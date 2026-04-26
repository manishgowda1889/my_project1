import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-2xl space-y-8 animate-in zoom-in duration-500">
        <div className="relative">
          <h1 className="text-[150px] md:text-[250px] font-black text-primary/5 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Lost in Trend?</h2>
             <p className="text-sm md:text-lg text-gray-500 font-bold uppercase tracking-widest mt-4">The page you're looking for doesn't exist.</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
           <Link to="/" className="btn-primary py-4 px-10 flex items-center gap-3 text-lg">
             <Home size={22} /> Back to Home
           </Link>
           <Link to="/products" className="btn-secondary py-4 px-10 flex items-center gap-3 text-lg border-2">
             <Search size={22} /> Browse Catalog
           </Link>
        </div>

        <div className="pt-12 border-t border-light-darkest dark:border-dark-lightest max-w-sm mx-auto">
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Or try one of these</p>
           <div className="flex justify-center gap-6 text-xs font-bold text-primary">
              <Link to="/account/orders" className="hover:underline">My Orders</Link>
              <Link to="/cart" className="hover:underline">Shopping Cart</Link>
              <Link to="/help" className="hover:underline">Get Help</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
