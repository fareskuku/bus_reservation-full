const pool = require('../config/database');

const findAll = async (filters = {}) => {
  let query = `
    SELECT r.*, b.bus_number, b.capacity, b.bus_type,
           (SELECT COUNT(*) FROM seats WHERE bus_id = r.bus_id AND is_available = true) as available_seats
    FROM routes r
    JOIN buses b ON r.bus_id = b.id
    WHERE r.status = 'active'
  `;
  const values = [];
  let paramCount = 1;

  if (filters.origin) {
    query += ` AND r.origin ILIKE $${paramCount}`;
    values.push(`%${filters.origin}%`);
    paramCount++;
  }

  if (filters.destination) {
    query += ` AND r.destination ILIKE $${paramCount}`;
    values.push(`%${filters.destination}%`);
    paramCount++;
  }

  if (filters.date) {
    query += ` AND DATE(r.departure_time) = $${paramCount}`;
    values.push(filters.date);
    paramCount++;
  }

  query += ' ORDER BY r.departure_time ASC';
  const result = await pool.query(query, values);
  return result.rows;
};

const findById = async (id) => {
  const query = `
    SELECT r.*, b.bus_number, b.capacity, b.bus_type,
           (SELECT COUNT(*) FROM seats WHERE bus_id = r.bus_id AND is_available = true) as available_seats
    FROM routes r
    JOIN buses b ON r.bus_id = b.id
    WHERE r.id = $1
  `;
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const create = async (routeData) => {
  const { busId, origin, destination, departureTime, arrivalTime, fareAmount, status = 'active' } = routeData;
  const query = `
    INSERT INTO routes (bus_id, origin, destination, departure_time, arrival_time, fare_amount, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const values = [busId, origin, destination, departureTime, arrivalTime, fareAmount, status];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const update = async (id, routeData) => {
  const { busId, origin, destination, departureTime, arrivalTime, fareAmount, status } = routeData;
  const query = `
    UPDATE routes
    SET bus_id = $1, origin = $2, destination = $3,
        departure_time = $4, arrival_time = $5,
        fare_amount = $6, status = $7, updated_at = CURRENT_TIMESTAMP
    WHERE id = $8
    RETURNING *
  `;
  const values = [busId, origin, destination, departureTime, arrivalTime, fareAmount, status, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const remove = async (id) => {
  const query = 'UPDATE routes SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
  const values = ['cancelled', id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};