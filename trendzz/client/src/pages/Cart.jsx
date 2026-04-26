import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCartItems } from '@/store/slices/cartSlice';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { toast } from 'react-toastify';
import { getProductImage, imgError } from '@/utils/getProductImage';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 500 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const updateQty = (item, newQty) => {
    if (newQty < 1) return;
    if (newQty > (item.stock || 99)) return;
    dispatch(addToCart({ ...item, qty: newQty }));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-light-darker dark:bg-dark rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter">Your cart is empty</h2>
        <p className="text-gray-500 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Go ahead and explore our latest collections.</p>
        <Link to="/products" className="btn-primary py-3 px-8 inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4">
        Your Shopping Bag <span className="text-primary">({cartItems.length})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-6">
          {cartItems.map((item) => (
            <div key={`${item._id}-${JSON.stringify(item.variant)}`} className="card p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center">
              <Link to={`/products/${item.slug}`} className="w-full md:w-32 aspect-square rounded-xl overflow-hidden bg-light-darker flex-shrink-0">
                <img src={getProductImage(item)} alt={item.title} className="w-full h-full object-cover" onError={imgError(item)} />
              </Link>
              
              <div className="flex-grow space-y-2 text-center md:text-left">
                <Link to={`/products/${item.slug}`} className="text-lg font-black hover:text-primary transition-colors line-clamp-1">{item.title}</Link>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                   {item.brand && <span>{item.brand}</span>}
                   {item.variant?.size && <span className="bg-light-darker dark:bg-dark px-2 py-0.5 rounded">Size: {item.variant.size}</span>}
                   {item.variant?.color && <span className="bg-light-darker dark:bg-dark px-2 py-0.5 rounded">Color: {item.variant.color}</span>}
                </div>
                <p className="text-xl font-black">₹{item.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-light-darker dark:bg-dark p-1 rounded-xl border border-light-darkest dark:border-dark-lightest">
                  <button onClick={() => updateQty(item, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-dark-lighter rounded-lg transition-colors"><Minus size={14} /></button>
                  <span className="w-10 text-center font-black">{item.qty}</span>
                  <button onClick={() => updateQty(item, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-dark-lighter rounded-lg transition-colors"><Plus size={14} /></button>
                </div>
                <button 
                  onClick={() => dispatch(removeFromCart({ id: item._id, variant: item.variant }))}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-6">
            <Link to="/products" className="text-sm font-bold flex items-center gap-2 hover:text-primary">
              <ArrowRight className="rotate-180" size={18} /> Continue Shopping
            </Link>
            <button onClick={() => dispatch(clearCartItems())} className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">
              Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-4 space-y-8">
          <div className="card p-8 bg-light-darker dark:bg-dark-lighter border-none shadow-xl">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Order Summary</h3>
            
            <div className="space-y-4 text-sm font-bold">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={shipping === 0 ? 'text-green-500' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Tax (18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              
              <div className="h-px bg-light-darkest dark:bg-dark-lightest my-6"></div>
              
              <div className="flex justify-between text-xl font-black">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full btn-primary py-4 mt-8 flex items-center justify-center gap-3 text-lg shadow-lg shadow-primary/25"
            >
              Checkout Now <ArrowRight size={22} />
            </button>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <ShieldCheck size={16} className="text-primary" /> 100% Secure Checkout
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <Truck size={16} className="text-primary" /> Fast Reliable Delivery
              </div>
            </div>
          </div>

          {/* Coupon */}
          <div className="card p-6">
            <h4 className="text-sm font-black uppercase tracking-widest mb-4">Apply Coupon</h4>
            <div className="flex gap-2">
              <input type="text" placeholder="Promo code" className="input-field py-2 text-sm uppercase" />
              <button className="btn-secondary py-2 px-6 text-sm">Apply</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
