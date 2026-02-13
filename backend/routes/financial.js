const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// GET all financial data
router.get('/', async (req, res) => {
  try {
    const [data] = await promisePool.query(`
      SELECT * FROM financial_data ORDER BY year DESC, quarter DESC
    `);
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

// GET financial data by year
router.get('/year/:year', async (req, res) => {
  try {
    const [data] = await promisePool.query(
      'SELECT * FROM financial_data WHERE year = ? ORDER BY quarter',
      [req.params.year]
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching financial data by year:', error);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

// GET financial data by year and quarter
router.get('/year/:year/quarter/:quarter', async (req, res) => {
  try {
    const [data] = await promisePool.query(
      'SELECT * FROM financial_data WHERE year = ? AND quarter = ?',
      [req.params.year, req.params.quarter]
    );
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Financial data not found' });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

// POST create financial data
router.post('/', async (req, res) => {
  try {
    const {
      year, quarter, revenue, expenses, netIncome,
      occupancyRate, totalUnits, leasedUnits
    } = req.body;
    
    await promisePool.query(
      `INSERT INTO financial_data 
       (year, quarter, revenue, expenses, net_income, occupancy_rate, total_units, leased_units)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [year, quarter, revenue, expenses, netIncome, occupancyRate, totalUnits, leasedUnits]
    );
    
    res.status(201).json({ message: 'Financial data created successfully' });
  } catch (error) {
    console.error('Error creating financial data:', error);
    res.status(500).json({ error: 'Failed to create financial data' });
  }
});

// PUT update financial data
router.put('/year/:year/quarter/:quarter', async (req, res) => {
  try {
    const {
      revenue, expenses, netIncome,
      occupancyRate, totalUnits, leasedUnits
    } = req.body;
    
    await promisePool.query(
      `UPDATE financial_data SET 
       revenue = ?, expenses = ?, net_income = ?,
       occupancy_rate = ?, total_units = ?, leased_units = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE year = ? AND quarter = ?`,
      [revenue, expenses, netIncome, occupancyRate, totalUnits, leasedUnits,
       req.params.year, req.params.quarter]
    );
    
    res.json({ message: 'Financial data updated successfully' });
  } catch (error) {
    console.error('Error updating financial data:', error);
    res.status(500).json({ error: 'Failed to update financial data' });
  }
});

// DELETE financial data
router.delete('/year/:year/quarter/:quarter', async (req, res) => {
  try {
    await promisePool.query(
      'DELETE FROM financial_data WHERE year = ? AND quarter = ?',
      [req.params.year, req.params.quarter]
    );
    
    res.json({ message: 'Financial data deleted successfully' });
  } catch (error) {
    console.error('Error deleting financial data:', error);
    res.status(500).json({ error: 'Failed to delete financial data' });
  }
});

module.exports = router;