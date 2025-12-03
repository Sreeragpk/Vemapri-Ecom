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
const socialLinks = [
  {
    Icon: Facebook,
    href: 'https://facebook.com/yourpage',
    label: 'Vemapri on Facebook',
  },
  {
    Icon: Twitter,
    href: 'https://twitter.com/yourprofile',
    label: 'Vemapri on Twitter',
  },
  {
    Icon: Instagram,
    href: 'https://instagram.com/yourprofile',
    label: 'Vemapri on Instagram',
  },
  {
    Icon: Linkedin,
    href: 'https://linkedin.com/company/yourcompany',
    label: 'Vemapri on LinkedIn',
  },
];
  return (
    <footer className="bg-slate-950 text-slate-100 text-sm border-t border-slate-800">
      {/* top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand / About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold tracking-[0.15em] text-slate-950">
                VP
              </div>
              <span className="text-lg font-semibold tracking-wide">
                Vemapri
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-300/90 mb-4 leading-relaxed">
              Carefully curated spices, staples and everyday essentials —
              delivered with the reliability of your favourite neighbourhood
              store.
            </p>

      <div className="flex items-center gap-3">
  {socialLinks.map(({ Icon, href, label }, idx) => (
    <a
      key={idx}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/70 bg-slate-900/60 hover:border-amber-500 hover:bg-slate-900 transition-colors"
    >
      <Icon size={16} className="text-slate-200" />
    </a>
  ))}
</div>
          </div>

          {/* Shop / Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.22em] uppercase text-slate-400 mb-3">
              Shop
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="hover:text-amber-400 text-xs md:text-sm transition-colors"
                >
                  Shop Products
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-amber-400 text-xs md:text-sm transition-colors"
                >
                  All Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="hover:text-amber-400 text-xs md:text-sm transition-colors"
                >
                  Offers &amp; Combos
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.22em] uppercase text-slate-400 mb-3">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/orders"
                  className="hover:text-amber-400 text-xs md:text-sm transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-amber-400 text-xs md:text-sm transition-colors"
                >
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-amber-400 text-xs md:text-sm transition-colors"
                >
                  Delivery Info
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-amber-400 text-xs md:text-sm transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.22em] uppercase text-slate-400 mb-3">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin
                  size={16}
                  className="mr-3 mt-0.5 flex-shrink-0 text-slate-400"
                />
                <span className="text-xs md:text-sm text-slate-200/90 leading-relaxed">
                  Electronic City,
                  <br />
                  Bengaluru, Karnataka
                </span>
              </li>
              <li className="flex items-center">
                <Phone
                  size={16}
                  className="mr-3 flex-shrink-0 text-slate-400"
                />
                <span className="text-xs md:text-sm">+91 77026 59401</span>
              </li>
              <li className="flex items-center">
                <Mail
                  size={16}
                  className="mr-3 flex-shrink-0 text-slate-400"
                />
                <span className="text-xs md:text-sm">
                  support@vemapri.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-8 pt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs md:text-sm text-slate-400">
              © {year} Vemapri. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm">
              <Link
                to="/privacy"
                className="hover:text-amber-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-amber-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="hover:text-amber-400 transition-colors"
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
