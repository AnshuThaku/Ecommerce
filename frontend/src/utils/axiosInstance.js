import axios from 'axios';

const api = axios.create({ 
  baseURL: '/api',
  withCredentials: true 
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config.url;

    // 🚨 401 Handler: Authorized access fail hone par
    if (status === 401) {
      
      // 1. Agar ye request history track karne ki hai, toh chup-chap fail hone do (Silent fail)
      if (url.includes('/history')) {
        return Promise.reject(err);
      }

      // 2. Agar ye koi aur authorized request hai (Cart, Profile, etc.)
      // Toh iska matlab browser mein baitha token "Kachra" (Invalid/Expired) ho chuka hai
      console.warn("Unauthorized or Invalid Token. Cleaning up session...");
      
      localStorage.removeItem('authUser');
      localStorage.removeItem('token'); // Agar aap 'token' naam se save karte hain toh

      // 3. User ko login par tabhi bhejo agar wo kisi specific protected page par ho
      // Agar wo 'Shop' ya 'Home' par hai, toh bas reload kar do taaki wo Guest ban jaye
      const protectedPaths = ['/profile', '/orders', '/admin', '/superadmin'];
      const isProtectedPage = protectedPaths.some(path => window.location.pathname.startsWith(path));

      if (isProtectedPage) {
        window.location.href = '/login';
      } else {
        // Sirf reload karo taaki UI Guest mode mein aa jaye bina spam kiye
        window.location.reload();
      }
    }
    
    return Promise.reject(err);
  }
);

api.interceptors.request.use((config) => {
  // Guest ID Header
  const guestId = localStorage.getItem('guestId');
  if (guestId) {
    config.headers['X-Guest-ID'] = guestId;
  }

  // ⚡ JWT Token Header (Manually adding if not using only Cookies)
  const token = localStorage.getItem('token');
  if (token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;