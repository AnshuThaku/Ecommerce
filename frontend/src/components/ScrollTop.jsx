import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  // Ye hook track karta hai ki user kis page/URL par hai
  const { pathname } = useLocation();

  useEffect(() => {
    // Jaise hi URL change hoga (page badlega), page ekdum top (0,0) par chala jayega
    window.scrollTo(0, 0);
  }, [pathname]);

  // Ye component UI mein kuch render nahi karega, bas background mein kaam karega
  return null; 
}