import { useSelector, useDispatch } from 'react-redux';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/store/api/wishlistApiSlice';
import ProductGrid from '../../components/product/ProductGrid';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { data, isLoading } = useGetWishlistQuery();
  const wishlist = data?.wishlist;

  if (isLoading) return <div className="container-custom py-20 text-center font-black">LOADING YOUR WISHLIST...</div>;

  return (
    <div className="container-custom py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">My Wishlist</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Saved products you love</p>
        </div>
        <Link to="/products" className="btn-secondary py-3 px-6 flex items-center gap-2">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>

      {!wishlist || wishlist.length === 0 ? (
        <div className="card py-24 text-center space-y-6">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mx-auto text-red-500">
            <Heart size={40} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">Your wishlist is empty</h3>
          <p className="text-gray-500 max-w-md mx-auto">Save items you like and they will show up here. Never lose track of what you want to buy.</p>
          <Link to="/products" className="btn-primary py-3 px-8 inline-block">Explore Trends</Link>
        </div>
      ) : (
        <ProductGrid products={wishlist} isLoading={false} />
      )}
    </div>
  );
};

export default Wishlist;
