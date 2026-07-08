const router = require('express').Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const User = require('../models/User');
const pool = require('../config/database');

// Get all users (Admin only)
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID (Admin only)
router.get('/users/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user role (Admin only)
router.put('/users/:id/role', auth, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }
    
    const validRoles = ['admin', 'manager', 'customer', 'driver', 'support'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Don't allow changing your own role
    if (parseInt(id) === req.userId) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }
    
    const user = await User.updateRole(id, role);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: 'User role updated successfully', 
      user 
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Don't allow deleting yourself
    if (parseInt(id) === req.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const user = await User.remove(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: 'User deleted successfully', 
      user 
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings (Admin only)
router.get('/all-bookings', auth, authorize('admin'), async (req, res) => {
  try {
    const query = `
      SELECT b.*, u.full_name as user_name, r.origin, r.destination
      FROM bookings b
      JOIN users u ON u.id = b.user_id
      JOIN routes r ON r.id = b.route_id
      ORDER BY b.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get system stats (Admin only)
router.get('/stats', auth, authorize('admin'), async (req, res) => {
  try {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM bookings) as total_bookings,
        (SELECT COUNT(*) FROM buses WHERE status = 'active') as active_buses,
        (SELECT COUNT(*) FROM routes WHERE status = 'active') as active_routes,
        (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE status = 'confirmed') as total_revenue
    `;
    const result = await pool.query(query);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;