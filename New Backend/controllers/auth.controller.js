// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const db = require('../config/db');

// // Register User
// exports.register = async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;

//     // Validate input
//     if (!username || !email || !password || !role) {
//       return res.status(400).json({
//         success: false,
//         message: 'All fields are required'
//       });
//     }

//     // Check if user exists
//     const [existingUsers] = await db.query(
//       'SELECT * FROM users WHERE email = ? OR username = ?',
//       [email, username]
//     );

//     if (existingUsers.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'User with this email or username already exists'
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Call stored procedure to insert user
//     const [result] = await db.query(
//       'CALL sp_insert_user(?, ?, ?, ?)',
//       [username, email, hashedPassword, role]
//     );

//     const user_id = result[0][0].user_id; // ✅ user_id name consistent

//     // Generate JWT with user_id field
//     const token = jwt.sign(
//       { user_id, email, role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       token,
//       user: {
//         user_id,
//         username,
//         email,
//         role
//       }
//     });
//   } catch (error) {
//     console.error('Register error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during registration'
//     });
//   }
// };

// // Login User
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and password are required'
//       });
//     }

//     // Call stored procedure to get user
//     const [result] = await db.query('CALL sp_user_login(?)', [email]);

//     if (!result[0] || result[0].length === 0) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     const user = result[0][0];

//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     // Generate JWT with user_id
//     const token = jwt.sign(
//       { user_id: user.user_id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: {
//         user_id: user.user_id,
//         username: user.username,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during login'
//     });
//   }
// };



const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register User
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user exists
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Call stored procedure to insert user
    const [result] = await db.query(
      'CALL sp_insert_user(?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    const user_id = result[0][0].user_id;

    // Generate JWT with user_id field
    const token = jwt.sign(
      { user_id, email, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        user_id,
        username,
        email,
        role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Call stored procedure to get user
    const [result] = await db.query('CALL sp_user_login(?)', [email]);

    if (!result[0] || result[0].length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result[0][0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT with user_id (stored procedure returns user_id as 'id')
    const token = jwt.sign(
      { user_id: user.id, email: user.email, role: user.role },  // ← CHANGED: user.user_id → user.id
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        user_id: user.id,          // ← CHANGED: user.user_id → user.id
        username: user.name,       // ← CHANGED: user.username → user.name
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};