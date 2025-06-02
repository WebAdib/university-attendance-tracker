import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

export const login = (email, password) =>
    api.post('/auth/login', { email, password });

export default api;