const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// GET image by ID - Serve binary image data
router.get('/:id', async (req, res) => {
  try {
    const [images] = await promisePool.query(
      'SELECT filename, mimetype, data FROM images WHERE id = ?',
      [req.params.id]
    );
    
    if (images.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const image = images[0];
    
    // Set appropriate headers
    res.setHeader('Content-Type', image.mimetype);
    res.setHeader('Content-Disposition', `inline; filename="${image.filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // Send the binary data
    res.send(image.data);
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
});

// GET image as base64 - For embedding in JSON responses
router.get('/:id/base64', async (req, res) => {
  try {
    const [images] = await promisePool.query(
      'SELECT filename, mimetype, data FROM images WHERE id = ?',
      [req.params.id]
    );
    
    if (images.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const image = images[0];
    const base64Data = image.data.toString('base64');
    const dataUrl = `data:${image.mimetype};base64,${base64Data}`;
    
    res.json({
      filename: image.filename,
      mimetype: image.mimetype,
      dataUrl: dataUrl
    });
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
});

// GET images for an entity (building or unit)
router.get('/entity/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    
    const [images] = await promisePool.query(
      `SELECT i.id, i.filename, i.mimetype, i.size, ei.is_primary, ei.sort_order
       FROM images i
       INNER JOIN entity_images ei ON i.id = ei.image_id
       WHERE ei.entity_type = ? AND ei.entity_id = ?
       ORDER BY ei.is_primary DESC, ei.sort_order ASC`,
      [entityType, entityId]
    );
    
    const imageList = images.map(img => ({
      id: img.id,
      filename: img.filename,
      mimetype: img.mimetype,
      size: img.size,
      isPrimary: img.is_primary,
      sortOrder: img.sort_order,
      url: `/api/images/${img.id}`
    }));
    
    res.json(imageList);
  } catch (error) {
    console.error('Error retrieving entity images:', error);
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
});

module.exports = router;
