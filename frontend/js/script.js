document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    authManager.updateUI();

    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const dashboardBtn = document.getElementById('dashboardBtn');
    const adminDashboardBtn = document.getElementById('adminDashboardBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal('login');
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal('register');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authManager.logout();
        });
    }

    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (authManager.isAuthenticated) {
                document.getElementById('userDashboard').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (adminDashboardBtn) {
        adminDashboardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (authManager.isAdmin()) {
                document.getElementById('adminDashboard').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    setupAuthModal();

    const quickBookingForm = document.getElementById('quick-booking-form');
    if (quickBookingForm) {
        quickBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const from = document.getElementById('from-location').value;
            const to = document.getElementById('to-location').value;
            const date = document.getElementById('travel-date').value;
            const passengers = document.getElementById('passenger-count').value;

            if (!from || !to) {
                showToast('Please select both departure and destination', 'error');
                return;
            }

            if (from === to) {
                showToast('Departure and destination cannot be the same', 'error');
                return;
            }

            const searchData = { from, to, date, passengers };
            localStorage.setItem('addis_metro_search', JSON.stringify(searchData));
            window.location.href = `booking.html?from=${from}&to=${to}`;
        });
    }

    const dateInput = document.getElementById('travel-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        if (!dateInput.value) dateInput.value = today;
    }
});

function showToast(message, type = 'info') {
    const container = document.getElementById('toast');
    if (!container) {
        console.warn('Toast container not found');
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    switch (type) {
        case 'success': icon = '✅'; break;
        case 'error': icon = '❌'; break;
        case 'warning': icon = '⚠️'; break;
    }
    
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

window.showToast = showToast;

function showAuthModal(mode) {
    const modal = document.getElementById('authModal');
    if (!modal) return;

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (mode === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }

    modal.style.display = 'flex';
}

function hideAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
}

function setupAuthModal() {
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal('register');
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal('login');
        });
    }

    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }

            try {
                await authManager.login(email, password);
                hideAuthModal();
                showToast('Login successful!', 'success');
                setTimeout(() => window.location.reload(), 1000);
            } catch (error) {
                showToast(error.message || 'Login failed', 'error');
            }
        });
    }

    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('registerFullName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const address = document.getElementById('registerAddress').value;
            const city = document.getElementById('registerCity').value;
            const dob = document.getElementById('registerDob').value;
            const gender = document.getElementById('registerGender').value;
            const paymentMethod = document.getElementById('registerPayment').value;
            const idType = document.getElementById('registerIdType').value;
            const idNumber = document.getElementById('registerIdNumber').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            const terms = document.getElementById('registerTerms').checked;

            if (!fullName || !email || !phone || !password || !confirmPassword) {
                showToast('Please fill in all required fields', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }

            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                showToast('Please enter a valid 10-digit phone number', 'error');
                return;
            }

            if (password.length < 8) {
                showToast('Password must be at least 8 characters long', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }

            if (!terms) {
                showToast('Please agree to the Terms of Service', 'error');
                return;
            }

            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Registering...';
            submitBtn.disabled = true;

            try {
                const userData = {
                    fullName,
                    email,
                    password,
                    phone,
                    address,
                    city,
                    dob,
                    gender,
                    paymentMethod,
                    idType,
                    idNumber
                };
                
                await authManager.register(userData);
                hideAuthModal();
                showToast('Registration successful! Welcome to Addis Metro!', 'success');
                registerForm.reset();
                
                const strengthLevel = document.querySelector('.strength-level');
                if (strengthLevel) {
                    strengthLevel.style.width = '0%';
                }
                
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                showToast(error.message || 'Registration failed', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    setupPasswordStrength();

    const closeButtons = document.querySelectorAll('.modal .modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

function setupPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('registerConfirmPassword');
    const strengthText = document.querySelector('.strength-text');
    const strengthLevel = document.querySelector('.strength-level');
    const passwordMatch = document.getElementById('passwordMatch');

    if (!passwordInput) return;

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        
        if (strengthLevel) {
            strengthLevel.style.width = strength.percentage + '%';
            strengthLevel.className = 'strength-level ' + strength.class;
        }
        
        if (strengthText) {
            strengthText.textContent = strength.message;
            strengthText.style.color = strength.color;
        }
        
        if (confirmPasswordInput && confirmPasswordInput.value) {
            checkPasswordMatch();
        }
    });

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }

    function checkPasswordStrength(password) {
        let score = 0;
        
        if (password.length === 0) {
            return { percentage: 0, class: 'weak', message: 'Enter a password', color: 'var(--gray-medium)' };
        }
        
        if (password.length >= 8) score += 25;
        if (/\d/.test(password)) score += 25;
        if (/[A-Z]/.test(password)) score += 25;
        if (/[^A-Za-z0-9]/.test(password)) score += 25;
        
        let class_name, message, color;
        
        if (score >= 75) {
            class_name = 'strong';
            message = 'Strong - Great password!';
            color = 'var(--success-green)';
        } else if (score >= 50) {
            class_name = 'medium';
            message = 'Medium - Add numbers and symbols';
            color = 'var(--warning-orange)';
        } else {
            class_name = 'weak';
            message = 'Weak - use 8+ characters with numbers and symbols';
            color = 'var(--primary-red)';
        }
        
        return { percentage: score, class: class_name, message, color };
    }

    function checkPasswordMatch() {
        const password = passwordInput ? passwordInput.value : '';
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
        
        if (!passwordMatch) return;
        
        if (confirmPassword.length === 0) {
            passwordMatch.style.display = 'none';
            return;
        }
        
        if (password === confirmPassword) {
            passwordMatch.textContent = '✅ Passwords match!';
            passwordMatch.className = 'password-match show';
            passwordMatch.style.color = 'var(--success-green)';
        } else {
            passwordMatch.textContent = '❌ Passwords do not match';
            passwordMatch.className = 'password-match show error';
            passwordMatch.style.color = 'var(--primary-red)';
        }
    }
}

// ===========================================
// ADMIN FUNCTIONS
// ===========================================

async function loadAdminDashboard() {
    try {
        const stats = await api.dashboard.getStats();
        document.getElementById('adminTotalUsers').textContent = stats.total_users || 0;
        document.getElementById('adminTotalBookings').textContent = stats.total_bookings || 0;
        document.getElementById('adminTotalBuses').textContent = stats.active_buses || 0;
        document.getElementById('adminTotalRevenue').textContent = `ETB ${stats.total_revenue || 0}`;
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
    }
}

async function loadUserDashboard() {
    try {
        const data = await api.dashboard.getUserDashboard();
        document.getElementById('userTotalBookings').textContent = data.stats.total_bookings || 0;
        document.getElementById('userActiveBookings').textContent = data.stats.active_bookings || 0;
        document.getElementById('userTotalSpent').textContent = `ETB ${data.stats.total_spent || 0}`;
        
        const container = document.getElementById('userRecentBookings');
        if (data.recent && data.recent.length > 0) {
            container.innerHTML = `
                <h3>Recent Bookings</h3>
                ${data.recent.map(booking => `
                    <div class="ticket">
                        <div class="ticket-header">
                            <div>
                                <h3>${booking.origin} → ${booking.destination}</h3>
                                <p>${new Date(booking.departure_time).toLocaleString()}</p>
                            </div>
                            <span class="ticket-status status-${booking.status}">${booking.status.toUpperCase()}</span>
                        </div>
                        <p><strong>Total:</strong> ETB ${booking.total_amount}</p>
                    </div>
                `).join('')}
            `;
        } else {
            container.innerHTML = '<p>No recent bookings</p>';
        }
    } catch (error) {
        console.error('Error loading user dashboard:', error);
    }
}

async function showAllUsers() {
    const container = document.getElementById('adminContent');
    try {
        const response = await fetch('http://localhost:5000/api/admin/users', {
            headers: { 'Authorization': `Bearer ${authManager.getToken()}` }
        });
        const users = await response.json();
        
        container.innerHTML = `
            <div class="admin-content-card">
                <h3>👤 All Users</h3>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.full_name}</td>
                                <td>${user.email}</td>
                                <td>
                                    <select class="role-select" onchange="updateUserRole(${user.id}, this.value)">
                                        <option value="customer" ${user.role === 'customer' ? 'selected' : ''}>Customer</option>
                                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                                        <option value="manager" ${user.role === 'manager' ? 'selected' : ''}>Manager</option>
                                        <option value="driver" ${user.role === 'driver' ? 'selected' : ''}>Driver</option>
                                    </select>
                                </td>
                                <td>
                                    <button class="btn btn-danger btn-small" onclick="deleteUser(${user.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<p>Error loading users: ${error.message}</p>`;
    }
}

async function updateUserRole(userId, role) {
    try {
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authManager.getToken()}`
            },
            body: JSON.stringify({ role })
        });
        const data = await response.json();
        showToast(`User role updated to ${role}`, 'success');
        showAllUsers();
    } catch (error) {
        showToast('Error updating role', 'error');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authManager.getToken()}` }
        });
        showToast('User deleted successfully', 'success');
        showAllUsers();
    } catch (error) {
        showToast('Error deleting user', 'error');
    }
}

async function showAllBookings() {
    const container = document.getElementById('adminContent');
    try {
        const bookings = await api.bookings.getAllAdmin();
        container.innerHTML = `
            <div class="admin-content-card">
                <h3>🎫 All Bookings</h3>
                ${bookings.map(booking => `
                    <div class="ticket">
                        <div class="ticket-header">
                            <div>
                                <h3>${booking.user_name} - ${booking.origin} → ${booking.destination}</h3>
                                <p>${new Date(booking.departure_time).toLocaleString()}</p>
                            </div>
                            <span class="ticket-status status-${booking.status}">${booking.status.toUpperCase()}</span>
                        </div>
                        <p><strong>Total:</strong> ETB ${booking.total_amount}</p>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<p>Error loading bookings: ${error.message}</p>`;
    }
}

async function showAllBuses() {
    const container = document.getElementById('adminContent');
    try {
        const buses = await api.buses.getAll();
        container.innerHTML = `
            <div class="admin-content-card">
                <h3>🚌 All Buses</h3>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Bus Number</th>
                            <th>Capacity</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${buses.map(bus => `
                            <tr>
                                <td>${bus.id}</td>
                                <td>${bus.bus_number}</td>
                                <td>${bus.capacity}</td>
                                <td>${bus.bus_type}</td>
                                <td><span class="role-badge ${bus.status}">${bus.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<p>Error loading buses: ${error.message}</p>`;
    }
}

async function showAllRoutes() {
    const container = document.getElementById('adminContent');
    try {
        const routes = await api.routes.getAll();
        container.innerHTML = `
            <div class="admin-content-card">
                <h3>🗺️ All Routes</h3>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Origin → Destination</th>
                            <th>Bus</th>
                            <th>Fare</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${routes.map(route => `
                            <tr>
                                <td>${route.id}</td>
                                <td>${route.origin} → ${route.destination}</td>
                                <td>${route.bus_number}</td>
                                <td>ETB ${route.fare_amount}</td>
                                <td><span class="role-badge ${route.status}">${route.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<p>Error loading routes: ${error.message}</p>`;
    }
}

function showAddBus() {
    document.getElementById('addBusModal').style.display = 'flex';
}

async function showAddRoute() {
    document.getElementById('addRouteModal').style.display = 'flex';
    try {
        const buses = await api.buses.getAll();
        const select = document.getElementById('routeBusId');
        select.innerHTML = buses.map(bus => `
            <option value="${bus.id}">${bus.bus_number} (${bus.capacity} seats)</option>
        `).join('');
    } catch (error) {
        console.error('Error loading buses:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const addBusForm = document.getElementById('addBusForm');
    if (addBusForm) {
        addBusForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const busData = {
                busNumber: document.getElementById('busNumber').value,
                capacity: parseInt(document.getElementById('busCapacity').value),
                busType: document.getElementById('busType').value,
                amenities: document.getElementById('busAmenities').value.split(',').map(s => s.trim()).filter(Boolean)
            };
            try {
                await api.buses.create(busData);
                showToast('Bus added successfully!', 'success');
                document.getElementById('addBusModal').style.display = 'none';
                addBusForm.reset();
            } catch (error) {
                showToast('Error adding bus: ' + error.message, 'error');
            }
        });
    }

    const addRouteForm = document.getElementById('addRouteForm');
    if (addRouteForm) {
        addRouteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const routeData = {
                busId: parseInt(document.getElementById('routeBusId').value),
                origin: document.getElementById('routeOrigin').value,
                destination: document.getElementById('routeDestination').value,
                departureTime: document.getElementById('routeDeparture').value,
                arrivalTime: document.getElementById('routeArrival').value,
                fareAmount: parseFloat(document.getElementById('routeFare').value)
            };
            try {
                await api.routes.create(routeData);
                showToast('Route added successfully!', 'success');
                document.getElementById('addRouteModal').style.display = 'none';
                addRouteForm.reset();
            } catch (error) {
                showToast('Error adding route: ' + error.message, 'error');
            }
        });
    }
});

window.loadAdminDashboard = loadAdminDashboard;
window.loadUserDashboard = loadUserDashboard;
window.showAllUsers = showAllUsers;
window.showAllBookings = showAllBookings;
window.showAllBuses = showAllBuses;
window.showAllRoutes = showAllRoutes;
window.showAddBus = showAddBus;
window.showAddRoute = showAddRoute;
window.updateUserRole = updateUserRole;
window.deleteUser = deleteUser;