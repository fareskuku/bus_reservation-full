const pool = require('../config/database');

const findByEmail = async (email) => {
  try {
    console.log('🔍 Finding user by email:', email);
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    console.log('✅ Found user:', result.rows[0] ? 'Yes' : 'No');
    return result.rows[0];
  } catch (error) {
    console.error('❌ findByEmail error:', error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    console.log('🔍 Finding user by id:', id);
    const query = `
      SELECT id, email, full_name, role, phone, address, city, 
             dob, gender, payment_method, id_type, id_number, created_at 
      FROM users WHERE id = $1
    `;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('❌ findById error:', error);
    throw error;
  }
};

const create = async (userData) => {
  try {
    const { 
      fullName, email, passwordHash, phone, role = 'customer',
      address, city, dob, gender, paymentMethod, idType, idNumber
    } = userData;
    
    console.log('💾 Inserting user into database...');
    
    const query = `
      INSERT INTO users (
        full_name, email, password_hash, phone, role, 
        address, city, dob, gender, payment_method, id_type, id_number
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, email, full_name, role, phone, address, city, 
                dob, gender, payment_method, id_type, id_number, created_at
    `;
    const values = [
      fullName, email, passwordHash, phone, role,
      address, city, dob, gender, paymentMethod, idType, idNumber
    ];
    const result = await pool.query(query, values);
    
    console.log('✅ User inserted successfully');
    return result.rows[0];
  } catch (error) {
    console.error('❌ create user error:', error);
    throw error;
  }
};

const update = async (id, userData) => {
  try {
    const { fullName, phone, address, city, dob, gender, paymentMethod, idType, idNumber } = userData;
    const query = `
      UPDATE users
      SET full_name = $1, phone = $2, address = $3, city = $4, 
          dob = $5, gender = $6, payment_method = $7, id_type = $8, 
          id_number = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING id, email, full_name, role, phone, address, city, 
                dob, gender, payment_method, id_type, id_number, created_at
    `;
    const values = [fullName, phone, address, city, dob, gender, paymentMethod, idType, idNumber, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('❌ update user error:', error);
    throw error;
  }
};

const updateRole = async (id, role) => {
  try {
    const query = `
      UPDATE users
      SET role = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, full_name, role, phone
    `;
    const values = [role, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('❌ updateRole error:', error);
    throw error;
  }
};

const updatePassword = async (id, passwordHash) => {
  try {
    const query = `
      UPDATE users
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    const values = [passwordHash, id];
    await pool.query(query, values);
  } catch (error) {
    console.error('❌ updatePassword error:', error);
    throw error;
  }
};

const remove = async (id) => {
  try {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id, email, full_name';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('❌ remove user error:', error);
    throw error;
  }
};

const findAll = async () => {
  try {
    const query = 'SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('❌ findAll users error:', error);
    throw error;
  }
};

module.exports = {
  findByEmail,
  findById,
  create,
  update,
  updateRole,
  updatePassword,
  remove,
  findAll
};