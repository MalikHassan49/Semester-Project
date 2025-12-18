// ReviewedFiles.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewedFiles.css';

const ReviewedFiles = () => {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviewedPapers();
  }, []);

  const fetchReviewedPapers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reviews/reviewed-papers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setPapers(data.papers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (paperId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reviews/paper/${paperId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setReviews(data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewReviews = (paper) => {
    setSelectedPaper(paper);
    fetchReviews(paper.paper_id);
  };

  return (
    <div className="reviewed-files-container">
      <div className="reviewed-content">
        <div className="reviewed-header">
          <button onClick={() => navigate('/reviewer-dashboard')} className="back-btn">
            ← Back
          </button>
          <h1>Reviewed Papers</h1>
          <p>Papers you have reviewed</p>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : papers.length === 0 ? (
          <div className="no-papers">
            <h3>No Reviewed Papers</h3>
          </div>
        ) : (
          <div className="papers-grid">
            {papers.map((paper) => (
              <div key={paper.paper_id} className="paper-card">
                <h3>{paper.title}</h3>
                <span className="review-count">{paper.review_count} Reviews</span>
                <button onClick={() => handleViewReviews(paper)}>View Reviews</button>
              </div>
            ))}
          </div>
        )}

        {selectedPaper && (
          <div className="review-modal-overlay" onClick={() => setSelectedPaper(null)}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setSelectedPaper(null)}>×</button>
              <h2>{selectedPaper.title}</h2>
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.review_id} className="review-item">
                    <div className="review-header-item">
                      <strong>{review.reviewer_name}</strong>
                      <span>{new Date(review.review_date).toLocaleDateString()}</span>
                    </div>
                    <p>{review.comments}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewedFiles;