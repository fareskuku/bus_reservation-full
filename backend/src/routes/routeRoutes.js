const router = require('express').Router();
const routeController = require('../controllers/routeController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Public routes - anyone can view routes
router.get('/', routeController.getAllRoutes);
router.get('/search', routeController.getAllRoutes);
router.get('/:id', routeController.getRouteById);
router.get('/:id/seats', routeController.getAvailableSeats);

// Protected routes - Admin only
router.post('/', auth, authorize('admin'), routeController.createRoute);
router.put('/:id', auth, authorize('admin'), routeController.updateRoute);
router.delete('/:id', auth, authorize('admin'), routeController.deleteRoute);

module.exports = router;