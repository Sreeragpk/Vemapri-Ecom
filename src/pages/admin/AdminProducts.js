import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Leaf,
  Star,
} from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    isActive: '',
    isOrganic: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: 20,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        ),
      };

      const res = await api.get('/products', { params });
      setProducts(res.data.products);
      setPagination({
        currentPage: Number(res.data.currentPage),
        totalPages: res.data.totalPages,
        totalProducts: res.data.totalProducts,
      });
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (productId, currentStatus) => {
    try {
      await api.put(`/products/${productId}`, { isActive: !currentStatus });
      toast.success('Product status updated');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleFilterChange = (name, value) => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      isActive: '',
      isOrganic: '',
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Products
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Manage Vemapri grocery & staples catalogue, pricing and inventory.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
            {pagination.totalProducts} total products
          </span>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 via-lime-500 to-amber-400 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-900 shadow-sm hover:shadow-md transition-all"
          >
            <Plus size={16} className="mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white/90 border border-emerald-100/80 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Search size={16} />
            </span>
            <span>Filter products</span>
          </div>
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50/70 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-100 transition-all"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, brand, SKU..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input pl-9 text-sm"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
          </div>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="input text-sm"
          >
            <option value="">All Categories</option>
            <option value="Pulses & Grains">Pulses &amp; Grains</option>
            <option value="Spices & Masalas">Spices &amp; Masalas</option>
            <option value="Nuts & Seeds">Nuts &amp; Seeds</option>
            <option value="Health & Organic Foods">
              Health &amp; Organic Foods
            </option>
          </select>

          {/* Status */}
          <select
            value={filters.isActive}
            onChange={(e) => handleFilterChange('isActive', e.target.value)}
            className="input text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Organic filter */}
          <select
            value={filters.isOrganic}
            onChange={(e) => handleFilterChange('isOrganic', e.target.value)}
            className="input text-sm"
          >
            <option value="">All Types</option>
            <option value="true">Organic</option>
            <option value="false">Non-Organic</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-emerald-50 bg-white/80 shadow-sm animate-pulse p-4"
            >
              <div className="h-40 bg-slate-100 rounded-xl mb-4" />
              <div className="h-4 bg-slate-100 rounded mb-2" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 text-sm">
            No products found for the selected filters.
          </div>
        ) : (
          products.map((product) => {
            const effectivePrice = product.discountPrice || product.price;
            const hasDiscount =
              product.discountPrice && product.discountPrice < product.price;
            const discountPercent =
              hasDiscount && product.price
                ? Math.round(
                    ((product.price - product.discountPrice) / product.price) *
                      100
                  )
                : 0;

            return (
              <div
                key={product._id}
                className="rounded-2xl border border-emerald-50 bg-white/90 shadow-sm hover:shadow-md transition-all p-4 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-40 bg-slate-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 text-xs">
                      <Leaf className="mb-1" size={20} />
                      No image
                    </div>
                  )}

                  {/* Status badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    <span
                      className={`px-2 py-0.5 text-[11px] rounded-full font-medium ${
                        product.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>

                    {product.isOrganic && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Leaf size={12} />
                        Organic
                      </span>
                    )}

                    {product.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                        <Star size={12} />
                        Featured
                      </span>
                    )}

                    {product.stock <= 0 && (
                      <span className="px-2 py-0.5 text-[11px] rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                        Out of Stock
                      </span>
                    )}
                    {product.stock > 0 && product.stock <= 5 && (
                      <span className="px-2 py-0.5 text-[11px] rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                        Low Stock
                      </span>
                    )}

                    {hasDiscount && (
                      <span className="px-2 py-0.5 text-[11px] rounded-full bg-emerald-600 text-white font-semibold shadow-sm">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-sm sm:text-base font-semibold mb-1 line-clamp-2 text-slate-900">
                  {product.name}
                </h3>

                {/* Tags row */}
                <div className="text-[11px] text-slate-600 mb-2 flex flex-wrap gap-1.5">
                  {product.category && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
                      {product.category}
                    </span>
                  )}
                  {product.displayQuantity && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-100">
                      {product.displayQuantity}
                    </span>
                  )}
                  {product.brand && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-100">
                      {product.brand}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline mb-2">
                  <span className="text-lg font-bold text-emerald-600">
                    ₹{effectivePrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="ml-2 text-xs text-slate-400 line-through">
                      ₹{product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* SKU / Stock */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-4">
                  <div>
                    <span className="font-medium text-slate-700">SKU:</span>{' '}
                    {product.sku}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Stock:</span>{' '}
                    <span
                      className={`font-semibold ${
                        product.stock <= 0
                          ? 'text-rose-600'
                          : product.stock <= 5
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex space-x-2">
                  <Link
                    to={`/admin/products/${product._id}`}
                    className="flex-1 btn btn-secondary text-xs sm:text-sm flex items-center justify-center"
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() =>
                      handleToggleActive(product._id, product.isActive)
                    }
                    className="btn btn-secondary text-xs sm:text-sm"
                    title={product.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {product.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn btn-danger text-xs sm:text-sm"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm text-slate-600">
          <div>
            Page{' '}
            <span className="font-semibold text-slate-900">
              {pagination.currentPage}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-900">
              {pagination.totalPages}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }
              disabled={pagination.currentPage === 1}
              className="btn btn-secondary text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="btn btn-secondary text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
