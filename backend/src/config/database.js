const { Pool } = require('pg');
require('dotenv').config();

console.log('🔌 ===== DATABASE CONFIG =====');
console.log('📋 DB_USER:', process.env.DB_USER || 'postgres');
console.log('📋 DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('📋 DB_PORT:', process.env.DB_PORT || '5432');
console.log('📋 DB_NAME:', process.env.DB_NAME || 'bus_reservation');
console.log('🔑 DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : '⚠️ NOT SET');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'bus_reservation',
  password: process.env.DB_PASSWORD || '',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err.message);
});

(async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as now, version() as version');
    console.log('✅ Database connection successful!');
    console.log('📅 Server time:', result.rows[0].now);
    console.log('📦 PostgreSQL:', result.rows[0].version.split(',')[0]);
    client.release();
  } catch (err) {
    console.error('❌ Database connection FAILED!');
    console.error('📝 Error:', err.message);
    console.error('💡 Please check:');
    console.error('   1. PostgreSQL is running');
    console.error('   2. .env file has correct credentials');
    console.error('   3. Database "bus_reservation" exists');
  }
})();

module.exports = pool;