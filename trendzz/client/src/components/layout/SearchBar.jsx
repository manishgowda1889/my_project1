import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Loader2, X, TrendingUp, Sparkles } from 'lucide-react';
import { useGetProductsQuery } from '@/store/api/productsApiSlice';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch suggestions
  const { data, isFetching } = useGetProductsQuery(
    { search: debouncedQuery, limit: 5 },
    { skip: debouncedQuery.length < 2 }
  );

  const products = data?.products || [];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setIsFocused(false);
    }
  };

  return (
    <div ref={searchRef} className="relative flex-grow max-w-2xl group">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search for premium products, brands..."
          className={`w-full pl-12 pr-12 py-3 bg-light-darker dark:bg-dark border-2 transition-all duration-300 outline-none rounded-2xl font-medium ${isFocused ? 'border-primary ring-4 ring-primary/10 shadow-lg' : 'border-transparent'}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-gray-400'}`} size={20} />
        
        {query && (
          <button 
            type="button" 
            onClick={() => setQuery('')}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark dark:hover:text-white p-1"
          >
            <X size={16} />
          </button>
        )}
        
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-xl hover:bg-primary/90 transition-all shadow-md group-hover:scale-105"
        >
          {isFetching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {isFocused && (query.length >= 2 || products.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-lighter border border-light-darkest dark:border-dark-lightest rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {isFetching && products.length === 0 ? (
             <div className="p-8 text-center text-gray-500">
               <Loader2 className="animate-spin mx-auto mb-2 text-primary" size={24} />
               <p className="text-xs font-black uppercase tracking-widest">Searching the store...</p>
             </div>
          ) : products.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 border-b border-light-darkest dark:border-dark-lightest mb-2">
                 <Sparkles size={14} /> Top Matches
              </div>
              {products.map((product) => (
                <Link 
                  key={product._id} 
                  to={`/products/${product.slug}`}
                  onClick={() => setIsFocused(false)}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-light-darker dark:hover:bg-dark transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={product.thumbnail || product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">{product.categoryName || 'Product'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-primary">₹{Math.round(product.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
              <button 
                onClick={handleSearch}
                className="w-full py-4 text-center text-xs font-black uppercase tracking-widest bg-light-darker dark:bg-dark text-primary hover:bg-primary hover:text-white transition-all"
              >
                View all results
              </button>
            </div>
          ) : query.length >= 2 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm font-bold italic">No matches found for "{query}"</p>
              <p className="text-xs mt-2 uppercase tracking-widest">Try another keyword</p>
            </div>
          ) : (
             <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                   <TrendingUp size={14} /> Trending Searches
                </div>
                <div className="flex flex-wrap gap-2">
                   {['iPhone', 'Laptop', 'Nike', 'Groceries', 'Fiction'].map(tag => (
                     <button 
                        key={tag} 
                        onClick={() => {setQuery(tag); navigate(`/products?search=${tag}`); setIsFocused(false);}}
                        className="px-4 py-2 bg-light-darker dark:bg-dark rounded-full text-xs font-bold hover:bg-primary hover:text-white transition-all"
                     >
                       {tag}
                     </button>
                   ))}
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
