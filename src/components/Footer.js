import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-emerald-950 text-emerald-50 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-2">Vemapri</h3>
            <p className="text-xs md:text-sm mb-3 text-emerald-100/80">
              Your trusted neighbourhood store for quality groceries, staples
              and daily essentials.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vemapri on Facebook"
                className="hover:text-white transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vemapri on Twitter"
                className="hover:text-white transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://instagram.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vemapri on Instagram"
                className="hover:text-white transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://linkedin.com/company/yourcompany"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vemapri on LinkedIn"
                className="hover:text-white transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="hover:text-white text-xs md:text-sm"
                >
                  Shop Products
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white text-xs md:text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/orders"
                  className="hover:text-white text-xs md:text-sm"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-white text-xs md:text-sm"
                >
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-white text-xs md:text-sm"
                >
                  Delivery Info
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-white text-xs md:text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-xs md:text-sm text-emerald-100/90">
                  Electronic City,<br />
                  Bengaluru, Karnataka
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 flex-shrink-0" />
                <span className="text-xs md:text-sm">+91 77026 59401</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 flex-shrink-0" />
                <span className="text-xs md:text-sm">
                  support@vemapri.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-900 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs md:text-sm text-emerald-100/80">
              © {year} Vemapri. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/privacy"
                className="text-xs md:text-sm hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-xs md:text-sm hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="text-xs md:text-sm hover:text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
