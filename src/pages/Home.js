import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import newImage from '../assets/newimg.webp';
import { 
  Truck, Shield, Leaf, CheckCircle2, ArrowRight, Sparkles, 
  Award, Star, Package, Heart, Zap,
  BadgeCheck, ShoppingBag, Clock, RefreshCw
} from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await api.get('/products?limit=8');
        const products = res.data?.data?.products || res.data?.products || [];
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
    setTimeout(() => setIsHeroVisible(true), 100);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (id) => (el) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="bg-gradient-to-b from-white via-slate-50/50 to-white overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION - Full Screen with Parallax
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] md:min-h-screen flex items-center overflow-hidden">
        {/* Background with Parallax */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 transition-transform duration-[20s] ease-out"
            style={{
              backgroundImage: `url(${newImage})`,
              transform: isHeroVisible ? 'scale(1)' : 'scale(1.1)',
            }}
          />
          {/* Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent" />
        </div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-amber-400/20 blur-sm animate-float"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${6 + i * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="max-w-4xl">
              {/* Premium Badge */}
              <div 
                className={`transform transition-all duration-700 ease-out ${
                  isHeroVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
              >
                <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-md shadow-2xl shadow-amber-500/30 border border-amber-400/30 mb-6 sm:mb-8">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    Vemapri • GUDIPATI PRODUCTS
                  </span>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-pulse" />
                </div>
              </div>

              {/* Main Heading */}
              <h1 
                className={`transform transition-all duration-1000 delay-150 ease-out ${
                  isHeroVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-12 opacity-0'
                }`}
              >
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.1] tracking-tight">
                  Natural Spices
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight mt-1 sm:mt-2">
                  <span className="text-white">for a </span>
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                      Healthier
                    </span>
             
                  </span>
                  <span className="text-white"> You</span>
                </span>
              </h1>

              {/* Subtext */}
              <p 
                className={`mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl transform transition-all duration-1000 delay-300 ease-out ${
                  isHeroVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-12 opacity-0'
                }`}
              >
                Premium quality spices, pulses and staples – carefully sourced from trusted farms, 
                hygienically packed, and delivered fresh to your doorstep.
              </p>

      

              {/* Trust Badges */}
              <div 
                className={`mt-10 sm:mt-12 flex flex-wrap items-center gap-4 sm:gap-6 transform transition-all duration-1000 delay-700 ease-out ${
                  isHeroVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-12 opacity-0'
                }`}
              >
                {[
                  { icon: BadgeCheck, text: '100% Natural', color: 'text-emerald-400' },
                  { icon: Star, text: 'Premium Quality', color: 'text-amber-400' },
                  { icon: Truck, text: 'Fast Delivery', color: 'text-blue-400' },
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 text-white/90"
                  >
                    <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
                    <span className="text-xs sm:text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className={`absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 transform transition-all duration-1000 delay-1000 ${
            isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors group"
          >
            <span className="text-xs font-medium tracking-wider uppercase">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-2 group-hover:border-amber-400 transition-colors">
              <div className="w-1 h-2 bg-current rounded-full animate-scroll group-hover:bg-amber-400" />
            </div>
          </button>
        </div>
      </section>

 

      {/* ═══════════════════════════════════════════════════════════════════
          WHAT WE OFFER - BENTO GRID
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="offers"
        ref={setRef('offers')}
        className="py-16 sm:py-20 lg:py-28 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div 
            className={`text-center mb-12 sm:mb-16 transform transition-all duration-700 ${
              visibleSections['offers'] 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 mb-4 sm:mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-amber-800 text-xs sm:text-sm font-semibold">Our Premium Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
              What We{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Offer
                </span>
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              From farm-fresh spices to wholesome staples, discover products that bring authentic flavors to your kitchen
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Large Featured Card - Spices */}
            <div 
              className={`lg:col-span-2 lg:row-span-2 transform transition-all duration-700 delay-100 ${
                visibleSections['offers'] 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-12 opacity-0'
              }`}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 p-[2px] sm:p-1">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700" />
                <div className="relative h-full bg-white rounded-[calc(1rem-2px)] sm:rounded-[22px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[350px] sm:min-h-[400px] lg:min-h-[480px] overflow-hidden">
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <span className="text-3xl sm:text-4xl lg:text-5xl">🌶️</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                      Whole & Ground Spices
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6 max-w-lg">
                      Authentic Indian spices sourced directly from trusted farms. From fiery red chillies to golden turmeric, bring the true essence of Indian cooking to your kitchen.
                    </p>
                    <ul className="grid grid-cols-2 gap-2 sm:gap-3">
                      {['Red Chilli Powder', 'Turmeric Powder', 'Coriander Seeds', 'Cumin Seeds', 'Garam Masala', 'Black Pepper'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-700 text-sm sm:text-base">
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative z-10 mt-6">
                    <Link 
                      to="/products?category=Spices%20%26%20Masalas"
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 group-hover:gap-4 transition-all duration-300"
                    >
                      Explore Spices
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-br from-orange-100 to-red-100 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-[80px] sm:text-[120px] lg:text-[160px] opacity-[0.08] group-hover:opacity-[0.15] transition-opacity select-none">
                    🌶️
                  </div>
                </div>
              </div>
            </div>

            {/* Medium Card - Pulses */}
            <div 
              className={`transform transition-all duration-700 delay-200 ${
                visibleSections['offers'] 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-12 opacity-0'
              }`}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-[2px] sm:p-1">
                <div className="relative h-full bg-white rounded-[calc(1rem-2px)] sm:rounded-[22px] p-5 sm:p-6 min-h-[200px] sm:min-h-[220px] flex flex-col justify-between overflow-hidden">
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl sm:text-3xl">🌾</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                      Pulses & Staples
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Everyday essentials like Bengal gram, besan flour, and more for your daily cooking.
                    </p>
                  </div>
                  <Link 
                    to="/products?category=Pulses%20%26%20Grains"
                    className="relative z-10 inline-flex items-center gap-2 text-amber-600 font-semibold text-sm mt-4 group-hover:gap-3 transition-all duration-300"
                  >
                    View Pulses <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <div className="absolute bottom-2 right-2 text-[60px] sm:text-[80px] opacity-[0.08] group-hover:opacity-[0.15] transition-opacity select-none">
                    🌾
                  </div>
                </div>
              </div>
            </div>

            {/* Medium Card - Health Foods */}
            <div 
              className={`transform transition-all duration-700 delay-300 ${
                visibleSections['offers'] 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-12 opacity-0'
              }`}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 p-[2px] sm:p-1">
                <div className="relative h-full bg-white rounded-[calc(1rem-2px)] sm:rounded-[22px] p-5 sm:p-6 min-h-[200px] sm:min-h-[220px] flex flex-col justify-between overflow-hidden">
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl sm:text-3xl">🥜</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                      Nuts & Health Foods
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Nutritious groundnuts, moringa powder, and other wholesome superfoods.
                    </p>
                  </div>
                  <Link 
                    to="/products?category=Health%20%26%20Organic%20Foods"
                    className="relative z-10 inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mt-4 group-hover:gap-3 transition-all duration-300"
                  >
                    View Health Foods <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <div className="absolute bottom-2 right-2 text-[60px] sm:text-[80px] opacity-[0.08] group-hover:opacity-[0.15] transition-opacity select-none">
                    🥜
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          WHY CHOOSE US
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="why-us"
        ref={setRef('why-us')}
        className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div 
            className={`text-center mb-12 sm:mb-16 transform transition-all duration-700 ${
              visibleSections['why-us'] 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-4">
              Why Vemapri
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Gudipati Products?
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Experience the difference with our commitment to quality and service
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Premium Quality',
                desc: 'Hand-picked ingredients, hygienically cleaned and carefully packed to preserve freshness and flavor.',
                color: 'emerald',
                gradient: 'from-emerald-500 to-teal-500',
              },
              {
                icon: Leaf,
                title: 'Fresh & Natural',
                desc: 'No artificial colors, preservatives, or additives – just pure, clean, and honest ingredients.',
                color: 'green',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: Truck,
                title: 'Reliable Delivery',
                desc: 'Carefully packed and shipped with care so products reach you in perfect condition, every time.',
                color: 'blue',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Clock,
                title: 'Fresh Stock Always',
                desc: 'We maintain fresh inventory with regular restocking to ensure you get the freshest products.',
                color: 'amber',
                gradient: 'from-amber-500 to-orange-500',
              },
              {
                icon: RefreshCw,
                title: 'Easy Returns',
                desc: 'Not satisfied? Our hassle-free return policy ensures your complete satisfaction with every purchase.',
                color: 'purple',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: Zap,
                title: 'Best Prices',
                desc: 'Direct sourcing from farms allows us to offer premium quality at competitive prices.',
                color: 'rose',
                gradient: 'from-rose-500 to-red-500',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`group relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-slate-300 transition-all duration-500 hover:-translate-y-1 overflow-hidden transform ${
                  visibleSections['why-us'] 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                
                <div className={`relative mb-4 sm:mb-5 inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-${item.color}-50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <item.icon className={`w-6 h-6 sm:w-7 sm:h-7 text-${item.color}-600`} />
                </div>
                
                <h3 className="relative text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">
                  {item.title}
                </h3>
                
                <p className="relative text-sm sm:text-base text-slate-600 leading-relaxed">
                  {item.desc}
                </p>

                {/* Corner Accent */}
                <div className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div 
            className={`mt-12 sm:mt-16 flex flex-wrap justify-center gap-3 sm:gap-4 transform transition-all duration-700 delay-300 ${
              visibleSections['why-us'] 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`}
          >
            {[
              { icon: Shield, text: 'Secure Payments' },
              { icon: BadgeCheck, text: 'Verified Quality' },
              { icon: Heart, text: 'Trusted Local Brand' },
            ].map((item, i) => (
              <div 
                key={i}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300"
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="products"
        ref={setRef('products')}
        className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white via-slate-50/50 to-slate-100"
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div 
            className={`flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-12 transform transition-all duration-700 ${
              visibleSections['products'] 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`}
          >
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wider uppercase mb-3">
                Our Collection
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-2 sm:mb-3">
                Featured{' '}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Products
                </span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl">
                Explore our curated selection of premium spices, pulses, and staples.
              </p>
            </div>
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-300"
            >
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-4 sm:p-5 animate-pulse"
                >
                  <div className="aspect-square bg-slate-100 rounded-xl sm:rounded-2xl mb-4" />
                  <div className="h-4 bg-slate-100 rounded-full mb-2 w-3/4" />
                  <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                  <div className="mt-4 h-10 bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 mb-6">
                <Package className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-700 mb-2">No products available</h3>
              <p className="text-slate-500 mb-6">Check back soon for our latest products!</p>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className={`transform transition-all duration-500 ${
                    visibleSections['products'] 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 75}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* View More CTA */}
          {!loading && featuredProducts.length > 0 && (
            <div className="mt-12 sm:mt-16 text-center">
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base sm:text-lg shadow-xl shadow-amber-200 hover:shadow-2xl hover:shadow-amber-300 hover:scale-105 active:scale-100 transition-all duration-300"
              >
                <span>Explore All Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 text-6xl opacity-20 animate-float">🌶️</div>
          <div className="absolute bottom-1/4 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>🌾</div>
          <div className="absolute top-1/2 right-1/4 text-5xl opacity-15 animate-float" style={{ animationDelay: '4s' }}>🥜</div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Experience <br className="hidden sm:block" />
            <span className="text-amber-100">Authentic Flavors?</span>
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Shop our premium collection of spices and staples. Fresh, natural, and delivered to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-orange-600 font-bold text-base sm:text-lg shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-100 transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Start Shopping</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 border-2 border-white/30 text-white font-bold text-base sm:text-lg backdrop-blur-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CUSTOM ANIMATIONS & STYLES
      ═══════════════════════════════════════════════════════════════════ */}
      <style>{`
        /* Smooth Scroll */
        html {
          scroll-behavior: smooth;
        }

        /* Custom Animations */
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes scroll {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(8px);
            opacity: 1;
          }
        }

        @keyframes draw {
          0% {
            stroke-dasharray: 0 200;
          }
          100% {
            stroke-dasharray: 200 0;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(251, 191, 36, 0.5);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }

        .animate-draw {
          animation: draw 1.5s ease-out forwards;
          animation-delay: 1s;
          stroke-dasharray: 0 200;
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        /* Responsive Text Sizing */
        @media (max-width: 640px) {
          .text-responsive-hero {
            font-size: clamp(2rem, 10vw, 3rem);
          }
        }

        /* Hide scrollbar but allow scrolling */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Smooth gradient text */
        .gradient-text {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Better focus states */
        *:focus-visible {
          outline: 2px solid #f59e0b;
          outline-offset: 2px;
        }

        /* Touch-friendly tap targets */
        @media (hover: none) {
          .touch-target {
            min-height: 44px;
            min-width: 44px;
          }
        }

        /* Reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Custom color classes for dynamic features */
        .bg-emerald-50 { background-color: rgb(236 253 245); }
        .bg-green-50 { background-color: rgb(240 253 244); }
        .bg-blue-50 { background-color: rgb(239 246 255); }
        .bg-amber-50 { background-color: rgb(255 251 235); }
        .bg-purple-50 { background-color: rgb(250 245 255); }
        .bg-rose-50 { background-color: rgb(255 241 242); }
        
        .text-emerald-600 { color: rgb(5 150 105); }
        .text-green-600 { color: rgb(22 163 74); }
        .text-blue-600 { color: rgb(37 99 235); }
        .text-amber-600 { color: rgb(217 119 6); }
        .text-purple-600 { color: rgb(147 51 234); }
        .text-rose-600 { color: rgb(225 29 72); }
      `}</style>
    </div>
  );
};

export default Home;
// // src/pages/Home.js
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../utils/api';
// import ProductCard from '../components/ProductCard';
// import newImage from '../assets/newimg.webp';
// import { Truck, Shield, Leaf, CheckCircle2, ArrowRight, Sparkles, Award } from 'lucide-react';

// const Home = () => {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isHeroVisible, setIsHeroVisible] = useState(false);

//   useEffect(() => {
//     const fetchFeaturedProducts = async () => {
//       try {
//         const res = await api.get('/products?limit=8');
        
//         // ✅ FIX: Handle both old and new API response formats
//         const products = res.data?.data?.products || res.data?.products || [];
//         setFeaturedProducts(products);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         setFeaturedProducts([]); // ✅ Set empty array on error
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedProducts();
    
//     // Trigger hero animation
//     setTimeout(() => setIsHeroVisible(true), 100);
//   }, []);

//   return (
//     <div className="bg-gradient-to-b from-white to-slate-50">
//       {/* PREMIUM HERO SECTION */}
//       <section className="relative min-h-[75vh] flex items-center overflow-hidden">
//         {/* Background Image with Parallax Effect */}
//         <div 
//           className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[8000ms] ease-out hover:scale-110"
//           style={{
//             backgroundImage: `url(${newImage})`,
//           }}
//         />
        
//         {/* Premium Gradient Overlay */}
//         <div className="absolute inset-0 bg-black/45" />
        
//         {/* Animated Accent Gradient */}
//         <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/20 via-transparent to-transparent opacity-0 animate-fadeIn" 
//           style={{ animationDelay: '500ms', animationFillMode: 'forwards' }} 
//         />

//         {/* Floating Particles Effect */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-float" style={{ animationDelay: '0s' }} />
//           <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-amber-300/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
//           <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-amber-500/25 rounded-full animate-float" style={{ animationDelay: '4s' }} />
//         </div>

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full z-10">
//           <div className="max-w-3xl">
//             {/* Premium Animated Badge - HIGHLIGHTED */}
//             <div 
//               className={`inline-block mb-6 transform transition-all duration-700 ${
//                 isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
//               }`}
//             >
//               <div className="relative group">
//                 {/* Glow effect behind badge */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-full blur-xl opacity-60 group-hover:opacity-80 animate-pulse transition-opacity" />
                
//                 {/* Main badge */}
//                 <div className="relative flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 border-2 border-amber-300/50 shadow-2xl shadow-amber-500/50 backdrop-blur-sm">
//                   <Award className="w-5 h-5 text-slate-900 animate-pulse" />
                  
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-bold text-slate-900">
//                       Vemapri
//                     </span>
//                     <span className="text-slate-800 font-medium">•</span>
//                     <span className="text-sm font-extrabold text-slate-900 tracking-wide animate-shimmer bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent bg-[length:200%_100%]">
//                       GUDIPATI PRODUCTS
//                     </span>
//                   </div>
                  
//                   <Sparkles className="w-4 h-4 text-slate-900 animate-spin-slow" />
//                 </div>

//                 {/* Decorative corner accents */}
//                 <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white/40 rounded-tl-lg" />
//                 <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br-lg" />
//               </div>
//             </div>

//             {/* Animated Main Heading */}
//             <h1 
//               className={`text-5xl md:text-7xl font-bold text-white leading-tight transform transition-all duration-1000 delay-200 ${
//                 isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
//               }`}
//             >
//               <span className="block bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
//                 Natural spices
//               </span>
//               <span className="block mt-2">
//                 for a{' '}
//                 <span className="relative inline-block">
//                   <span className="relative z-10 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent font-extrabold">
//                     healthier
//                   </span>
//                   <span className="absolute bottom-2 left-0 w-full h-3 bg-amber-500/30 -rotate-1 blur-sm" />
//                 </span>
//                 {' '}you.
//               </span>
//             </h1>

//             {/* Animated Subtext */}
//             <p 
//               className={`mt-6 text-base md:text-lg text-slate-200 leading-relaxed max-w-2xl transform transition-all duration-1000 delay-400 ${
//                 isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
//               }`}
//             >
//               Premium quality spices, pulses and staples – carefully sourced, 
//               hygienically packed, and delivered fresh to your doorstep.
//             </p>

//             {/* Animated CTA Buttons */}
//             <div 
//               className={`mt-10 flex flex-wrap gap-4 transform transition-all duration-1000 delay-600 ${
//                 isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
//               }`}
//             >
//               <Link
//                 to="/products"
//                 className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
//               >
//                 Shop All Products
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </Link>
              
//               <Link
//                 to="/products?category=Spices%20%26%20Masalas"
//                 className="group inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300"
//               >
//                 Browse Spices
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </Link>
//             </div>

//             {/* Trust Indicators */}
//             <div 
//               className={`mt-12 flex flex-wrap items-center gap-6 text-sm text-white/80 transform transition-all duration-1000 delay-800 ${
//                 isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="w-5 h-5 text-emerald-400" />
//                 <span className="font-medium">100% Natural</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="w-5 h-5 text-emerald-400" />
//                 <span className="font-medium">Premium Quality</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="w-5 h-5 text-emerald-400" />
//                 <span className="font-medium">Fast Delivery</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Scroll Indicator */}
//         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
//           <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
//             <div className="w-1 h-3 bg-white/50 rounded-full animate-scroll" />
//           </div>
//         </div>
//       </section>

//       {/* WHAT WE OFFER - BENTO GRID */}
//       <section className="py-20 bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 mb-6">
//               <span className="relative flex h-2 w-2">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
//               </span>
//               <span className="text-amber-800 text-sm font-semibold">Our Premium Collection</span>
//             </div>
//             <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
//               What We <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Offer</span>
//             </h2>
//             <p className="text-lg text-slate-600 max-w-2xl mx-auto">
//               From farm-fresh spices to wholesome staples, discover products that bring authentic flavors to your kitchen
//             </p>
//           </div>

//           {/* Bento Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Large Featured Card */}
//             <div className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 p-1">
//               <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
//               <div className="relative h-full bg-white rounded-[22px] p-8 flex flex-col justify-between min-h-[400px]">
//                 <div>
//                   <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
//                     <span className="text-4xl">🌶️</span>
//                   </div>
//                   <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
//                     Whole & Ground Spices
//                   </h3>
//                   <p className="text-slate-600 text-lg leading-relaxed mb-6">
//                     Authentic Indian spices sourced directly from trusted farms. From fiery red chillies to golden turmeric, our spices bring the true essence of Indian cooking to your kitchen.
//                   </p>
//                   <ul className="space-y-3">
//                     {['Red Chilli Powder', 'Turmeric Powder', 'Coriander Seeds', 'Cumin Seeds'].map((item, i) => (
//                       <li key={i} className="flex items-center gap-3 text-slate-700">
//                         <CheckCircle2 className="w-5 h-5 text-orange-500" />
//                         <span>{item}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="mt-6">
//                   <Link 
//                     to="/products?category=Spices%20%26%20Masalas"
//                     className="inline-flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-4 transition-all duration-300"
//                   >
//                     Explore Spices
//                     <ArrowRight className="w-5 h-5" />
//                   </Link>
//                 </div>
                
//                 {/* Decorative Elements */}
//                 <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full blur-3xl opacity-50" />
//                 <div className="absolute bottom-4 right-4 text-8xl opacity-10 group-hover:opacity-20 transition-opacity">
//                   🌶️
//                 </div>
//               </div>
//             </div>

//             {/* Medium Card - Pulses */}
//             <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-1">
//               <div className="relative h-full bg-white rounded-[22px] p-6 min-h-[200px] flex flex-col justify-between">
//                 <div>
//                   <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 mb-4 group-hover:scale-110 transition-transform duration-300">
//                     <span className="text-3xl">🌾</span>
//                   </div>
//                   <h3 className="text-xl font-bold text-slate-900 mb-2">
//                     Pulses & Staples
//                   </h3>
//                   <p className="text-slate-600 text-sm leading-relaxed">
//                     Everyday essentials like Bengal gram, besan flour, and more for your daily cooking needs.
//                   </p>
//                 </div>
//                 <Link 
//                   to="/products?category=Pulses%20%26%20Grains"
//                   className="inline-flex items-center gap-2 text-amber-600 font-semibold text-sm mt-4 group-hover:gap-3 transition-all duration-300"
//                 >
//                   View Pulses <ArrowRight className="w-4 h-4" />
//                 </Link>
                
//                 <div className="absolute bottom-2 right-2 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
//                   🌾
//                 </div>
//               </div>
//             </div>

//             {/* Medium Card - Health Foods */}
//             <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 p-1">
//               <div className="relative h-full bg-white rounded-[22px] p-6 min-h-[200px] flex flex-col justify-between">
//                 <div>
//                   <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 mb-4 group-hover:scale-110 transition-transform duration-300">
//                     <span className="text-3xl">🥜</span>
//                   </div>
//                   <h3 className="text-xl font-bold text-slate-900 mb-2">
//                     Nuts & Health Foods
//                   </h3>
//                   <p className="text-slate-600 text-sm leading-relaxed">
//                     Nutritious groundnuts, moringa powder, and other wholesome superfoods.
//                   </p>
//                 </div>
//                 <Link 
//                   to="/products?category=Health%20%26%20Organic%20Foods"
//                   className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mt-4 group-hover:gap-3 transition-all duration-300"
//                 >
//                   View Health Foods <ArrowRight className="w-4 h-4" />
//                 </Link>
                
//                 <div className="absolute bottom-2 right-2 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
//                   🥜
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* WHY CHOOSE US */}
//       <section className="py-16 bg-gradient-to-b from-white to-slate-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-4">
//               Why Vemapri
//             </span>
//             <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
//               Why Choose Gudipati Products?
//             </h2>
//             <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
//               Experience the difference with our commitment to quality and service
//             </p>
//           </div>

//           <div className="grid gap-8 md:grid-cols-3">
//             {[
//               {
//                 icon: Shield,
//                 title: 'Premium Quality',
//                 desc: 'Hand-picked ingredients, hygienically cleaned and packed.',
//                 bgColor: 'bg-emerald-50',
//                 iconColor: 'text-emerald-600'
//               },
//               {
//                 icon: Leaf,
//                 title: 'Fresh & Natural',
//                 desc: 'No unnecessary additives – just clean, honest ingredients.',
//                 bgColor: 'bg-green-50',
//                 iconColor: 'text-green-600'
//               },
//               {
//                 icon: Truck,
//                 title: 'Reliable Delivery',
//                 desc: 'Carefully packed and shipped so products reach you in perfect condition.',
//                 bgColor: 'bg-blue-50',
//                 iconColor: 'text-blue-600'
//               }
//             ].map((item, index) => (
//               <div
//                 key={index}
//                 className="group relative flex flex-col items-center text-center rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
//               >
//                 <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${item.bgColor} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
//                   <item.icon className={`h-8 w-8 ${item.iconColor}`} />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-900 mb-3">
//                   {item.title}
//                 </h3>
//                 <p className="text-sm text-slate-600 leading-relaxed">
//                   {item.desc}
//                 </p>

//                 <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//               </div>
//             ))}
//           </div>

//           <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-600">
//             {[
//               'Easy Returns',
//               'Secure Payments',
//               'Trusted Local Brand'
//             ].map((text, i) => (
//               <span 
//                 key={i}
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-300"
//               >
//                 <CheckCircle2 className="h-5 w-5 text-emerald-600" />
//                 <span className="font-medium">{text}</span>
//               </span>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FEATURED PRODUCTS */}
//       <section className="py-20 bg-slate-50 border-t border-slate-200">
//         <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
//             <div>
//               <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wider uppercase mb-3">
//                 Our Collection
//               </span>
//               <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
//                 All Products
//               </h2>
//               <p className="mt-2 text-slate-600">
//                 Explore our full range of spices, pulses and staples.
//               </p>
//             </div>
//             <Link
//               to="/products"
//               className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
//             >
//               View All Products
//               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>

//           {loading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {[...Array(8)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="rounded-2xl bg-white border border-slate-200 p-4 animate-pulse"
//                 >
//                   <div className="h-48 bg-slate-100 rounded-xl mb-4" />
//                   <div className="h-4 bg-slate-100 rounded mb-2" />
//                   <div className="h-4 w-2/3 bg-slate-100 rounded" />
//                 </div>
//               ))}
//             </div>
//           ) : featuredProducts.length === 0 ? (
//             // ✅ Empty state
//             <div className="text-center py-16">
//               <div className="text-6xl mb-4">🛒</div>
//               <h3 className="text-xl font-semibold text-slate-700 mb-2">No products available</h3>
//               <p className="text-slate-500">Check back soon for our latest products!</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {featuredProducts.map((product, index) => (
//                 <div
//                   key={product._id}
//                   className="animate-fadeInUp"
//                   style={{
//                     animationDelay: `${index * 0.1}s`,
//                     animationFillMode: 'both'
//                   }}
//                 >
//                   <ProductCard product={product} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Animations CSS */}
//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes scaleIn {
//           from {
//             opacity: 0;
//             transform: scale(0.9);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }

//         @keyframes shimmer {
//           0%, 100% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//         }

//         @keyframes float {
//           0%, 100% {
//             transform: translateY(0) translateX(0);
//           }
//           33% {
//             transform: translateY(-20px) translateX(10px);
//           }
//           66% {
//             transform: translateY(10px) translateX(-10px);
//           }
//         }

//         @keyframes scroll {
//           0% {
//             transform: translateY(0);
//             opacity: 0;
//           }
//           40% {
//             opacity: 1;
//           }
//           80% {
//             transform: translateY(20px);
//             opacity: 0;
//           }
//           100% {
//             opacity: 0;
//           }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.6s ease-out forwards;
//         }

//         .animate-fadeInUp {
//           animation: fadeInUp 0.6s ease-out forwards;
//         }

//         .animate-shimmer {
//           animation: shimmer 3s ease-in-out infinite;
//         }

//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }

//         .animate-scroll {
//           animation: scroll 2s ease-in-out infinite;
//         }

//         .animate-spin-slow {
//           animation: spin 8s linear infinite;
//         }

//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Home;