// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../utils/api';
// import ProductCard from '../components/ProductCard';
// import newImage from '../assets/newimg.webp'; // change extension if needed
// import { Truck, Shield, Leaf, CheckCircle2 } from 'lucide-react';

// const Home = () => {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFeaturedProducts = async () => {
//       try {
//         const res = await api.get('/products?limit=8');
//         setFeaturedProducts(res.data.products);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedProducts();
//   }, []);

//   return (
//     <div className="bg-white">
//       {/* HERO */}
//       <section
//         className="relative min-h-[60vh] flex items-center"
//         style={{
//           backgroundImage: `url(${newImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         {/* overlay */}
//         <div className="absolute inset-0 bg-black/45" />

//         <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
//           <div className="max-w-xl">
//             <p className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">
//               Vemapri • Natural Spices & Staples
//             </p>
//             <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white leading-tight">
//               Natural spices for
//               <span className="block">a healthier you.</span>
//             </h1>
//             <p className="mt-4 text-sm md:text-base text-gray-100">
//               Carefully sourced spices, pulses and staples – packed fresh and
//               delivered with care.
//             </p>

//             <div className="mt-8 flex flex-wrap gap-4">
//               <Link
//                 to="/products"
//                 className="inline-flex items-center justify-center rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow hover:bg-gray-100 transition"
//               >
//                 Shop all products
//               </Link>
//               <Link
//                 to="/products?category=Spices%20%26%20Masalas"
//                 className="inline-flex items-center text-sm font-medium text-white/90 hover:text-white"
//               >
//                 Browse spices
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* WHAT WE OFFER */}
//       <section className="py-12 border-b border-gray-100">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
//             What we offer
//           </h2>

//           <div className="grid gap-6 md:grid-cols-3">
//             <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
//               <h3 className="text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
//                 Whole & Ground Spices
//               </h3>
//               <p className="mt-2 text-sm text-gray-700">
//                 Authentic Indian spices like chilli, dhania, turmeric and more.
//               </p>
//             </div>

//             <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
//               <h3 className="text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
//                 Pulses & Staples
//               </h3>
//               <p className="mt-2 text-sm text-gray-700">
//                 Everyday essentials such as Bengal gram and Bengal gram flour
//                 (besan).
//               </p>
//             </div>

//             <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
//               <h3 className="text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
//                 Nuts, Seeds & Health Foods
//               </h3>
//               <p className="mt-2 text-sm text-gray-700">
//                 Groundnuts, moringa powder and other wholesome ingredients for
//                 healthier cooking.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* WHY CHOOSE US */}
//       <section className="py-12">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
//             Why choose Vemapri?
//           </h2>

//           <div className="grid gap-6 md:grid-cols-3">
//             <div className="flex flex-col items-center text-center rounded-lg border border-gray-100 bg-gray-50 p-6">
//               <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
//                 <Shield className="h-6 w-6 text-emerald-600" />
//               </div>
//               <h3 className="text-base font-semibold text-gray-900">
//                 Premium Quality
//               </h3>
//               <p className="mt-2 text-sm text-gray-600">
//                 Hand-picked ingredients, hygienically cleaned and packed.
//               </p>
//             </div>

//             <div className="flex flex-col items-center text-center rounded-lg border border-gray-100 bg-gray-50 p-6">
//               <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
//                 <Leaf className="h-6 w-6 text-emerald-600" />
//               </div>
//               <h3 className="text-base font-semibold text-gray-900">
//                 Fresh & Natural
//               </h3>
//               <p className="mt-2 text-sm text-gray-600">
//                 No unnecessary additives – just clean, honest ingredients.
//               </p>
//             </div>

//             <div className="flex flex-col items-center text-center rounded-lg border border-gray-100 bg-gray-50 p-6">
//               <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
//                 <Truck className="h-6 w-6 text-emerald-600" />
//               </div>
//               <h3 className="text-base font-semibold text-gray-900">
//                 Reliable Delivery
//               </h3>
//               <p className="mt-2 text-sm text-gray-600">
//                 Carefully packed and shipped so products reach you in good
//                 condition.
//               </p>
//             </div>
//           </div>

//           <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
//             <span className="inline-flex items-center gap-2">
//               <CheckCircle2 className="h-4 w-4 text-emerald-600" />
//               Easy returns
//             </span>
//             <span className="inline-flex items-center gap-2">
//               <CheckCircle2 className="h-4 w-4 text-emerald-600" />
//               Secure payments
//             </span>
//             <span className="inline-flex items-center gap-2">
//               <CheckCircle2 className="h-4 w-4 text-emerald-600" />
//               Trusted local brand
//             </span>
//           </div>
//         </div>
//       </section>

//       {/* FEATURED PRODUCTS */}
//       <section className="py-14 bg-gray-50 border-t border-gray-100">
//         <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
//                 All Products
//               </h2>
//               <p className="mt-1 text-sm text-gray-600">
//                 Explore our full range of spices, pulses and staples.
//               </p>
//             </div>
//             <Link
//               to="/products"
//               className="hidden sm:inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-800"
//             >
//               View all
//             </Link>
//           </div>

//           {loading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {[...Array(8)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="rounded-lg bg-white border border-gray-100 p-4 animate-pulse"
//                 >
//                   <div className="h-40 bg-gray-100 rounded mb-4" />
//                   <div className="h-3 bg-gray-100 rounded mb-2" />
//                   <div className="h-3 w-2/3 bg-gray-100 rounded" />
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {featuredProducts.map((product) => (
//                 <ProductCard key={product._id} product={product} />
//               ))}
//             </div>
//           )}

//           <div className="mt-8 text-center sm:hidden">
//             <Link
//               to="/products"
//               className="inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-800"
//             >
//               View all products
//             </Link>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import newImage from '../assets/newimg.webp';
import { Truck, Shield, Leaf, CheckCircle2, ArrowRight, Sparkles, Award } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHeroVisible, setIsHeroVisible] = useState(false);

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
    
    // Trigger hero animation
    setTimeout(() => setIsHeroVisible(true), 100);
  }, []);

  return (
    <div className="bg-gradient-to-b from-white to-slate-50">
      {/* PREMIUM HERO SECTION */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[8000ms] ease-out hover:scale-110"
          style={{
            backgroundImage: `url(${newImage})`,
          }}
        />
        
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-black/45" />
        
        {/* Animated Accent Gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/20 via-transparent to-transparent opacity-0 animate-fadeIn" 
          style={{ animationDelay: '500ms', animationFillMode: 'forwards' }} 
        />

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-amber-300/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-amber-500/25 rounded-full animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full z-10">
          <div className="max-w-3xl">
            {/* Premium Animated Badge - HIGHLIGHTED */}
            <div 
              className={`inline-block mb-6 transform transition-all duration-700 ${
                isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <div className="relative group">
                {/* Glow effect behind badge */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-full blur-xl opacity-60 group-hover:opacity-80 animate-pulse transition-opacity" />
                
                {/* Main badge */}
                <div className="relative flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 border-2 border-amber-300/50 shadow-2xl shadow-amber-500/50 backdrop-blur-sm">
                  <Award className="w-5 h-5 text-slate-900 animate-pulse" />
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      Vemapri
                    </span>
                    <span className="text-slate-800 font-medium">•</span>
                    <span className="text-sm font-extrabold text-slate-900 tracking-wide animate-shimmer bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent bg-[length:200%_100%]">
                      GUDIPATI PRODUCTS
                    </span>
                  </div>
                  
                  <Sparkles className="w-4 h-4 text-slate-900 animate-spin-slow" />
                </div>

                {/* Decorative corner accents */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white/40 rounded-tl-lg" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br-lg" />
              </div>
            </div>

            {/* Alternative: Even More Prominent Version */}
            {/* <div 
              className={`mb-8 transform transition-all duration-700 ${
                isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl blur-2xl opacity-50 animate-pulse" />
                
                <div className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-1 rounded-2xl shadow-2xl">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl px-8 py-5">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-amber-400 animate-pulse" />
                      <div>
                        <div className="text-[10px] font-bold tracking-[0.3em] text-amber-400 uppercase mb-1">
                          Vemapri Presents
                        </div>
                        <div className="text-2xl font-black bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                          GUDIPATI PRODUCTS
                        </div>
                      </div>
                      <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Animated Main Heading */}
            <h1 
              className={`text-5xl md:text-7xl font-bold text-white leading-tight transform transition-all duration-1000 delay-200 ${
                isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <span className="block bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                Natural spices
              </span>
              <span className="block mt-2">
                for a{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent font-extrabold">
                    healthier
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-amber-500/30 -rotate-1 blur-sm" />
                </span>
                {' '}you.
              </span>
            </h1>

            {/* Animated Subtext */}
            <p 
              className={`mt-6 text-base md:text-lg text-slate-200 leading-relaxed max-w-2xl transform transition-all duration-1000 delay-400 ${
                isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              Premium quality spices, pulses and staples – carefully sourced, 
              hygienically packed, and delivered fresh to your doorstep.
            </p>

            {/* Animated CTA Buttons */}
            <div 
              className={`mt-10 flex flex-wrap gap-4 transform transition-all duration-1000 delay-600 ${
                isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
              >
                Shop All Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/products?category=Spices%20%26%20Masalas"
                className="group inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300"
              >
                Browse Spices
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div 
              className={`mt-12 flex flex-wrap items-center gap-6 text-sm text-white/80 transform transition-all duration-1000 delay-800 ${
                isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">100% Natural</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      
      {/* WHAT WE OFFER */}
      {/* WHAT WE OFFER - BENTO GRID */}
<section className="py-20 bg-white border-b border-slate-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span className="text-amber-800 text-sm font-semibold">Our Premium Collection</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
        What We <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Offer</span>
      </h2>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto">
        From farm-fresh spices to wholesome staples, discover products that bring authentic flavors to your kitchen
      </p>
    </div>

    {/* Bento Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Large Featured Card */}
      <div className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 p-1">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
        <div className="relative h-full bg-white rounded-[22px] p-8 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <span className="text-4xl">🌶️</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Whole & Ground Spices
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Authentic Indian spices sourced directly from trusted farms. From fiery red chillies to golden turmeric, our spices bring the true essence of Indian cooking to your kitchen.
            </p>
            <ul className="space-y-3">
              {['Red Chilli Powder', 'Turmeric Powder', 'Coriander Seeds', 'Cumin Seeds'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <Link 
              to="/products?category=Spices%20%26%20Masalas"
              className="inline-flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-4 transition-all duration-300"
            >
              Explore Spices
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-4 right-4 text-8xl opacity-10 group-hover:opacity-20 transition-opacity">
            🌶️
          </div>
        </div>
      </div>

      {/* Medium Card - Pulses */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-1">
        <div className="relative h-full bg-white rounded-[22px] p-6 min-h-[200px] flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🌾</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Pulses & Staples
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Everyday essentials like Bengal gram, besan flour, and more for your daily cooking needs.
            </p>
          </div>
          <Link 
            to="/products?category=Pulses"
            className="inline-flex items-center gap-2 text-amber-600 font-semibold text-sm mt-4 group-hover:gap-3 transition-all duration-300"
          >
            View Pulses <ArrowRight className="w-4 h-4" />
          </Link>
          
          <div className="absolute bottom-2 right-2 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
            🌾
          </div>
        </div>
      </div>

      {/* Medium Card - Health Foods */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 p-1">
        <div className="relative h-full bg-white rounded-[22px] p-6 min-h-[200px] flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🥜</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Nuts & Health Foods
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Nutritious groundnuts, moringa powder, and other wholesome superfoods.
            </p>
          </div>
          <Link 
            to="/products?category=Health"
            className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mt-4 group-hover:gap-3 transition-all duration-300"
          >
            View Health Foods <ArrowRight className="w-4 h-4" />
          </Link>
          
          <div className="absolute bottom-2 right-2 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
            🥜
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-4">
              Why Vemapri
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Why Choose Gudipati Products?
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Experience the difference with our commitment to quality and service
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Premium Quality',
                desc: 'Hand-picked ingredients, hygienically cleaned and packed.',
                color: 'emerald'
              },
              {
                icon: Leaf,
                title: 'Fresh & Natural',
                desc: 'No unnecessary additives – just clean, honest ingredients.',
                color: 'green'
              },
              {
                icon: Truck,
                title: 'Reliable Delivery',
                desc: 'Carefully packed and shipped so products reach you in perfect condition.',
                color: 'blue'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-center text-center rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{
                  animation: `scaleIn 0.6s ease-out ${index * 0.15}s both`
                }}
              >
                <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <item.icon className={`h-8 w-8 text-${item.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>

                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-600">
            {[
              'Easy Returns',
              'Secure Payments',
              'Trusted Local Brand'
            ].map((text, i) => (
              <span 
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-300"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="font-medium">{text}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wider uppercase mb-3">
                Our Collection
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                All Products
              </h2>
              <p className="mt-2 text-slate-600">
                Explore our full range of spices, pulses and staples.
              </p>
            </div>
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-slate-200 p-4 animate-pulse"
                >
                  <div className="h-48 bg-slate-100 rounded-xl mb-4" />
                  <div className="h-4 bg-slate-100 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div
                  key={product._id}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
        }

        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          80% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;