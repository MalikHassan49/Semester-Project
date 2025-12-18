// ============================================
// reviews.js
const express3 = require('express');
const router3 = express3.Router();
const reviewController = require('../controllers/review.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router3.post('/submit', authMiddleware, roleMiddleware('reviewer'), 
  reviewController.submitReview);

router3.get('/paper/:paperId', authMiddleware, 
  reviewController.getReviewsByPaper);

router3.get('/reviewed-papers', authMiddleware, roleMiddleware('reviewer'), 
  reviewController.getAllReviewedPapers);

module.exports = router3;
