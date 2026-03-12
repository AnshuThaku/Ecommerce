import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/Toast';
import axios from 'axios';

export default function ShopHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Manage Real Database products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (type, message) => {
    setToastMessage({ type, message });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Fetch Public Products directly on load
  const fetchPublicProducts = async () => {
    try {
      // The public route is '/api/products' (mapped via baseURL to '/products')
      const { data } = await axios.get('https://fakestoreapi.com/products');
      setProducts(data);
    } catch (error) {
      showToast('error', 'Failed to load catalogue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      {/* Navbar segment */}
      <nav className="border-b border-zinc-800 bg-[#111] px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif">Truee <span className="text-[#C8A253]">Luxury</span></h1>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Show Dashboard link if user is Admin/Super-Admin */}
              {['admin', 'super-admin'].includes(user.role) && (
                <Link to={user.role === 'super-admin' ? '/superadmin/dashboard' : '/admin/dashboard'} className="text-zinc-300 hover:text-white text-sm mr-4">
                  Dashboards
                </Link>
              )}
              
              <span className="text-zinc-400 text-sm hidden sm:block">Welcome, {user.name}</span>
              <button 
                onClick={handleLogout}
                className="text-xs font-semibold tracking-widest uppercase border border-[#C8A253] text-[#C8A253] px-4 py-2 rounded hover:bg-[#C8A253] hover:text-black transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="text-sm font-medium text-white hover:text-[#C8A253] transition-colors px-3 py-2"
              >
                Log In
              </Link>
              <Link 
                to="/register"
                className="text-xs font-semibold tracking-widest uppercase bg-[#C8A253] text-[#0A0A0A] px-5 py-2.5 rounded hover:bg-[#b08d44] transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-[#C8A253] mb-8">Exclusive Collection</h2>
        
        {loading ? (
          <div className="text-center text-[#C8A253] py-20 font-serif">Curating the collection...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-zinc-500 py-20">Currently no items available in the shop.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product) => {
              const numOfReviews = product.reviews?.length || 0;
              const ratings = numOfReviews > 0 
                ? product.reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0) / numOfReviews 
                : 0;

              // Create slugs for SEO-friendly URLs
              const generateSlug = (text) => text ? text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'item';
              const nameSlug = generateSlug(product.title || product.name);
              const productId = product.id || product._id;

              return (
              <Link 
                to={`/${nameSlug}/p/${productId}`} 
                key={productId} 
                className="group bg-[#111] rounded-xl overflow-hidden border border-zinc-800 hover:border-[#C8A253]/50 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="h-64 overflow-hidden bg-white relative p-4 flex items-center justify-center">
                  <img 
                    src={product.image || (product.images && product.images.length > 0 ? product.images[0].url : 'https://placehold.co/400x400/111/C8A253?text=Boutique')} 
                    alt={product.title || product.name} 
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.stock !== undefined && product.stock < 1 && (
                    <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                      Sold Out
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs text-zinc-500 mb-1">{product.category || product.brand}</span>
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-[#C8A253] transition-colors line-clamp-2">{product.title || product.name}</h3>
                  
                  {/* Rating Stars Amazon Style */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex text-yellow-500 text-sm">
                      {[...Array(5)].map((_, i) => (
                         <span key={i} className={i < Math.round(ratings || 0) ? "opacity-100" : "text-zinc-700"}>★</span>
                      ))}
                    </div>
                    <span className="text-xs text-blue-400 hover:text-blue-300 hover:underline">{numOfReviews} ratings</span>
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-xl font-medium text-white">₹{product.price}</span>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        )}
      </main>
    </div>
  );
}
