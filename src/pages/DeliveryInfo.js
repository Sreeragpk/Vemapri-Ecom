import React from 'react';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  IndianRupee, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Shield,
  Box
} from 'lucide-react';

const DeliveryInfo = () => {
  const deliveryZones = [
    {
      zone: 'Bengaluru (Electronic City & Nearby)',
      icon: MapPin,
      time: 'Same Day / Next Day',
      charge: 'Free on orders ₹500+',
      color: 'emerald'
    },
    {
      zone: 'Bengaluru (Other Areas)',
      icon: MapPin,
      time: '1-2 Business Days',
      charge: 'Free on orders ₹500+',
      color: 'blue'
    },
    {
      zone: 'Karnataka',
      icon: MapPin,
      time: '2-4 Business Days',
      charge: 'Free on orders ₹750+',
      color: 'violet'
    },
    {
      zone: 'Rest of India',
      icon: MapPin,
      time: '3-7 Business Days',
      charge: 'Free on orders ₹1000+',
      color: 'amber'
    }
  ];

  const deliveryFeatures = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same-day delivery available in select areas'
    },
    {
      icon: Shield,
      title: 'Secure Packaging',
      description: 'All products packed with care and quality materials'
    },
    {
      icon: Clock,
      title: 'Flexible Timing',
      description: 'Choose your preferred delivery time slot'
    },
    {
      icon: Box,
      title: 'Easy Returns',
      description: '7-day hassle-free return policy'
    }
  ];

  const deliveryGuidelines = [
    'Orders placed before 12 PM qualify for same-day delivery (select areas)',
    'Free delivery on orders above minimum cart value',
    'Track your order in real-time with SMS & email updates',
    'Multiple delivery attempts in case you\'re unavailable',
    'Contactless delivery option available',
    'Special handling for fragile and perishable items'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
              <Truck size={16} className="text-amber-400" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Delivery Information
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Fast & Reliable Delivery
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Get your groceries and staples delivered right to your doorstep with our efficient delivery service.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16">
        {/* Delivery Zones */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Delivery Zones & Timeline
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We deliver across India with varying delivery times based on your location
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryZones.map((zone, index) => {
              const IconComponent = zone.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all p-6 group"
                >
                  <div className={`w-12 h-12 bg-${zone.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`text-${zone.color}-600`} size={24} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                    {zone.zone}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock size={16} className="text-slate-400" />
                      <span>{zone.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <IndianRupee size={16} className="text-slate-400" />
                      <span>{zone.charge}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Features */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
              Why Choose Our Delivery Service?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {deliveryFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:bg-slate-900 transition-colors group">
                      <IconComponent className="text-slate-600 group-hover:text-white transition-colors" size={28} />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delivery Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Guidelines List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-white" size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                Delivery Guidelines
              </h2>
            </div>
            <ul className="space-y-4">
              {deliveryGuidelines.map((guideline, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="text-emerald-600" size={16} />
                  </div>
                  <span className="text-slate-600 leading-relaxed">
                    {guideline}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery Process */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                <Package className="text-white" size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                Delivery Process
              </h2>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Order Confirmed</h4>
                  <p className="text-sm text-slate-600">
                    You'll receive a confirmation email and SMS with order details
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Order Packed</h4>
                  <p className="text-sm text-slate-600">
                    Your items are carefully picked and securely packaged
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Out for Delivery</h4>
                  <p className="text-sm text-slate-600">
                    Track your order in real-time with our tracking system
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Delivered</h4>
                  <p className="text-sm text-slate-600">
                    Your order is delivered to your doorstep safely
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Charges Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center">
            Shipping Charges
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 font-semibold text-slate-900">Location</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-900">Order Value</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-900">Delivery Time</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-900">Shipping Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-slate-700">Electronic City, Bengaluru</td>
                  <td className="py-4 px-4 text-slate-700">Above ₹500</td>
                  <td className="py-4 px-4 text-slate-700">Same Day / Next Day</td>
                  <td className="py-4 px-4 font-semibold text-emerald-600">FREE</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-slate-700">Electronic City, Bengaluru</td>
                  <td className="py-4 px-4 text-slate-700">Below ₹500</td>
                  <td className="py-4 px-4 text-slate-700">Same Day / Next Day</td>
                  <td className="py-4 px-4 text-slate-700">₹40</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-slate-700">Bengaluru (Other Areas)</td>
                  <td className="py-4 px-4 text-slate-700">Above ₹500</td>
                  <td className="py-4 px-4 text-slate-700">1-2 Business Days</td>
                  <td className="py-4 px-4 font-semibold text-emerald-600">FREE</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-slate-700">Bengaluru (Other Areas)</td>
                  <td className="py-4 px-4 text-slate-700">Below ₹500</td>
                  <td className="py-4 px-4 text-slate-700">1-2 Business Days</td>
                  <td className="py-4 px-4 text-slate-700">₹60</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-slate-700">Karnataka</td>
                  <td className="py-4 px-4 text-slate-700">Above ₹750</td>
                  <td className="py-4 px-4 text-slate-700">2-4 Business Days</td>
                  <td className="py-4 px-4 font-semibold text-emerald-600">FREE</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-slate-700">Karnataka</td>
                  <td className="py-4 px-4 text-slate-700">Below ₹750</td>
                  <td className="py-4 px-4 text-slate-700">2-4 Business Days</td>
                  <td className="py-4 px-4 text-slate-700">₹80</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-slate-700">Rest of India</td>
                  <td className="py-4 px-4 text-slate-700">Above ₹1000</td>
                  <td className="py-4 px-4 text-slate-700">3-7 Business Days</td>
                  <td className="py-4 px-4 font-semibold text-emerald-600">FREE</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-slate-700">Rest of India</td>
                  <td className="py-4 px-4 text-slate-700">Below ₹1000</td>
                  <td className="py-4 px-4 text-slate-700">3-7 Business Days</td>
                  <td className="py-4 px-4 text-slate-700">₹100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="text-amber-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Important Notes</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Delivery times are approximate and may vary based on location and order volume</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Same-day delivery is available only for orders placed before 12:00 PM in select areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>We do not deliver on public holidays. Orders placed on holidays will be delivered on the next working day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>A valid phone number is required for successful delivery. Our delivery partner will contact you if needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>For bulk orders (above ₹10,000), please contact us for customized delivery options</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Calendar className="text-amber-400" size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Need Help with Delivery?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Our customer support team is available to assist you with any delivery-related queries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/faq"
              className="inline-flex items-center justify-center px-8 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              View FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;