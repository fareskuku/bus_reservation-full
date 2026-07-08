let selectedSeats = [];
let currentRouteId = null;
let currentFareAmount = 0;

async function showSeatSelection(routeId) {
    if (!authManager.isAuthenticated) {
        showToast('Please login to book seats', 'info');
        showAuthModal('login');
        return;
    }

    const modal = document.getElementById('seatSelectionModal');
    if (!modal) return;

    modal.style.display = 'flex';
    currentRouteId = routeId;
    await loadSeatMap(routeId);
}

async function loadSeatMap(routeId) {
    try {
        const seats = await api.routes.getSeats(routeId);
        const route = await api.routes.getById(routeId);
        currentFareAmount = route.fare_amount;

        const seatMap = document.getElementById('seatMap');
        if (!seatMap) return;

        selectedSeats = [];
        updateSeatSummary();

        seatMap.innerHTML = seats.map(seat => {
            const status = seat.is_available ? 'available' : 'booked';
            return `
                <div class="seat ${status}" data-seat-id="${seat.id}" onclick="toggleSeatSelection(${seat.id}, '${status}')">
                    ${seat.seat_number}
                </div>
            `;
        }).join('');
    } catch (error) {
        showToast('Error loading seats', 'error');
    }
}

function toggleSeatSelection(seatId, status) {
    if (status === 'booked') {
        showToast('This seat is already booked', 'error');
        return;
    }

    const seatElement = document.querySelector(`.seat[data-seat-id="${seatId}"]`);
    if (!seatElement) return;

    const index = selectedSeats.indexOf(seatId);
    if (index > -1) {
        selectedSeats.splice(index, 1);
        seatElement.className = 'seat available';
    } else {
        selectedSeats.push(seatId);
        seatElement.className = 'seat selected';
    }

    updateSeatSummary();
}

function updateSeatSummary() {
    const countElement = document.getElementById('selectedSeatsCount');
    const totalElement = document.getElementById('totalAmount');

    if (countElement) countElement.textContent = selectedSeats.length;
    if (totalElement) {
        const total = selectedSeats.length * currentFareAmount;
        totalElement.textContent = total.toFixed(2);
    }
}

function hideSeatSelection() {
    const modal = document.getElementById('seatSelectionModal');
    if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('confirmBookingBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            if (selectedSeats.length === 0) {
                showToast('Please select at least one seat', 'error');
                return;
            }

            try {
                await api.bookings.create({ routeId: currentRouteId, seatIds: selectedSeats });
                hideSeatSelection();
                showToast('Booking confirmed successfully!', 'success');
                loadHomePage();
            } catch (error) {
                showToast(error.message || 'Error creating booking', 'error');
            }
        });
    }

    const closeBtn = document.querySelector('#seatSelectionModal .modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideSeatSelection);
    }

    window.addEventListener('click', (e) => {
        if (e.target.id === 'seatSelectionModal') {
            hideSeatSelection();
        }
    });
});