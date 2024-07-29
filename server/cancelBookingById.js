const Booking = require('./models/Booking');

const cancelBookingById = async (bookingId) => {
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        booking.booked = false;
        await booking.save();
        console.log('Booking cancelled successfully');
    } catch (error) {
        console.error('Error cancelling booking:', error);
        throw error;
    }
};

module.exports = cancelBookingById;
