import api from './api';

export const createMaster = async (masterData) => {
    const response = await api.post('/masters/new', masterData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Другие функции для работы с мастерами (если необходимо)
