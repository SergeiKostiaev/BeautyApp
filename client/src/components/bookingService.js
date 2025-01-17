import axios from 'axios';

export const createBooking = async (bookingData) => {
    try {
        const response = await axios.post('https://devprimeclients.ru/api/bookings', bookingData, {
            headers: { 'Content-Type': 'application/json' },
        });

        // Отправка уведомления в Telegram
        await axios.post('https://devprimeclients.ru/api/send-telegram', {
            message: `New booking:\nName: ${bookingData.customerName}\nPhone: ${bookingData.customerPhone}\nDate: ${bookingData.date}\nTime: ${bookingData.time}`,
            bookingId: response.data._id
        });

        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

export const cancelBooking = async (bookingId) => {
    try {
        const response = await axios.post('https://devprimeclients.ru/api/bookings/cancel', { bookingId }, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        console.error('Error cancelling booking:', error);
        throw error;
    }
};