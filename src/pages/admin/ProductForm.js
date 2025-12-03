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
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [newSpec, setNewSpec] = useState({ key: '', value: '' });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
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
        isActive: typeof p.isActive === 'boolean' ? p.isActive : true,
        isFeatured: typeof p.isFeatured === 'boolean' ? p.isFeatured : false,
        isOrganic: typeof p.isOrganic === 'boolean' ? p.isOrganic : false,
      }));
    } catch (error) {
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
      setFormData((prev) => ({
        ...prev,
        tags: tagsArray,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + formData.images.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    const imagePromises = files.map((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return null;
      }

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) =>
          resolve({ url: ev.target.result, alt: file.name });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((images) => {
      const validImages = images.filter(Boolean);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validImages],
      }));
      if (validImages.length > 0) {
        toast.success(`${validImages.length} image(s) added`);
      }
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.success('Image removed');
  };

  const addSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setFormData((prev) => ({
        ...prev,
        specifications: [...prev.specifications, newSpec],
      }));
      setNewSpec({ key: '', value: '' });
      toast.success('Specification added');
    } else {
      toast.error('Please fill both key and value');
    }
  };

  const removeSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
    toast.success('Specification removed');
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
      toast.success('Feature added');
    } else {
      toast.error('Please enter a feature');
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
    toast.success('Feature removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (
        formData.discountPrice &&
        Number(formData.discountPrice) > Number(formData.price)
      ) {
        toast.error('Discount price cannot be greater than regular price');
        setLoading(false);
        return;
      }

      if (formData.images.length === 0) {
        toast.error('Please add at least one product image');
        setLoading(false);
        return;
      }

      if (isEdit) {
        await api.put(`/products/${id}`, formData);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', formData);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error) {
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

  const discountPercentage = formData.price && formData.discountPrice 
    ? Math.round(((formData.price - formData.discountPrice) / formData.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button
            onClick={() => navigate('/admin/products')}
            className="group flex items-center text-white/90 hover:text-white mb-6 transition-all duration-200 hover:translate-x-[-4px]"
          >
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
                Manage Vemapri grocery product details, pricing, pack info and catalogue visibility.
              </p>
            </div>

            {isEdit && (
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                  formData.isActive 
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200' 
                    : 'bg-gray-100 text-gray-800 border-2 border-gray-200'
                } shadow-lg`}>
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
          {/* Basic Information */}
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
              {/* Product Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <Tag size={16} className="text-indigo-600" />
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm"
                  placeholder="e.g., Bengal Gram (Chana Dal) 1 kg"
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <FileText size={16} className="text-indigo-600" />
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm resize-none"
                  placeholder="Describe quality, sourcing, taste profile and usage recommendations..."
                />
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <Info size={12} />
                  Provide detailed information to help customers make informed decisions
                </p>
              </div>

              {/* Category & Sub-category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm bg-white"
                  >
                    <option value="Pulses & Grains">Pulses & Grains</option>
                    <option value="Spices & Masalas">Spices & Masalas</option>
                    <option value="Nuts & Seeds">Nuts & Seeds</option>
                    <option value="Health & Organic Foods">Health & Organic Foods</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Sub Category
                  </label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm"
                    placeholder="e.g., Bengal gram, Chilli powder"
                  />
                </div>
              </div>

              {/* Brand & Origin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm"
                    placeholder="e.g., Vemapri Select"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Origin
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm"
                    placeholder="e.g., India, Karnataka"
                  />
                </div>
              </div>

              {/* Pack Information */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={18} className="text-purple-600" />
                  Pack Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      required
                      min="0"
                      step="0.01"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-sm"
                      placeholder="e.g., 1 or 500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Unit *
                    </label>
                    <select
                      name="unit"
                      required
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-sm bg-white"
                    >
                      <option value="g">g (grams)</option>
                      <option value="kg">kg (kilograms)</option>
                      <option value="ml">ml (milliliters)</option>
                      <option value="L">L (liters)</option>
                      <option value="pcs">pcs (pieces)</option>
                      <option value="pack">pack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Display Quantity
                    </label>
                    <input
                      type="text"
                      name="displayQuantity"
                      value={formData.displayQuantity}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-sm"
                      placeholder="e.g., 1 kg, 500 g"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag size={18} className="text-emerald-600" />
                  Pricing & Inventory
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Regular Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Discount Price (₹)
                    </label>
                    <input
                      type="number"
                      name="discountPrice"
                      min="0"
                      step="0.01"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-sm"
                      placeholder="0.00"
                    />
                    {discountPercentage > 0 && (
                      <p className="mt-1 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <Sparkles size={12} />
                        {discountPercentage}% OFF
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-sm"
                      placeholder="Available units"
                    />
                  </div>
                </div>
              </div>

              {/* SKU, Weight, Shelf Life */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    required
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm font-mono"
                    placeholder="Unique SKU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Weight (g)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    min="0"
                    step="0.01"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm"
                    placeholder="e.g., 1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Shelf Life (days)
                  </label>
                  <input
                    type="number"
                    name="shelfLifeDays"
                    min="0"
                    value={formData.shelfLifeDays}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm"
                    placeholder="e.g., 365"
                  />
                </div>
              </div>

              {/* Storage Instructions */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Storage Instructions
                </label>
                <textarea
                  name="storageInstructions"
                  value={formData.storageInstructions}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm resize-none"
                  placeholder="e.g., Store in a cool, dry place away from direct sunlight in an airtight container."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags.join(', ')}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm"
                  placeholder="e.g., bengal gram, chana dal, pulses, protein rich"
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 text-xs font-semibold text-indigo-700"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Flags */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star size={18} className="text-blue-600" />
                  Product Settings
                </h3>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      Product is Active
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-amber-600 transition-colors flex items-center gap-1">
                      <Star size={14} />
                      Mark as Featured
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isOrganic"
                        checked={formData.isOrganic}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors flex items-center gap-1">
                      <Sparkles size={14} />
                      Organic Product
                    </span>
                  </label>
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Package Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    name="dimensions.length"
                    min="0"
                    step="0.01"
                    value={formData.dimensions.length}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm"
                    placeholder="Length"
                  />
                  <input
                    type="number"
                    name="dimensions.width"
                    min="0"
                    step="0.01"
                    value={formData.dimensions.width}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm"
                    placeholder="Width"
                  />
                  <input
                    type="number"
                    name="dimensions.height"
                    min="0"
                    step="0.01"
                    value={formData.dimensions.height}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm"
                    placeholder="Height"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-8 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <ImageIcon size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Product Images</h2>
                    <p className="text-white/80 text-sm">Upload clear product photos (max 10 images, 5MB each)</p>
                  </div>
                </div>
                {formData.images.length > 0 && (
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold text-sm">
                    {formData.images.length} / 10
                  </span>
                )}
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Upload Area */}
              <div>
                <label className="flex flex-col items-center justify-center w-full h-48 border-3 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gradient-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    <p className="mb-2 text-sm text-gray-700">
                      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Click to upload
                      </span>{' '}
                      or drag & drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (max 5MB each)</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Preview Grid */}
              {formData.images.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-900">Uploaded Images</h3>
                    <p className="text-xs text-gray-500">First image will be the main thumbnail</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {formData.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group rounded-2xl overflow-hidden border-2 border-gray-200 bg-white hover:border-indigo-400 transition-all duration-300 hover:shadow-xl"
                      >
                        {index === 0 && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold rounded-lg shadow-lg">
                              <Star size={10} fill="white" />
                              MAIN
                            </span>
                          </div>
                        )}
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-40 object-contain p-2 bg-gray-50"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                          <X size={16} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-[10px] truncate">{image.alt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.images.length === 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
                    <AlertCircle size={32} className="text-gray-400" />
                  </div>
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
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FileText size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Specifications</h2>
                  <p className="text-white/80 text-sm">Add key product attributes and certifications</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newSpec.key}
                  onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 text-sm"
                  placeholder="Specification name (e.g., Protein, FSSAI License)"
                />
                <input
                  type="text"
                  value={newSpec.value}
                  onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 text-sm"
                  placeholder="Specification value (e.g., Rich in protein)"
                />
                <button
                  type="button"
                  onClick={addSpecification}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>

              {formData.specifications.length > 0 ? (
                <div className="space-y-3">
                  {formData.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-100 hover:border-cyan-300 transition-all duration-300"
                    >
                      <div className="text-sm">
                        <span className="font-bold text-cyan-900">{spec.key}:</span>{' '}
                        <span className="text-gray-700">{spec.value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <X size={18} />
                      </button>
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
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Highlights / Features</h2>
                  <p className="text-white/80 text-sm">Key selling points displayed as bullet points</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 text-sm"
                  placeholder="e.g., Unpolished, Single-origin, Sun-dried"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>

              {formData.features.length > 0 ? (
                <ul className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <li
                      key={index}
                      className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-100 hover:border-violet-300 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full"></div>
                        <span className="text-sm text-gray-800">{feature}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <X size={18} />
                      </button>
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

          {/* Submit Buttons */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-lg border-t-2 border-gray-200 rounded-2xl shadow-2xl p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Product...
                  </>
                ) : (
                  <>
                    <Check size={22} />
                    {isEdit ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
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