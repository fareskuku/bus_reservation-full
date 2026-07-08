const pool = require('../config/database');

const findByBookingId = async (bookingId) => {
  const query = 'SELECT * FROM payments WHERE booking_id = $1';
  const values = [bookingId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const create = async (paymentData) => {
  const { bookingId, amount, paymentMethod, transactionId, status = 'pending' } = paymentData;
  const query = `
    INSERT INTO payments (booking_id, amount, payment_method, transaction_id, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [bookingId, amount, paymentMethod, transactionId, status];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const updateStatus = async (id, status) => {
  const query = `
    UPDATE payments
    SET status = $1
    WHERE id = $2
    RETURNING *
  `;
  const values = [status, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  findByBookingId,
  create,
  updateStatus
};