// reviewController.js
const db = require('../config/db');

// Submit Review
exports.submitReview = async (req, res) => {
  try {
    const { paperId, comments } = req.body;
    const reviewerId = req.user.user_id;

    if (!paperId || !comments) {
      return res.status(400).json({
        success: false,
        message: 'Paper ID and comments are required'
      });
    }

    // Check if reviewer already reviewed this paper
    const [existing] = await db.query(
      'SELECT * FROM reviews WHERE paper_id = ? AND reviewer_id = ?',
      [paperId, reviewerId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this paper'
      });
    }

    // Call stored procedure
    const [result] = await db.query(
      'CALL sp_insert_review(?, ?, ?)',
      [paperId, reviewerId, comments]
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: {
        review_id: result[0][0].review_id,
        paperId,
        reviewerId,
        comments
      }
    });
  } catch (error) {
    if (error.sqlMessage && error.sqlMessage.includes('maximum 3 reviews')) {
      return res.status(400).json({
        success: false,
        message: 'This paper already has the maximum number of reviews (3)'
      });
    }
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting review'
    });
  }
};

// Get Reviews for a Paper
exports.getReviewsByPaper = async (req, res) => {
  try {
    const { paperId } = req.params;

    const [result] = await db.query('CALL sp_get_reviews_by_paper(?)', [paperId]);

    res.status(200).json({
      success: true,
      reviews: result[0]
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

// Get All Reviewed Papers
exports.getAllReviewedPapers = async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_all_reviewed_papers()');

    res.status(200).json({
      success: true,
      papers: result[0]
    });
  } catch (error) {
    console.error('Get reviewed papers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviewed papers'
    });
  }
};