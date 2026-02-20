const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');
const jwt = require('jsonwebtoken');

// Middleware to verify admin authentication
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// GET all appointments
router.get('/', verifyAdmin, async (req, res) => {
  try {
    console.log('📋 Fetching all appointments...');
    const [appointments] = await promisePool.query(
      'SELECT * FROM appointments ORDER BY created_at DESC'
    );
    console.log(`✅ Found ${appointments.length} appointments`);
    res.json(appointments);
  } catch (error) {
    console.error('❌ Error fetching appointments:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ 
      error: 'Failed to fetch appointments',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET single appointment
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    console.log(`📋 Fetching appointment #${req.params.id}...`);
    const [appointments] = await promisePool.query(
      'SELECT * FROM appointments WHERE id = ?',
      [req.params.id]
    );
    
    if (appointments.length === 0) {
      console.log(`⚠️ Appointment #${req.params.id} not found`);
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    console.log(`✅ Found appointment #${req.params.id}`);
    res.json(appointments[0]);
  } catch (error) {
    console.error(`❌ Error fetching appointment #${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch appointment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// UPDATE appointment status
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    console.log(`🔄 Updating appointment #${id} status to: ${status}`);

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      console.log(`⚠️ Invalid status: ${status}`);
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if updated_at column exists, if not use simpler query
    let query = 'UPDATE appointments SET status = ?';
    const params = [status];
    
    // Try to update with updated_at first
    try {
      await promisePool.query('SELECT updated_at FROM appointments LIMIT 1');
      query += ', updated_at = NOW()';
    } catch (columnError) {
      console.log('ℹ️ updated_at column not found, updating status only');
    }
    
    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await promisePool.query(query, params);

    if (result.affectedRows === 0) {
      console.log(`⚠️ Appointment #${id} not found`);
      return res.status(404).json({ error: 'Appointment not found' });
    }

    console.log(`✅ Appointment #${id} status updated to: ${status}`);
    res.json({ success: true, message: 'Appointment status updated' });
  } catch (error) {
    console.error(`❌ Error updating appointment #${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to update appointment status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE appointment
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🗑️ Deleting appointment #${id}...`);

    const [result] = await promisePool.query(
      'DELETE FROM appointments WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      console.log(`⚠️ Appointment #${id} not found`);
      return res.status(404).json({ error: 'Appointment not found' });
    }

    console.log(`✅ Appointment #${id} deleted`);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    console.error(`❌ Error deleting appointment #${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to delete appointment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET appointment statistics
router.get('/stats/summary', verifyAdmin, async (req, res) => {
  try {
    console.log('📊 Fetching appointment statistics...');
    const [stats] = await promisePool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM appointments
    `);
    
    console.log('✅ Statistics fetched:', stats[0]);
    res.json(stats[0]);
  } catch (error) {
    console.error('❌ Error fetching appointment stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch appointment statistics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;