const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const buildingsDir = path.join(__dirname, '../../src/assets/Buildings');
const unitsDir = path.join(__dirname, '../../src/assets/Units');

if (!fs.existsSync(buildingsDir)) {
  fs.mkdirSync(buildingsDir, { recursive: true });
}

if (!fs.existsSync(unitsDir)) {
  fs.mkdirSync(unitsDir, { recursive: true });
}

// Configure multer for file uploads
// NOTE: We can't access req.body.type in the destination callback reliably
// So we'll upload to a temp location first, then move to correct folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use query parameter instead of body for type
    const uploadType = req.query.type || 'units';
    const dest = uploadType === 'buildings' ? buildingsDir : unitsDir;
    console.log('Upload destination:', dest, 'for type:', uploadType);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp + original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// POST endpoint for single file upload
router.post('/single', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get type from query parameter
    const uploadType = req.query.type || 'units';
    const relativePath = `/src/assets/${uploadType === 'buildings' ? 'Buildings' : 'Units'}/${req.file.filename}`;

    console.log('File uploaded:', {
      type: uploadType,
      filename: req.file.filename,
      path: relativePath,
      destination: req.file.destination
    });

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: relativePath,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// POST endpoint for multiple file uploads
router.post('/multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Get type from query parameter
    const uploadType = req.query.type || 'units';
    const files = req.files.map(file => ({
      filename: file.filename,
      path: `/src/assets/${uploadType === 'buildings' ? 'Buildings' : 'Units'}/${file.filename}`,
      size: file.size
    }));

    console.log(`${files.length} file(s) uploaded to ${uploadType}`);

    res.json({
      message: `${files.length} file(s) uploaded successfully`,
      files: files
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// DELETE endpoint to remove an image
router.delete('/', (req, res) => {
  try {
    const { path: imagePath } = req.body;
    
    if (!imagePath) {
      return res.status(400).json({ error: 'Image path is required' });
    }

    // Convert relative path to absolute path
    const absolutePath = path.join(__dirname, '../..', imagePath);
    
    console.log('Attempting to delete file:', absolutePath);
    
    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      console.log('File not found:', absolutePath);
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file
    fs.unlinkSync(absolutePath);
    console.log('File deleted successfully:', absolutePath);
    
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;