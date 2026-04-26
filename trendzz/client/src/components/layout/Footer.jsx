import { Link } from 'react-router-dom';
import { Layout, Globe, Share2, Play, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-dark-lighter border-t border-light-darkest dark:border-dark-lightest pt-16 pb-8 transition-colors duration-300">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Newsletter */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-heading font-black text-primary tracking-tighter italic">
              Trendzz<span className="text-dark dark:text-white">.</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Your one-stop destination for the trendiest fashion and electronics. Quality products, fast delivery, and premium experience.
            </p>
            <div className="space-y-3">
              <h4 className="font-bold text-sm uppercase tracking-wider">Join our newsletter</h4>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow bg-light-darker dark:bg-dark px-4 py-2 rounded-lg text-sm outline-none border border-transparent focus:border-primary transition-all"
                />
                <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors">
                  <Mail size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-dark dark:text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400 text-sm">
              <li><Link to="/products" className="hover:text-primary transition-colors">Browse Products</Link></li>
              <li><Link to="/deals" className="hover:text-primary transition-colors">Today's Deals</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link to="/account/orders" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-bold text-dark dark:text-white mb-6 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400 text-sm">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/shipping" className="hover:text-primary transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-dark dark:text-white mb-6 uppercase tracking-wider text-sm">Contact Info</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 text-sm">
              <li className="flex gap-3">
                <MapPin className="text-primary flex-shrink-0" size={18} />
                <span>123 Trendzz St, Fashion District, New York, NY 10001</span>
              </li>
              <li className="flex gap-3">
                <Phone className="text-primary flex-shrink-0" size={18} />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex gap-3">
                <Mail className="text-primary flex-shrink-0" size={18} />
                <span>support@trendzz.com</span>
              </li>
              <li className="flex gap-4 pt-4">
                <a href="#" className="w-9 h-9 bg-light-darker dark:bg-dark rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Layout size={18} />
                </a>
                <a href="#" className="w-9 h-9 bg-light-darker dark:bg-dark rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Globe size={18} />
                </a>
                <a href="#" className="w-9 h-9 bg-light-darker dark:bg-dark rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Share2 size={18} />
                </a>
                <a href="#" className="w-9 h-9 bg-light-darker dark:bg-dark rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Play size={18} />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-light-darkest dark:border-dark-lightest pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 uppercase tracking-widest">
          <p>© {currentYear} Trendzz E-Commerce. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-primary">Cookie Policy</Link>
          </div>
          <div className="flex gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-help" title="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-help" title="Mastercard" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-help" title="PayPal" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
