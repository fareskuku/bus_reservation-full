document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;

    let currentStep = 1;
    const totalSteps = 4;
    const steps = document.querySelectorAll('.step');
    const sections = document.querySelectorAll('.form-section');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    const updateStepDisplay = () => {
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < currentStep) step.classList.add('completed');
            else if (index + 1 === currentStep) step.classList.add('active');
        });

        sections.forEach((section, index) => {
            section.style.display = index + 1 === currentStep ? 'block' : 'none';
        });

        if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-block' : 'none';
        if (nextBtn) {
            nextBtn.textContent = currentStep === totalSteps ? 'Confirm Booking' : 'Next Step';
        }
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStepDisplay();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep === totalSteps) {
                completeBooking();
            } else {
                currentStep++;
                updateStepDisplay();
                if (currentStep === 4) updateBookingSummary();
            }
        });
    }

    updateStepDisplay();

    const passengerSelect = document.getElementById('passengers');
    if (passengerSelect) {
        passengerSelect.addEventListener('change', () => {
            generatePassengerForms(parseInt(passengerSelect.value));
        });
        generatePassengerForms(parseInt(passengerSelect.value));
    }

    const fromSelect = document.getElementById('from-location');
    const toSelect = document.getElementById('to-location');
    if (fromSelect && toSelect) {
        fromSelect.addEventListener('change', () => {
            Array.from(toSelect.options).forEach(option => {
                option.disabled = option.value === fromSelect.value;
            });
        });
        toSelect.addEventListener('change', () => {
            Array.from(fromSelect.options).forEach(option => {
                option.disabled = option.value === toSelect.value;
            });
        });
    }

    const seatsContainer = document.getElementById('seats-container');
    const passengerCount = document.getElementById('passengers');
    let bookedSeats = getRandomBookedSeats(4);
    let selectedSeatsBooking = [];

    function getRandomBookedSeats(count) {
        const seats = [];
        while (seats.length < count) {
            const seat = Math.floor(Math.random() * 16) + 1;
            if (!seats.includes(seat)) seats.push(seat);
        }
        return seats;
    }

    function generateSeats() {
        if (!seatsContainer) return;
        seatsContainer.innerHTML = '';
        const totalSeats = 16;

        for (let i = 1; i <= totalSeats; i++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.textContent = i;
            seat.dataset.seatNumber = i;

            if (bookedSeats.includes(i)) {
                seat.classList.add('booked');
            }

            if (selectedSeatsBooking.includes(i.toString())) {
                seat.classList.add('selected');
            }

            if (!bookedSeats.includes(i)) {
                seat.addEventListener('click', () => handleSeatClickBooking(seat));
            }

            seatsContainer.appendChild(seat);
        }
    }

    function handleSeatClickBooking(seat) {
        const seatNum = seat.dataset.seatNumber;
        const maxSeats = parseInt(passengerCount?.value || 1);

        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            selectedSeatsBooking = selectedSeatsBooking.filter(s => s !== seatNum);
        } else {
            if (selectedSeatsBooking.length >= maxSeats) {
                showToast(`You can only select ${maxSeats} seat(s)`, 'warning');
                return;
            }
            seat.classList.add('selected');
            selectedSeatsBooking.push(seatNum);
        }

        updateSeatDisplayBooking();
    }

    function updateSeatDisplayBooking() {
        const countEl = document.getElementById('selected-seats-count');
        const listEl = document.getElementById('selected-seats-list');
        const priceEl = document.getElementById('total-price');

        if (countEl) countEl.textContent = selectedSeatsBooking.length;
        if (listEl) listEl.textContent = selectedSeatsBooking.length > 0 ? selectedSeatsBooking.join(', ') : 'None';
        if (priceEl) priceEl.textContent = selectedSeatsBooking.length * 20;
    }

    generateSeats();

    function generatePassengerForms(count) {
        const container = document.getElementById('passenger-forms');
        if (!container) return;
        container.innerHTML = '';

        for (let i = 1; i <= count; i++) {
            container.innerHTML += `
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Passenger ${i} Name *</label>
                        <input type="text" id="passenger-name-${i}" class="form-input" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Passenger ${i} Age *</label>
                        <input type="number" id="passenger-age-${i}" class="form-input" min="1" max="120" required />
                    </div>
                </div>
            `;
        }
    }

    function updateBookingSummary() {
        const from = document.getElementById('from-location');
        const to = document.getElementById('to-location');
        const date = document.getElementById('travel-date');
        const time = document.getElementById('travel-time');
        const passengers = document.getElementById('passengers');

        document.getElementById('summary-route').textContent = 
            `${from.options[from.selectedIndex]?.text || ''} → ${to.options[to.selectedIndex]?.text || ''}`;
        document.getElementById('summary-date').textContent = date?.value || '';
        document.getElementById('summary-time').textContent = time?.value || '';
        document.getElementById('summary-passengers').textContent = passengers?.value || '';
        document.getElementById('summary-seats').textContent = selectedSeatsBooking.join(', ') || 'None';
        document.getElementById('summary-total').textContent = selectedSeatsBooking.length * 20;
    }

    function completeBooking() {
        const bookingData = {
            id: 'ADD' + Date.now().toString().slice(-8),
            from: document.getElementById('from-location').value,
            to: document.getElementById('to-location').value,
            date: document.getElementById('travel-date').value,
            time: document.getElementById('travel-time').value,
            passengers: document.getElementById('passengers').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            payment: document.getElementById('payment').value,
            seats: selectedSeatsBooking,
            total: selectedSeatsBooking.length * 20,
            status: 'valid',
            bookedAt: new Date().toISOString()
        };

        const passengerCount = parseInt(bookingData.passengers);
        bookingData.passengerDetails = [];
        for (let i = 1; i <= passengerCount; i++) {
            const name = document.getElementById(`passenger-name-${i}`)?.value;
            const age = document.getElementById(`passenger-age-${i}`)?.value;
            if (name && age) bookingData.passengerDetails.push({ name, age });
        }

        const bookings = JSON.parse(localStorage.getItem('addis_metro_bookings') || '[]');
        bookings.unshift(bookingData);
        localStorage.setItem('addis_metro_bookings', JSON.stringify(bookings));

        document.getElementById('booking-form').style.display = 'none';
        document.getElementById('confirmation').style.display = 'block';
        document.getElementById('booking-id').textContent = bookingData.id;
        showToast(`Booking confirmed! ID: ${bookingData.id}`, 'success');
    }

    const dateInput = document.getElementById('travel-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        if (!dateInput.value) dateInput.value = today;
    }

    const timeInput = document.getElementById('travel-time');
    if (timeInput && !timeInput.value) {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        timeInput.value = now.getHours().toString().padStart(2, '0') + ':00';
    }
});