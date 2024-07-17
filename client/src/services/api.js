import axios from 'axios';

const api = axios.create({
    baseURL: 'http://31.172.75.47:5000',
});

export default api;
