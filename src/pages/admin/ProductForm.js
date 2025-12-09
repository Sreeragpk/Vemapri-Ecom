// src/pages/admin/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  Plus,
  X,
  Upload,
  Package,
  Tag,
  Image as ImageIcon,
  FileText,
  Star,
  AlertCircle,
  Check,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Pulses & Grains',
    subCategory: '',
    brand: '',
    price: '',
    discountPrice: '',
    stock: '',
    sku: '',
    quantity: '',
    unit: 'g',
    displayQuantity: '',
    isOrganic: false,
    origin: '',
    shelfLifeDays: '',
    storageInstructions: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    images: [],
    specifications: [],
    features: [],
    tags: [],
    isActive: true,
    isFeatured: false,
    variants: [],
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [newSpec, setNewSpec] = useState({ key: '', value: '' });
  const [newFeature, setNewFeature] = useState('');

  // local "add variant" form
  const [newVariant, setNewVariant] = useState({
    name: '',
    quantity: '',
    unit: 'g',
    displayQuantity: '',
    price: '',
    discountPrice: '',
    stock: '',
    images: [],
    sku: '',
    isDefault: false,
  });

  useEffect(() => {
    if (isEdit) fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    setFetchingProduct(true);
    try {
      const res = await api.get(`/products/${id}`);
      const p = res.data;

      setFormData((prev) => ({
        ...prev,
        ...p,
        dimensions: {
          length: p.dimensions?.length || '',
          width: p.dimensions?.width || '',
          height: p.dimensions?.height || '',
        },
        images: p.images || [],
        specifications: p.specifications || [],
        features: p.features || [],
        tags: p.tags || [],
        variants: p.variants || [],
        isActive: typeof p.isActive === 'boolean' ? p.isActive : true,
        isFeatured: typeof p.isFeatured === 'boolean' ? p.isFeatured : false,
        isOrganic: typeof p.isOrganic === 'boolean' ? p.isOrganic : false,
      }));
    } catch (error) {
      console.error('Failed to fetch product', error);
      toast.error('Failed to fetch product');
      navigate('/admin/products');
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else if (name === 'tags') {
      const tagsArray = value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      setFormData((prev) => ({ ...prev, tags: tagsArray }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  // variant row edits
  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const variants = [...(prev.variants || [])];
      variants[index] = { ...variants[index], [field]: value };
      return { ...prev, variants };
    });
  };

  // Image handling for product-level images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length + (formData.images?.length || 0) > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    const readerPromises = files.map((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return null;
      }
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve({ url: ev.target.result, alt: file.name });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readerPromises).then((results) => {
      const valid = results.filter(Boolean);
      if (valid.length === 0) return;
      setFormData((prev) => ({ ...prev, images: [...(prev.images || []), ...valid] }));
      toast.success(`${valid.length} image(s) added`);
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== index) }));
    toast.success('Image removed');
  };

  // variant-level image handling (for newVariant only)
  const handleNewVariantImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const readerPromises = files.map((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return null;
      }
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve({ url: ev.target.result, alt: file.name });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readerPromises).then((results) => {
      const valid = results.filter(Boolean);
      if (valid.length === 0) return;
      setNewVariant((prev) => ({ ...prev, images: [...(prev.images || []), ...valid] }));
      toast.success(`${valid.length} variant image(s) added`);
    });
  };

  const removeNewVariantImage = (index) => {
    setNewVariant((prev) => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== index) }));
  };

  // add/remove specs / features
  const addSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setFormData((prev) => ({ ...prev, specifications: [...(prev.specifications || []), newSpec] }));
      setNewSpec({ key: '', value: '' });
      toast.success('Specification added');
    } else {
      toast.error('Please fill both key and value');
    }
  };

  const removeSpecification = (index) => {
    setFormData((prev) => ({ ...prev, specifications: (prev.specifications || []).filter((_, i) => i !== index) }));
    toast.success('Specification removed');
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({ ...prev, features: [...(prev.features || []), newFeature.trim()] }));
      setNewFeature('');
      toast.success('Feature added');
    } else {
      toast.error('Please enter a feature');
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({ ...prev, features: (prev.features || []).filter((_, i) => i !== index) }));
    toast.success('Feature removed');
  };

  // add variant from local newVariant state
  const addVariant = () => {
    const v = { ...newVariant };

    if (!v.quantity || !v.unit || !v.price) {
      toast.error('Variant needs quantity, unit and price');
      return;
    }

    if (v.discountPrice && Number(v.discountPrice) > Number(v.price)) {
      toast.error('Variant discount price cannot be greater than regular price');
      return;
    }

    setFormData((prev) => ({ ...prev, variants: [...(prev.variants || []), v] }));

    // reset new variant form
    setNewVariant({
      name: '',
      quantity: '',
      unit: 'g',
      displayQuantity: '',
      price: '',
      discountPrice: '',
      stock: '',
      images: [],
      sku: '',
      isDefault: false,
    });

    toast.success('Variant added');
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({ ...prev, variants: (prev.variants || []).filter((_, i) => i !== index) }));
    toast.success('Variant removed');
  };

  // small helper to compute discount percentage for base price display
  const discountPercentage =
    formData.price && formData.discountPrice
      ? Math.round(((Number(formData.price) - Number(formData.discountPrice)) / Number(formData.price)) * 100)
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Base validations
      if (formData.discountPrice && Number(formData.discountPrice) > Number(formData.price)) {
        toast.error('Discount price cannot be greater than regular price');
        setLoading(false);
        return;
      }

      // Variant-level validation
      if (formData.variants && formData.variants.length > 0) {
        for (const v of formData.variants) {
          if (v.discountPrice && Number(v.discountPrice) > Number(v.price)) {
            toast.error(`Variant "${v.displayQuantity || v.name || 'pack'}": discount price > price`);
            setLoading(false);
            return;
          }
        }
      }

      if (!formData.images || formData.images.length === 0) {
        toast.error('Please add at least one product image');
        setLoading(false);
        return;
      }

      // Build payload — ensure numeric fields are converted and fallback values set when variants exist
      const payload = { ...formData };

      // Normalize numbers
      if (payload.price !== undefined && payload.price !== '') payload.price = Number(payload.price);
      if (payload.discountPrice !== undefined && payload.discountPrice !== '') payload.discountPrice = Number(payload.discountPrice);
      if (payload.stock !== undefined && payload.stock !== '') payload.stock = Number(payload.stock);
      if (payload.quantity !== undefined && payload.quantity !== '') payload.quantity = Number(payload.quantity);

      // Normalize variant fields
      if (Array.isArray(payload.variants) && payload.variants.length > 0) {
        payload.variants = payload.variants.map((v) => {
          const copy = { ...v };
          if (copy.price !== undefined && copy.price !== '') copy.price = Number(copy.price);
          if (copy.discountPrice !== undefined && copy.discountPrice !== '') copy.discountPrice = Number(copy.discountPrice);
          if (copy.stock !== undefined && copy.stock !== '') copy.stock = Number(copy.stock);
          if (copy.quantity !== undefined && copy.quantity !== '') copy.quantity = Number(copy.quantity);
          return copy;
        });

        // If base fields are missing, mirror from first variant (safe defaults)
        const first = payload.variants[0];
        if ((!payload.price || payload.price === 0) && first.price) payload.price = first.price;
        if ((!payload.discountPrice || payload.discountPrice === 0) && first.discountPrice) payload.discountPrice = first.discountPrice;
        if ((!payload.stock || payload.stock === 0) && first.stock) {
          const total = payload.variants.reduce((s, it) => s + (Number(it.stock) || 0), 0);
          payload.stock = total;
        }
        if ((!payload.quantity || payload.quantity === 0) && first.quantity) payload.quantity = first.quantity;
        if (!payload.unit && first.unit) payload.unit = first.unit;
        if (!payload.displayQuantity && first.displayQuantity) payload.displayQuantity = first.displayQuantity;
      }

      // POST/PUT
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Save product error', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-1/3" />
            <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-xl" />
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button onClick={() => navigate('/admin/products')} className="group flex items-center text-white/90 hover:text-white mb-6 transition-all duration-200 hover:translate-x-[-4px]">
            <ArrowLeft size={20} className="mr-2 group-hover:animate-pulse" />
            <span className="font-medium text-sm">Back to Products</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <Package className="w-10 h-10" />
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-white/80 text-sm md:text-base max-w-2xl">
                Manage product details, pricing, variants and catalogue visibility.
              </p>
            </div>

            {isEdit && (
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${formData.isActive ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200' : 'bg-gray-100 text-gray-800 border-2 border-gray-200'} shadow-lg`}>
                  {formData.isActive ? (
                    <>
                      <Check size={16} />
                      Active
                    </>
                  ) : (
                    <>
                      <X size={16} />
                      Inactive
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Package size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Basic Information</h2>
                  <p className="text-white/80 text-sm">Core product details shown across store</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* name + description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <Tag size={16} className="text-indigo-600" />
                  Product Name *
                </label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm" placeholder="e.g., Bengal Gram (Chana Dal)" />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <FileText size={16} className="text-indigo-600" />
                  Description *
                </label>
                <textarea name="description" required value={formData.description} onChange={handleChange} rows="5" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm resize-none" placeholder="Describe quality, sourcing, taste profile and usage recommendations..." />
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1"><Info size={12} /> Provide detailed information to help customers make informed decisions</p>
              </div>

              {/* category/subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
                  <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm bg-white">
                    <option value="Pulses & Grains">Pulses & Grains</option>
                    <option value="Spices & Masalas">Spices & Masalas</option>
                    <option value="Nuts & Seeds">Nuts & Seeds</option>
                    <option value="Health & Organic Foods">Health & Organic Foods</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Sub Category</label>
                  <input type="text" name="subCategory" value={formData.subCategory} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm" placeholder="e.g., Bengal gram, Chilli powder" />
                </div>
              </div>

              {/* Brand / origin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Brand *</label>
                  <input type="text" name="brand" required value={formData.brand} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm" placeholder="e.g., Vemapri Select" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Origin</label>
                  <input type="text" name="origin" value={formData.origin} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm" placeholder="e.g., India, Karnataka" />
                </div>
              </div>

              {/* Base pack / pricing / stock */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Package size={18} className="text-purple-600" /> Base Pack Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Quantity *</label>
                    <input type="number" name="quantity" required min="0" step="0.01" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-sm" placeholder="e.g., 1 or 500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Unit *</label>
                    <select name="unit" required value={formData.unit} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-sm bg-white">
                      <option value="g">g (grams)</option>
                      <option value="kg">kg (kilograms)</option>
                      <option value="ml">ml (milliliters)</option>
                      <option value="L">L (liters)</option>
                      <option value="pcs">pcs (pieces)</option>
                      <option value="pack">pack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Display Quantity</label>
                    <input type="text" name="displayQuantity" value={formData.displayQuantity} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-sm" placeholder="e.g., 1 kg, 500 g" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Tag size={18} className="text-emerald-600" /> Base Pricing & Inventory</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Regular Price (₹) *</label>
                    <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-sm" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Discount Price (₹)</label>
                    <input type="number" name="discountPrice" min="0" step="0.01" value={formData.discountPrice} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-sm" placeholder="0.00" />
                    {discountPercentage > 0 && (<p className="mt-1 text-xs text-emerald-700 font-semibold flex items-center gap-1"><Sparkles size={12} />{discountPercentage}% OFF</p>)}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                    <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-sm" placeholder="Available units" />
                  </div>
                </div>
              </div>

              {/* VARIANTS */}
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-amber-200">
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"><Package size={18} className="text-amber-600" /> Pack Variants (Optional)</h3>
                <p className="text-xs text-gray-600 mb-4">Use this if the same product is available in multiple pack sizes with different prices/stock. If you don’t add variants, only the base pack will be used.</p>

                {/* new variant row */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Display Quantity / Label</label>
                    <input type="text" value={newVariant.displayQuantity} onChange={(e) => setNewVariant((p) => ({ ...p, displayQuantity: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-200 text-xs" placeholder="e.g., 500 g, 1 kg" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity *</label>
                    <input type="number" min="0" step="0.01" value={newVariant.quantity} onChange={(e) => setNewVariant((p) => ({ ...p, quantity: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-200 text-xs" placeholder="500" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Unit *</label>
                    <select value={newVariant.unit} onChange={(e) => setNewVariant((p) => ({ ...p, unit: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-200 text-xs bg-white">
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="pcs">pcs</option>
                      <option value="pack">pack</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹) *</label>
                    <input type="number" min="0" step="0.01" value={newVariant.price} onChange={(e) => setNewVariant((p) => ({ ...p, price: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-200 text-xs" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Discount (₹)</label>
                    <input type="number" min="0" step="0.01" value={newVariant.discountPrice} onChange={(e) => setNewVariant((p) => ({ ...p, discountPrice: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-200 text-xs" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Stock</label>
                    <input type="number" min="0" value={newVariant.stock} onChange={(e) => setNewVariant((p) => ({ ...p, stock: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-200 text-xs" />
                  </div>
                </div>

                {/* new variant images + add button */}
                <div className="flex items-center gap-3 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="file" accept="image/*" multiple onChange={handleNewVariantImageChange} className="hidden" />
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-amber-200 text-xs">
                      <Upload size={14} />
                      Upload Variant Images
                    </div>
                  </label>
                  <button type="button" onClick={addVariant} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition shadow">
                    <Plus size={16} /> Add Variant
                  </button>
                </div>

                {/* preview newVariant images */}
                {newVariant.images && newVariant.images.length > 0 && (
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    {newVariant.images.map((img, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden border border-amber-200 bg-white p-1">
                        <img src={img.url} alt={img.alt} className="h-20 w-full object-contain" />
                        <button type="button" onClick={() => removeNewVariantImage(i)} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* existing variants list */}
                {formData.variants && formData.variants.length > 0 ? (
                  <div className="mt-4 space-y-2">
                    {formData.variants.map((v, idx) => {
                      const d = v.price && v.discountPrice && Number(v.discountPrice) < Number(v.price)
                        ? Math.round(((v.price - v.discountPrice) / v.price) * 100)
                        : 0;
                      return (
                        <div key={idx} className="group grid grid-cols-1 md:grid-cols-7 gap-2 items-center bg-white/80 border border-amber-200 rounded-xl px-3 py-3">
                          <div className="md:col-span-2">
                            <p className="text-xs font-semibold text-gray-800">{v.displayQuantity || `${v.quantity || ''} ${v.unit || ''}`}</p>
                            <input type="text" value={v.displayQuantity || ''} onChange={(e) => handleVariantChange(idx, 'displayQuantity', e.target.value)} className="mt-1 w-full px-2 py-1.5 rounded-lg border border-amber-200 text-[11px]" placeholder="Label (optional)" />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Qty</label>
                            <input type="number" min="0" step="0.01" value={v.quantity || ''} onChange={(e) => handleVariantChange(idx, 'quantity', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-amber-200 text-[11px]" />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Unit</label>
                            <select value={v.unit || 'g'} onChange={(e) => handleVariantChange(idx, 'unit', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-amber-200 text-[11px] bg-white">
                              <option value="g">g</option>
                              <option value="kg">kg</option>
                              <option value="ml">ml</option>
                              <option value="L">L</option>
                              <option value="pcs">pcs</option>
                              <option value="pack">pack</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Price</label>
                            <input type="number" min="0" step="0.01" value={v.price || ''} onChange={(e) => handleVariantChange(idx, 'price', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-amber-200 text-[11px]" />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Discount</label>
                            <input type="number" min="0" step="0.01" value={v.discountPrice || ''} onChange={(e) => handleVariantChange(idx, 'discountPrice', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-amber-200 text-[11px]" />
                            {d > 0 && <p className="mt-0.5 text-[10px] text-amber-700">{d}% OFF</p>}
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Stock</label>
                            <input type="number" min="0" value={v.stock || ''} onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-amber-200 text-[11px]" />
                          </div>

                          <div className="flex justify-end">
                            <button type="button" onClick={() => removeVariant(idx)} className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 opacity-60 group-hover:opacity-100">
                              <X size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 text-xs text-gray-500 flex items-center gap-2"><Info size={14} className="text-amber-500" /> No variants added. Only base pack will be used.</div>
                )}
              </div>

              {/* SKU / weight / shelf life */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">SKU *</label>
                  <input type="text" name="sku" required value={formData.sku} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm font-mono" placeholder="Unique SKU" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Weight (g)</label>
                  <input type="number" name="weight" min="0" step="0.01" value={formData.weight} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm" placeholder="e.g., 1000" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Shelf Life (days)</label>
                  <input type="number" name="shelfLifeDays" min="0" value={formData.shelfLifeDays} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm" placeholder="e.g., 365" />
                </div>
              </div>

              {/* storage instructions */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Storage Instructions</label>
                <textarea name="storageInstructions" value={formData.storageInstructions} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm resize-none" placeholder="e.g., Store in a cool, dry place away from direct sunlight in an airtight container." />
              </div>

              {/* tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Tags (comma separated)</label>
                <input type="text" name="tags" value={formData.tags.join(', ')} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm" placeholder="e.g., bengal gram, chana dal, pulses, protein rich" />
                {formData.tags.length > 0 && <div className="flex flex-wrap gap-2 mt-3">{formData.tags.map((tag, i) => (<span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 text-xs font-semibold text-indigo-700"><Tag size={12} />{tag}</span>))}</div>}
              </div>

              {/* product flags */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Star size={18} className="text-blue-600" /> Product Settings</h3>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-emerald-600 relative after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600">Product is Active</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-amber-500 relative after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-amber-600 flex items-center gap-1"><Star size={14} /> Mark as Featured</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" name="isOrganic" checked={formData.isOrganic} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-600 relative after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-green-600 flex items-center gap-1"><Sparkles size={14} /> Organic Product</span>
                  </label>
                </div>
              </div>

              {/* dimensions */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Package Dimensions (cm)</label>
                <div className="grid grid-cols-3 gap-4">
                  <input type="number" name="dimensions.length" min="0" step="0.01" value={formData.dimensions.length} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm" placeholder="Length" />
                  <input type="number" name="dimensions.width" min="0" step="0.01" value={formData.dimensions.width} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm" placeholder="Width" />
                  <input type="number" name="dimensions.height" min="0" step="0.01" value={formData.dimensions.height} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm" placeholder="Height" />
                </div>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-8 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><ImageIcon size={24} className="text-white" /></div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Product Images</h2>
                    <p className="text-white/80 text-sm">Upload clear product photos (max 10 images, 5MB each)</p>
                  </div>
                </div>
                {(formData.images || []).length > 0 && (
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold text-sm">{(formData.images || []).length} / 10</span>
                )}
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="flex flex-col items-center justify-center w-full h-48 border-3 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gradient-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    <p className="mb-2 text-sm text-gray-700">
                      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Click to upload</span> or drag & drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (max 5MB each)</p>
                  </div>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {(formData.images || []).length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-900">Uploaded Images</h3>
                    <p className="text-xs text-gray-500">First image will be the main thumbnail</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {(formData.images || []).map((image, index) => (
                      <div key={index} className="relative group rounded-2xl overflow-hidden border-2 border-gray-200 bg-white hover:border-indigo-400 transition-all duration-300 hover:shadow-xl">
                        {index === 0 && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold rounded-lg shadow-lg">
                              <Star size={10} /> MAIN
                            </span>
                          </div>
                        )}
                        <img src={image.url} alt={image.alt || `image-${index}`} className="w-full h-40 object-contain p-2 bg-gray-50" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg">
                          <X size={16} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-[10px] truncate">{image.alt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3"><AlertCircle size={32} className="text-gray-400" /></div>
                  <p className="text-sm text-gray-600">No images uploaded yet</p>
                  <p className="text-xs text-gray-500 mt-1">Upload at least one product image</p>
                </div>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><FileText size={24} className="text-white" /></div>
                <div>
                  <h2 className="text-xl font-bold text-white">Specifications</h2>
                  <p className="text-white/80 text-sm">Add key product attributes and certifications</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" value={newSpec.key} onChange={(e) => setNewSpec((p) => ({ ...p, key: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm" placeholder="Specification name (e.g., Protein, FSSAI License)" />
                <input type="text" value={newSpec.value} onChange={(e) => setNewSpec((p) => ({ ...p, value: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm" placeholder="Specification value (e.g., Rich in protein)" />
                <button type="button" onClick={addSpecification} className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl flex items-center gap-2 font-semibold shadow-lg">
                  <Plus size={20} /> <span className="hidden sm:inline">Add</span>
                </button>
              </div>

              {(formData.specifications || []).length > 0 ? (
                <div className="space-y-3">
                  {(formData.specifications || []).map((spec, i) => (
                    <div key={i} className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-100 hover:border-cyan-300 transition-all duration-300">
                      <div className="text-sm"><span className="font-bold text-cyan-900">{spec.key}:</span> <span className="text-gray-700">{spec.value}</span></div>
                      <button type="button" onClick={() => removeSpecification(i)} className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all duration-300"><X size={18} /></button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <Info size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">No specifications added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><Sparkles size={24} className="text-white" /></div>
                <div>
                  <h2 className="text-xl font-bold text-white">Highlights / Features</h2>
                  <p className="text-white/80 text-sm">Key selling points displayed as bullet points</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex gap-3">
                <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm" placeholder="e.g., Unpolished, Single-origin, Sun-dried" />
                <button type="button" onClick={addFeature} className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl flex items-center gap-2 font-semibold shadow-lg">
                  <Plus size={20} /> <span className="hidden sm:inline">Add</span>
                </button>
              </div>

              {(formData.features || []).length > 0 ? (
                <ul className="space-y-3">
                  {(formData.features || []).map((f, i) => (
                    <li key={i} className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-100 hover:border-violet-300 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full"></div>
                        <span className="text-sm text-gray-800">{f}</span>
                      </div>
                      <button type="button" onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all duration-300"><X size={18} /></button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <Sparkles size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">No features added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-lg border-t-2 border-gray-200 rounded-2xl shadow-2xl p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl disabled:opacity-50 transition-all duration-300 font-bold text-lg shadow-xl">
                {loading ? (<><div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div> Saving Product...</>) : (<><Check size={22} /> {isEdit ? 'Update Product' : 'Create Product'}</>)}
              </button>

              <button type="button" onClick={() => navigate('/admin/products')} disabled={loading} className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold text-lg border-2 border-gray-200">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
