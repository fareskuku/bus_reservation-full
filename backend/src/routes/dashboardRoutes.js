const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// User dashboard - authenticated users only
router.get('/user', auth, dashboardController.getUserDashboard);

// Admin dashboard - Admin only
router.get('/stats', auth, authorize('admin'), dashboardController.getStats);
router.get('/recent', auth, authorize('admin'), dashboardController.getRecentBookings);
router.get('/upcoming', auth, authorize('admin'), dashboardController.getUpcomingTrips);

module.exports = router;