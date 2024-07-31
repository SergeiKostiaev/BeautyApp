const mongoose = require('mongoose');
const Booking = require('./models/Booking'); // Убедитесь, что путь к модели правильный

const cancelBookingById = async (bookingId) => {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new Error('Invalid bookingId');
    }

    try {
        const result = await Booking.findByIdAndUpdate(bookingId, { isCancelled: true });
        if (!result) {
            throw new Error(`Booking with ID ${bookingId} not found`);
        }
        console.log('Booking canceled successfully:', result);
    } catch (error) {
        console.error('Error canceling booking:', error);
        throw error;
    }
};


module.exports = cancelBookingById;