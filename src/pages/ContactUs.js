import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, CheckCircle } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
              <MessageCircle size={16} className="text-amber-400" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                We're Here to Help
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Have questions about our products? Need assistance with an order? 
              Our team is ready to help you with anything you need.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Address Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">Visit Us</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Electronic City,<br />
                    Bengaluru, Karnataka<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">Call Us</h3>
                  <a 
                    href="tel:+917702659401" 
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors block mb-1"
                  >
                    +91 77026 59401
                  </a>
                  <p className="text-xs text-slate-500">Mon-Sat 9am-7pm IST</p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">Email Us</h3>
                  <a 
                    href="mailto:support@vemapri.com" 
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors block mb-1"
                  >
                    support@vemapri.com
                  </a>
                  <p className="text-xs text-slate-500">Response within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Clock className="text-amber-400" size={20} />
                </div>
                <h3 className="font-semibold text-lg">Business Hours</h3>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-slate-300">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-slate-300">Saturday</span>
                  <span className="font-medium">10:00 AM - 5:00 PM</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-300">Sunday</span>
                  <span className="font-medium text-amber-400">Closed</span>
                </div>
              </div>
            </div>

            {/* Quick Response Badge */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-amber-600 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Quick Response</h4>
                  <p className="text-sm text-slate-600">
                    We typically respond to all inquiries within 2-4 business hours during working days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Send us a Message
                </h2>
                <p className="text-slate-600">
                  Fill out the form below and our team will get back to you as soon as possible.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="mt-1 w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-2 focus:ring-slate-900"
                  />
                  <label htmlFor="privacy" className="text-sm text-slate-600">
                    I agree to the processing of my personal data in accordance with the{' '}
                    <a href="/privacy-policy" className="text-slate-900 font-medium hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  By submitting this form, you acknowledge that you have read and understood our{' '}
                  <a href="/privacy-policy" className="text-slate-900 font-medium hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-slate-50 rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MessageCircle size={20} className="text-slate-600" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900 list-none flex items-center justify-between py-2">
                    <span>What are your delivery times?</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-sm text-slate-600 mt-2 pl-4 border-l-2 border-slate-200">
                    We typically deliver within 3-5 business days for standard orders within Bengaluru.
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900 list-none flex items-center justify-between py-2">
                    <span>Do you ship outside Bengaluru?</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-sm text-slate-600 mt-2 pl-4 border-l-2 border-slate-200">
                    Yes, we ship across India. Delivery times may vary based on location.
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900 list-none flex items-center justify-between py-2">
                    <span>What is your return policy?</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-sm text-slate-600 mt-2 pl-4 border-l-2 border-slate-200">
                    We offer a 7-day return policy for unopened products in original packaging.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;