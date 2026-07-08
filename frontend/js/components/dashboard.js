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
            <div class="stats-grid">
                <div class="stat-item">
                    <h4>${data.stats.total_bookings || 0}</h4>
                    <p>Total Bookings</p>
                </div>
                <div class="stat-item">
                    <h4>${data.stats.active_bookings || 0}</h4>
                    <p>Active Bookings</p>
                </div>
                <div class="stat-item">
                    <h4>ETB ${data.stats.total_spent || 0}</h4>
                    <p>Total Spent</p>
                </div>
            </div>
            <h3 style="margin-top:2rem;">Recent Bookings</h3>
            ${data.recent.length > 0 ? 
                data.recent.map(booking => createBookingCard(booking)).join('') :
                '<p>No recent bookings</p>'
            }
        `;
    } catch (error) {
        container.innerHTML = '<p>Error loading dashboard</p>';
    }
}

function createBookingCard(booking) {
    const statusClass = `status-${booking.status}`;
    return `
        <div class="ticket">
            <div class="ticket-header">
                <div>
                    <h3>${booking.origin} → ${booking.destination}</h3>
                    <p>${new Date(booking.departure_time).toLocaleString()}</p>
                </div>
                <span class="ticket-status ${statusClass}">${booking.status.toUpperCase()}</span>
            </div>
            <p><strong>Seats:</strong> ${booking.seat_numbers ? booking.seat_numbers.join(', ') : 'N/A'}</p>
            <p><strong>Total:</strong> ETB ${booking.total_amount}</p>
        </div>
    `;
}