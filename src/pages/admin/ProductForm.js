import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, X, Upload } from 'lucide-react';

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
  const [newSpec, setNewSpec] = useState({ key: '', value: '' });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
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

    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) =>
          resolve({ url: ev.target.result, alt: file.name });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((images) => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...images],
      }));
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setFormData((prev) => ({
        ...prev,
        specifications: [...prev.specifications, newSpec],
      }));
      setNewSpec({ key: '', value: '' });
    }
  };

  const removeSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (newFeature) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        formData.discountPrice &&
        Number(formData.discountPrice) > Number(formData.price)
      ) {
        toast.error('Discount price cannot be greater than price');
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Manage Vemapri grocery product details, pricing, pack info and
            catalogue visibility.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="hidden sm:inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card border border-emerald-50 rounded-2xl shadow-sm bg-white/95">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Basic Information
              </h2>
              <p className="text-xs text-slate-500">
                Core product details shown across store and listings.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input text-sm"
                placeholder="e.g., Bengal Gram (Chana Dal) 1 kg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="input text-sm"
                placeholder="Describe quality, sourcing, taste profile and usage."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input text-sm"
                >
                  <option value="Pulses & Grains">
                    Pulses &amp; Grains
                  </option>
                  <option value="Spices & Masalas">
                    Spices &amp; Masalas
                  </option>
                  <option value="Nuts & Seeds">Nuts &amp; Seeds</option>
                  <option value="Health & Organic Foods">
                    Health &amp; Organic Foods
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Sub Category
                </label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="e.g., Bengal gram, Chilli powder"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="e.g., Vemapri Select"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Origin
                </label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="e.g., India, Karnataka"
                />
              </div>
            </div>

            {/* Pack & shelf-life */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
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
                  className="input text-sm"
                  placeholder="e.g., 1 or 500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Unit *
                </label>
                <select
                  name="unit"
                  required
                  value={formData.unit}
                  onChange={handleChange}
                  className="input text-sm"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="L">L</option>
                  <option value="pcs">pcs</option>
                  <option value="pack">pack</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Display Quantity
                </label>
                <input
                  type="text"
                  name="displayQuantity"
                  value={formData.displayQuantity}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="e.g., 1 kg, 500 g"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Discount Price (₹)
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  min="0"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  required
                  value={formData.sku}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="Enter unique SKU"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Weight (g)
                </label>
                <input
                  type="number"
                  name="weight"
                  min="0"
                  step="0.01"
                  value={formData.weight}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="e.g., 1000"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Shelf Life (days)
                </label>
                <input
                  type="number"
                  name="shelfLifeDays"
                  min="0"
                  value={formData.shelfLifeDays}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="e.g., 365"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Storage Instructions
              </label>
              <textarea
                name="storageInstructions"
                value={formData.storageInstructions}
                onChange={handleChange}
                rows="2"
                className="input text-sm"
                placeholder="e.g., Store in a cool, dry place away from direct sunlight."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags.join(', ')}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="e.g., bengal gram, chana dal, pulses"
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[11px] text-emerald-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center pt-2 border-t border-slate-100">
              <label className="flex items-center text-xs text-slate-800">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                />
                <span className="ml-2">Product is active</span>
              </label>

              <label className="flex items-center text-xs text-slate-800">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                />
                <span className="ml-2">Mark as featured</span>
              </label>

              <label className="flex items-center text-xs text-slate-800">
                <input
                  type="checkbox"
                  name="isOrganic"
                  checked={formData.isOrganic}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                />
                <span className="ml-2">Organic product</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Dimensions (cm)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  name="dimensions.length"
                  min="0"
                  step="0.01"
                  value={formData.dimensions.length}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="Length"
                />
                <input
                  type="number"
                  name="dimensions.width"
                  min="0"
                  step="0.01"
                  value={formData.dimensions.width}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="Width"
                />
                <input
                  type="number"
                  name="dimensions.height"
                  min="0"
                  step="0.01"
                  value={formData.dimensions.height}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="Height"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card border border-emerald-50 rounded-2xl shadow-sm bg-white/95">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Product Images
              </h2>
              <p className="text-xs text-slate-500">
                Upload clear pack and close-up shots. First image appears as the
                main thumbnail.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Upload Images
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-4 pb-5">
                    <Upload className="w-7 h-7 mb-2 text-slate-400" />
                    <p className="mb-1 text-xs text-slate-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag &amp; drop
                    </p>
                    <p className="text-[11px] text-slate-400">
                      PNG, JPG or WEBP (max 5MB each)
                    </p>
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
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden border border-slate-100 bg-slate-50"
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-32 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div className="card border border-emerald-50 rounded-2xl shadow-sm bg-white/95">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Specifications
              </h2>
              <p className="text-xs text-slate-500">
                Add key attributes like nutrition claims, certifications, etc.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
              <input
                type="text"
                value={newSpec.key}
                onChange={(e) =>
                  setNewSpec({ ...newSpec, key: e.target.value })
                }
                className="input flex-1 text-sm"
                placeholder="Specification name (e.g., Protein, FSSAI License)"
              />
              <input
                type="text"
                value={newSpec.value}
                onChange={(e) =>
                  setNewSpec({ ...newSpec, value: e.target.value })
                }
                className="input flex-1 text-sm"
                placeholder="Specification value (e.g., Rich in protein)"
              />
              <button
                type="button"
                onClick={addSpecification}
                className="btn btn-primary mt-1 md:mt-0"
              >
                <Plus size={18} />
              </button>
            </div>

            {formData.specifications.length > 0 && (
              <div className="space-y-2">
                {formData.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100"
                  >
                    <div className="text-xs sm:text-sm text-slate-800">
                      <span className="font-semibold">{spec.key}:</span>{' '}
                      {spec.value}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="card border border-emerald-50 rounded-2xl shadow-sm bg-white/95">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Highlights / Features
              </h2>
              <p className="text-xs text-slate-500">
                Bullet points that show on product detail page.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="input flex-1 text-sm"
                placeholder="e.g., Unpolished, Single-origin, Sun-dried"
              />
              <button
                type="button"
                onClick={addFeature}
                className="btn btn-primary"
              >
                <Plus size={18} />
              </button>
            </div>

            {formData.features.length > 0 && (
              <ul className="space-y-2">
                {formData.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100"
                  >
                    <span className="text-xs sm:text-sm text-slate-800">
                      {feature}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1 disabled:opacity-50"
          >
            {loading
              ? 'Saving...'
              : isEdit
              ? 'Update Product'
              : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
