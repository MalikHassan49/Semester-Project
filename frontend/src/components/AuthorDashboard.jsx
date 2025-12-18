import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthorDashboard.css';

const AuthorDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'author') {
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

  const handleSubmitPaper = () => {
    navigate('/submit-paper');
  };

  const handleDisplayPapers = () => {
    navigate('/display-papers');
  };

  if (!user) return null;

  return (
    <div className="author-dashboard">
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
          <h1>Author Dashboard</h1>
          <p>Manage your research papers and submissions</p>
        </div>

        <div className="dashboard-cards">
          <div className="action-card submit-card">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <h3>Submit Paper</h3>
            <p>Upload and submit your research paper for review</p>
            <button onClick={handleSubmitPaper} className="card-btn submit-btn-action">
              Submit New Paper
            </button>
          </div>

          <div className="action-card display-card">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h3>Display My Papers</h3>
            <p>View all your submitted research papers</p>
            <button onClick={handleDisplayPapers} className="card-btn display-btn-action">
              View My Papers
            </button>
          </div>
        </div>

        <div className="dashboard-info">
          <div className="info-card">
            <h4>Quick Tips</h4>
            <ul>
              <li>Ensure your paper is in PDF, DOC, or DOCX format</li>
              <li>Write a clear and concise abstract</li>
              <li>Papers are reviewed by up to 3 reviewers</li>
              <li>You can track the status of your submissions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;