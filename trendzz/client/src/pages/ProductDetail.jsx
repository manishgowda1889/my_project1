import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery } from '@/store/api/productsApiSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import ProductGrid from '../components/product/ProductGrid';
import {
  Star, ShoppingCart, Heart, ShieldCheck, Truck, Share2,
  Plus, Minus, Zap, Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getProductImage, getProductImages, imgError } from '@/utils/getProductImage';


const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const { data, isLoading, error } = useGetProductDetailsQuery(slug);
  const product = data?.product;
  const related = data?.related;

  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some((item) => item._id === product?._id);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedSize(product.variants[0].size);
      setSelectedColor(product.variants[0].color);
    }
    setActiveImage(0);
  }, [product]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty, variant: { size: selectedSize, color: selectedColor } }));
    toast.success('Added to cart!');
  };

  if (isLoading) return <div className="container-custom py-20 text-center font-black uppercase tracking-widest">Loading product...</div>;
  if (error) return <div className="container-custom py-20 text-center text-red-500 font-black">Error loading product.</div>;
  if (!product) return <div className="container-custom py-20 text-center font-black">Product not found.</div>;

  const images = getProductImages(product, 4);
  const currentPrice = product.discountPrice || product.price;

  // Safely iterate specifications (could be a Map or plain object)
  const specEntries = product.specifications
    ? product.specifications instanceof Map
      ? [...product.specifications.entries()]
      : Object.entries(product.specifications)
    : [];

  return (
    <div className="container-custom py-8 md:py-12 space-y-16">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <span>/</span>
        <span className="text-dark dark:text-white truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-light-darker dark:bg-dark-lighter border border-light-darkest dark:border-dark-lightest group cursor-zoom-in">
            <img
              src={images[activeImage] || getProductImage(product)}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-150 origin-center"
              onError={imgError(product)}
            />
            <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              Hover to Zoom
            </div>
            <button className="absolute right-6 top-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white text-dark transition-all shadow-xl">
              <Share2 size={24} />
            </button>
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 md:w-24 aspect-square flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" onError={imgError(product)} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                  {product.brand || 'Premium Brand'}
                </span>
                {product.isPrime && (
                  <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> Prime
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-accent">
                <Star size={16} fill="currentColor" />
                <span className="text-sm font-black text-dark dark:text-white">{product.ratings?.average || 0}</span>
                <span className="text-xs text-gray-400">({product.ratings?.count || 0} Reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none italic">{product.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="flex items-end gap-4">
            <span className="text-4xl font-black text-primary">₹{currentPrice.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <div className="flex flex-col">
                <span className="text-lg text-gray-400 line-through leading-none">₹{product.originalPrice.toLocaleString()}</span>
                <span className="text-sm font-black text-green-500 uppercase tracking-widest mt-1">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4 bg-light-darker dark:bg-dark p-6 rounded-2xl border border-light-darkest dark:border-dark-lightest">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Free Fast Delivery</p>
                <p className="text-[10px] text-gray-500 font-bold">Estimated: 3-5 Business Days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Genuine Product</p>
                <p className="text-[10px] text-gray-500 font-bold">From {product.source?.toUpperCase() || 'OFFICIAL'}</p>
              </div>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-light-darker dark:bg-dark p-1 rounded-xl border border-light-darkest dark:border-dark-lightest">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-dark-lighter rounded-lg transition-colors">
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-black text-xl">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock || 99, qty + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-dark-lighter rounded-lg transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-grow btn-primary py-5 px-8 flex items-center justify-center gap-3 text-lg shadow-xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={22} /> Add to Cart
              </button>
              <button
                onClick={() => dispatch(toggleWishlist(product))}
                className={`btn-secondary py-5 px-6 border-2 transition-all ${isWishlisted ? 'border-primary text-primary' : 'border-light-darkest dark:border-dark-lightest hover:border-primary hover:text-primary'}`}
              >
                <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Info */}
      <div className="pt-16 border-t border-light-darkest dark:border-dark-lightest grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-16">

          <section className="space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-primary w-fit pb-2">Description</h2>
            <div className="text-gray-500 dark:text-gray-400 text-base leading-relaxed whitespace-pre-line">
              {product.richDescription || product.description}
            </div>
          </section>

          {specEntries.length > 0 && (
            <section className="space-y-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-primary w-fit pb-2">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specEntries.map(([key, val]) => (
                  <div key={key} className="flex justify-between p-5 bg-light-darker dark:bg-dark rounded-2xl border border-light-darkest dark:border-dark-lightest">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">{key}</span>
                    <span className="text-sm font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="space-y-12 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-primary w-fit pb-2">Reviews</h2>
              <button className="btn-secondary py-2 px-6 rounded-full text-xs font-black uppercase tracking-widest border-2">Write a Review</button>
            </div>
            <div className="bg-primary/5 p-8 rounded-3xl text-center space-y-4 max-w-xs">
              <p className="text-7xl font-black text-primary">{product.ratings?.average || 0}</p>
              <div className="flex justify-center text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < Math.floor(product.ratings?.average || 0) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                Based on {product.ratings?.count || 0} reviews
              </p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-12">
            <section className="bg-dark text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-6 text-center">
                <Sparkles className="text-primary mx-auto" size={40} />
                <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight italic">Exclusive Deal!</h3>
                <p className="text-sm text-gray-400 font-medium">Buy now and get an extra 5% cashback on your Trendzz Wallet.</p>
                <button className="w-full btn-primary py-4 rounded-2xl text-sm font-black uppercase tracking-widest">Claim Reward</button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            </section>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related?.length > 0 && (
        <section className="pt-16 border-t border-light-darkest dark:border-dark-lightest">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-10">You May Also Like</h2>
          <ProductGrid products={related} isLoading={false} count={4} />
        </section>
      )}

    </div>
  );
};

export default ProductDetail;
