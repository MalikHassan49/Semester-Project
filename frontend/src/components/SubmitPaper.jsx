import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubmitPaper.css';

const SubmitPaper = () => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Only PDF, DOC, and DOCX files are allowed');
        setFile(null);
        e.target.value = '';
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        setFile(null);
        e.target.value = '';
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('abstract', formData.abstract);
      formDataToSend.append('file', file);

      const response = await fetch('http://localhost:5000/api/papers/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Paper submitted successfully!');
        setFormData({ title: '', abstract: '' });
        setFile(null);
        document.getElementById('file-input').value = '';
        
        setTimeout(() => {
          navigate('/author-dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit paper');
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

  return (
    <div className="submit-paper-container">
      <div className="submit-paper-box">
        <div className="submit-header">
          <button onClick={handleBack} className="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Dashboard
          </button>
          <h1>Submit Research Paper</h1>
          <p>Fill in the details and upload your research paper</p>
        </div>

        <form onSubmit={handleSubmit} className="submit-form">
          <div className="form-group">
            <label htmlFor="title">Paper Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your paper title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="abstract">Abstract *</label>
            <textarea
              id="abstract"
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              placeholder="Enter your paper abstract (max 500 words)"
              rows="8"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="file-input">Upload Paper File * (PDF, DOC, DOCX)</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                required
              />
              <div className="file-input-display">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>{file ? file.name : 'Choose a file or drag it here'}</span>
              </div>
            </div>
            {file && (
              <div className="file-info">
                <span>Selected: {file.name}</span>
                <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Uploading...
              </>
            ) : (
              'Submit Paper'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitPaper;