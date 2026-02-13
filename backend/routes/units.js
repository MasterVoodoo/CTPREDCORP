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
      unit.images = JSON.parse(unit.images || '[]');
      unit.floor_plan = JSON.parse(unit.floor_plan || '{}');
      unit.availability = JSON.parse(unit.availability || '{}');
    }
    
    res.json(units);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ error: 'Failed to fetch units' });
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
      unit.images = JSON.parse(unit.images || '[]');
      unit.floor_plan = JSON.parse(unit.floor_plan || '{}');
      unit.availability = JSON.parse(unit.availability || '{}');
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
    unit.images = JSON.parse(unit.images || '[]');
    unit.floor_plan = JSON.parse(unit.floor_plan || '{}');
    unit.availability = JSON.parse(unit.availability || '{}');
    
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
      unit.images = JSON.parse(unit.images || '[]');
      unit.floor_plan = JSON.parse(unit.floor_plan || '{}');
      unit.availability = JSON.parse(unit.availability || '{}');
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
      unit.images = JSON.parse(unit.images || '[]');
      unit.floor_plan = JSON.parse(unit.floor_plan || '{}');
      unit.availability = JSON.parse(unit.availability || '{}');
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
      unit.images = JSON.parse(unit.images || '[]');
      unit.floor_plan = JSON.parse(unit.floor_plan || '{}');
      unit.availability = JSON.parse(unit.availability || '{}');
    }
    
    res.json(units);
  } catch (error) {
    console.error('Error searching units:', error);
    res.status(500).json({ error: 'Failed to search units' });
  }
});

// POST create new unit
router.post('/', async (req, res) => {
  try {
    const {
      id, title, building, location, floor, size, capacity,
      price, status, condition, image, images, description,
      floorPlan, availability
    } = req.body;
    
    await promisePool.query(
      'INSERT INTO units (id, title, building, location, floor, size, capacity, price, status, `condition`, image, images, description, floor_plan, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id, title, building, location, floor, size, capacity, price,
        status, condition, image, JSON.stringify(images || []),
        description, JSON.stringify(floorPlan || {}), JSON.stringify(availability || {})
      ]
    );
    
    res.status(201).json({ message: 'Unit created successfully', id });
  } catch (error) {
    console.error('Error creating unit:', error);
    res.status(500).json({ error: 'Failed to create unit' });
  }
});

// PUT update unit
router.put('/:id', async (req, res) => {
  try {
    const {
      title, building, location, floor, size, capacity,
      price, status, condition, image, images, description,
      floorPlan, availability
    } = req.body;
    
    await promisePool.query(
      'UPDATE units SET title = ?, building = ?, location = ?, floor = ?, size = ?, capacity = ?, price = ?, status = ?, `condition` = ?, image = ?, images = ?, description = ?, floor_plan = ?, availability = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        title, building, location, floor, size, capacity, price,
        status, condition, image, JSON.stringify(images || []),
        description, JSON.stringify(floorPlan || {}), JSON.stringify(availability || {}),
        req.params.id
      ]
    );
    
    res.json({ message: 'Unit updated successfully' });
  } catch (error) {
    console.error('Error updating unit:', error);
    res.status(500).json({ error: 'Failed to update unit' });
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