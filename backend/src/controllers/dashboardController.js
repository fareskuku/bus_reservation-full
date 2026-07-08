const pool = require('../config/database');

const getStats = async (req, res) => {
  try {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM bookings) as total_bookings,
        (SELECT COUNT(*) FROM routes WHERE status = 'active') as active_routes,
        (SELECT COUNT(*) FROM buses WHERE status = 'active') as active_buses,
        (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE status = 'confirmed') as total_revenue
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

const getRecentBookings = async (req, res) => {
  try {
    const query = `
      SELECT b.*, u.full_name as user_name, r.origin, r.destination
      FROM bookings b
      JOIN users u ON u.id = b.user_id
      JOIN routes r ON r.id = b.route_id
      ORDER BY b.created_at DESC
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get recent bookings error:', error);
    res.status(500).json({ message: 'Error fetching recent bookings' });
  }
};

const getUpcomingTrips = async (req, res) => {
  try {
    const query = `
      SELECT r.*, b.bus_number, 
             COUNT(bs.id) as total_seats,
             COUNT(CASE WHEN bs.is_available = false THEN 1 END) as booked_seats
      FROM routes r
      JOIN buses b ON b.id = r.bus_id
      JOIN seats bs ON bs.bus_id = b.id
      WHERE r.departure_time > CURRENT_TIMESTAMP AND r.status = 'active'
      GROUP BY r.id, b.id
      ORDER BY r.departure_time ASC
      LIMIT 5
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get upcoming trips error:', error);
    res.status(500).json({ message: 'Error fetching upcoming trips' });
  }
};

const getUserDashboard = async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM bookings WHERE user_id = $1) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE user_id = $1 AND status = 'confirmed') as active_bookings,
        (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE user_id = $1 AND status = 'confirmed') as total_spent
    `;
    const statsResult = await pool.query(statsQuery, [req.userId]);

    const recentQuery = `
      SELECT b.*, r.origin, r.destination, r.departure_time
      FROM bookings b
      JOIN routes r ON r.id = b.route_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
      LIMIT 5
    `;
    const recentResult = await pool.query(recentQuery, [req.userId]);

    res.status(200).json({
      stats: statsResult.rows[0],
      recent: recentResult.rows
    });
  } catch (error) {
    console.error('Get user dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard' });
  }
};

module.exports = {
  getStats,
  getRecentBookings,
  getUpcomingTrips,
  getUserDashboard
};