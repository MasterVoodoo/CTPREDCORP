const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// GET all buildings
router.get('/', async (req, res) => {
  try {
    const [buildings] = await promisePool.query(`
      SELECT * FROM buildings ORDER BY name
    `);
    
    // Get features for each building
    for (let building of buildings) {
      const [features] = await promisePool.query(
        'SELECT * FROM building_features WHERE building_id = ?',
        [building.id]
      );
      const [floorPlans] = await promisePool.query(
        'SELECT * FROM building_floor_plans WHERE building_id = ? ORDER BY floor',
        [building.id]
      );
      
      building.buildingFeatures = features;
      building.floorPlans = floorPlans;
      building.description = JSON.parse(building.description || '[]');
      building.stats = JSON.parse(building.stats || '{}');
      building.buildingHours = JSON.parse(building.building_hours || '{}');
      building.contact = JSON.parse(building.contact || '{}');
      
      // Handle image storage - check if using database or file storage
      if (building.image_storage_type === 'database') {
        // Get images from database
        const [images] = await promisePool.query(
          `SELECT i.id FROM images i
           INNER JOIN entity_images ei ON i.id = ei.image_id
           WHERE ei.entity_type = 'building' AND ei.entity_id = ? AND ei.is_primary = true
           LIMIT 1`,
          [building.id]
        );
        if (images.length > 0) {
          building.hero_image = `/api/images/${images[0].id}`;
        }
      }
      // If image_storage_type is 'file' or null, hero_image already contains the file path
    }
    
    res.json(buildings);
  } catch (error) {
    console.error('Error fetching buildings:', error);
    res.json([]); // Return empty array instead of 500 error
  }
});

// GET building by ID
router.get('/:id', async (req, res) => {
  try {
    const [buildings] = await promisePool.query(
      'SELECT * FROM buildings WHERE id = ?',
      [req.params.id]
    );
    
    if (buildings.length === 0) {
      return res.status(404).json({ error: 'Building not found' });
    }
    
    const building = buildings[0];
    
    // Get building features
    const [features] = await promisePool.query(
      'SELECT * FROM building_features WHERE building_id = ?',
      [building.id]
    );
    
    // Get floor plans
    const [floorPlans] = await promisePool.query(
      'SELECT * FROM building_floor_plans WHERE building_id = ? ORDER BY floor',
      [building.id]
    );
    
    building.buildingFeatures = features;
    building.floorPlans = floorPlans;
    building.description = JSON.parse(building.description || '[]');
    building.stats = JSON.parse(building.stats || '{}');
    building.buildingHours = JSON.parse(building.building_hours || '{}');
    building.contact = JSON.parse(building.contact || '{}');
    
    // Handle image storage - check if using database or file storage
    if (building.image_storage_type === 'database') {
      // Get images from database
      const [images] = await promisePool.query(
        `SELECT i.id FROM images i
         INNER JOIN entity_images ei ON i.id = ei.image_id
         WHERE ei.entity_type = 'building' AND ei.entity_id = ? AND ei.is_primary = true
         LIMIT 1`,
        [building.id]
      );
      if (images.length > 0) {
        building.hero_image = `/api/images/${images[0].id}`;
      }
    }
    
    res.json(building);
  } catch (error) {
    console.error('Error fetching building:', error);
    res.status(500).json({ error: 'Failed to fetch building' });
  }
});

// GET units for a building
router.get('/:id/units', async (req, res) => {
  try {
    const [units] = await promisePool.query(
      `SELECT 
        id,
        title as unitNumber,
        floor,
        size,
        price as pricePerSqm,
        status,
        \`condition\`
      FROM units 
      WHERE building = ? 
      ORDER BY floor, title`,
      [req.params.id]
    );
    
    res.json(units);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

// POST create new building
router.post('/', async (req, res) => {
  const connection = await promisePool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      id, name, displayName, location, shortLocation,
      description, stats, buildingHours, contact,
      heroImage, heroImageId, badge, ctaTitle, ctaDescription,
      buildingFeatures, floorPlans
    } = req.body;
    
    // Determine storage type based on whether heroImageId is provided
    const storageType = heroImageId ? 'database' : 'file';
    const imageValue = heroImageId ? null : heroImage; // Store null if using database storage
    
    // Insert building
    await connection.query(
      `INSERT INTO buildings 
       (id, name, display_name, location, short_location, description, stats, 
        building_hours, contact, hero_image, image_storage_type, badge, cta_title, cta_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, name, displayName, location, shortLocation,
        JSON.stringify(description), JSON.stringify(stats),
        JSON.stringify(buildingHours), JSON.stringify(contact),
        imageValue, storageType, badge, ctaTitle, ctaDescription
      ]
    );
    
    // If using database storage, update the entity_images mapping
    if (heroImageId) {
      await connection.query(
        'UPDATE entity_images SET entity_id = ?, is_primary = true WHERE image_id = ?',
        [id, heroImageId]
      );
    }
    
    // Insert building features
    if (buildingFeatures && buildingFeatures.length > 0) {
      for (const feature of buildingFeatures) {
        await connection.query(
          'INSERT INTO building_features (building_id, title, description) VALUES (?, ?, ?)',
          [id, feature.title, feature.description]
        );
      }
    }
    
    // Insert floor plans
    if (floorPlans && floorPlans.length > 0) {
      for (const plan of floorPlans) {
        await connection.query(
          'INSERT INTO building_floor_plans (building_id, floor, units, total_sqft, available, `condition`) VALUES (?, ?, ?, ?, ?, ?)',
          [id, plan.floor, plan.units, plan.totalSqft, plan.available, plan.condition]
        );
      }
    }
    
    await connection.commit();
    res.status(201).json({ message: 'Building created successfully', id });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating building:', error);
    res.status(500).json({ error: 'Failed to create building' });
  } finally {
    connection.release();
  }
});

// PUT update building
router.put('/:id', async (req, res) => {
  const connection = await promisePool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      name, displayName, location, shortLocation,
      description, stats, buildingHours, contact,
      heroImage, heroImageId, badge, ctaTitle, ctaDescription,
      buildingFeatures, floorPlans
    } = req.body;
    
    // Determine storage type based on whether heroImageId is provided
    const storageType = heroImageId ? 'database' : 'file';
    const imageValue = heroImageId ? null : heroImage;
    
    // Update building
    await connection.query(
      `UPDATE buildings SET 
       name = ?, display_name = ?, location = ?, short_location = ?,
       description = ?, stats = ?, building_hours = ?, contact = ?,
       hero_image = ?, image_storage_type = ?, badge = ?, cta_title = ?, cta_description = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name, displayName, location, shortLocation,
        JSON.stringify(description), JSON.stringify(stats),
        JSON.stringify(buildingHours), JSON.stringify(contact),
        imageValue, storageType, badge, ctaTitle, ctaDescription,
        req.params.id
      ]
    );
    
    // If using database storage, update the entity_images mapping
    if (heroImageId) {
      // Remove old primary image mapping
      await connection.query(
        'DELETE FROM entity_images WHERE entity_type = ? AND entity_id = ? AND is_primary = true',
        ['building', req.params.id]
      );
      // Add new primary image mapping
      await connection.query(
        'INSERT INTO entity_images (entity_type, entity_id, image_id, is_primary) VALUES (?, ?, ?, true) ON DUPLICATE KEY UPDATE is_primary = true',
        ['building', req.params.id, heroImageId]
      );
    }
    
    // Update features (delete and re-insert)
    await connection.query('DELETE FROM building_features WHERE building_id = ?', [req.params.id]);
    if (buildingFeatures && buildingFeatures.length > 0) {
      for (const feature of buildingFeatures) {
        await connection.query(
          'INSERT INTO building_features (building_id, title, description) VALUES (?, ?, ?)',
          [req.params.id, feature.title, feature.description]
        );
      }
    }
    
    // Update floor plans (delete and re-insert)
    await connection.query('DELETE FROM building_floor_plans WHERE building_id = ?', [req.params.id]);
    if (floorPlans && floorPlans.length > 0) {
      for (const plan of floorPlans) {
        await connection.query(
          'INSERT INTO building_floor_plans (building_id, floor, units, total_sqft, available, `condition`) VALUES (?, ?, ?, ?, ?, ?)',
          [req.params.id, plan.floor, plan.units, plan.totalSqft, plan.available, plan.condition]
        );
      }
    }
    
    await connection.commit();
    res.json({ message: 'Building updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating building:', error);
    res.status(500).json({ error: 'Failed to update building' });
  } finally {
    connection.release();
  }
});

// DELETE building
router.delete('/:id', async (req, res) => {
  const connection = await promisePool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    await connection.query('DELETE FROM building_features WHERE building_id = ?', [req.params.id]);
    await connection.query('DELETE FROM building_floor_plans WHERE building_id = ?', [req.params.id]);
    await connection.query('DELETE FROM buildings WHERE id = ?', [req.params.id]);
    
    await connection.commit();
    res.json({ message: 'Building deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting building:', error);
    res.status(500).json({ error: 'Failed to delete building' });
  } finally {
    connection.release();
  }
});

module.exports = router;