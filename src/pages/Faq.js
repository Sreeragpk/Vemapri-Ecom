import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Package, 
  Truck, 
  CreditCard, 
  RefreshCw, 
  Shield, 
  MessageCircle,
  Mail,
  Phone,
  Search
} from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'returns', label: 'Returns', icon: RefreshCw },
    { id: 'products', label: 'Products', icon: Shield },
  ];

  const faqs = [
    // Orders
    {
      category: 'orders',
      question: 'How do I place an order?',
      answer: 'To place an order, browse our products, add items to your cart, and proceed to checkout. You\'ll need to provide your delivery address and payment information. Once your order is confirmed, you\'ll receive a confirmation email with your order details.'
    },
    {
      category: 'orders',
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 1 hour of placing it. Please contact our customer support immediately at support@vemapri.com or call +91 77026 59401. Once the order is processed or shipped, modifications may not be possible.'
    },
    {
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you\'ll receive a tracking number via email and SMS. You can also track your order by logging into your account and visiting the "My Orders" section. The tracking information updates in real-time.'
    },
    {
      category: 'orders',
      question: 'What is the minimum order value?',
      answer: 'There is no minimum order value at Vemapri. However, orders above ₹500 qualify for free shipping within Bengaluru. For orders below ₹500, standard shipping charges apply.'
    },

    // Shipping
    {
      category: 'shipping',
      question: 'What are your delivery areas?',
      answer: 'We currently deliver across India. Same-day and next-day delivery is available within Bengaluru (Electronic City and nearby areas). For other locations, delivery typically takes 3-7 business days depending on your pin code.'
    },
    {
      category: 'shipping',
      question: 'What are the shipping charges?',
      answer: 'Shipping is free for orders above ₹500 within Bengaluru. For orders below ₹500, we charge ₹40 for delivery. For deliveries outside Bengaluru, shipping charges vary based on location and order weight, calculated at checkout.'
    },
    {
      category: 'shipping',
      question: 'Do you offer same-day delivery?',
      answer: 'Yes! We offer same-day delivery for orders placed before 12 PM within Electronic City, Bengaluru. Orders placed after 12 PM will be delivered the next business day. This service is currently available only in select areas.'
    },
    {
      category: 'shipping',
      question: 'What if I\'m not available during delivery?',
      answer: 'Our delivery partner will attempt delivery up to 3 times. If you\'re unavailable, you can reschedule the delivery by contacting our support team. Alternatively, you can provide delivery instructions during checkout.'
    },

    // Payment
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept multiple payment methods including Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery (COD). All online payments are processed securely through Razorpay with 256-bit SSL encryption.'
    },
    {
      category: 'payment',
      question: 'Is Cash on Delivery available?',
      answer: 'Yes, Cash on Delivery (COD) is available for orders within India. Please note that COD may have a maximum order value limit of ₹5,000 and is subject to availability in your delivery location.'
    },
    {
      category: 'payment',
      question: 'Are my payment details secure?',
      answer: 'Absolutely! We never store your card details on our servers. All payments are processed through Razorpay, a PCI-DSS compliant payment gateway, ensuring your payment information is completely secure.'
    },
    {
      category: 'payment',
      question: 'Can I get an invoice for my purchase?',
      answer: 'Yes, a detailed invoice is automatically generated for every order and sent to your registered email. You can also download invoices from the "My Orders" section in your account. GST invoices are provided for all purchases.'
    },

    // Returns
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for unopened products in their original packaging. The product must be unused and in the same condition that you received it. Perishable items and opened food products cannot be returned for hygiene reasons.'
    },
    {
      category: 'returns',
      question: 'How do I return a product?',
      answer: 'To initiate a return, contact our customer support within 7 days of delivery. Provide your order number and reason for return. Our team will arrange a pickup and guide you through the return process. Refunds are processed within 5-7 business days after we receive the returned item.'
    },
    {
      category: 'returns',
      question: 'What if I receive a damaged product?',
      answer: 'We\'re sorry if you received a damaged product! Please contact us immediately with photos of the damaged item and packaging. We\'ll arrange a replacement or full refund at no additional cost. Please report damaged items within 48 hours of delivery.'
    },
    {
      category: 'returns',
      question: 'How long does it take to get a refund?',
      answer: 'Once we receive and inspect your returned item, refunds are processed within 5-7 business days. The amount will be credited to your original payment method. For COD orders, refunds are issued via bank transfer or UPI.'
    },

    // Products
    {
      category: 'products',
      question: 'Are your products organic?',
      answer: 'We offer a wide range of both organic and conventional products. All our organic products are clearly labeled with "Organic" tags. You can filter products by organic certification using our search filters. We source our organic products from certified suppliers.'
    },
    {
      category: 'products',
      question: 'How do I know if a product is in stock?',
      answer: 'Product availability is displayed on each product page. If an item is out of stock, you\'ll see an "Out of Stock" label. You can click "Notify Me" to receive an email when the product becomes available again.'
    },
    {
      category: 'products',
      question: 'Do you have bulk purchase options?',
      answer: 'Yes! We offer special pricing for bulk orders. For bulk purchases (typically orders above ₹10,000), please contact our business team at support@vemapri.com or call +91 77026 59401 for customized pricing and delivery options.'
    },
    {
      category: 'products',
      question: 'What is the shelf life of your products?',
      answer: 'Shelf life varies by product type. All products are packaged with clear expiry dates. We ensure that products have a minimum of 3-6 months of shelf life at the time of delivery. Specific shelf life information is available on each product page.'
    },
    {
      category: 'products',
      question: 'Do you sell branded products?',
      answer: 'Yes, we sell both our own Vemapri brand products and other trusted brands. Our Vemapri Select, Vemapri Masala, and Vemapri Wellness ranges are our exclusive products, sourced and packaged to ensure the highest quality standards.'
    },
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
              <HelpCircle size={16} className="text-amber-400" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Help Center
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about our products, orders, and services.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-2 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-sm bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Count */}
        <div className="mb-6">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filteredFaqs.length}</span> {filteredFaqs.length === 1 ? 'question' : 'questions'}
            {activeCategory !== 'all' && (
              <span> in <span className="font-semibold text-slate-900">
                {categories.find(c => c.id === activeCategory)?.label}
              </span></span>
            )}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-12">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No questions found
              </h3>
              <p className="text-slate-600 mb-6">
                We couldn't find any questions matching your search. Try different keywords or browse by category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-black transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      openIndex === index ? 'bg-slate-900' : 'bg-slate-100'
                    }`}>
                      {React.createElement(
                        categories.find(c => c.id === faq.category)?.icon || HelpCircle,
                        { 
                          size: 20, 
                          className: openIndex === index ? 'text-white' : 'text-slate-600'
                        }
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-base md:text-lg pr-4">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-6 pl-20">
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Still Have Questions Section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <MessageCircle className="text-amber-400" size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Still have questions?
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our customer support team is here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <a
              href="mailto:support@vemapri.com"
              className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="text-amber-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Email us at</p>
                <p className="font-semibold text-lg">support@vemapri.com</p>
              </div>
            </a>

            <a
              href="tel:+917702659401"
              className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="text-amber-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Call us at</p>
                <p className="font-semibold text-lg">+91 77026 59401</p>
              </div>
            </a>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Available Monday - Saturday, 9:00 AM - 7:00 PM IST
            </p>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
            Popular Topics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.slice(1, 4).map((category) => {
              const IconComponent = category.icon;
              const count = faqs.filter(faq => faq.category === category.id).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                      <IconComponent className="text-slate-600 group-hover:text-white transition-colors" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-lg">
                        {category.label}
                      </h4>
                      <p className="text-sm text-slate-500">{count} questions</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;