document.addEventListener("DOMContentLoaded", function() {
    const slotsContainer = document.getElementById('slots');
    const slots = [
        { time: "08:00 - 10:00", booked: 0 },
        { time: "10:00 - 12:00", booked: 0 },
        { time: "12:00 - 14:00", booked: 0 },
        { time: "14:00 - 16:00", booked: 0 },
        { time: "16:00 - 18:00", booked: 0 },
        { time: "18:00 - 20:00", booked: 0 }
    ];

    const maxBookingsPerWeek = 2;
    const currentWeek = getCurrentWeekNumber();
    let userBookings = getUserBookings();

    slots.forEach((slot, index) => {
        const slotElement = document.createElement('div');
        slotElement.className = 'slot';
        slotElement.innerHTML = `
            <span>${slot.time}</span>
            <button id="slot-${index}">Book (${slot.booked}/12)</button>
        `;
        slotsContainer.appendChild(slotElement);

        document.getElementById(`slot-${index}`).addEventListener('click', function() {
            if (slot.booked < 12 && userBookings.week === currentWeek && userBookings.count < maxBookingsPerWeek) {
                slot.booked++;
                this.innerHTML = `Book (${slot.booked}/12)`;
                if (slot.booked === 12) {
                    this.disabled = true;
                }
                userBookings.count++;
                saveUserBookings(userBookings);
            } else if (userBookings.week !== currentWeek) {
                // Reset user bookings for the new week
                userBookings = { week: currentWeek, count: 1 };
                slot.booked++;
                this.innerHTML = `Book (${slot.booked}/12)`;
                saveUserBookings(userBookings);
            } else {
                alert("You can only book a maximum of two slots per week.");
            }
        });
    });

    function getCurrentWeekNumber() {
        const currentDate = new Date();
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const pastDaysOfYear = (currentDate - startOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    }

    function getUserBookings() {
        const userBookings = localStorage.getItem('userBookings');
        return userBookings ? JSON.parse(userBookings) : { week: currentWeek, count: 0 };
    }

    function saveUserBookings(bookings) {
        localStorage.setItem('userBookings', JSON.stringify(bookings));
    }
});
