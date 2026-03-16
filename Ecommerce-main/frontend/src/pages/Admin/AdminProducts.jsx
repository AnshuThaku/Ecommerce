import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/Toast';
import { Plus, Trash2, ImagePlus } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
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
  
  const [imageFiles, setImageFiles] = useState([]);
  
  // Variants state - each variant has color, size, stock, price, and imageFile
  const [variants, setVariants] = useState([]);

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

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  // Variant handlers
  const addVariant = () => {
    setVariants([...variants, { color: '', size: '', stock: 0, price: '', imageFile: null, imagePreview: null }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleVariantImageChange = (index, file) => {
    const updated = [...variants];
    updated[index].imageFile = file;
    updated[index].imagePreview = URL.createObjectURL(file);
    setVariants(updated);
  };

  const handleOpenModal = (product = null) => {
    setImageFiles([]);
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
      // Load existing variants (without images - they are already uploaded)
      if (product.variants && product.variants.length > 0) {
        setVariants(product.variants.map(v => ({
          color: v.color || '',
          size: v.size || '',
          stock: v.stock || 0,
          price: v.price || '',
          imageFile: null,
          imagePreview: v.image?.url || null,
          existingImage: v.image || null
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
      
      // Append main product images
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          submitData.append('images', file);
        });
      }

      // Append variants data as JSON (without image files)
      const variantsData = variants.map((v, idx) => ({
        color: v.color,
        size: v.size,
        stock: v.stock,
        price: v.price,
        existingImage: v.existingImage || null,
        hasNewImage: !!v.imageFile
      }));
      submitData.append('variants', JSON.stringify(variantsData));

      // Append variant images separately with index reference
      variants.forEach((v, idx) => {
        if (v.imageFile) {
          submitData.append(`variantImage_${idx}`, v.imageFile);
        }
      });

      if (editMode) {
        await axiosInstance.put(`/products/admin/product/${currentId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('success', 'Product updated successfully');
      } else {
        await axiosInstance.post('/products/admin/product/new', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('success', 'Product created successfully');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Action failed');
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

  return (
    <div>
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#C8A253]">Products Catalogue</h1>
          <p className="text-gray-500 text-sm mt-1">Manage inventory, pricing, and variants</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-lg bg-[#C8A253] text-black text-sm font-semibold hover:bg-[#b08d44] transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-center text-[#C8A253] py-10">Loading inventory...</div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#C8A253]/20 bg-[#111] p-16 text-center">
          <p className="text-gray-500">No products found. Start by adding a new product!</p>
        </div>
      ) : (
        <div className="bg-[#111] rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#1A1A1A] border-b border-zinc-800 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price / Stock</th>
                <th className="px-6 py-4">Variants</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-zinc-800 hover:bg-[#151515] transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    {p.images && p.images.length > 0 && (
                      <img src={p.images[0].url} alt={p.name} className="w-10 h-10 object-cover rounded bg-white" />
                    )}
                    <div>
                      {p.name} <br/>
                      <span className="text-xs text-gray-500 font-normal">{p.brand}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{p.category}</td>
                  <td className="px-6 py-4">
                    <span className="text-[#C8A253] font-mono">Rs{p.price}</span>
                    <br/><span className="text-xs">Stock: {p.stock}</span>
                  </td>
                  <td className="px-6 py-4">
                    {p.variants && p.variants.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {p.variants.map((v, i) => (
                          <span key={i} className="px-2 py-0.5 bg-zinc-800 rounded text-xs">
                            {v.color || v.size || `V${i+1}`}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-zinc-600 text-xs">No variants</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${p.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {p.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => handleOpenModal(p)} className="text-blue-400 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111] border border-zinc-800 rounded-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-serif text-[#C8A253] mb-6">
              {editMode ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Product Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A253]" />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Main Product Images</label>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full bg-[#1A1A1A] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A253] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#C8A253] file:text-black hover:file:bg-[#b08d44]" />
                  <p className="text-xs text-zinc-500 mt-1">
                    {imageFiles.length > 0 
                      ? `${imageFiles.length} file(s) selected` 
                      : 'Upload main gallery images (Ctrl/Cmd to select multiple)'}
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-[#1A1A1A] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A253]"></textarea>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Base Price (Rs)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A253]" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Discount Price (Rs)</label>
                  <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A253]" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <input required name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Shoes" className="w-full bg-[#1A1A1A] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A253]" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Brand</label>
                  <input required name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A253]" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Base Stock</label>
                  <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A253]" />
                </div>

                <div className="flex items-center mt-6">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 accent-[#C8A253] bg-[#1A1A1A] border-zinc-800 rounded" />
                  <label className="ml-2 text-sm text-gray-400">Product is Active</label>
                </div>
              </div>

              {/* VARIANTS SECTION */}
              <div className="border-t border-zinc-800 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-serif text-[#C8A253]">Product Variants</h3>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-gray-300 text-sm hover:bg-zinc-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Variant
                  </button>
                </div>

                {variants.length === 0 ? (
                  <p className="text-zinc-600 text-sm text-center py-4">No variants added. Click Add Variant to create color/size options.</p>
                ) : (
                  <div className="space-y-4">
                    {variants.map((variant, idx) => (
                      <div key={idx} className="p-4 bg-[#1A1A1A] rounded-lg border border-zinc-800">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-300">Variant {idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeVariant(idx)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Color</label>
                            <input
                              value={variant.color}
                              onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                              placeholder="Red"
                              className="w-full bg-[#111] border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C8A253]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Size</label>
                            <input
                              value={variant.size}
                              onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                              placeholder="M"
                              className="w-full bg-[#111] border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C8A253]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Stock</label>
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                              className="w-full bg-[#111] border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C8A253]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Price (Rs)</label>
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                              placeholder="Optional"
                              className="w-full bg-[#111] border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C8A253]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Image</label>
                            <div className="flex items-center gap-2">
                              {variant.imagePreview ? (
                                <img src={variant.imagePreview} alt="" className="w-10 h-10 object-cover rounded border border-zinc-700" />
                              ) : (
                                <div className="w-10 h-10 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center">
                                  <ImagePlus className="w-4 h-4 text-zinc-600" />
                                </div>
                              )}
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => e.target.files[0] && handleVariantImageChange(idx, e.target.files[0])}
                                />
                                <span className="text-xs text-[#C8A253] hover:underline">
                                  {variant.imagePreview ? 'Change' : 'Upload'}
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg border border-zinc-700 text-gray-300 hover:bg-zinc-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-lg bg-[#C8A253] text-black font-semibold hover:bg-[#b08d44] transition-colors">
                  {editMode ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
