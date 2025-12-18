import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DisplayPapers.css';

const API_URL = import.meta.env.VITE_API_URL;

const DisplayPapers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/papers/my-papers`);
      const data = await response.json();

      if (response.ok) {
        setPapers(data.papers);
      } else {
        setError(data.message || 'Failed to fetch papers');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/author-dashboard');
  };

  const handleViewFile = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffa726';
      case 'under_review':
        return '#42a5f5';
      case 'accepted':
        return '#66bb6a';
      case 'rejected':
        return '#ef5350';
      default:
        return '#999';
    }
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  if (loading) {
    return (
      <div className="display-papers-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="display-papers-container">
      <div className="display-papers-content">
        <div className="display-header">
          <button onClick={handleBack} className="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Dashboard
          </button>
          <h1>My Research Papers</h1>
          <p>View all your submitted papers</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {papers.length === 0 ? (
          <div className="no-papers">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <h3>No Papers Yet</h3>
            <p>You haven't submitted any research papers</p>
            <button onClick={() => navigate('/submit-paper')} className="submit-new-btn">
              Submit Your First Paper
            </button>
          </div>
        ) : (
          <div className="papers-grid">
            {papers.map((paper) => (
              <div key={paper.paper_id} className="paper-card">
                <div className="paper-header">
                  <div 
                    className="paper-status" 
                    style={{ backgroundColor: getStatusColor(paper.status) }}
                  >
                    {getStatusText(paper.status)}
                  </div>
                  <span className="paper-date">
                    {new Date(paper.submission_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <h3 className="paper-title">{paper.title}</h3>
                <p className="paper-abstract">
                  {paper.abstract.length > 150 
                    ? `${paper.abstract.substring(0, 150)}...` 
                    : paper.abstract}
                </p>

                <div className="paper-footer">
                  <div className="paper-info">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span>{paper.file_name}</span>
                  </div>
                  <button 
                    onClick={() => handleViewFile(paper.file_url)} 
                    className="view-btn"
                  >
                    View File
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayPapers;
