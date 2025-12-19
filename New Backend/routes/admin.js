// admin.js
const express4 = require('express');
const router4 = express4.Router();
const adminController = require('../controllers/admin.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router4.get('/users', authMiddleware, roleMiddleware('admin'), 
  adminController.getAllUsers);

router4.delete('/users/:user_id', authMiddleware, roleMiddleware('admin'), 
  adminController.deleteUser);

module.exports = router4;