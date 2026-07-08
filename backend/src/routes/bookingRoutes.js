const router = require('express').Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Customer routes - authenticated users only
router.get('/', auth, bookingController.getUserBookings);
router.get('/:id', auth, bookingController.getBookingById);
router.post('/', auth, bookingController.createBooking);
router.put('/:id/cancel', auth, bookingController.cancelBooking);

// Admin routes - Admin only
router.get('/all', auth, authorize('admin'), bookingController.getAllBookings);
router.put('/:id/status', auth, authorize('admin'), bookingController.updateBookingStatus);

module.exports = router;