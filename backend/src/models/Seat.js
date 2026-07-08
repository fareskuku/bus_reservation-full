const pool = require('../config/database');

const findByBusId = async (busId) => {
  const query = 'SELECT * FROM seats WHERE bus_id = $1 ORDER BY seat_number';
  const values = [busId];
  const result = await pool.query(query, values);
  return result.rows;
};

const findAvailableByRouteId = async (routeId) => {
  const query = `
    SELECT s.*
    FROM seats s
    JOIN routes r ON r.bus_id = s.bus_id
    WHERE r.id = $1 AND s.is_available = true
    ORDER BY s.seat_number
  `;
  const values = [routeId];
  const result = await pool.query(query, values);
  return result.rows;
};

const createBulk = async (busId, seatCount) => {
  const seats = [];
  for (let i = 1; i <= seatCount; i++) {
    seats.push(`(${busId}, ${i}, 'standard', true)`);
  }
  const query = `
    INSERT INTO seats (bus_id, seat_number, seat_type, is_available)
    VALUES ${seats.join(', ')}
    RETURNING *
  `;
  const result = await pool.query(query);
  return result.rows;
};

const updateAvailability = async (seatIds, isAvailable) => {
  const placeholders = seatIds.map((_, i) => `$${i + 1}`).join(', ');
  const query = `
    UPDATE seats
    SET is_available = $${seatIds.length + 1}
    WHERE id IN (${placeholders})
    RETURNING *
  `;
  const values = [...seatIds, isAvailable];
  const result = await pool.query(query, values);
  return result.rows;
};

const checkAvailability = async (seatIds) => {
  const placeholders = seatIds.map((_, i) => `$${i + 1}`).join(', ');
  const query = `
    SELECT id, seat_number, is_available
    FROM seats
    WHERE id IN (${placeholders})
  `;
  const values = seatIds;
  const result = await pool.query(query, values);
  return result.rows;
};

module.exports = {
  findByBusId,
  findAvailableByRouteId,
  createBulk,
  updateAvailability,
  checkAvailability
};