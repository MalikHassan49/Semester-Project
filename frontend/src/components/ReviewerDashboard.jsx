import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewerDashboard.css';

const ReviewerDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'reviewer') {
      navigate('/');
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="reviewer-dashboard">
      <nav className="dashboard-navbar">
        <div className="nav-brand">
          <h2>Research Paper System</h2>
        </div>
        <div className="nav-user">
          <span className="user-greeting">Welcome, {user.username}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Reviewer Dashboard</h1>
          <p>Review and evaluate research papers</p>
        </div>

        <div className="dashboard-cards">
          <div className="action-card review-card">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="M12 11v6"/>
                <path d="M9 14h6"/>
              </svg>
            </div>
            <h3>Review Papers</h3>
            <p>View and review submitted research papers</p>
            <button onClick={() => navigate('/review-files')} className="card-btn review-btn-action">
              Start Reviewing
            </button>
          </div>

          <div className="action-card viewed-card">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3>Reviewed Papers</h3>
            <p>View all papers you have reviewed</p>
            <button onClick={() => navigate('/reviewed-files')} className="card-btn viewed-btn-action">
              View Reviews
            </button>
          </div>
        </div>

        <div className="dashboard-info">
          <div className="info-card">
            <h4>Reviewer Guidelines</h4>
            <ul>
              <li>Each paper can receive a maximum of 3 reviews</li>
              <li>Provide constructive feedback in your comments</li>
              <li>Review papers thoroughly before submitting</li>
              <li>Your reviews help authors improve their work</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerDashboard;