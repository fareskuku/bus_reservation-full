

-- Create users table with role column
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',  -- 👈 ROLE COLUMN ADDED
    address VARCHAR(255),
    city VARCHAR(100),
    dob DATE,
    gender VARCHAR(20),
    payment_method VARCHAR(50),
    id_type VARCHAR(50),
    id_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create buses table
CREATE TABLE buses (
    id SERIAL PRIMARY KEY,
    bus_number VARCHAR(20) UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    bus_type VARCHAR(50) DEFAULT 'standard',
    amenities TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create routes table
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER REFERENCES buses(id) ON DELETE CASCADE,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    fare_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create seats table
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER REFERENCES buses(id) ON DELETE CASCADE,
    seat_number INTEGER NOT NULL,
    seat_type VARCHAR(20) DEFAULT 'standard',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bus_id, seat_number)
);

-- Create bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
    seat_ids INTEGER[] NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_routes_origin_destination ON routes(origin, destination);
CREATE INDEX idx_routes_departure_time ON routes(departure_time);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_route_id ON bookings(route_id);

-- Insert sample bus
INSERT INTO buses (bus_number, capacity, bus_type, amenities) 
VALUES ('BUS001', 40, 'standard', ARRAY['AC', 'WiFi']);

-- Insert sample route
INSERT INTO routes (bus_id, origin, destination, departure_time, arrival_time, fare_amount)
VALUES (1, 'Piazza', 'Bole', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 45 minutes', 20.00);

-- Insert sample seats
INSERT INTO seats (bus_id, seat_number, seat_type, is_available)
SELECT 1, generate_series(1, 40), 'standard', true;

-- Insert admin user (password: admin123)
INSERT INTO users (full_name, email, password_hash, phone, role) 
VALUES (
    'Admin User',
    'admin@bus.com',
    '$2b$10$XQ7cQY5zH5Z5zH5Z5zH5ZuXQ7cQY5zH5Z5zH5Z5zH5Z5zH5Z5zH5',
    '0911111111',
    'admin'
);

-- View all users with roles
SELECT id, full_name, email, role, created_at FROM users;

SELECT id, full_name, email, role FROM users WHERE email = 'admin@bus.com';

-- Show all tables
-- Update admin password to 'admin123' with correct hash
UPDATE users 
SET password_hash = '$2b$10$y62weiAW6JkasH3PKFeTVOLWZ6FDKAo3Sf1U8P2ucCB8u/TJiulhS'
WHERE email = 'admin@bus.com';

-- Verify the update
SELECT id, full_name, email, role, password_hash FROM users WHERE email = 'admin@bus.com';