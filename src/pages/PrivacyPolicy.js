import React from 'react';
import { Shield, Lock, Eye, UserCheck, Cookie, Mail, Phone, Calendar } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Eye,
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, including:',
      items: [
        'Name, email address, and mobile number',
        'Shipping and billing addresses',
        'Payment information (processed securely through Razorpay)',
        'Order history and preferences',
        'Communication preferences'
      ]
    },
    {
      icon: UserCheck,
      title: '2. How We Use Your Information',
      content: 'We use the information we collect to:',
      items: [
        'Process and fulfill your orders',
        'Send order confirmations and updates',
        'Communicate with you about products and services',
        'Improve our website and customer service',
        'Detect and prevent fraud'
      ]
    },
    {
      icon: Shield,
      title: '3. Information Sharing',
      content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with:',
      items: [
        'Service providers who assist in our operations',
        'Payment processors for secure transactions',
        'Shipping companies to deliver your orders',
        'Law enforcement when required by law'
      ]
    },
    {
      icon: Lock,
      title: '4. Data Security',
      content: 'We implement appropriate security measures to protect your personal information. This includes encryption, secure servers, and regular security audits.',
      items: []
    },
    {
      icon: UserCheck,
      title: '5. Your Rights',
      content: 'You have the right to:',
      items: [
        'Access your personal information',
        'Correct inaccurate data',
        'Request deletion of your data',
        'Opt-out of marketing communications',
        'Export your data'
      ]
    },
    {
      icon: Cookie,
      title: '6. Cookies',
      content: 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.',
      items: []
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
              <Shield size={16} className="text-amber-400" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Your Privacy Matters
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We are committed to protecting your personal information and your right to privacy.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Introduction Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Introduction</h2>
              <p className="text-slate-600 leading-relaxed">
                This Privacy Policy describes how Vemapri collects, uses, and shares your personal information 
                when you use our website and services. By using our platform, you agree to the collection and 
                use of information in accordance with this policy.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <IconComponent className="text-slate-700" size={22} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                      {section.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      {section.content}
                    </p>
                    {section.items.length > 0 && (
                      <ul className="space-y-2.5">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-900 mt-2" />
                            <span className="text-slate-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Mail className="text-amber-400" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Contact Us</h2>
              <p className="text-slate-300 mb-4 leading-relaxed">
                If you have any questions about this Privacy Policy or our privacy practices, 
                please don't hesitate to contact us:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="mailto:support@vemapri.com"
              className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="text-amber-400" size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Email</p>
                <p className="font-medium">support@vemapri.com</p>
              </div>
            </a>

            <a
              href="tel:+917702659401"
              className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="text-amber-400" size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                <p className="font-medium">+91 77026 59401</p>
              </div>
            </a>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Protection Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <Lock className="text-amber-600 flex-shrink-0" size={24} />
              <h3 className="font-semibold text-slate-900">Data Protection</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              We comply with applicable data protection laws and regulations, including 
              the Information Technology Act, 2000 and associated rules in India.
            </p>
          </div>

          {/* Updates Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <Calendar className="text-slate-600 flex-shrink-0" size={24} />
              <h3 className="font-semibold text-slate-900">Policy Updates</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              We may update this Privacy Policy from time to time. We will notify you of 
              any changes by posting the new policy on this page.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200">
              <Calendar size={14} className="text-slate-500" />
              <span className="text-xs font-medium text-slate-700">
                Last updated: {new Date().toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            By using our services, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;