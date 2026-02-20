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
    const [appointments] = await promisePool.query(
      'SELECT * FROM appointments ORDER BY created_at DESC'
    );
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// GET single appointment
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const [appointments] = await promisePool.query(
      'SELECT * FROM appointments WHERE id = ?',
      [req.params.id]
    );
    
    if (appointments.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(appointments[0]);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

// UPDATE appointment status
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [result] = await promisePool.query(
      'UPDATE appointments SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ success: true, message: 'Appointment status updated' });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
});

// DELETE appointment
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.query(
      'DELETE FROM appointments WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// GET appointment statistics
router.get('/stats/summary', verifyAdmin, async (req, res) => {
  try {
    const [stats] = await promisePool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM appointments
    `);
    
    res.json(stats[0]);
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    res.status(500).json({ error: 'Failed to fetch appointment statistics' });
  }
});

module.exports = router;