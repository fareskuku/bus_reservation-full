document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    const navLinkItems = document.querySelectorAll('.nav-links a[data-page]');
    navLinkItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }
        });
    });

    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const dashboardBtn = document.getElementById('dashboardBtn');

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
            showPage('dashboard');
        });
    }

    authManager.updateUI();

    if (authManager.isAuthenticated) {
        showPage('home');
    } else {
        showPage('home');
    }

    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const origin = document.getElementById('searchOrigin').value;
            const destination = document.getElementById('searchDestination').value;
            const date = document.getElementById('searchDate').value;
            searchRoutes({ origin, destination, date });
        });
    }
});

function showPage(page) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));

    const targetPage = document.getElementById(`${page}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    switch(page) {
        case 'home':
            loadHomePage();
            break;
        case 'routes':
            loadRoutesPage();
            break;
        case 'bookings':
            loadBookingsPage();
            break;
        case 'dashboard':
            loadDashboardPage();
            break;
    }
}

async function loadHomePage() {
    const container = document.getElementById('routesContainer');
    if (container) {
        try {
            const routes = await api.routes.getAll();
            container.innerHTML = routes.map(route => createRouteCard(route)).join('');
        } catch (error) {
            container.innerHTML = '<p>Error loading routes</p>';
        }
    }
}

async function loadRoutesPage() {
    const container = document.getElementById('routesList');
    if (container) {
        try {
            const routes = await api.routes.getAll();
            container.innerHTML = routes.map(route => createRouteCard(route)).join('');
        } catch (error) {
            container.innerHTML = '<p>Error loading routes</p>';
        }
    }
}

async function loadBookingsPage() {
    const container = document.getElementById('bookingsList');
    if (!container) return;

    if (!authManager.isAuthenticated) {
        container.innerHTML = '<p>Please login to view your bookings</p>';
        return;
    }

    try {
        const bookings = await api.bookings.getAll();
        if (bookings.length === 0) {
            container.innerHTML = '<p>No bookings found</p>';
            return;
        }
        container.innerHTML = bookings.map(booking => createBookingCard(booking)).join('');
    } catch (error) {
        container.innerHTML = '<p>Error loading bookings</p>';
    }
}

async function loadDashboardPage() {
    const container = document.getElementById('dashboardContent');
    if (!container) return;

    if (!authManager.isAuthenticated) {
        container.innerHTML = '<p>Please login to view dashboard</p>';
        return;
    }

    try {
        const data = await api.dashboard.getUserDashboard();
        container.innerHTML = `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-ticket-alt"></i></div>
                    <h3>Total Bookings</h3>
                    <div class="stat-value">${data.stats.total_bookings || 0}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                    <h3>Active Bookings</h3>
                    <div class="stat-value">${data.stats.active_bookings || 0}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
                    <h3>Total Spent</h3>
                    <div class="stat-value">$${data.stats.total_spent || 0}</div>
                </div>
            </div>
            <h3>Recent Bookings</h3>
            ${data.recent.length > 0 ? 
                data.recent.map(booking => createBookingCard(booking)).join('') :
                '<p>No recent bookings</p>'
            }
        `;
    } catch (error) {
        container.innerHTML = '<p>Error loading dashboard</p>';
    }
}

function createRouteCard(route) {
    return `
        <div class="route-card" onclick="showSeatSelection(${route.id})">
            <h3>${route.origin} → ${route.destination}</h3>
            <div class="route-info">
                <span><i class="fas fa-clock"></i> ${new Date(route.departure_time).toLocaleTimeString()}</span>
                <span><i class="fas fa-bus"></i> ${route.bus_number}</span>
            </div>
            <div class="route-info">
                <span><i class="fas fa-calendar"></i> ${new Date(route.departure_time).toLocaleDateString()}</span>
                <span class="route-seats"><i class="fas fa-chair"></i> ${route.available_seats || 0} seats</span>
            </div>
            <div class="route-price">$${route.fare_amount}</div>
        </div>
    `;
}

function createBookingCard(booking) {
    const statusClass = `status-${booking.status}`;
    const seatNumbers = booking.seat_numbers ? booking.seat_numbers.join(', ') : '';

    return `
        <div class="booking-card">
            <div class="booking-info">
                <h3>${booking.origin} → ${booking.destination}</h3>
                <p><i class="fas fa-clock"></i> ${new Date(booking.departure_time).toLocaleString()}</p>
                <p><i class="fas fa-chair"></i> Seats: ${seatNumbers}</p>
                <p><i class="fas fa-dollar-sign"></i> $${booking.total_amount}</p>
            </div>
            <div>
                <span class="booking-status ${statusClass}">${booking.status.toUpperCase()}</span>
                ${booking.status === 'confirmed' ? `
                    <div class="booking-actions">
                        <button class="btn btn-danger" onclick="cancelBooking(${booking.id})">Cancel</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

async function searchRoutes(filters) {
    try {
        const routes = await api.routes.getAll(filters);
        const container = document.getElementById('routesContainer');
        if (container) {
            if (routes.length === 0) {
                container.innerHTML = '<p>No routes found</p>';
                return;
            }
            container.innerHTML = routes.map(route => createRouteCard(route)).join('');
        }
    } catch (error) {
        showToast('Error searching routes', 'error');
    }
}

async function cancelBooking(id) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        await api.bookings.cancel(id);
        showToast('Booking cancelled successfully', 'success');
        loadBookingsPage();
    } catch (error) {
        showToast('Error cancelling booking', 'error');
    }
}

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
    if (modal) {
        modal.style.display = 'none';
    }
}

function showSeatSelection(routeId) {
    if (!authManager.isAuthenticated) {
        showToast('Please login to book seats', 'info');
        showAuthModal('login');
        return;
    }

    const modal = document.getElementById('seatSelectionModal');
    if (!modal) return;

    modal.style.display = 'flex';
    modal.dataset.routeId = routeId;
    loadSeatMap(routeId);
}

function hideSeatSelection() {
    const modal = document.getElementById('seatSelectionModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const closeButtons = document.querySelectorAll('.modal .close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

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

    const loginFormElement = document.getElementById('loginFormElement');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                await authManager.login(email, password);
                hideAuthModal();
                showToast('Login successful', 'success');
                loadHomePage();
            } catch (error) {
                showToast(error.message || 'Login failed', 'error');
            }
        });
    }

    const registerFormElement = document.getElementById('registerFormElement');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('registerFullName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const phone = document.getElementById('registerPhone').value;

            try {
                await authManager.register({ fullName, email, password, phone });
                hideAuthModal();
                showToast('Registration successful', 'success');
                loadHomePage();
            } catch (error) {
                showToast(error.message || 'Registration failed', 'error');
            }
        });
    }

    const confirmBookingBtn = document.getElementById('confirmBookingBtn');
    if (confirmBookingBtn) {
        confirmBookingBtn.addEventListener('click', confirmBooking);
    }
});