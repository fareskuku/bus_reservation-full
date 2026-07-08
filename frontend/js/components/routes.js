async function loadHomePage() {
    const container = document.getElementById('routesContainer');
    if (!container) return;

    try {
        const routes = await api.routes.getAll();
        if (routes.length === 0) {
            container.innerHTML = '<p>No routes available</p>';
            return;
        }
        container.innerHTML = routes.map(route => createRouteCard(route)).join('');
    } catch (error) {
        container.innerHTML = '<p>Error loading routes</p>';
    }
}

function createRouteCard(route) {
    return `
        <div class="card">
            <div class="card-content">
                <h3 class="card-title">${route.origin} → ${route.destination}</h3>
                <div class="card-details">
                    <span class="detail"><i class="route-icon">🕐</i> ${new Date(route.departure_time).toLocaleTimeString()}</span>
                    <span class="detail"><i class="route-icon">🚌</i> ${route.bus_number}</span>
                    <span class="detail"><i class="route-icon">📅</i> ${new Date(route.departure_time).toLocaleDateString()}</span>
                </div>
                <p class="card-description">${route.available_seats || 0} seats available</p>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:1.25rem;font-weight:bold;color:var(--primary-green);">ETB ${route.fare_amount}</span>
                    <button class="btn btn-primary btn-small" onclick="showSeatSelection(${route.id})">Book Now</button>
                </div>
            </div>
        </div>
    `;
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