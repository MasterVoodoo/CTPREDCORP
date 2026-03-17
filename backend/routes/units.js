const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// GET all units (public - excludes Unavailable)
router.get('/', async (req, res) => {
  try {
    const [units] = await promisePool.query(`
      SELECT * FROM units 
      WHERE status != 'Unavailable'
      ORDER BY building, floor
    `);
    
    for (let unit of units) {
      unit.floor_plan = JSON.parse(unit.floor_plan || '{}');
      unit.availability = JSON.parse(unit.availability || '{}');
      
      // Handle image storage
      if (unit.image_storage_type === 'database') {
        // Get images from database
        const [dbImages] = await promisePool.query(
          `SELECT i.id, ei.is_primary, ei.sort_order
           FROM images i
           INNER JOIN entity_images ei ON i.id = ei.image_id
           WHERE ei.entity_type = 'unit' AND ei.entity_id = ?
           ORDER BY ei.is_primary DESC, ei.sort_order ASC`,
          [unit.id]
        );
        
        unit.images = dbImages.map(img => `/api/images/${img.id}`);
        if (dbImages.length > 0) {
          unit.image = `/api/images/${dbImages[0].id}`;
        }
      } else {
        // Use file-based images
        unit.images = JSON.parse(unit.images || '[]');
      }
    }
    
    res.json(units);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.json([]); // Return empty array instead of 500 error
  }
});

// GET all units including unavailable (admin)
router.get('/admin/all', async (req, res) => {
  try {
    const [units] = await promisePool.query(`
      SELECT * FROM units 
      ORDER BY building, floor
    `);
    
    for (let unit of units) {
      unit.floor_plan = JSON.parse(unit.floor_plan || '{}');
      unit.availability = JSON.parse(unit.availability || '{}');
      
      // Handle image storage
      if (unit.image_storage_type === 'database') {
        // Get images from database
        const [dbImages] = await promisePool.query(
          `SELECT i.id, ei.is_primary, ei.sort_order
           FROM images i
           INNER JOIN entity_images ei ON i.id = ei.image_id
           WHERE ei.entity_type = 'unit' AND ei.entity_id = ?
           ORDER BY ei.is_primary DESC, ei.sort_order ASC`,
          [unit.id]
        );
        
        unit.images = dbImages.map(img => `/api/images/${img.id}`);
        if (dbImages.length > 0) {
          unit.image = `/api/images/${dbImages[0].id}`;
        }
      } else {
        // Use file-based images
        unit.images = JSON.parse(unit.images || '[]');
      }
    }
    
    res.json(units);
  } catch (error) {
    console.error('Error fetching all units:', error);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

// GET unit by ID
router.get('/:id', async (req, res) => {
  try {
    const [units] = await promisePool.query(
      'SELECT * FROM units WHERE id = ?',
      [req.params.id]
    );
    
    if (units.length === 0) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    
    const unit = units[0];
    unit.floor_plan = JSON.parse(unit.floor_plan || '{}');
    unit.availability = JSON.parse(unit.availability || '{}');
    
    // Handle image storage
    if (unit.image_storage_type === 'database') {
      // Get images from database
      const [dbImages] = await promisePool.query(
        `SELECT i.id, ei.is_primary, ei.sort_order
         FROM images i
         INNER JOIN entity_images ei ON i.id = ei.image_id
         WHERE ei.entity_type = 'unit' AND ei.entity_id = ?
         ORDER BY ei.is_primary DESC, ei.sort_order ASC`,
        [unit.id]
      );
      
      unit.images = dbImages.map(img => `/api/images/${img.id}`);
      if (dbImages.length > 0) {
        unit.image = `/api/images/${dbImages[0].id}`;
      }
    } else {
      // Use file-based images
      unit.images = JSON.parse(unit.images || '[]');
    }
    
    res.json(unit);
  } catch (error) {
    console.error('Error fetching unit:', error);
    res.status(500).json({ error: 'Failed to fetch unit' });
  }
});

// GET units by building
router.get('/building/:buildingId', async (req, res) => {
  try {
    const [units] = await promisePool.query(
      `SELECT * FROM units 
       WHERE building = ? AND status != 'Unavailable'
       ORDER BY floor`,
      [req.params.buildingId]
    );
    
    for (let unit of units) {
      unit.floor_plan = JSON.parse(unit.floor_plan || '{}');
      unit.availability = JSON.parse(unit.availability || '{}');
      
      // Handle image storage
      if (unit.image_storage_type === 'database') {
        const [dbImages] = await promisePool.query(
          `SELECT i.id, ei.is_primary, ei.sort_order
           FROM images i
           INNER JOIN entity_images ei ON i.id = ei.image_id
           WHERE ei.entity_type = 'unit' AND ei.entity_id = ?
           ORDER BY ei.is_primary DESC, ei.sort_order ASC`,
          [unit.id]
        );
        
        unit.images = dbImages.map(img => `/api/images/${img.id}`);
        if (dbImages.length > 0) {
          unit.image = `/api/images/${dbImages[0].id}`;
        }
      } else {
        unit.images = JSON.parse(unit.images || '[]');
      }
    }
    
    res.json(units);
  } catch (error) {
    console.error('Error fetching units by building:', error);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

// GET units by status
router.get('/status/:status', async (req, res) => {
  try {
    const [units] = await promisePool.query(
      'SELECT * FROM units WHERE status = ? ORDER BY building, floor',
      [req.params.status]
    );
    
    for (let unit of units) {
      unit.floor_plan = JSON.parse(unit.floor_plan || '{}');
      unit.availability = JSON.parse(unit.availability || '{}');
      
      // Handle image storage
      if (unit.image_storage_type === 'database') {
        const [dbImages] = await promisePool.query(
          `SELECT i.id, ei.is_primary, ei.sort_order
           FROM images i
           INNER JOIN entity_images ei ON i.id = ei.image_id
           WHERE ei.entity_type = 'unit' AND ei.entity_id = ?
           ORDER BY ei.is_primary DESC, ei.sort_order ASC`,
          [unit.id]
        );
        
        unit.images = dbImages.map(img => `/api/images/${img.id}`);
        if (dbImages.length > 0) {
          unit.image = `/api/images/${dbImages[0].id}`;
        }
      } else {
        unit.images = JSON.parse(unit.images || '[]');
      }
    }
    
    res.json(units);
  } catch (error) {
    console.error('Error fetching units by status:', error);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

// POST search units with filters
router.post('/search', async (req, res) => {
  try {
    const { buildingId, floor, minSize, maxSize, maxPrice, status } = req.body;
    
    let query = 'SELECT * FROM units WHERE status != "Unavailable"';
    const params = [];
    
    if (buildingId) {
      query += ' AND building = ?';
      params.push(buildingId);
    }
    
    if (floor !== undefined) {
      query += ' AND floor = ?';
      params.push(floor);
    }
    
    if (minSize !== undefined) {
      query += ' AND size >= ?';
      params.push(minSize);
    }
    
    if (maxSize !== undefined) {
      query += ' AND size <= ?';
      params.push(maxSize);
    }
    
    if (maxPrice !== undefined) {
      query += ' AND price <= ?';
      params.push(maxPrice);
    }
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY building, floor';
    
    const [units] = await promisePool.query(query, params);
    
    for (let unit of units) {
      unit.floor_plan = JSON.parse(unit.floor_plan || '{}');
      unit.availability = JSON.parse(unit.availability || '{}');
      
      // Handle image storage
      if (unit.image_storage_type === 'database') {
        const [dbImages] = await promisePool.query(
          `SELECT i.id, ei.is_primary, ei.sort_order
           FROM images i
           INNER JOIN entity_images ei ON i.id = ei.image_id
           WHERE ei.entity_type = 'unit' AND ei.entity_id = ?
           ORDER BY ei.is_primary DESC, ei.sort_order ASC`,
          [unit.id]
        );
        
        unit.images = dbImages.map(img => `/api/images/${img.id}`);
        if (dbImages.length > 0) {
          unit.image = `/api/images/${dbImages[0].id}`;
        }
      } else {
        unit.images = JSON.parse(unit.images || '[]');
      }
    }
    
    res.json(units);
  } catch (error) {
    console.error('Error searching units:', error);
    res.status(500).json({ error: 'Failed to search units' });
  }
});

// POST create new unit
router.post('/', async (req, res) => {
  const connection = await promisePool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      id, title, building, location, floor, size, capacity,
      price, status, condition, image, images, imageIds, description,
      floorPlan, availability
    } = req.body;
    
    // Determine storage type based on whether imageIds is provided
    const storageType = imageIds && imageIds.length > 0 ? 'database' : 'file';
    const imageValue = storageType === 'database' ? null : image;
    const imagesValue = storageType === 'database' ? null : JSON.stringify(images || []);
    
    await connection.query(
      'INSERT INTO units (id, title, building, location, floor, size, capacity, price, status, `condition`, image, images, image_storage_type, description, floor_plan, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id, title, building, location, floor, size, capacity, price,
        status, condition, imageValue, imagesValue, storageType,
        description, JSON.stringify(floorPlan || {}), JSON.stringify(availability || {})
      ]
    );
    
    // If using database storage, update entity_images mappings
    if (imageIds && imageIds.length > 0) {
      for (let i = 0; i < imageIds.length; i++) {
        await connection.query(
          'INSERT INTO entity_images (entity_type, entity_id, image_id, sort_order, is_primary) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE sort_order = ?, is_primary = ?',
          ['unit', id, imageIds[i], i, i === 0, i, i === 0]
        );
      }
    }
    
    await connection.commit();
    res.status(201).json({ message: 'Unit created successfully', id });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating unit:', error);
    res.status(500).json({ error: 'Failed to create unit' });
  } finally {
    connection.release();
  }
});

// PUT update unit
router.put('/:id', async (req, res) => {
  const connection = await promisePool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      title, building, location, floor, size, capacity,
      price, status, condition, image, images, imageIds, description,
      floorPlan, availability
    } = req.body;
    
    // Determine storage type based on whether imageIds is provided
    const storageType = imageIds && imageIds.length > 0 ? 'database' : 'file';
    const imageValue = storageType === 'database' ? null : image;
    const imagesValue = storageType === 'database' ? null : JSON.stringify(images || []);
    
    await connection.query(
      'UPDATE units SET title = ?, building = ?, location = ?, floor = ?, size = ?, capacity = ?, price = ?, status = ?, `condition` = ?, image = ?, images = ?, image_storage_type = ?, description = ?, floor_plan = ?, availability = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        title, building, location, floor, size, capacity, price,
        status, condition, imageValue, imagesValue, storageType,
        description, JSON.stringify(floorPlan || {}), JSON.stringify(availability || {}),
        req.params.id
      ]
    );
    
    // If using database storage, update entity_images mappings
    if (imageIds && imageIds.length > 0) {
      // Remove old mappings
      await connection.query(
        'DELETE FROM entity_images WHERE entity_type = ? AND entity_id = ?',
        ['unit', req.params.id]
      );
      
      // Add new mappings
      for (let i = 0; i < imageIds.length; i++) {
        await connection.query(
          'INSERT INTO entity_images (entity_type, entity_id, image_id, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)',
          ['unit', req.params.id, imageIds[i], i, i === 0]
        );
      }
    }
    
    await connection.commit();
    res.json({ message: 'Unit updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating unit:', error);
    res.status(500).json({ error: 'Failed to update unit' });
  } finally {
    connection.release();
  }
});

// DELETE unit
router.delete('/:id', async (req, res) => {
  try {
    await promisePool.query('DELETE FROM units WHERE id = ?', [req.params.id]);
    res.json({ message: 'Unit deleted successfully' });
  } catch (error) {
    console.error('Error deleting unit:', error);
    res.status(500).json({ error: 'Failed to delete unit' });
  }
});

module.exports = router;