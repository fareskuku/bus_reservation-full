const pool = require('../config/database');

const findAll = async () => {
  const query = 'SELECT * FROM buses ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
};

const findById = async (id) => {
  const query = 'SELECT * FROM buses WHERE id = $1';
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const create = async (busData) => {
  const { busNumber, capacity, busType, amenities, status = 'active' } = busData;
  const query = `
    INSERT INTO buses (bus_number, capacity, bus_type, amenities, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [busNumber, capacity, busType, amenities, status];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const update = async (id, busData) => {
  const { busNumber, capacity, busType, amenities, status } = busData;
  const query = `
    UPDATE buses
    SET bus_number = $1, capacity = $2, bus_type = $3, 
        amenities = $4, status = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `;
  const values = [busNumber, capacity, busType, amenities, status, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const remove = async (id) => {
  const query = 'DELETE FROM buses WHERE id = $1 RETURNING *';
  const values = [id];
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