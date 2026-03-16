const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// -------------------- UPLOAD FOLDERS --------------------
const uploadsBase = path.join(__dirname, '../uploads');
const buildingsDir = path.join(uploadsBase, 'buildings');
const unitsDir = path.join(uploadsBase, 'units');

[uploadsBase, buildingsDir, unitsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// -------------------- MULTER CONFIG --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.query.type === 'buildings' ? 'buildings' : 'units';
    cb(null, type === 'buildings' ? buildingsDir : unitsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${name}-${unique}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb(new Error('Only image files allowed (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

// -------------------- ROUTES --------------------
// Single file
router.post('/single', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const type = req.query.type === 'buildings' ? 'buildings' : 'units';
  const urlPath = `/uploads/${type}/${req.file.filename}`;
  res.json({ message: 'File uploaded', path: urlPath });
});

// Multiple files
router.post('/multiple', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
  const type = req.query.type === 'buildings' ? 'buildings' : 'units';
  const files = req.files.map(f => ({ filename: f.filename, path: `/uploads/${type}/${f.filename}` }));
  res.json({ message: `${files.length} file(s) uploaded`, files });
});

// Delete file
router.delete('/', (req, res) => {
  const { path: imagePath } = req.body;
  if (!imagePath) return res.status(400).json({ error: 'Image path required' });

  const absolutePath = path.join(__dirname, '../', imagePath.replace(/^\/+/, ''));
  if (!fs.existsSync(absolutePath)) return res.status(404).json({ error: 'File not found' });

  fs.unlinkSync(absolutePath);
  res.json({ message: 'File deleted' });
});

module.exports = router;