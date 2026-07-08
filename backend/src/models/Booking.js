const pool = require('../config/database');

const findByUserId = async (userId) => {
  const query = `
    SELECT b.*, r.origin, r.destination, r.departure_time, r.arrival_time,
           r.fare_amount, bu.bus_number, bu.bus_type,
           array_agg(s.seat_number) as seat_numbers
    FROM bookings b
    JOIN routes r ON b.route_id = r.id
    JOIN buses bu ON r.bus_id = bu.id
    JOIN seats s ON s.id = ANY(b.seat_ids)
    WHERE b.user_id = $1
    GROUP BY b.id, r.id, bu.id
    ORDER BY b.created_at DESC
  `;
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows;
};

const findById = async (id, userId) => {
  const query = `
    SELECT b.*, r.origin, r.destination, r.departure_time, r.arrival_time,
           r.fare_amount, bu.bus_number, bu.bus_type,
           array_agg(s.seat_number) as seat_numbers,
           u.full_name as user_name, u.email as user_email
    FROM bookings b
    JOIN routes r ON b.route_id = r.id
    JOIN buses bu ON r.bus_id = bu.id
    JOIN seats s ON s.id = ANY(b.seat_ids)
    JOIN users u ON u.id = b.user_id
    WHERE b.id = $1 AND b.user_id = $2
    GROUP BY b.id, r.id, bu.id, u.id
  `;
  const values = [id, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const create = async (bookingData) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { userId, routeId, seatIds, totalAmount } = bookingData;

    const checkQuery = `
      SELECT COUNT(*) as count
      FROM seats
      WHERE id = ANY($1) AND is_available = true
    `;
    const checkResult = await client.query(checkQuery, [seatIds]);
    if (checkResult.rows[0].count !== seatIds.length) {
      throw new Error('One or more seats are not available');
    }

    const bookingQuery = `
      INSERT INTO bookings (user_id, route_id, seat_ids, total_amount, status, payment_status)
      VALUES ($1, $2, $3, $4, 'confirmed', 'pending')
      RETURNING *
    `;
    const bookingValues = [userId, routeId, seatIds, totalAmount];
    const bookingResult = await client.query(bookingQuery, bookingValues);
    const booking = bookingResult.rows[0];

    const updateQuery = `
      UPDATE seats
      SET is_available = false
      WHERE id = ANY($1)
    `;
    await client.query(updateQuery, [seatIds]);

    await client.query('COMMIT');
    return booking;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const cancel = async (id, userId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const bookingQuery = `
      UPDATE bookings
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2 AND status != 'cancelled'
      RETURNING *
    `;
    const bookingValues = [id, userId];
    const bookingResult = await client.query(bookingQuery, bookingValues);
    const booking = bookingResult.rows[0];

    if (!booking) {
      throw new Error('Booking not found or already cancelled');
    }

    const updateQuery = `
      UPDATE seats
      SET is_available = true
      WHERE id = ANY($1)
    `;
    await client.query(updateQuery, [booking.seat_ids]);

    await client.query('COMMIT');
    return booking;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const findAll = async () => {
  const query = `
    SELECT b.*, r.origin, r.destination, r.departure_time,
           u.full_name as user_name, u.email as user_email
    FROM bookings b
    JOIN routes r ON b.route_id = r.id
    JOIN users u ON u.id = b.user_id
    ORDER BY b.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

const updateStatus = async (id, status) => {
  const query = `
    UPDATE bookings
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  const values = [status, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  findByUserId,
  findById,
  create,
  cancel,
  findAll,
  updateStatus
};