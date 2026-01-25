import React from 'react';
import { 
  Heart, 
  Award, 
  Users, 
  Leaf, 
  ShoppingBag, 
  Target,
  CheckCircle,
  TrendingUp,
  Shield,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Mail,
  Package,
  Truck,
  Star,
  Zap,
  Sunrise
} from 'lucide-react';
import adminProductsImage from '../assets/adminproducts.webp';

const About = () => {
  const stats = [
    {
      icon: Users,
      value: '50+',
      label: 'Happy Customers',
      color: 'blue'
    },
    {
      icon: ShoppingBag,
      value: '100+',
      label: 'Orders Delivered',
      color: 'emerald'
    },
    {
      icon: Package,
      value: '7+',
      label: 'Quality Products',
      color: 'amber'
    },
    {
      icon: Star,
      value: '4.5/5',
      label: 'Customer Rating',
      color: 'violet'
    }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Every product is carefully sourced from trusted local suppliers. We personally verify quality to ensure you get only the best.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'As a new brand, we\'re building our reputation on exceptional service. Your feedback helps us grow and serve you better every day.'
    },
    {
      icon: Leaf,
      title: 'Supporting Local',
      description: 'We partner with local farmers and suppliers in Karnataka, ensuring fresh products while supporting our local economy.'
    },
    {
      icon: Award,
      title: 'Trust & Transparency',
      description: 'Fair pricing, honest product information, and genuine service. We\'re building lasting relationships, not just transactions.'
    }
  ];

  const milestones = [
    {
      year: '2025',
      month: 'June',
      title: 'The Dream Begins',
      description: 'Vemapri was founded with a vision to bring authentic, quality groceries to Bengaluru households at honest prices.'
    },
    {
      year: '2025',
      month: 'September',
      title: 'First Deliveries',
      description: 'Started operations in Electronic City area with our initial product range of essential spices, pulses, and grains.'
    },
    {
      year: '2025',
      month: 'October',
      title: 'Growing Trust',
      description: 'Reached 50+ regular customers and expanded our product range based on customer feedback and demand.'
    },
    {
      year: '2025',
      month: 'November',
      title: 'Community Building',
      description: 'Established partnerships with local farmers and introduced organic product line to serve health-conscious customers.'
    },
    {
      year: '2025',
      month: 'December',
      title: 'Expanding Reach',
      description: 'Now serving 100+ customers across Bengaluru with same-day delivery and a growing product catalog.'
    }
  ];

  const team = [
    {
      name: 'Fresh & Local',
      role: 'Our Promise',
      description: 'We source products locally whenever possible, ensuring freshness and supporting our community.',
      icon: Leaf
    },
    {
      name: 'Personal Touch',
      role: 'Family Business',
      description: 'As a small local business, we treat every customer like family and every order with personal care.',
      icon: Heart
    },
    {
      name: 'Quick Delivery',
      role: 'Fast Service',
      description: 'Being local means faster delivery. We understand the urgency of your grocery needs.',
      icon: Truck
    }
  ];

  const features = [
    'Locally sourced, fresh products with quality guarantee',
    'Small batch processing ensures freshness',
    'Direct partnerships with Karnataka farmers',
    'Same-day delivery in Electronic City and nearby areas',
    'No minimum order value - order what you need',
    'Competitive pricing with transparent billing',
    'Personal customer service - talk to real people',
    'Eco-friendly, minimal packaging',
    'Products tested and approved by our own families',
    'Easy returns within 7 days for unopened items',
    'Building relationships, not just selling products',
    'Growing product range based on your requests'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section with Image */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={adminProductsImage} 
            alt="Vemapri Products" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm mb-8">
              <Sunrise size={16} className="text-emerald-400" />
              <span className="text-sm font-semibold uppercase tracking-wider text-emerald-200">
                New Local Brand • Established 2025,
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Neighborhood
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Grocery Partner
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto">
              We're a fresh new local brand from Bengaluru, bringing you quality groceries and staples 
              with the personal touch and care of a family-run business. Just getting started, growing with you!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors shadow-xl"
              >
                <ShoppingBag size={20} />
                Explore Our Products
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <Phone size={20} />
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="-mt-16 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all p-6 text-center group"
                >
                  <div className={`w-14 h-14 bg-${stat.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`text-${stat.color}-600`} size={28} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* New Brand Badge */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4">
              <Zap className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Fresh. New. Local.
            </h3>
            <p className="text-slate-700 max-w-3xl mx-auto text-lg">
              We're excited to introduce Vemapri to Bengaluru! As a newly established local brand, 
              we're on a mission to redefine grocery shopping with quality products, honest pricing, 
              and service that feels like family. Join us on this journey!
            </p>
          </div>
        </div>

        {/* Our Story Section with Image */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-4">
              <Sparkles size={16} className="text-amber-600" />
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Our Story
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How Vemapri Started
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              A local dream turning into reality, one delivery at a time
            </p>
          </div>

          {/* Story with Image Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Vemapri was born in 2025', a simple observation: Bengaluru families deserve better access 
                    to quality groceries without compromising on authenticity or breaking the bank.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    We started small—just a handful of essential products sourced from trusted local suppliers and farmers 
                    in Karnataka. What sets us apart is our genuine commitment to treating every customer like family.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Being new in the market means we're hungry to prove ourselves. We listen to every piece of feedback, 
                    adapt quickly, and constantly improve based on what YOU ask for.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                <img 
                  src={adminProductsImage} 
                  alt="Vemapri Quality Products" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
            <p className="text-slate-700 leading-relaxed text-center max-w-4xl mx-auto text-lg">
              We're not just building a business; we're building a community. Every order helps us grow, every review 
              helps us improve, and every satisfied customer inspires us to do better. Thank you for being part of our 
              journey from the very beginning!
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-4">
              <Target size={16} className="text-amber-600" />
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Our Values
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Drives Us
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              The principles that guide our new journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all p-8 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="text-white" size={26} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-4">
              <TrendingUp size={16} className="text-amber-600" />
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Our Journey
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              2025, First Year
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Every step of our journey so far
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-200 via-amber-300 to-emerald-200" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col gap-8`}
                >
                  {/* Content */}
                  <div className="flex-1 w-full">
                    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all p-6 ${
                      index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                    }`}>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-3">
                        <Clock size={14} />
                        {milestone.month} {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex w-12 h-12 bg-slate-900 rounded-full items-center justify-center z-10 shadow-lg flex-shrink-0">
                    <div className="w-6 h-6 bg-amber-400 rounded-full animate-pulse" />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-4">
              <CheckCircle size={16} className="text-amber-600" />
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              The Vemapri Difference
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              What makes our new local brand special
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {team.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all p-8 text-center"
                >
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="text-amber-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm font-medium text-emerald-600 mb-3">
                    {item.role}
                  </p>
                  <p className="text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Our Promises to You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growing Together Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-full mb-6">
                <Heart className="text-white" size={32} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Growing Together with You
              </h2>
              <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                As a new brand, your support means the world to us. Every order, every review, 
                every recommendation helps us grow and serve you better. We're learning, adapting, 
                and expanding based on YOUR needs and feedback.
              </p>
              <p className="text-slate-700 mb-8">
                Have a product you'd like us to stock? A suggestion for improvement? We're all ears! 
                This is YOUR local grocery partner, and we're building it together.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-black transition-colors"
                >
                  Share Your Feedback
                </a>
                <a
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-50 transition-colors border-2 border-slate-200"
                >
                  Try Us Today
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
            
            <div className="relative text-center max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <MapPin className="text-amber-400" size={32} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Visit Us or Get in Touch
              </h2>
              <p className="text-slate-300 mb-8 text-lg">
                We're a local Bengaluru business ready to serve you. Reach out anytime—we love hearing from our customers!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <MapPin className="text-amber-400 mx-auto mb-3" size={28} />
                  <h4 className="font-semibold mb-2">Location</h4>
                  <p className="text-sm text-slate-300">
                    Electronic City,<br />
                    Bengaluru, Karnataka
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <Phone className="text-amber-400 mx-auto mb-3" size={28} />
                  <h4 className="font-semibold mb-2">Call Us</h4>
                  <a href="tel:+917702659401" className="text-sm text-slate-300 hover:text-white">
                    +91 77026 59401
                  </a>
                  <p className="text-xs text-slate-400 mt-1">Mon-Sat, 9AM-7PM</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <Mail className="text-amber-400 mx-auto mb-3" size={28} />
                  <h4 className="font-semibold mb-2">Email Us</h4>
                  <a href="mailto:support@vemapri.com" className="text-sm text-slate-300 hover:text-white">
                    support@vemapri.com
                  </a>
                  <p className="text-xs text-slate-400 mt-1">24-48 hr response</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  Start Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;