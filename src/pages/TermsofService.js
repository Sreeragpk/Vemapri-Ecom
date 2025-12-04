import React, { useState } from 'react';
import { 
  FileText, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Scale, 
  CreditCard,
  Truck,
  RefreshCw,
  UserCheck,
  Lock,
  Mail,
  Phone,
  Calendar,
  ChevronRight
} from 'lucide-react';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: 'acceptance',
      icon: CheckCircle,
      title: '1. Acceptance of Terms',
      content: `By accessing and using the Vemapri website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
      subsections: [
        'These terms apply to all users of the site, including browsers, vendors, customers, and content contributors',
        'By using our service, you represent that you are at least 18 years of age',
        'We reserve the right to update, change, or replace any part of these Terms of Service'
      ]
    },
    {
      id: 'account',
      icon: UserCheck,
      title: '2. Account Terms',
      content: `When you create an account with us, you must provide accurate, complete, and current information at all times.`,
      subsections: [
        'You are responsible for safeguarding the password that you use to access the service',
        'You must not use another user\'s account without permission',
        'You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account',
        'You may not use as a username the name of another person or entity that is not lawfully available for use',
        'We reserve the right to refuse service, terminate accounts, or cancel orders at our discretion'
      ]
    },
    {
      id: 'products',
      icon: Shield,
      title: '3. Products and Services',
      content: `We reserve the right to limit the quantities of any products or services that we offer.`,
      subsections: [
        'All descriptions of products or product pricing are subject to change at any time without notice',
        'We reserve the right to discontinue any product at any time',
        'We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations',
        'Product images are for illustration purposes only. Actual product may vary',
        'All organic products are certified and sourced from trusted suppliers'
      ]
    },
    {
      id: 'pricing',
      icon: CreditCard,
      title: '4. Pricing and Payment',
      content: `All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated.`,
      subsections: [
        'Prices are subject to change without prior notice',
        'We accept Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery',
        'All payments are processed securely through Razorpay',
        'We reserve the right to refuse any order placed through our service',
        'In case of pricing errors, we reserve the right to cancel the order and issue a full refund',
        'Payment must be received in full before order processing'
      ]
    },
    {
      id: 'ordering',
      icon: FileText,
      title: '5. Order Processing',
      content: `Orders are processed after payment confirmation and are subject to product availability.`,
      subsections: [
        'Order confirmation will be sent via email and SMS',
        'We reserve the right to refuse or cancel any order for any reason',
        'Orders cannot be modified or cancelled once processed',
        'In case of unavailable items, we will contact you for alternatives or refund',
        'Bulk orders may require additional processing time',
        'Orders are processed Monday through Saturday, excluding public holidays'
      ]
    },
    {
      id: 'shipping',
      icon: Truck,
      title: '6. Shipping and Delivery',
      content: `We strive to deliver products within the estimated time frame, but delays may occur due to unforeseen circumstances.`,
      subsections: [
        'Delivery times are estimates and not guaranteed',
        'Same-day delivery is available in select areas for orders placed before 12 PM',
        'Free shipping is available on orders above specified minimum values',
        'We are not responsible for delays caused by incorrect address information',
        'Delivery is attempted up to 3 times before the order is returned',
        'Risk of loss and title for items purchased pass to you upon delivery',
        'You must inspect products upon delivery and report any damages within 48 hours'
      ]
    },
    {
      id: 'returns',
      icon: RefreshCw,
      title: '7. Returns and Refunds',
      content: `We accept returns within 7 days of delivery for unopened products in original packaging.`,
      subsections: [
        'Products must be unused and in the same condition that you received them',
        'Products must be in the original packaging',
        'Perishable items and opened food products cannot be returned for hygiene reasons',
        'Refunds are processed within 5-7 business days after receiving the returned item',
        'Return shipping costs are borne by the customer unless the product is defective or damaged',
        'We reserve the right to refuse returns that do not meet our return policy criteria',
        'In case of damaged or defective products, we provide replacement or full refund at no additional cost'
      ]
    },
    {
      id: 'prohibited',
      icon: AlertCircle,
      title: '8. Prohibited Uses',
      content: `You may not use our service for any illegal or unauthorized purpose.`,
      subsections: [
        'You must not violate any laws in your jurisdiction',
        'You must not transmit any worms, viruses, or any code of a destructive nature',
        'You must not use our service to harm minors in any way',
        'You must not impersonate or attempt to impersonate Vemapri or any employee',
        'You must not engage in any automated use of the system',
        'You must not interfere with or circumvent the security features of the service'
      ]
    },
    {
      id: 'intellectual',
      icon: Lock,
      title: '9. Intellectual Property',
      content: `All content on this website, including text, graphics, logos, and images, is the property of Vemapri.`,
      subsections: [
        'The Vemapri name and logo are trademarks of Vemapri',
        'You may not use our products or brand names without prior written consent',
        'You may not reproduce, duplicate, copy, sell, or exploit any portion of the service',
        'User-generated content remains the property of the user but grants us a license to use it',
        'We respect intellectual property rights and expect users to do the same'
      ]
    },
    {
      id: 'privacy',
      icon: Shield,
      title: '10. Privacy and Data Protection',
      content: `Your privacy is important to us. Please review our Privacy Policy to understand our practices.`,
      subsections: [
        'We collect personal information only as needed to provide our services',
        'Your data is stored securely and never sold to third parties',
        'We use cookies to enhance your browsing experience',
        'You have the right to access, correct, or delete your personal information',
        'We comply with applicable data protection laws including the IT Act, 2000'
      ]
    },
    {
      id: 'warranty',
      icon: CheckCircle,
      title: '11. Warranty Disclaimer',
      content: `Products and services are provided "as is" without any warranty or conditions.`,
      subsections: [
        'We do not guarantee that our service will be uninterrupted or error-free',
        'We do not warrant that results obtained from using the service will be accurate',
        'We do not warrant that the quality of products will meet your expectations',
        'Any material downloaded or obtained through our service is at your own risk',
        'We are not responsible for any damage to your computer system or loss of data'
      ]
    },
    {
      id: 'liability',
      icon: Scale,
      title: '12. Limitation of Liability',
      content: `Vemapri shall not be liable for any indirect, incidental, special, or consequential damages.`,
      subsections: [
        'Our total liability shall not exceed the amount paid by you for the products',
        'We are not liable for any business losses including lost profits or data',
        'We are not liable for delays or failures due to circumstances beyond our control',
        'We are not liable for third-party content or services',
        'Some jurisdictions do not allow limitations on liability, so some limitations may not apply'
      ]
    },
    {
      id: 'indemnification',
      icon: Shield,
      title: '13. Indemnification',
      content: `You agree to indemnify and hold Vemapri harmless from any claims arising from your use of the service.`,
      subsections: [
        'You agree to defend, indemnify and hold harmless Vemapri and its affiliates',
        'This includes any claims resulting from your breach of these Terms',
        'This includes any claims resulting from your violation of any law or rights of a third party',
        'You agree to cooperate fully in the defense of any claim'
      ]
    },
    {
      id: 'termination',
      icon: AlertCircle,
      title: '14. Termination',
      content: `We may terminate or suspend your account and access to the service immediately, without prior notice.`,
      subsections: [
        'Termination may occur for breach of these Terms',
        'Upon termination, your right to use the service will immediately cease',
        'We are not liable to you or any third party for any termination of access',
        'All provisions that should survive termination shall survive'
      ]
    },
    {
      id: 'governing',
      icon: Scale,
      title: '15. Governing Law',
      content: `These Terms shall be governed by and construed in accordance with the laws of India.`,
      subsections: [
        'Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka',
        'You agree to submit to the personal jurisdiction of these courts',
        'The UN Convention on Contracts for the International Sale of Goods does not apply'
      ]
    },
    {
      id: 'changes',
      icon: Calendar,
      title: '16. Changes to Terms',
      content: `We reserve the right to update or modify these Terms at any time without prior notice.`,
      subsections: [
        'Changes are effective immediately upon posting to the website',
        'Your continued use of the service constitutes acceptance of changes',
        'It is your responsibility to review the Terms regularly',
        'Material changes will be communicated via email or website notification',
        'The "Last Updated" date at the bottom indicates when changes were made'
      ]
    }
  ];

  const quickLinks = [
    { id: 'account', label: 'Account Terms', icon: UserCheck },
    { id: 'pricing', label: 'Pricing & Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'returns', label: 'Returns & Refunds', icon: RefreshCw },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
              <FileText size={16} className="text-amber-400" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Legal Agreement
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Terms of Service
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services. By using Vemapri, you agree to be bound by these terms.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Introduction Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <Scale className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome to Vemapri</h2>
              <p className="text-slate-600 leading-relaxed">
                These Terms of Service ("Terms") govern your access to and use of Vemapri's website, products, 
                and services. Please read these Terms carefully, and contact us if you have any questions. 
                By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    const element = document.getElementById(link.id);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left group"
                >
                  <IconComponent size={18} className="text-slate-600 group-hover:text-slate-900" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {link.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Last Updated */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-center gap-3">
          <Calendar className="text-amber-600 flex-shrink-0" size={20} />
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Last Updated:</span> {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            const isOpen = activeSection === section.id;

            return (
              <div
                key={section.id}
                id={section.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setActiveSection(isOpen ? null : section.id)}
                  className="w-full flex items-start gap-4 p-6 md:p-8 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isOpen ? 'bg-slate-900' : 'bg-slate-100'
                  }`}>
                    <IconComponent className={isOpen ? 'text-white' : 'text-slate-600'} size={22} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      {section.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                  <ChevronRight 
                    size={24} 
                    className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[2000px]' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 md:px-8 pb-6 md:pb-8 pl-20 md:pl-24">
                    <div className="pt-4 border-t border-slate-100">
                      <ul className="space-y-3">
                        {section.subsections.map((subsection, subIndex) => (
                          <li key={subIndex} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-900 mt-2" />
                            <span className="text-slate-600 leading-relaxed flex-1">
                              {subsection}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Mail className="text-amber-400" size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Questions About Our Terms?
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">
              If you have any questions about these Terms of Service, please don't hesitate to contact us. 
              We're here to help clarify any concerns you may have.
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
        </div>

        {/* Related Links */}
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Related Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="/privacy-policy"
              className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <Shield size={18} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Privacy Policy</span>
            </a>
            <a
              href="/delivery-info"
              className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <Truck size={18} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Delivery Information</span>
            </a>
            <a
              href="/faq"
              className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <FileText size={18} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">FAQ</span>
            </a>
          </div>
        </div>

        {/* Acceptance Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            By using Vemapri's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;