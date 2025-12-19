// adminController.js
const db2 = require('../config/db');

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const [result] = await db2.query('CALL sp_get_all_users()');

    res.status(200).json({
      success: true,
      users: result[0]
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Prevent deleting yourself
    if (parseInt(user_id) === req.user.user_id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const [result] = await db2.query('CALL sp_delete_user(?)', [user_id]);

    if (result[0][0].deleted_count === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
};