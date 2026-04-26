import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  X, 
  Moon, 
  Sun,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  ListOrdered
} from 'lucide-react';
import { toggleDarkMode, toggleSidebar, setSearchQuery } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { useLogoutApiMutation } from '@/store/api/authApiSlice';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isDarkMode } = useSelector((state) => state.ui);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  
  const [logoutApi] = useLogoutApiMutation();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
    navigate(`/products?q=${localSearch}`);
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-lighter border-b border-light-darkest dark:border-dark-lightest shadow-sm transition-colors duration-300">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl md:text-3xl font-heading font-black text-primary tracking-tighter italic">
              Trendzz<span className="text-dark dark:text-white">.</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-grow max-w-2xl">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-full hover:bg-light-darker dark:hover:bg-dark transition-colors"
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            {/* Wishlist */}
            <Link 
              to="/account/wishlist" 
              className="hidden sm:flex p-2 rounded-full hover:bg-light-darker dark:hover:bg-dark transition-colors relative"
            >
              <Heart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-dark-lighter">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="p-2 rounded-full hover:bg-light-darker dark:hover:bg-dark transition-colors relative"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-dark-lighter">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="relative">
              {isAuthenticated ? (
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1 p-1 pl-2 rounded-full hover:bg-light-darker dark:hover:bg-dark transition-colors border border-transparent hover:border-light-darkest dark:hover:border-dark-lightest"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} className="text-primary" />
                    )}
                  </div>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link to="/login" className="btn-primary py-2 px-5 hidden md:block">
                  Login
                </Link>
              )}

              {/* Profile Dropdown */}
              {isProfileOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-lighter border border-light-darkest dark:border-dark-lightest rounded-xl shadow-xl py-2 z-[60]">
                  <div className="px-4 py-2 border-b border-light-darkest dark:border-dark-lightest mb-1">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  <Link to="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-light-darker dark:hover:bg-dark transition-colors">
                    <User size={18} /> My Profile
                  </Link>
                  <Link to="/account/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-light-darker dark:hover:bg-dark transition-colors">
                    <ListOrdered size={18} /> My Orders
                  </Link>

                  {user.role === 'seller' && (
                    <>
                      <div className="h-px bg-light-darkest dark:bg-dark-lightest my-1"></div>
                      <Link to="/seller/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary font-semibold hover:bg-light-darker dark:hover:bg-dark transition-colors">
                        <LayoutDashboard size={18} /> Seller Dashboard
                      </Link>
                      <Link to="/seller/products" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-light-darker dark:hover:bg-dark transition-colors">
                        <Package size={18} /> My Products
                      </Link>
                    </>
                  )}

                  {user.role === 'admin' && (
                    <>
                      <div className="h-px bg-light-darkest dark:bg-dark-lightest my-1"></div>
                      <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 font-semibold hover:bg-light-darker dark:hover:bg-dark transition-colors">
                        <LayoutDashboard size={18} /> Admin Dashboard
                      </Link>
                    </>
                  )}

                  <div className="h-px bg-light-darkest dark:bg-dark-lightest my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-light-darker dark:hover:bg-dark transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-light-darkest dark:border-dark-lightest bg-white dark:bg-dark-lighter py-4 px-4 space-y-4 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-light-darker dark:bg-dark rounded-lg outline-none"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </form>
          
          <div className="grid grid-cols-2 gap-2">
            <Link to="/products" className="flex items-center justify-center gap-2 p-3 bg-light-darker dark:bg-dark rounded-lg text-sm font-semibold">
              <Package size={18} /> Browse
            </Link>
            <Link to="/account/wishlist" className="flex items-center justify-center gap-2 p-3 bg-light-darker dark:bg-dark rounded-lg text-sm font-semibold">
              <Heart size={18} /> Wishlist
            </Link>
          </div>

          {!isAuthenticated && (
            <div className="flex flex-col gap-2">
              <Link to="/login" className="btn-primary text-center py-3">Login</Link>
              <Link to="/register" className="btn-secondary text-center py-3">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
