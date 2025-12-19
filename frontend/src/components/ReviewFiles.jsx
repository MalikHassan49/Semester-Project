// ReviewFiles.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewFiles.css';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const ReviewFiles = () => {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`{API_BASE_URL}/api/papers/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setPapers(data.papers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewPaper = (paper) => {
    setSelectedPaper(paper);
    setComment('');
    setError('');
    setSuccess('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/reviews/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paperId: selectedPaper.paper_id,
          comments: comment
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Review submitted successfully!');
        setComment('');
        setTimeout(() => {
          setSelectedPaper(null);
          fetchPapers();
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to submit review',err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="review-files-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-files-container">
      <div className="review-content">
        <div className="review-header">
          <button onClick={() => navigate('/reviewer-dashboard')} className="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Dashboard
          </button>
          <h1>Available Papers for Review</h1>
          <p>Select a paper to review</p>
        </div>

        {papers.length === 0 ? (
          <div className="no-papers">
            <h3>No Papers Available</h3>
            <p>There are no papers to review at the moment</p>
          </div>
        ) : (
          <div className="papers-grid">
            {papers.map((paper) => (
              <div key={paper.paper_id} className="paper-card">
                <div className="paper-meta">
                  <span className="paper-author">By: {paper.author_name}</span>
                  <span className="review-count">{paper.review_count}/3 Reviews</span>
                </div>
                <h3>{paper.title}</h3>
                <p>{paper.abstract.substring(0, 120)}...</p>
                <div className="card-actions">
                  <button onClick={() => window.open(paper.file_url, '_blank')} className="view-btn">
                    View Paper
                  </button>
                  <button 
                    onClick={() => handleReviewPaper(paper)} 
                    className="review-btn"
                    disabled={paper.review_count >= 3}
                  >
                    {paper.review_count >= 3 ? 'Max Reviews' : 'Review'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedPaper && (
          <div className="review-modal-overlay" onClick={() => setSelectedPaper(null)}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setSelectedPaper(null)}>×</button>
              <h2>Review Paper</h2>
              <h3>{selectedPaper.title}</h3>
              <form onSubmit={handleSubmitReview}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review comments..."
                  rows="8"
                  required
                />
                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg">{success}</div>}
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewFiles;