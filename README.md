# bus_reservation-full
bus_reservation with backend

# 🚌 Addis Metro - Bus Reservation System

A full-stack bus reservation system built with Node.js, Express, PostgreSQL, and Vanilla JavaScript. This system allows users to search for bus routes, book tickets, manage their bookings, and provides administrative capabilities for managing buses, routes, and users.


---

## ✨ Features

### 👤 Customer Features
- **User Authentication**: Register, Login, Logout with JWT
- **Route Search**: Search buses by origin, destination, and date
- **Seat Selection**: Interactive seat map with real-time availability
- **Booking Management**: View, cancel, and manage bookings
- **Personal Dashboard**: View booking statistics and history
- **Profile Management**: Update personal information and password

### 👑 Admin Features
- **Dashboard**: System-wide statistics and analytics
- **User Management**: View, update roles, delete users
- **Bus Management**: Add, update, delete buses
- **Route Management**: Add, update, delete routes
- **Booking Management**: View all bookings, update status
- **Role Management**: Assign roles (admin, manager, customer, driver, support)

### 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Role-based authorization
- Input validation and sanitization
- CORS protection
- Rate limiting

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v18+ | Runtime Environment |
| Express.js | v5.2.1 | Web Framework |
| PostgreSQL | v15+ | Database |
| JSON Web Token | v9.0.3 | Authentication |
| bcrypt | v6.0.0 | Password Hashing |
| dotenv | v17.4.2 | Environment Variables |
| cors | v2.8.5 | CORS Configuration |
| Winston | v3.17.0 | Logging |

### Frontend
| Technology | Purpose |
|------------|---------|
| Vanilla JavaScript | Frontend Logic |
| HTML5 | Structure |
| CSS3 | Styling |
| Live Server | Development Server |

---
bus-reservation-system/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ ├── database.js # PostgreSQL connection configuration
│ │ │ └── jwt.js # JWT configuration and utilities
│ │ ├── models/
│ │ │ ├── User.js # User model - CRUD operations
│ │ │ ├── Bus.js # Bus model - CRUD operations
│ │ │ ├── Route.js # Route model - CRUD operations
│ │ │ ├── Seat.js # Seat model - availability management
│ │ │ ├── Booking.js # Booking model - booking operations
│ │ │ └── Payment.js # Payment model - payment processing
│ │ ├── controllers/
│ │ │ ├── authController.js # Authentication logic
│ │ │ ├── busController.js # Bus operations
│ │ │ ├── routeController.js # Route operations
│ │ │ ├── bookingController.js # Booking operations
│ │ │ └── dashboardController.js # Dashboard analytics
│ │ ├── routes/
│ │ │ ├── authRoutes.js # Authentication endpoints
│ │ │ ├── busRoutes.js # Bus endpoints
│ │ │ ├── routeRoutes.js # Route endpoints
│ │ │ ├── bookingRoutes.js # Booking endpoints
│ │ │ ├── dashboardRoutes.js # Dashboard endpoints
│ │ │ └── adminRoutes.js # Admin-only endpoints
│ │ └── middleware/
│ │ ├── auth.js # JWT verification middleware
│ │ └── authorize.js # Role-based authorization middleware
│ ├── server.js # Application entry point
│ ├── package.json
│ └── .env # Environment variables (not in repo)
├── frontend/
│ ├── index.html # Home page
│ ├── booking.html # Booking page
│ ├── tickets.html # Tickets page
│ ├── about.html # About page
│ ├── css/
│ │ └── style.css # Complete styling
│ └── js/
│ ├── api.js # API wrapper and requests
│ ├── auth.js # Authentication management
│ ├── script.js # Main application logic
│ └── components/
│ ├── auth.js # Authentication components
│ ├── routes.js # Route components
│ ├── seats.js # Seat selection components
│ ├── booking.js # Booking components
│ └── dashboard.js # Dashboard components

## 📁 Project Structure
