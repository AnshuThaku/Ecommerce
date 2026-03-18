import axios from 'axios';

const api = axios.create({ 
  baseURL: '/api',
  withCredentials: true 
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // 🚨 401 handler ko sirf tabhi trigger karo jab user logged in hone ki koshish kar raha ho
    // Agar history track fail hoti hai (401), toh user ko login pe mat bhejo warna loop ban jayega
    if (err.response?.status === 401 && !err.config.url.includes('/history')) {
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

api.interceptors.request.use((config) => {
  const guestId = localStorage.getItem('guestId');
  if (guestId) {
    config.headers['X-Guest-ID'] = guestId;
  }
  return config;
});

export default api;