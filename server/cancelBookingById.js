const TimeSlot = require('./models/timeSlot');
const Booking = require('./models/Booking');

async function cancelBookingById(bookingId) {
    try {
        // Найдите бронирование по ID
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        // Найдите временной интервал по ID мастера и дате
        const timeSlot = await TimeSlot.findOne({
            masterId: booking.masterId,
            date: booking.date,
            startTime: booking.time // Предполагается, что время соответствует
        });

        if (!timeSlot) {
            throw new Error('Time slot not found');
        }

        // Обновите статус временного интервала на доступный
        timeSlot.booked = false;
        await timeSlot.save();

        console.log(`Booking ${bookingId} cancelled`);
    } catch (error) {
        console.error('Error cancelling booking:', error);
        throw error;
    }
}

module.exports = { cancelBookingById };