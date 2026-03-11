const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// GET all settings (public)
router.get('/', async (req, res) => {
  try {
    const [settings] = await promisePool.query(
      'SELECT setting_key, setting_value, setting_type FROM site_settings'
    );
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      let value = setting.setting_value;
      
      // Parse value based on type
      if (setting.setting_type === 'boolean') {
        value = value === 'true' || value === '1' || value === 1;
      } else if (setting.setting_type === 'number') {
        value = parseFloat(value);
      } else if (setting.setting_type === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = setting.setting_value;
        }
      }
      
      settingsObj[setting.setting_key] = value;
    });
    
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// GET single setting by key (public)
router.get('/:key', async (req, res) => {
  try {
    const [settings] = await promisePool.query(
      'SELECT setting_value, setting_type FROM site_settings WHERE setting_key = ?',
      [req.params.key]
    );
    
    if (settings.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    let value = settings[0].setting_value;
    
    // Parse value based on type
    if (settings[0].setting_type === 'boolean') {
      value = value === 'true' || value === '1' || value === 1;
    } else if (settings[0].setting_type === 'number') {
      value = parseFloat(value);
    } else if (settings[0].setting_type === 'json') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        value = settings[0].setting_value;
      }
    }
    
    res.json({ [req.params.key]: value });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// UPDATE setting (admin only)
router.put('/:key', async (req, res) => {
  try {
    const { value } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }
    
    // Convert value to string for storage
    const stringValue = typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);
    
    const [result] = await promisePool.query(
      'UPDATE site_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
      [stringValue, req.params.key]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Setting updated successfully',
      key: req.params.key,
      value: value
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// GET all settings with metadata (admin only)
router.get('/admin/all', async (req, res) => {
  try {
    const [settings] = await promisePool.query(
      'SELECT * FROM site_settings ORDER BY setting_key'
    );
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

module.exports = router;
