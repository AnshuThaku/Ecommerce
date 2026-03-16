import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';
import { Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  const [toastMessage, setToastMessage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const showToast = (type, message) => setToastMessage({ type, message });

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://fakestoreapi.com/products/${id}`);
      
      // Fetch local reviews
      const reviewsData = await axiosInstance.get(`/reviews/${id}`);
      data.reviews = reviewsData.data.reviews || [];
      
      setProduct(data);
      // Reset selected variant to default when loading a new product
      setSelectedVariant(null);
      
      // Fetch related products (using API, maybe same category)
      const relatedData = await axios.get(`https://fakestoreapi.com/products/category/${data.category || data.brand}?limit=4`);
      
      // Filter out current product, or if we need more fallback to regular
      let related = relatedData.data.filter(p => String(p.id) !== String(id));
      if (related.length === 0) {
        const fallbackData = await axios.get('https://fakestoreapi.com/products?limit=5');
        related = fallbackData.data.filter(p => String(p.id) !== String(id)).slice(0, 4);
      }
      
      setRelatedProducts(related);
    } catch (error) {
      showToast('error', 'Failed to load product details');
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      return showToast('error', 'Please login to submit a review');
    }
    
    setIsSubmitting(true);
    try {
      if (editingReviewId) {
        await axiosInstance.put(`/reviews/${editingReviewId}`, { rating, comment });
        showToast('success', 'Review updated successfully!');
        setEditingReviewId(null);
      } else {
        await axiosInstance.post(`/reviews/${id}`, { rating, comment });
        showToast('success', 'Review submitted successfully!');
      }
      setComment('');
      setRating(5);
      fetchProduct(); // Refresh to show new review
    } catch (error) {
      showToast('error', error.response?.data?.error || error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingReviewId(review._id);
    
    // Scroll to form
    const formElement = document.getElementById('review-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      showToast('success', 'Review deleted successfully!');
      fetchProduct();
    } catch (error) {
       showToast('error', error.response?.data?.error || error.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleAddToCart = async () => {
    try {
      await axiosInstance.post('/cart/add', {
        productId: product.id || product._id || id,
        quantity: 1,
        price: product.price || 0,
        title: product.title || product.name || 'Unknown Product',
        image: currentImage
      });
      // Redirect to cart page immediately after success
      navigate('/cart');
    } catch (error) {
      showToast('error', error.response?.data?.message || error.response?.data?.error || 'Failed to add to cart');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0A0A0A] text-[#C8A253] flex items-center justify-center font-serif text-xl">Loading details...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">Product not found.</div>;
  }

  const calculatedNumOfReviews = product.reviews?.length || 0;
  const calculatedRatings = calculatedNumOfReviews > 0 
    ? product.reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0) / calculatedNumOfReviews 
    : 0;

  const currentImage = selectedVariant?.imageUrl || product.image || (product.images && product.images.length > 0 ? product.images[0].url : 'https://placehold.co/600x600/111/C8A253?text=Boutique');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-12 px-6">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="text-zinc-500 hover:text-[#C8A253] transition-colors text-sm uppercase tracking-wider">
            &larr; Back to Boutique
          </Link>
        </div>

        {/* Product Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#111] border border-zinc-800 rounded-2xl p-8 mb-12">
          {/* Image */}
          <div className="bg-white rounded-xl overflow-hidden aspect-square flex items-center justify-center p-8">
            <img 
              src={currentImage} 
              alt={product.title || product.name}
              className="max-w-full max-h-full object-contain transition-opacity duration-300"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h4 className="text-[#C8A253] tracking-widest uppercase text-xs font-bold mb-2">{product.category || product.brand}</h4>
            <h1 className="text-4xl font-serif mb-4">{product.title || product.name}</h1>
            
            <div className="flex items-center mb-6 gap-4">
              <span className="text-3xl font-mono text-white">₹{product.price}</span>
              <div className="flex items-center gap-1 text-sm bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                <span className="text-yellow-500">★</span> 
                <span>{calculatedRatings > 0 ? calculatedRatings.toFixed(1) : 'No rating'}</span>
                <span className="text-zinc-500 ml-1">({calculatedNumOfReviews} reviews)</span>
              </div>
            </div>

            <p className="text-zinc-400 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Variants Selector */}
            {(product.variants && product.variants.length > 0) || product.category === "men's clothing" || product.category === "women's clothing" ? (
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-3 uppercase tracking-wider text-zinc-300">Select Variant</h3>
                <div className="flex flex-wrap gap-4">
                  {/* Using Mock Variants for Demo if real ones don't exist */}
                  {(product.variants?.length ? product.variants : [
                    { _id: 'v1', id_num: 1, color: 'Black' },
                    { _id: 'v2', id_num: 2, color: 'Navy' },
                    { _id: 'v3', id_num: 3, color: 'Olive' },
                    { _id: 'v4', id_num: 4, color: 'Grey' }
                  ]).map((variant, index) => {
                    const variantImageUrl = variant.image || `https://picsum.photos/id/${(variant.id_num || index) + 10}/600/600`;
                    const isSelected = (selectedVariant && selectedVariant._id === variant._id) || (!selectedVariant && index === 0);
                    return (
                    <button
                      key={variant._id || index}
                      onClick={() => setSelectedVariant({ ...variant, imageUrl: variantImageUrl })}
                      className={`relative flex flex-col items-center justify-center p-1 rounded-lg overflow-hidden border-2 transition-all group
                        ${isSelected
                          ? 'border-[#C8A253] opacity-100 scale-105 shadow-md' 
                          : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105 bg-zinc-900'}
                      `}
                      title={variant.color || variant.name}
                    >
                      <div className="w-16 h-16 rounded overflow-hidden">
                        <img 
                          src={`https://picsum.photos/id/${(variant.id_num || index) + 10}/200/300`} 
                          alt={variant.color || variant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {isSelected && (
                        <div className="absolute top-0 right-0 bg-[#C8A253] text-black w-4 h-4 flex items-center justify-center rounded-bl-lg text-[10px]">
                          ✓
                        </div>
                      )}
                    </button>
                  )})}
                </div>
                {(!selectedVariant || selectedVariant) && (
                   <p className="text-xs text-zinc-400 mt-3">Color: <span className="text-white font-medium">{selectedVariant?.color || 'Black'}</span></p>
                )}
              </div>
            ) : null}

            <div className="space-y-4 border-t border-zinc-800 pt-8 mt-auto">
              <p className="text-sm">
                <span className="text-zinc-500 mr-2">Availability:</span>
                <span className={product.stock !== 0 ? 'text-green-500' : 'text-red-500'}>
                  {product.stock !== undefined ? (product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock') : 'In Stock'}
                </span>
              </p>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 text-sm font-bold uppercase tracking-widest rounded-lg transition-colors
                  ${product.stock !== 0 ? 'bg-[#C8A253] text-black hover:bg-[#b08d44]' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
                `}
              >
                {product.stock !== 0 ? 'Add to Cart' : 'Sold Out'}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-serif text-[#C8A253] mb-8 border-b border-zinc-800 pb-4">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Display Reviews */}
            <div className="col-span-2 space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review._id} className="border-b border-zinc-800 pb-6 mb-6 last:border-0 relative">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-[#C8A253]">
                         {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                       </div>
                       <div>
                         <p className="text-sm font-medium">{review.user?.name || 'Anonymous User'}</p>
                         <p className="text-xs text-zinc-500">Reviewed on {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                       </div>
                    </div>
                    <div className="flex text-yellow-500 text-sm mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'opacity-100' : 'text-zinc-700'}>★</span>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-zinc-300 leading-relaxed font-sans">{review.comment}</p>
                      
                      {/* Edit/Delete Actions for Review Author */}
                      {user && user.id === review.user?._id && (
                        <div className="flex items-center gap-3 mt-2">
                          <button 
                            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-blue-400 transition-colors"
                            onClick={() => handleEditReview(review)}
                            title="Edit Review"
                          >
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </button>
                          <button 
                            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors"
                            onClick={() => handleDeleteReview(review._id)}
                            title="Delete Review"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 italic">No reviews yet. Be the first to share your thoughts!</p>
              )}
            </div>

            {/* Submit Review Form (Amazon Style) */}
            <div id="review-form" className="bg-[#111] p-6 rounded-xl border border-zinc-800 h-fit">
              <h3 className="text-xl font-medium mb-2 border-b border-zinc-800 pb-3">
                {editingReviewId ? 'Edit your review' : 'Review this product'}
              </h3>
              <p className="text-xs text-zinc-500 mb-6 mt-2">
                 {editingReviewId ? 'Update your review and rating below' : 'Share your thoughts with other customers'}
              </p>
              
              {user ? (
                <form onSubmit={submitReview} className="space-y-5">
                  <div>
                     <label className="block text-sm font-medium mb-3">Overall rating</label>
                     {/* Interactive Star Rating instead of dropdown */}
                     <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                           <button
                             type="button"
                             key={num}
                             onClick={() => setRating(num)}
                             className="focus:outline-none transition-transform hover:scale-110"
                           >
                             <svg 
                                className={`w-8 h-8 ${num <= rating ? 'text-yellow-500' : 'text-zinc-700'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <div className="border-t border-zinc-800 pt-5">
                    <label className="block text-sm font-medium mb-2">Write your review</label>
                    <textarea 
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      className="w-full bg-[#1A1A1A] border border-zinc-700 text-white rounded-md p-3 outline-none focus:border-[#C8A253] text-sm placeholder:text-zinc-600 transition-colors"
                      placeholder="What did you like or dislike? What did you use this product for?"
                    ></textarea>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                      {isSubmitting ? 'Submitting...' : (editingReviewId ? 'Update Review' : 'Write a product review')}
                    </button>
                    
                    {editingReviewId && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingReviewId(null);
                          setRating(5);
                          setComment('');
                        }}
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 bg-transparent border border-zinc-700 text-white text-sm font-bold rounded-full hover:bg-zinc-800 transition-all shadow-md disabled:opacity-50 mt-2"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4 items-start border-t border-zinc-800 pt-4 mt-2">
                  <p className="text-zinc-400 text-sm">Please log in to share your thoughts about this product.</p>
                  <Link to="/login" className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-colors shadow-sm w-full text-center">
                    Log In to Review
                  </Link>
                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif text-[#C8A253] mb-8 border-b border-zinc-800 pb-4">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => {
                const generateSlug = (text) => text ? text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'item';
                const relatedNameSlug = generateSlug(rp.title || rp.name);
                return (
                <Link to={`/${relatedNameSlug}/p/${rp.id}`} key={rp.id} className="block group bg-[#111] p-4 rounded-xl border border-zinc-800 hover:border-[#C8A253] transition-all">
                  <div className="bg-white rounded-lg overflow-hidden mb-4 p-4 aspect-square flex items-center justify-center relative">
                    <img 
                      src={rp.image || rp.images?.[0]?.url || 'https://placehold.co/400x400/fff/333?text=Product'} 
                      alt={rp.title || rp.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1 truncate text-zinc-300 group-hover:text-white transition-colors">{rp.title || rp.name}</h3>
                    <p className="text-[#C8A253] font-mono">₹{rp.price}</p>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
