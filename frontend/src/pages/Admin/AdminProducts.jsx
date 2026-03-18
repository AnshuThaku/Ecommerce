import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/Toast';
// 1. ADDED: Star icon imported here
import { Plus, Trash2, ImagePlus, Grid3X3, List, Search, Package, Edit2, X, ChevronDown, Tag, Boxes, IndianRupee, Star } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (type, message) => {
    setToastMessage({ type, message });
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: 0,
    category: '',
    brand: '',
    stock: 1,
    isActive: true
  });
  
  const [variants, setVariants] = useState([]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  const fetchProducts = async () => {
    try {
      const { data } = await axiosInstance.get('/products/admin/products');
      setProducts(data.products);
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const addVariant = () => {
    setVariants([...variants, { color: '', size: '', stock: 0, price: '', imageFiles: [], imagePreviews: [], existingImages: [] }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleVariantImageChange = (index, files) => {
    const updated = [...variants];
    const newFiles = Array.from(files);
    
    updated[index].imageFiles = [...(updated[index].imageFiles || []), ...newFiles];
    updated[index].imagePreviews = [
      ...(updated[index].imagePreviews || []),
      ...newFiles.map(f => URL.createObjectURL(f))
    ];
    setVariants(updated);
  };

  const removeVariantImage = (variantIndex, imageIndex, isExisting = false) => {
    const updated = [...variants];
    if (isExisting) {
      updated[variantIndex].existingImages = updated[variantIndex].existingImages.filter((_, i) => i !== imageIndex);
    } else {
      updated[variantIndex].imageFiles = updated[variantIndex].imageFiles.filter((_, i) => i !== imageIndex);
      updated[variantIndex].imagePreviews = updated[variantIndex].imagePreviews.filter((_, i) => i !== imageIndex);
    }
    setVariants(updated);
  };

  const handleOpenModal = (product = null) => {
    setVariants([]);
    
    if (product) {
      setEditMode(true);
      setCurrentId(product._id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice || 0,
        category: product.category,
        brand: product.brand,
        stock: product.stock,
        isActive: product.isActive
      });
      if (product.variants && product.variants.length > 0) {
        setVariants(product.variants.map(v => ({
          color: v.color || '',
          size: v.size || '',
          stock: v.stock || 0,
          price: v.price || '',
          imageFiles: [],
          imagePreviews: [],
          existingImages: v.images || []
        })));
      }
    } else {
      setEditMode(false);
      setCurrentId(null);
      setFormData({
        name: '', description: '', price: '', discountPrice: 0,
        category: '', brand: '', stock: 1, isActive: true
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('discountPrice', formData.discountPrice);
      submitData.append('category', formData.category);
      submitData.append('brand', formData.brand);
      submitData.append('stock', formData.stock);
      submitData.append('isActive', formData.isActive);

      const variantsData = variants.map((v) => ({
        color: v.color,
        size: v.size,
        stock: v.stock,
        price: v.price,
        existingImages: v.existingImages || [],
        hasNewImages: v.imageFiles && v.imageFiles.length > 0
      }));
      submitData.append('variants', JSON.stringify(variantsData));

      let fileCount = 0;
      variants.forEach((v, variantIdx) => {
        if (v.imageFiles && v.imageFiles.length > 0) {
          v.imageFiles.forEach((file, imgIdx) => {
            submitData.append(`variantImages_${variantIdx}_${imgIdx}`, file);
            fileCount++;
          });
        }
      });

      if (fileCount === 0 && !editMode) {
        showToast('error', 'Please upload at least one image!');
        return; 
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      };

      if (editMode) {
        await axiosInstance.put(`/products/admin/product/${currentId}`, submitData, config);
        showToast('success', 'Product updated successfully');
      } else {
        await axiosInstance.post('/products/admin/product/new', submitData, config);
        showToast('success', 'Product created successfully');
      }
      
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Upload Error:", error);
      showToast('error', error.response?.data?.message || 'Action failed. Check console.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosInstance.delete(`/products/admin/product/${id}`);
        showToast('success', 'Product deleted');
        fetchProducts();
      } catch (error) {
        showToast('error', error.response?.data?.message || 'Delete failed');
      }
    }
  };

  // 2. ADDED: Toggle Featured Status Function
  const handleToggleFeatured = async (id) => {
    try {
      // API call to our new lightweight route
      const { data } = await axiosInstance.patch(`/products/admin/product/${id}/feature`);
      
      // Update local state instantly so we don't need to refetch all products
      setProducts(products.map(p => 
        p._id === id ? { ...p, isFeatured: data.isFeatured } : p
      ));
      
      showToast('success', data.message);
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to update featured status');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#C8A253] flex items-center gap-3">
            <Package className="w-8 h-8" />
            Product Inventory
          </h1>
          <p className="text-gray-500 mt-1">Manage your products and variants</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A253] to-[#b08d44] text-black font-semibold hover:shadow-lg hover:shadow-[#C8A253]/20 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#111] to-[#151515] rounded-xl border border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#C8A253]/10">
              <Boxes className="w-5 h-5 text-[#C8A253]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{products.length}</p>
              <p className="text-xs text-gray-500">Total Products</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#111] to-[#151515] rounded-xl border border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-500/10">
              <Tag className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{products.filter(p => p.isActive).length}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#111] to-[#151515] rounded-xl border border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/10">
              <Tag className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{products.filter(p => !p.isActive).length}</p>
              <p className="text-xs text-gray-500">Hidden</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#111] to-[#151515] rounded-xl border border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10">
              <IndianRupee className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{categories.length}</p>
              <p className="text-xs text-gray-500">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#111] rounded-xl border border-zinc-800 p-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search products by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#C8A253] transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-[#1A1A1A] border border-zinc-700 rounded-lg px-4 py-2.5 pr-10 text-white focus:outline-none focus:border-[#C8A253] cursor-pointer w-full"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center bg-[#1A1A1A] border border-zinc-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#C8A253] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-[#C8A253] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#C8A253] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#C8A253]">Loading inventory...</p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#C8A253]/20 bg-[#111] p-16 text-center">
          <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm || filterCategory !== 'all' 
              ? 'No products match your search criteria' 
              : 'No products found. Start by adding a new product!'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <div 
              key={p._id} 
              className="bg-gradient-to-br from-[#111] to-[#151515] rounded-xl border border-zinc-800 overflow-hidden group hover:border-[#C8A253]/30 transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-[#1A1A1A] overflow-hidden">
                {p.images?.[0]?.url ? (
                  <img 
                    src={p.images[0].url} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : p.variants?.[0]?.images?.[0]?.url ? (
                  <img 
                    src={p.variants[0].images[0].url} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImagePlus className="w-12 h-12 text-zinc-700" />
                  </div>
                )}
                
                {/* 3. UPDATED: Top Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                    {p.isActive ? 'Active' : 'Hidden'}
                  </div>
                  {p.isFeatured && (
                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-[#C8A253] text-black flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3 fill-black" /> Featured
                    </div>
                  )}
                </div>

                {p.discountPrice > 0 && (
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-[#C8A253] text-black">
                    {Math.round((p.discountPrice / p.price) * 100)}% OFF
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-medium text-white line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.brand}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-gray-400">{p.category}</span>
                </div>
                
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-bold text-[#C8A253]">
                    ₹{p.discountPrice > 0 ? p.price - p.discountPrice : p.price}
                  </span>
                  {p.discountPrice > 0 && (
                    <span className="text-sm text-gray-500 line-through">₹{p.price}</span>
                  )}
                </div>
                
                {p.variants && p.variants.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.variants.slice(0, 3).map((v, i) => (
                      <span key={i} className="px-2 py-0.5 bg-zinc-800/50 rounded text-xs text-gray-400">
                        {v.color || v.size || `V${i+1}`}
                      </span>
                    ))}
                    {p.variants.length > 3 && (
                      <span className="px-2 py-0.5 bg-zinc-800/50 rounded text-xs text-gray-400">
                        +{p.variants.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mb-3">Stock: {p.stock} units</p>
                
                {/* 4. UPDATED: Actions including Feature Toggle */}
                <div className="flex gap-2 pt-3 border-t border-zinc-800">
                  <button 
                    onClick={() => handleToggleFeatured(p._id)} 
                    className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm transition-colors border ${
                      p.isFeatured 
                        ? 'bg-[#C8A253]/10 text-[#C8A253] border-[#C8A253]/30 hover:bg-[#C8A253]/20' 
                        : 'bg-zinc-800 text-gray-400 border-transparent hover:bg-zinc-700 hover:text-white'
                    }`}
                    title={p.isFeatured ? "Remove from Featured" : "Mark as Featured"}
                  >
                    <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-[#C8A253]' : ''}`} />
                  </button>

                  <button 
                    onClick={() => handleOpenModal(p)} 
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 text-gray-300 text-sm hover:bg-zinc-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(p._id)} 
                    className="flex items-center justify-center px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[#111] rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#1A1A1A] border-b border-zinc-800 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id} className="border-b border-zinc-800 hover:bg-[#151515] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.images?.[0]?.url ? (
                        <img src={p.images[0].url} alt={p.name} className="w-12 h-12 object-cover rounded-lg bg-white" />
                      ) : p.variants?.[0]?.images?.[0]?.url ? (
                        <img src={p.variants[0].images[0].url} alt={p.name} className="w-12 h-12 object-cover rounded-lg bg-white" />
                      ) : (
                        <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                          <ImagePlus className="w-5 h-5 text-zinc-600" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{p.name}</p>
                          {p.isFeatured && <Star className="w-3 h-3 text-[#C8A253] fill-[#C8A253]" />}
                        </div>
                        <p className="text-xs text-gray-500">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs">{p.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-[#C8A253] font-semibold">
                        ₹{p.discountPrice > 0 ? p.price - p.discountPrice : p.price}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${p.stock < 10 ? 'text-red-400' : 'text-white'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {p.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* 5. UPDATED: Actions including Feature Toggle in Table */}
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleToggleFeatured(p._id)} 
                        className={`p-2 rounded-lg transition-colors border ${
                          p.isFeatured 
                            ? 'bg-[#C8A253]/10 text-[#C8A253] border-[#C8A253]/30 hover:bg-[#C8A253]/20' 
                            : 'bg-zinc-800 text-gray-400 border-transparent hover:bg-zinc-700 hover:text-white'
                        }`}
                        title={p.isFeatured ? "Remove from Featured" : "Mark as Featured"}
                      >
                        <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-[#C8A253]' : ''}`} />
                      </button>

                      <button 
                        onClick={() => handleOpenModal(p)} 
                        className="p-2 rounded-lg bg-zinc-800 text-blue-400 hover:bg-zinc-700 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p._id)} 
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#111]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#C8A253]/10">
                  <Package className="w-5 h-5 text-[#C8A253]" />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-[#C8A253]">
                    {editMode ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <p className="text-xs text-gray-500">Fill in the product details below</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="bg-[#1A1A1A]/50 rounded-xl p-5 border border-zinc-800/50">
                  <h3 className="text-sm font-medium text-[#C8A253] mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-1.5">Product Name *</label>
                      <input 
                        required 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="Enter product name"
                        className="w-full bg-[#111] border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#C8A253] focus:ring-1 focus:ring-[#C8A253]/20 transition-all" 
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-1.5">Description *</label>
                      <textarea 
                        required 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        rows="3" 
                        placeholder="Describe your product..."
                        className="w-full bg-[#111] border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#C8A253] focus:ring-1 focus:ring-[#C8A253]/20 transition-all resize-none"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Category *</label>
                      <input 
                        required 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange} 
                        placeholder="e.g. Shoes, Electronics" 
                        className="w-full bg-[#111] border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#C8A253] focus:ring-1 focus:ring-[#C8A253]/20 transition-all" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Brand *</label>
                      <input 
                        required 
                        name="brand" 
                        value={formData.brand} 
                        onChange={handleChange} 
                        placeholder="Brand name"
                        className="w-full bg-[#111] border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#C8A253] focus:ring-1 focus:ring-[#C8A253]/20 transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#1A1A1A]/50 rounded-xl p-5 border border-zinc-800/50">
                  <h3 className="text-sm font-medium text-[#C8A253] mb-4 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" /> Pricing & Stock
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Base Price (₹) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input 
                          required 
                          type="number" 
                          name="price" 
                          value={formData.price} 
                          onChange={handleChange} 
                          placeholder="0"
                          className="w-full bg-[#111] border border-zinc-700 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#C8A253] focus:ring-1 focus:ring-[#C8A253]/20 transition-all" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Discount Amount (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input 
                          type="number" 
                          name="discountPrice" 
                          value={formData.discountPrice} 
                          onChange={handleChange}
                          placeholder="0"
                          className="w-full bg-[#111] border border-zinc-700 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#C8A253] focus:ring-1 focus:ring-[#C8A253]/20 transition-all" 
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Selling price: ₹{formData.price - (formData.discountPrice || 0)}</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Base Stock *</label>
                      <input 
                        required 
                        type="number" 
                        name="stock" 
                        value={formData.stock} 
                        onChange={handleChange} 
                        placeholder="0"
                        className="w-full bg-[#111] border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#C8A253] focus:ring-1 focus:ring-[#C8A253]/20 transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-zinc-800/50">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          name="isActive" 
                          checked={formData.isActive} 
                          onChange={handleChange} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-zinc-700 rounded-full peer-checked:bg-[#C8A253] transition-colors"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        Product is {formData.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* VARIANTS SECTION */}
                <div className="bg-[#1A1A1A]/50 rounded-xl p-5 border border-zinc-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-[#C8A253] flex items-center gap-2">
                      <Boxes className="w-4 h-4" /> Product Variants
                      <span className="text-xs text-gray-500 font-normal ml-1">(First variant image = main image)</span>
                    </h3>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8A253]/10 text-[#C8A253] text-sm hover:bg-[#C8A253]/20 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Variant
                    </button>
                  </div>

                  {variants.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-zinc-800 rounded-xl">
                      <Boxes className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                      <p className="text-zinc-600 text-sm">No variants added</p>
                      <p className="text-zinc-700 text-xs mt-1">Click "Add Variant" to create color/size options</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {variants.map((variant, idx) => (
                        <div key={idx} className="p-4 bg-[#111] rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-[#C8A253]/10 text-[#C8A253] text-xs flex items-center justify-center font-medium">
                                {idx + 1}
                              </span>
                              <span className="text-sm text-gray-300">
                                {variant.color || variant.size ? `${variant.color} ${variant.size}`.trim() : `Variant ${idx + 1}`}
                              </span>
                              {idx === 0 && (
                                <span className="text-xs px-2 py-0.5 bg-[#C8A253]/10 text-[#C8A253] rounded-full">Main</span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVariant(idx)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Color</label>
                              <input
                                value={variant.color}
                                onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                                placeholder="e.g. Red"
                                className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#C8A253] transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Size</label>
                              <input
                                value={variant.size}
                                onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                                placeholder="e.g. M, L, XL"
                                className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#C8A253] transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Stock</label>
                              <input
                                type="number"
                                value={variant.stock}
                                onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                                placeholder="0"
                                className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#C8A253] transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Price (₹)</label>
                              <input
                                type="number"
                                value={variant.price}
                                onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                                placeholder="Optional"
                                className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#C8A253] transition-colors"
                              />
                            </div>
                          </div>
                          
                          {/* Multiple Images Section */}
                          <div className="mt-3 pt-3 border-t border-zinc-800/50">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-xs text-gray-500">Images (3-4 recommended)</label>
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={(e) => e.target.files.length > 0 && handleVariantImageChange(idx, e.target.files)}
                                />
                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-[#C8A253]/10 text-[#C8A253] rounded-lg hover:bg-[#C8A253]/20 transition-colors">
                                  <ImagePlus className="w-3 h-3" /> Add Images
                                </span>
                              </label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {/* Existing Images */}
                              {variant.existingImages?.map((img, imgIdx) => (
                                <div key={`existing-${imgIdx}`} className="relative group">
                                  <img 
                                    src={img.url} 
                                    alt="" 
                                    className="w-16 h-16 object-cover rounded-lg border border-zinc-700" 
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeVariantImage(idx, imgIdx, true)}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3 text-white" />
                                  </button>
                                  {imgIdx === 0 && (
                                    <span className="absolute bottom-0 left-0 right-0 text-[8px] text-center bg-[#C8A253] text-black rounded-b-lg">Main</span>
                                  )}
                                </div>
                              ))}
                              {/* New Image Previews */}
                              {variant.imagePreviews?.map((preview, imgIdx) => (
                                <div key={`new-${imgIdx}`} className="relative group">
                                  <img 
                                    src={preview} 
                                    alt="" 
                                    className="w-16 h-16 object-cover rounded-lg border border-[#C8A253]/50" 
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeVariantImage(idx, imgIdx, false)}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3 text-white" />
                                  </button>
                                  <span className="absolute bottom-0 left-0 right-0 text-[8px] text-center bg-green-500 text-white rounded-b-lg">New</span>
                                </div>
                              ))}
                              {/* Empty State */}
                              {(!variant.existingImages || variant.existingImages.length === 0) && 
                               (!variant.imagePreviews || variant.imagePreviews.length === 0) && (
                                <div className="w-16 h-16 bg-zinc-800 rounded-lg border border-dashed border-zinc-700 flex items-center justify-center">
                                  <ImagePlus className="w-5 h-5 text-zinc-600" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <p className="text-xs text-gray-600">* Required fields</p>
                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)} 
                      className="px-5 py-2.5 rounded-xl border border-zinc-700 text-gray-300 hover:bg-zinc-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A253] to-[#b08d44] text-black font-semibold hover:shadow-lg hover:shadow-[#C8A253]/20 transition-all duration-300"
                    >
                      {editMode ? 'Update Product' : 'Save Product'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};