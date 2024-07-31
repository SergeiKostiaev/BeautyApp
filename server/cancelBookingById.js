const mongoose = require('mongoose');
const Booking = require('./models/Booking'); // Убедитесь, что путь к модели правильный

const cancelBookingById = async (bookingId) => {
    if (!bookingId || bookingId.length !== 24) { // Проверка длины для MongoDB ObjectId
        throw new Error('Invalid bookingId');
    }

    try {
        const result = await Booking.findByIdAndUpdate(bookingId, { isCancelled: true }, { new: true });

        if (!result) {
            throw new Error('Booking not found');
        }

        return result;
    } catch (error) {
        throw error;
    }
};


module.exports = cancelBookingById;