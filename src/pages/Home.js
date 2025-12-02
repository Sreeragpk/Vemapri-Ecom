import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import heroImage from '../assets/Grocery.png';
import {
  ArrowRight,
  Truck,
  Shield,
  Headphones,
  CreditCard,
  Leaf,
} from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await api.get('/products?limit=8');
        setFeaturedProducts(res.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    {
      name: 'Pulses & Grains',
      description: 'Bengal gram, Bengal gram powder (Besan)',
      highlight: 'Daily staples for every kitchen',
      query: 'Pulses & Grains',
    },
    {
      name: 'Spices & Masalas',
      description: 'Chilli powder, Dhana seeds, Dry Ginger',
      highlight: 'Bold flavours, authentic taste',
      query: 'Spices & Masalas',
    },
    {
      name: 'Nuts & Seeds',
      description: 'Ground nuts',
      highlight: 'Wholesome crunch for snacks',
      query: 'Nuts & Seeds',
    },
    {
      name: 'Health & Organic Foods',
      description: 'Moringa powder',
      highlight: 'Clean, natural nutrition',
      query: 'Health & Organic Foods',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-emerald-50/40 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-lime-500 text-white">
        {/* Background overlay / pattern */}
        <div className="absolute inset-0">
              <img
                src={heroImage}
                alt="Fresh groceries"
                className="h-full w-full object-cover opacity-30 mix-blend-soft-light"
              />
         
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_60%)]" />
          <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-amber-300/25 blur-3xl" />
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-lime-300/25 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Hero Copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide uppercase backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                Fresh Grocery & Staples • Vemapri
              </div>
              <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Fresh groceries & staples,
                <span className="block text-amber-200">
                  delivered to your doorstep.
                </span>
              </h1>
              <p className="mt-4 text-base md:text-lg text-emerald-100 max-w-xl">
                From everyday pulses and grains to premium spices, nuts and
                health foods — get quality ingredients at the right price,
                without stepping out.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-emerald-700 shadow-md shadow-emerald-900/20 hover:bg-emerald-50 hover:shadow-lg transition-all"
                >
                  Shop Grocery & Staples
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  to="/products?category=Pulses%20%26%20Grains"
                  className="inline-flex items-center text-sm font-medium text-emerald-50 hover:text-amber-200/90"
                >
                  View Pulses &amp; Grains
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-xs text-emerald-50/90">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-800/40 px-3 py-1">
                  <Leaf size={14} />
                  Farm-fresh quality
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-800/40 px-3 py-1">
                  Same-day delivery (selected areas)
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-800/40 px-3 py-1">
                  Trusted local brand
                </span>
              </div>
            </div>

            {/* Hero Right: Highlight card */}
            <div className="md:pl-6">
              <div className="rounded-3xl bg-white/90 backdrop-blur shadow-2xl shadow-emerald-900/20 p-5 sm:p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-emerald-500 uppercase">
                      Today&apos;s Staples Picks
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      Stock up on your essentials
                    </h2>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center">
                    <Leaf className="text-white" size={22} />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-emerald-50 bg-emerald-50/70 px-3 py-3">
                    <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wide">
                      Pulses &amp; Grains
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      Bengal gram (Chana)
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Perfect for dal, curries & snacks.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-amber-50 bg-amber-50/70 px-3 py-3">
                    <p className="text-[11px] font-medium text-amber-600 uppercase tracking-wide">
                      Spices &amp; Masalas
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      Chilli &amp; Dhana powder
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Bold flavours, rich colour.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-50 bg-white px-3 py-3">
                    <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wide">
                      Nuts &amp; Seeds
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      Ground nuts
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Ideal for roasting &amp; chutneys.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-50 bg-white px-3 py-3">
                    <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wide">
                      Health &amp; Organic
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      Moringa powder
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Natural nutrition boost.
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Handpicked staples, Vemapri quality.</span>
                  <span className="font-medium text-emerald-600">
                    Starting from ₹49
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="text-emerald-600" size={30} />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-slate-900">
                Fast Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                Free delivery on orders above ₹1000.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-emerald-600" size={30} />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-slate-900">
                Quality Assured
              </h3>
              <p className="text-gray-600 text-sm">
                Carefully sourced, hygienically packed.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Headphones className="text-emerald-600" size={30} />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-slate-900">
                Dedicated Support
              </h3>
              <p className="text-gray-600 text-sm">
                Help with orders, substitutions & more.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-emerald-600" size={30} />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-slate-900">
                Secure Checkout
              </h3>
              <p className="text-gray-600 text-sm">
                Trusted payment gateways & easy refunds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-emerald-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Best Sellers in Grocery &amp; Staples
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Explore our most popular pulses, grains, spices, nuts and health
              foods picked by customers like you.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white shadow-sm p-4 animate-pulse"
                >
                  <div className="h-40 bg-emerald-100 rounded-xl mb-4" />
                  <div className="h-3 bg-emerald-100 rounded mb-2" />
                  <div className="h-3 bg-emerald-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/products" className="btn btn-primary">
              View All Grocery Products
              <ArrowRight className="ml-2 inline" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Quickly find what you need across staples, spices, nuts and
              health-focused products.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.query)}`}
                className="group rounded-2xl border border-emerald-50 bg-emerald-50/40 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-500 mb-2">
                    {category.highlight}
                  </p>
                  <h3 className="font-semibold text-lg text-slate-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {category.description}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center text-xs font-medium text-emerald-600 group-hover:text-emerald-700">
                  Browse {category.name}
                  <ArrowRight className="ml-1.5" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
