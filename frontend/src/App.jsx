// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import AuthorDashboard from './components/AuthorDashboard';
import SubmitPaper from './components/SubmitPaper';
import DisplayPapers from './components/DisplayPapers';
import ReviewerDashboard from './components/ReviewerDashboard';
import ReviewFiles from './components/ReviewFiles';
import ReviewedFiles from './components/ReviewedFiles';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/author-dashboard" element={<AuthorDashboard />} />
        <Route path="/submit-paper" element={<SubmitPaper />} />
        <Route path="/display-papers" element={<DisplayPapers />} />
        <Route path="/reviewer-dashboard" element={<ReviewerDashboard />} />
        <Route path="/review-files" element={<ReviewFiles />} />
        <Route path="/reviewed-files" element={<ReviewedFiles />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;