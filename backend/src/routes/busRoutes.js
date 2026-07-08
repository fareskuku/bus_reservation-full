const router = require('express').Router();
const busController = require('../controllers/busController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Public routes - anyone can view buses
router.get('/', busController.getAllBuses);
router.get('/:id', busController.getBusById);
router.get('/:id/seats', busController.getBusSeats);

// Protected routes - Admin only
router.post('/', auth, authorize('admin'), busController.createBus);
router.put('/:id', auth, authorize('admin'), busController.updateBus);
router.delete('/:id', auth, authorize('admin'), busController.deleteBus);

module.exports = router;