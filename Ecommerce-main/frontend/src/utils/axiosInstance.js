import axios from 'axios';

const api = axios.create({ 
  baseURL: '/api',
  withCredentials: true // This is crucial: instructs Axios to send the HTTP-only cookie to the backend 
});

// We no longer need the request interceptor to attach 'Authorization: Bearer' 
// because cookies are sent automatically by the browser!

// Global 401 handler — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
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
