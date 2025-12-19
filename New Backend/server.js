const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


// Import routes
const authRoutes = require('./routes/auth');
const paperRoutes = require('./routes/papers');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');

// Create Express app
const app = express();

// Middleware
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
//   credentials: true
// }));


app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));




app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  const environment = process.env.NODE_ENV || 'development';
  const corsOrigin = process.env.CORS_ORIGIN || 'Not set';

  const serverMessage = environment === 'production' 
    ? 'Server is running in production mode' 
    : `Server is running on http://localhost:${PORT}`;

  console.log(serverMessage);
  console.log(`Environment: ${environment}`);
  console.log(`CORS enabled for: ${corsOrigin}`);
});

