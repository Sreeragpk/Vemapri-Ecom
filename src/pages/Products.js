import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Filter, Search } from 'lucide-react';

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

  // Grocery-specific categories and brands
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

  // Keep URL query params in sync with filters + page
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/60 to-white">
      <div className="max-w-[107rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <p className="inline-flex items-center text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" />
              Grocery &amp; Staples
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Shop essential groceries
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {pagination.totalProducts} products found • Page{' '}
              {pagination.currentPage} of {pagination.totalPages}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        {/* Active filters chips (left aligned, subtle) */}
        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {activeFilterChips.map((chip) => (
              <button
                key={chip.key}
                onClick={() => removeChip(chip.key)}
                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800 ring-1 ring-slate-200 hover:bg-slate-200 transition-colors"
              >
                <span>{chip.label}</span>
                <span className="ml-2 text-slate-500 text-sm leading-none">
                  ×
                </span>
              </button>
            ))}
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Filters Sidebar (left) */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-20 p-4 sm:p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Filter size={18} className="text-slate-600" />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Reset
                </button>
              </div>

              {/* Search */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Search
                </label>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange('search', e.target.value)
                    }
                    placeholder="Search products..."
                    className="input pr-10 text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <Search size={18} />
                  </button>
                </form>
              </div>

              <div className="h-px bg-slate-100 my-3" />

              {/* Category */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange('category', e.target.value)
                  }
                  className="input text-sm"
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="input text-sm"
                >
                  <option value="">All brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Organic */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Type
                </label>
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isOrganic"
                      value=""
                      checked={filters.isOrganic === ''}
                      onChange={(e) =>
                        handleFilterChange('isOrganic', e.target.value)
                      }
                      className="h-4 w-4 text-slate-900 border-slate-300"
                    />
                    <span className="ml-2 text-slate-700">All</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isOrganic"
                      value="true"
                      checked={filters.isOrganic === 'true'}
                      onChange={(e) =>
                        handleFilterChange('isOrganic', e.target.value)
                      }
                      className="h-4 w-4 text-slate-900 border-slate-300"
                    />
                    <span className="ml-2 text-slate-700">Organic only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isOrganic"
                      value="false"
                      checked={filters.isOrganic === 'false'}
                      onChange={(e) =>
                        handleFilterChange('isOrganic', e.target.value)
                      }
                      className="h-4 w-4 text-slate-900 border-slate-300"
                    />
                    <span className="ml-2 text-slate-700">Non-organic</span>
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Minimum rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) =>
                    handleFilterChange('minRating', e.target.value)
                  }
                  className="input text-sm"
                >
                  <option value="">Any rating</option>
                  <option value="3">3★ &amp; above</option>
                  <option value="4">4★ &amp; above</option>
                  <option value="4.5">4.5★ &amp; above</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Price range (₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange('minPrice', e.target.value)
                    }
                    className="input text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange('maxPrice', e.target.value)
                    }
                    className="input text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid + Sort (right) */}
          <div className="md:col-span-3">
            {/* Sort row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
              <p className="text-xs sm:text-sm text-slate-500">
                Showing page {pagination.currentPage} of{' '}
                {pagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-xs sm:text-sm font-medium text-slate-700">
                  Sort by:
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="input py-1 text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm animate-pulse"
                  >
                    <div className="h-48 bg-slate-200 rounded-xl mb-4" />
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-10 px-6 text-left shadow-sm">
                <p className="text-slate-700 text-base mb-2">
                  No products match your filters
                </p>
                <p className="text-xs text-slate-500 mb-4 max-w-md">
                  Try adjusting the filters or clearing them to see more items.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {/* Bigger-feeling cards by reducing columns on large screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8 flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: prev.currentPage - 1,
                        }))
                      }
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-2 text-xs sm:text-sm rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const page = i + 1;
                      const isActive = pagination.currentPage === page;
                      return (
                        <button
                          key={page}
                          onClick={() =>
                            setPagination((prev) => ({
                              ...prev,
                              currentPage: page,
                            }))
                          }
                          className={`px-3 py-2 text-xs sm:text-sm rounded-full border transition-colors ${
                            isActive
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: prev.currentPage + 1,
                        }))
                      }
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-2 text-xs sm:text-sm rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
