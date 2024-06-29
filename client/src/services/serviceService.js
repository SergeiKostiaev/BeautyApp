import api from './api';

export const getServices = async () => {
    const response = await api.get('/services');
    return response.data;
};

export const createService = async (service) => {
    const response = await api.post('/services', service);
    return response.data;
};

// Другие функции для работы с услугами (если необходимо)
