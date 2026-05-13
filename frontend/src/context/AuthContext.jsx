import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('authUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [guestId, setGuestId] = useState(null);

  // Initialize Guest ID if user is not logged in
  useEffect(() => {
    if (!user) {
      let storedGuestId = localStorage.getItem('guestId');
      if (!storedGuestId) {
        storedGuestId = `guest_${uuidv4()}`;
        localStorage.setItem('guestId', storedGuestId);
      }
      setGuestId(storedGuestId);
    } else {
      // If user logs in, we don't need guest ID in active memory
      setGuestId(null);
    }
  }, [user]);

  const login = useCallback((token, userData) => {
    // Store the token in localStorage for Authorization header
    if (token) {
      localStorage.setItem('token', token);
    }
    // Also store basic user info for UI
    localStorage.setItem('authUser', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call the backend to clear the HTTP-Only cookie
      await axiosInstance.get('/auth/logout'); 
    } catch(err) {
      console.error(err);
    }
    
    // Clear the UI data from localStorage
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, guestId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
