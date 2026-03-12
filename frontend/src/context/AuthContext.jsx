import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
    // Note: The token is securely stored by the browser via HTTP-Only cookies.
    // We only need localStorage to persist the basic UI data (name, role, etc).
    localStorage.setItem('authUser', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call the backend to clear the HTTP-Only cookie
      await fetch('/api/auth/logout'); 
    } catch(err) {
      console.error(err);
    }
    
    // Clear the UI data from localStorage
    localStorage.removeItem('authUser');
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
