const Bus = require('../models/Bus');
const Seat = require('../models/Seat');

const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.findAll();
    res.status(200).json(buses);
  } catch (error) {
    console.error('Get buses error:', error);
    res.status(500).json({ message: 'Error fetching buses' });
  }
};

const getBusById = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.status(200).json(bus);
  } catch (error) {
    console.error('Get bus error:', error);
    res.status(500).json({ message: 'Error fetching bus' });
  }
};

const getBusSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const seats = await Seat.findByBusId(id);
    res.status(200).json(seats);
  } catch (error) {
    console.error('Get bus seats error:', error);
    res.status(500).json({ message: 'Error fetching seats' });
  }
};

const createBus = async (req, res) => {
  try {
    const { busNumber, capacity, busType, amenities } = req.body;
    if (!busNumber || !capacity) {
      return res.status(400).json({ message: 'Bus number and capacity are required' });
    }

    const bus = await Bus.create({ busNumber, capacity, busType, amenities });
    await Seat.createBulk(bus.id, capacity);

    res.status(201).json({ message: 'Bus created successfully', bus });
  } catch (error) {
    console.error('Create bus error:', error);
    res.status(500).json({ message: 'Error creating bus' });
  }
};

const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { busNumber, capacity, busType, amenities, status } = req.body;

    const existingBus = await Bus.findById(id);
    if (!existingBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const bus = await Bus.update(id, {
      busNumber: busNumber || existingBus.bus_number,
      capacity: capacity || existingBus.capacity,
      busType: busType || existingBus.bus_type,
      amenities: amenities || existingBus.amenities,
      status: status || existingBus.status
    });

    res.status(200).json({ message: 'Bus updated successfully', bus });
  } catch (error) {
    console.error('Update bus error:', error);
    res.status(500).json({ message: 'Error updating bus' });
  }
};

const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    const existingBus = await Bus.findById(id);
    if (!existingBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    await Bus.remove(id);
    res.status(200).json({ message: 'Bus deleted successfully' });
  } catch (error) {
    console.error('Delete bus error:', error);
    res.status(500).json({ message: 'Error deleting bus' });
  }
};

module.exports = {
  getAllBuses,
  getBusById,
  getBusSeats,
  createBus,
  updateBus,
  deleteBus
};