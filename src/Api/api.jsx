// utils/axios.js
import axios from 'axios';

// baseURL: 'http://127.0.0.1:8000/api'
// render : 'https://shortne-backend.onrender.com/api/'

const api = axios.create({
  baseURL: 'https://shortne-backend.onrender.com/api/',
});

// Interceptor
api.interceptors.request.use(
  async (config) => {
    const userinfo = JSON.parse(localStorage.getItem('userinfo'));

    if (userinfo && userinfo.access) {
      const token = userinfo.access;

      const exp = JSON.parse(atob(token.split('.')[1])).exp * 1000;
      const now = Date.now();

      // If access token expired
      if (now >= exp) {
        try {
          const res = await axios.post(
            'https://shortne-backend.onrender.com/api/user/token/refresh/',
            { refresh: userinfo.refresh },
            { headers: { 'Content-Type': 'application/json' } }
          );
          userinfo.access = res.data.access;
          localStorage.setItem('userinfo', JSON.stringify(userinfo));
          config.headers.Authorization = `Bearer ${res.data.access}`;
        } catch (err) {
          localStorage.removeItem('userinfo');
          window.location.href = '/signin';
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;


//before:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUwMjM2NzYzLCJpYXQiOjE3NTAyMzY3MDMsImp0aSI6IjE1MjBiMzgxNWRiNjRmYTU5NGM0YTQyOGFhNmU4M2U3IiwidXNlcl9pZCI6Mn0.cQozoGhzUSHbqBdXaXXOzmDtr3e3V9nXwESusVHJvlY

