import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosInstance from "../utils/axiosInstance";
import { History, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Needed to check logged-in status

export default function SearchResults() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Recent Searches State
  const [recentSearches, setRecentSearches] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // 1. Fetch Search Results
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/products/search?q=${query}`);
        if (data.success) {
          setProducts(data.products);
          setTotal(data.totalCount);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setLoading(false);
    }
  }, [query]); 

  // 2. Fetch Recent Searches History
  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        let currentGuestId = localStorage.getItem('guestId');
        if (!user && !currentGuestId) {
          setRecentSearches([]);
          setHistoryLoading(false);
          return;
        }

        let searchUrl = '/history?type=search';
        if (!user && currentGuestId) {
          searchUrl += `&guestId=${currentGuestId}`;
        }

        const { data } = await axiosInstance.get(searchUrl);
        
        if (data.success) {
          const searches = data.history.map(item => item.searchQuery).filter(Boolean);
          setRecentSearches([...new Set(searches)]); 
        }
      } catch (error) {
        console.error("Failed to load search history", error);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchSearchHistory();
  }, [user]);

  // SEO URL Generator (Consistency ke liye)
  const createProductUrl = (product) => {
    const catSlug = product.category ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'category';
    const brandSlug = product.brand ? product.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'brand';
    const nameSlug = product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product';
    return `/${catSlug}/${brandSlug}/${nameSlug}/p/${product._id}`;
  };

  const getMainImage = (product) => {
    if (product.variants?.[0]?.images?.[0]?.url) return product.variants[0].images[0].url;
    if (product.images?.[0]?.url) return product.images[0].url;
    return 'https://placehold.co/400x400/111/C8A253?text=Item';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP SECTION: Back to Home / Search History */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-zinc-800/50 pb-8">
          <div>
            <h1 className="text-3xl font-serif text-[#C8A253] mb-2 flex items-center gap-3">
              <Search className="w-6 h-6" /> 
              {query ? `Results for "${query}"` : "Search LUXE"}
            </h1>
            <p className="text-zinc-400">{query ? `${total} items found` : "Enter a search term to begin"}</p>
          </div>

          {/* RECENT SEARCHES (Injected from ShopHome logic) */}
          {!historyLoading && recentSearches.length > 0 && (
            <div className="md:max-w-md">
               <h3 className="text-sm text-zinc-500 mb-3 tracking-widest uppercase flex items-center gap-2">
                  <History className="w-4 h-4" /> Your Recent Searches
               </h3>
               <div className="flex gap-2 flex-wrap">
                 {recentSearches.map((term, index) => (
                   <Link 
                     to={`/search?q=${term}`} 
                     key={index}
                     className="bg-[#111] border border-zinc-800 hover:border-[#C8A253] text-zinc-300 hover:text-[#C8A253] px-3 py-1 rounded-full text-xs transition-all"
                   >
                     {term}
                   </Link>
                 ))}
               </div>
            </div>
          )}
        </div>

        {/* RESULTS GRID */}
        {loading ? (
          <div className="text-[#C8A253] flex items-center justify-center py-20 gap-3 font-serif">
             <div className="w-8 h-8 border-2 border-[#C8A253] border-t-transparent rounded-full animate-spin"></div>
             Searching the collection...
          </div>
        ) : query && products.length === 0 ? (
          <div className="text-center py-20 bg-[#111] rounded-2xl border border-zinc-800">
            <h2 className="text-xl text-zinc-400 mb-4">No luxury items matched your search.</h2>
            <Link to="/shop" className="bg-[#C8A253] text-black px-6 py-2 rounded-full font-medium hover:bg-white transition-colors">
              Return to Shop
            </Link>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link 
                to={createProductUrl(product)} 
                key={product._id} 
                className="group bg-[#111] rounded-xl overflow-hidden border border-zinc-800 hover:border-[#C8A253]/50 transition-all flex flex-col shadow-lg"
              >
                <div className="h-64 bg-[#1A1A1A] p-4 flex items-center justify-center relative">
                  <img 
                    src={getMainImage(product)} 
                    alt={product.name} 
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {product.discountPrice > 0 && (
                    <div className="absolute top-3 left-3 bg-[#C8A253] text-[#0A0A0A] text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                      Sale
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[10px] text-zinc-500 mb-1 tracking-wider uppercase">{product.category}</span>
                  <h3 className="text-sm font-semibold group-hover:text-[#C8A253] transition-colors line-clamp-2">{product.name}</h3>
                  <div className="mt-auto pt-3">
                    <span className="text-lg font-serif text-[#C8A253]">
                      ₹{product.discountPrice > 0 ? (product.price - product.discountPrice).toLocaleString('en-IN') : product.price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}