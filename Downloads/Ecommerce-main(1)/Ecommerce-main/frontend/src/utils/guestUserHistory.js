
const axiosInstance = require('./axiosInstance'); // Axios instance jisme auth token set hota hai
const trackView = async (productId, user) => {
  if (user) {
    // 1. Agar user logged-in hai, toh Backend API hit karo
    await axiosInstance.post('/history/add', { productId });
  } else {
    // 2. Agar Guest hai, toh LocalStorage mein save karo
    let guestHistory = JSON.parse(localStorage.getItem('guestHistory')) || [];
    
    // Duplicate remove karo agar wahi product phir se dekha
    guestHistory = guestHistory.filter(id => id !== productId);
    guestHistory.unshift(productId); // Naya product top par
    
    // Limit rakho (e.g., top 10 products)
    localStorage.setItem('guestHistory', JSON.stringify(guestHistory.slice(0, 10)));
  }
};

module.exports = { trackView };