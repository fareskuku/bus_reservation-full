const Booking = require('../models/Booking');
const Route = require('../models/Route');
const Seat = require('../models/Seat');

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findByUserId(req.userId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id, req.userId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
};

const createBooking = async (req, res) => {
  try {
    const { routeId, seatIds } = req.body;
    if (!routeId || !seatIds || seatIds.length === 0) {
      return res.status(400).json({ message: 'Route ID and seat IDs are required' });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const seats = await Seat.checkAvailability(seatIds);
    const unavailableSeats = seats.filter(seat => !seat.is_available);
    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: 'Some seats are not available',
        unavailableSeats: unavailableSeats.map(s => s.seat_number)
      });
    }

    const totalAmount = route.fare_amount * seatIds.length;
    const booking = await Booking.create({
      userId: req.userId,
      routeId,
      seatIds,
      totalAmount
    });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.cancel(id, req.userId);
    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Cancel booking error:', error);
    if (error.message === 'Booking not found or already cancelled') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.updateStatus(id, status);
    res.status(200).json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
};

module.exports = {
  getUserBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
};