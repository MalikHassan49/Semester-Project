// papers.js
const express2 = require('express');
const router2 = express2.Router();
const multer = require('multer');
const path = require('path');
const paperController = require('../controllers/paper.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router2.post('/submit', authMiddleware, roleMiddleware('author'), 
  upload.single('file'), paperController.submitPaper);

router2.get('/my-papers', authMiddleware, roleMiddleware('author'), 
  paperController.getMyPapers);

router2.get('/all', authMiddleware, roleMiddleware('reviewer', 'admin'), 
  paperController.getAllPapers);

router2.get('/search', authMiddleware, paperController.searchPapers);



module.exports = router2;

