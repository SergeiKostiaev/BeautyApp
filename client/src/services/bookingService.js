import api from './api';

export const createBooking = async (booking) => {
    const response = await api.post('/bookings', booking);
    return response.data;
};

// Другие функции для работы с записями (если необходимо)
