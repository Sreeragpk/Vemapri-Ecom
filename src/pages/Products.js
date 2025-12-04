import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Filter, Search, X, ChevronDown } from 'lucide-react';
import productsBanner from '../assets/products.webp';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    isOrganic: searchParams.get('isOrganic') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  const [pagination, setPagination] = useState({
    currentPage: Number(searchParams.get('page')) || 1,
    totalPages: 1,
    totalProducts: 0,
  });

  const categories = [
    'Pulses & Grains',
    'Spices & Masalas',
    'Nuts & Seeds',
    'Health & Organic Foods',
  ];

  const brands = [
    'Vemapri Select',
    'Vemapri Masala',
    'Vemapri Wellness',
    'Other',
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.currentPage]);

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value != null) {
        params.set(key, value);
      }
    });

    if (pagination.currentPage > 1) {
      params.set('page', String(pagination.currentPage));
    }

    setSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: 12,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        ),
      };

      const res = await api.get('/products', { params });
      setProducts(res.data.products);
      setPagination((prev) => ({
        ...prev,
        currentPage: Number(res.data.currentPage),
        totalPages: res.data.totalPages,
        totalProducts: res.data.totalProducts,
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      isOrganic: '',
      sort: 'newest',
    });
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.category) {
      chips.push({ label: filters.category, key: 'category' });
    }
    if (filters.brand) {
      chips.push({ label: `Brand: ${filters.brand}`, key: 'brand' });
    }
    if (filters.minPrice || filters.maxPrice) {
      chips.push({
        label: `₹${filters.minPrice || 0} - ₹${filters.maxPrice || '∞'}`,
        key: 'price',
      });
    }
    if (filters.minRating) {
      chips.push({
        label: `Rating ≥ ${filters.minRating}`,
        key: 'minRating',
      });
    }
    if (filters.isOrganic === 'true') {
      chips.push({
        label: 'Organic only',
        key: 'isOrganic',
      });
    }

    return chips;
  }, [filters]);

  const removeChip = (key) => {
    if (key === 'price') {
      handleFilterChange('minPrice', '');
      handleFilterChange('maxPrice', '');
    } else {
      handleFilterChange(key, '');
    }
  };

  const organicOptions = [
    { label: 'All', value: '' },
    { label: 'Organic', value: 'true' },
    { label: 'Non-organic', value: 'false' },
  ];

  const ratingOptions = [
    { label: 'Any', value: '' },
    { label: '3★+', value: '3' },
    { label: '4★+', value: '4' },
    { label: '4.5★+', value: '4.5' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/30">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Banner */}
        <div className="mb-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <img
              src={productsBanner}
              alt="Shop groceries and staples"
              className="w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Compact Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                All Products
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {pagination.totalProducts} products available
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
          {/* Compact Filters Sidebar - Desktop */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm sticky top-4 overflow-hidden">
              {/* Filter Header */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Filter size={16} className="text-slate-500" />
                    Filters
                  </h2>
                  {activeFilterChips.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-[10px] font-medium text-slate-600 hover:text-slate-900 uppercase tracking-wider"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Search */}
                <div>
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange('search', e.target.value)
                      }
                      placeholder="Search..."
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <Search size={16} />
                    </button>
                  </form>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange('category', e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="">All</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Brand
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="">All</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Pills */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Type
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {organicOptions.map((opt) => {
                      const active = filters.isOrganic === opt.value;
                      return (
                        <button
                          key={opt.value || 'all'}
                          type="button"
                          onClick={() => handleFilterChange('isOrganic', opt.value)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                            active
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating Pills */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Rating
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ratingOptions.map((opt) => {
                      const active = filters.minRating === opt.value;
                      return (
                        <button
                          key={opt.value || 'any'}
                          type="button"
                          onClick={() => handleFilterChange('minRating', opt.value)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                            active
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Price (₹)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange('minPrice', e.target.value)
                      }
                      className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange('maxPrice', e.target.value)
                      }
                      className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Products Area */}
          <div className="flex-1 min-w-0">
            {/* Top Bar - Mobile Filters + Sort + Active Chips */}
            <div className="mb-4">
              {/* Mobile Filter Button + Sort */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex-shrink-0 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <Filter size={16} />
                  Filters
                  {activeFilterChips.length > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-slate-900 rounded-full">
                      {activeFilterChips.length}
                    </span>
                  )}
                </button>

                <div className="flex-1 flex items-center justify-end gap-2">
                  <label className="text-xs font-medium text-slate-600 hidden sm:block">
                    Sort:
                  </label>
                  <div className="relative">
                    <select
                      value={filters.sort}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeFilterChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {activeFilterChips.map((chip) => (
                    <button
                      key={chip.key}
                      onClick={() => removeChip(chip.key)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 pl-3 pr-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/60 hover:bg-slate-200 transition-colors"
                    >
                      <span>{chip.label}</span>
                      <X size={14} className="text-slate-500" />
                    </button>
                  ))}
                  <button
                    onClick={clearFilters}
                    className="text-xs font-medium text-slate-500 hover:text-slate-900 underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="lg:hidden mb-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-slate-500 hover:text-slate-900"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Search */}
                  <div>
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange('search', e.target.value)
                        }
                        placeholder="Search products..."
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        <Search size={16} />
                      </button>
                    </form>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        handleFilterChange('category', e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                    >
                      <option value="">All</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Brand
                    </label>
                    <select
                      value={filters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                    >
                      <option value="">All</option>
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {organicOptions.map((opt) => {
                        const active = filters.isOrganic === opt.value;
                        return (
                          <button
                            key={opt.value || 'all'}
                            type="button"
                            onClick={() =>
                              handleFilterChange('isOrganic', opt.value)
                            }
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                              active
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Rating
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ratingOptions.map((opt) => {
                        const active = filters.minRating === opt.value;
                        return (
                          <button
                            key={opt.value || 'any'}
                            type="button"
                            onClick={() =>
                              handleFilterChange('minRating', opt.value)
                            }
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                              active
                                ? 'bg-amber-500 text-white border-amber-500'
                                : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Price (₹)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) =>
                          handleFilterChange('minPrice', e.target.value)
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          handleFilterChange('maxPrice', e.target.value)
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      clearFilters();
                      setShowFilters(false);
                    }}
                    className="w-full py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-slate-200/60 p-3 shadow-sm animate-pulse"
                  >
                    <div className="aspect-square bg-slate-200 rounded-lg mb-3" />
                    <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/60 py-12 px-6 text-center shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={28} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-black transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 gap-2">
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: prev.currentPage - 1,
                        }))
                      }
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {[...Array(pagination.totalPages)].map((_, i) => {
                        const page = i + 1;
                        const isActive = pagination.currentPage === page;
                        
                        // Show first, last, current, and adjacent pages
                        if (
                          page === 1 ||
                          page === pagination.totalPages ||
                          (page >= pagination.currentPage - 1 &&
                            page <= pagination.currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() =>
                                setPagination((prev) => ({
                                  ...prev,
                                  currentPage: page,
                                }))
                              }
                              className={`w-9 h-9 text-sm rounded-lg border transition-colors ${
                                isActive
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === pagination.currentPage - 2 ||
                          page === pagination.currentPage + 2
                        ) {
                          return (
                            <span
                              key={page}
                              className="w-9 h-9 flex items-center justify-center text-slate-400"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: prev.currentPage + 1,
                        }))
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;