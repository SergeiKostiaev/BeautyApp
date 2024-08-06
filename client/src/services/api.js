import axios from 'axios';

const api = axios.create({
    baseURL: 'https://devprimeclients.ru',
});

export default api;
