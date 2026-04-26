import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { getProductImage, imgError } from '@/utils/getProductImage';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`${product.title} added to cart!`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    if (isWishlisted) {
      toast.info('Removed from wishlist');
    } else {
      toast.success('Added to wishlist');
    }
  };

  const discount = product.discountPercent || (product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0);

  return (
    <div className="card group h-full flex flex-col">
      <Link to={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-light-darker">
        <img 
          src={getProductImage(product)}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={imgError(product)}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter shadow-lg">
              {Math.round(discount)}% OFF
            </span>
          )}
          {product.isPrime && (
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter flex items-center gap-1 shadow-lg">
              <Zap size={10} fill="currentColor" /> Prime
            </span>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter shadow-lg">
              Only {product.stock} Left
            </span>
          )}
        </div>
        
        {/* Price Range Badge */}
        {product.priceRange && (
          <div className="absolute top-3 right-3 flex flex-col gap-2">
             <span className="bg-dark/80 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg border border-white/10">
               {product.priceRange}
             </span>
          </div>
        )}


        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
           <button 
            onClick={handleToggleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 ${isWishlisted ? 'bg-primary text-white' : 'bg-white text-dark hover:bg-primary hover:text-white'}`}
          >
            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button className="w-10 h-10 bg-white text-dark rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75">
            <Eye size={20} />
          </button>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product.slug}`} className="block mb-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold truncate">
            {product.brand || 'Generic'}
          </p>
          <h3 className="text-sm md:text-base font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-accent">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                fill={i < Math.floor(product.ratings?.average || 0) ? "currentColor" : "none"} 
                className={i < Math.floor(product.ratings?.average || 0) ? "" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-bold">({product.ratings?.count || 0})</span>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            {product.discountPrice ? (
              <div className="flex flex-col">
                <span className="text-lg font-black text-dark dark:text-white">₹{product.discountPrice.toLocaleString()}</span>
                <span className="text-xs text-gray-400 line-through font-bold">₹{product.price.toLocaleString()}</span>
              </div>
            ) : (
              <span className="text-lg font-black text-dark dark:text-white">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="w-10 h-10 bg-light-darker dark:bg-dark hover:bg-primary hover:text-white rounded-lg flex items-center justify-center transition-colors text-dark dark:text-white border border-light-darkest dark:border-dark-lightest"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
