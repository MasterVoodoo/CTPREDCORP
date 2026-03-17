const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisePool } = require('../config/database');

// -------------------- MULTER CONFIG FOR MEMORY STORAGE --------------------
// Store files in memory instead of disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb(new Error('Only image files allowed (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

// -------------------- ROUTES --------------------
// Single file - Store in database
router.post('/single', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const type = req.query.type === 'buildings' ? 'building' : 'unit';
    const entityId = req.query.entityId || null;
    
    // Generate a unique filename
    const ext = path.extname(req.file.originalname);
    const name = path.basename(req.file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${name}-${unique}${ext}`;
    
    // Insert image into database
    const [result] = await promisePool.query(
      'INSERT INTO images (filename, mimetype, size, data, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?)',
      [filename, req.file.mimetype, req.file.size, req.file.buffer, type, entityId]
    );
    
    const imageId = result.insertId;
    
    // If entityId is provided, create entity_images mapping
    if (entityId) {
      await promisePool.query(
        'INSERT INTO entity_images (entity_type, entity_id, image_id, is_primary) VALUES (?, ?, ?, ?)',
        [type, entityId, imageId, true]
      );
    }
    
    res.json({ 
      message: 'File uploaded to database', 
      imageId: imageId,
      filename: filename,
      path: `/api/images/${imageId}`
    });
  } catch (error) {
    console.error('Error uploading image to database:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Multiple files - Store in database
router.post('/multiple', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const type = req.query.type === 'buildings' ? 'building' : 'unit';
    const entityId = req.query.entityId || null;
    const uploadedImages = [];
    
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      // Generate a unique filename
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + i;
      const filename = `${name}-${unique}${ext}`;
      
      // Insert image into database
      const [result] = await promisePool.query(
        'INSERT INTO images (filename, mimetype, size, data, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?)',
        [filename, file.mimetype, file.size, file.buffer, type, entityId]
      );
      
      const imageId = result.insertId;
      
      // If entityId is provided, create entity_images mapping
      if (entityId) {
        await promisePool.query(
          'INSERT INTO entity_images (entity_type, entity_id, image_id, sort_order) VALUES (?, ?, ?, ?)',
          [type, entityId, imageId, i]
        );
      }
      
      uploadedImages.push({
        imageId: imageId,
        filename: filename,
        path: `/api/images/${imageId}`
      });
    }
    
    res.json({ 
      message: `${uploadedImages.length} file(s) uploaded to database`, 
      files: uploadedImages 
    });
  } catch (error) {
    console.error('Error uploading images to database:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Delete image from database
router.delete('/', async (req, res) => {
  try {
    const { imageId, path: imagePath } = req.body;
    
    if (imageId) {
      // Delete by image ID
      await promisePool.query('DELETE FROM images WHERE id = ?', [imageId]);
      res.json({ message: 'Image deleted from database' });
    } else if (imagePath) {
      // For backward compatibility - try to find image by old path format
      // This is for transitioning from file-based to database storage
      const filename = path.basename(imagePath);
      await promisePool.query('DELETE FROM images WHERE filename = ?', [filename]);
      res.json({ message: 'Image deleted from database' });
    } else {
      return res.status(400).json({ error: 'Image ID or path required' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;