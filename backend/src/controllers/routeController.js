const Route = require('../models/Route');
const Seat = require('../models/Seat');

const getAllRoutes = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    const routes = await Route.findAll({ origin, destination, date });
    res.status(200).json(routes);
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ message: 'Error fetching routes' });
  }
};

const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(200).json(route);
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({ message: 'Error fetching route' });
  }
};

const getAvailableSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const seats = await Seat.findAvailableByRouteId(id);
    res.status(200).json(seats);
  } catch (error) {
    console.error('Get seats error:', error);
    res.status(500).json({ message: 'Error fetching seats' });
  }
};

const createRoute = async (req, res) => {
  try {
    const { busId, origin, destination, departureTime, arrivalTime, fareAmount } = req.body;
    if (!busId || !origin || !destination || !departureTime || !arrivalTime || !fareAmount) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const route = await Route.create({ busId, origin, destination, departureTime, arrivalTime, fareAmount });
    res.status(201).json({ message: 'Route created successfully', route });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({ message: 'Error creating route' });
  }
};

const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { busId, origin, destination, departureTime, arrivalTime, fareAmount, status } = req.body;

    const existingRoute = await Route.findById(id);
    if (!existingRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const route = await Route.update(id, {
      busId: busId || existingRoute.bus_id,
      origin: origin || existingRoute.origin,
      destination: destination || existingRoute.destination,
      departureTime: departureTime || existingRoute.departure_time,
      arrivalTime: arrivalTime || existingRoute.arrival_time,
      fareAmount: fareAmount || existingRoute.fare_amount,
      status: status || existingRoute.status
    });

    res.status(200).json({ message: 'Route updated successfully', route });
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({ message: 'Error updating route' });
  }
};

const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const existingRoute = await Route.findById(id);
    if (!existingRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }

    await Route.remove(id);
    res.status(200).json({ message: 'Route cancelled successfully' });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ message: 'Error cancelling route' });
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  getAvailableSeats,
  createRoute,
  updateRoute,
  deleteRoute
};