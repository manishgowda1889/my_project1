import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, MapPin, CreditCard, Truck,
  ArrowRight, ChevronLeft, Loader2, ShieldCheck,
  Zap, ShoppingBag,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { clearCartItems } from '@/store/slices/cartSlice';
import { useCreateOrderMutation } from '@/store/api/ordersApiSlice';
import { useCreateRazorpayOrderMutation, useVerifyRazorpayPaymentMutation } from '@/store/api/paymentApiSlice';
import { getProductImage, imgError } from '@/utils/getProductImage';

const steps = [
  { id: 1, title: 'Cart',     icon: ShoppingBag  },
  { id: 2, title: 'Address',  icon: MapPin       },
  { id: 3, title: 'Payment',  icon: CreditCard   },
  { id: 4, title: 'Summary',  icon: CheckCircle2 },
];

const EMPTY_ADDRESS = {
  fullName: '', phone: '', street: '', city: '', state: '', pincode: '', country: 'India',
};

const Checkout = () => {
  const [currentStep,    setCurrentStep]    = useState(2);
  const [paymentMethod,  setPaymentMethod]  = useState('COD');
  const [isProcessing,   setIsProcessing]   = useState(false);
  const [address,        setAddress]        = useState(EMPTY_ADDRESS);

  const { cartItems } = useSelector((state) => state.cart);
  const { user }      = useSelector((state) => state.auth);
  const dispatch      = useDispatch();
  const navigate      = useNavigate();

  const [createOrder]         = useCreateOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyRazorpay]      = useVerifyRazorpayPaymentMutation();

  const subtotal      = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const taxPrice      = Math.round(subtotal * 0.18);
  const shippingPrice = subtotal > 499 ? 0 : 40;
  const totalPrice    = subtotal + taxPrice + shippingPrice;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const { fullName, phone, street, city, state, pincode } = address;
    if (!fullName || !phone || !street || !city || !state || !pincode) {
      return toast.error('Please fill in all address fields');
    }
    setCurrentStep(3);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'Razorpay') handleRazorpayPayment();
    else handleCODOrder();
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        orderItems: cartItems, shippingAddress: address,
        paymentMethod: 'Razorpay',
        itemsPrice: subtotal, shippingPrice, taxPrice, totalPrice,
      };
      const dbOrder  = await createOrder(orderData).unwrap();
      const rzpOrder = await createRazorpayOrder({ amount: totalPrice }).unwrap();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: rzpOrder.amount, currency: rzpOrder.currency,
        name: 'Trendzz.', description: 'Order Payment',
        order_id: rzpOrder.id,
        handler: async (response) => {
          try {
            await verifyRazorpay({ ...response, orderId: dbOrder._id }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order-success/${dbOrder._id}`);
            toast.success('Payment successful!');
          } catch { toast.error('Payment verification failed'); }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#FF6B00' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err?.data?.message || 'Order failed');
    } finally { setIsProcessing(false); }
  };

  const handleCODOrder = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        orderItems: cartItems, shippingAddress: address,
        paymentMethod: 'COD',
        itemsPrice: subtotal, shippingPrice, taxPrice, totalPrice,
      };
      const dbOrder = await createOrder(orderData).unwrap();
      dispatch(clearCartItems());
      navigate(`/order-success/${dbOrder._id}`);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err?.data?.message || 'Order failed');
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="container-custom py-12 max-w-6xl">

      {/* Stepper */}
      <div className="flex items-center justify-center mb-16 relative">
        <div className="absolute top-6 left-0 w-full h-0.5 bg-light-darkest dark:bg-dark-lightest -z-10" />
        <div className="flex justify-between w-full max-w-3xl">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;
            return (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${isActive ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-dark border-light-darkest dark:border-dark-lightest text-gray-400'}`}>
                  <Icon size={20} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-gray-400'}`}>{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left — Forms */}
        <div className="lg:col-span-2 space-y-8">

          {/* ── Step 2: Address ── */}
          {currentStep === 2 && (
            <form onSubmit={handleAddressSubmit} className="bg-white dark:bg-dark-lighter p-8 rounded-[32px] border border-light-darkest dark:border-dark-lightest shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full Name *</label>
                  <input className="input-field py-3" placeholder="John Doe" value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Phone *</label>
                  <input className="input-field py-3" placeholder="9876543210" value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Street Address *</label>
                  <input className="input-field py-3" placeholder="House No, Street, Area" value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">City *</label>
                  <input className="input-field py-3" placeholder="Mumbai" value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">State *</label>
                  <input className="input-field py-3" placeholder="Maharashtra" value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pincode *</label>
                  <input className="input-field py-3" placeholder="400001" value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Country</label>
                  <input className="input-field py-3" value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                </div>
              </div>

              <button type="submit" className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2">
                Continue to Payment <ArrowRight size={20} />
              </button>
            </form>
          )}

          {/* ── Step 3: Payment ── */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-dark-lighter p-8 rounded-[32px] border border-light-darkest dark:border-dark-lightest shadow-sm space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="text-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'Razorpay', label: 'Razorpay', sub: 'UPI, Cards, Net Banking' },
                  { id: 'COD',      label: 'Cash on Delivery', sub: 'Pay when you receive' },
                ].map((m) => (
                  <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                    className={`p-6 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${paymentMethod === m.id ? 'border-primary bg-primary/5' : 'border-light-darkest dark:border-dark-lightest hover:border-gray-300'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${paymentMethod === m.id ? 'border-primary' : 'border-gray-300'}`}>
                      {paymentMethod === m.id && <div className="w-3 h-3 bg-primary rounded-full" />}
                    </div>
                    <div>
                      <p className="font-black uppercase tracking-widest text-sm mb-1">{m.label}</p>
                      <p className="text-xs text-gray-500">{m.sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setCurrentStep(2)} className="flex-1 btn-secondary py-4 rounded-2xl flex items-center justify-center gap-2">
                  <ChevronLeft size={20} /> Back
                </button>
                <button onClick={() => setCurrentStep(4)} className="flex-[2] btn-primary py-4 rounded-2xl flex items-center justify-center gap-2">
                  Review Order <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Summary ── */}
          {currentStep === 4 && (
            <div className="bg-white dark:bg-dark-lighter p-8 rounded-[32px] border border-light-darkest dark:border-dark-lightest shadow-sm space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="text-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">Order Summary</h2>
              </div>

              {/* Address recap */}
              <div className="p-4 bg-light-darker dark:bg-dark rounded-2xl text-sm space-y-1">
                <p className="font-black uppercase tracking-widest text-xs text-gray-400 mb-2">Delivering to</p>
                <p className="font-bold">{address.fullName} · {address.phone}</p>
                <p className="text-gray-500">{address.street}, {address.city}, {address.state} — {address.pincode}</p>
              </div>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4 items-center p-4 bg-light-darker dark:bg-dark rounded-2xl">
                    <img src={getProductImage(item)} onError={imgError(item)}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0" alt={item.title} />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{item.qty} × ₹{item.price.toLocaleString()}</p>
                    </div>
                    <p className="font-black text-primary flex-shrink-0">₹{(item.qty * item.price).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setCurrentStep(3)} className="flex-1 btn-secondary py-4 rounded-2xl flex items-center justify-center gap-2">
                  <ChevronLeft size={20} /> Back
                </button>
                <button onClick={handlePlaceOrder} disabled={isProcessing}
                  className="flex-[2] btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 shadow-2xl shadow-primary/40">
                  {isProcessing
                    ? <Loader2 className="animate-spin" size={20} />
                    : <> Place Order · ₹{totalPrice.toLocaleString()} <ArrowRight size={20} /> </>
                  }
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right — Price summary */}
        <div className="space-y-6">
          <div className="bg-dark text-white p-8 rounded-[32px] shadow-2xl space-y-6">
            <h3 className="text-xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Price Details</h3>
            <div className="space-y-4">
              {[
                { label: 'Subtotal',    value: `₹${subtotal.toLocaleString()}` },
                { label: 'GST (18%)',   value: `₹${taxPrice.toLocaleString()}` },
                { label: 'Shipping',    value: shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`, green: shippingPrice === 0 },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center text-gray-400">
                  <span className="text-sm font-bold uppercase tracking-widest">{row.label}</span>
                  <span className={`font-black ${row.green ? 'text-green-400' : 'text-white'}`}>{row.value}</span>
                </div>
              ))}
              <div className="h-px bg-white/10" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-black uppercase tracking-tighter italic text-primary">Total</span>
                <span className="text-2xl font-black text-white">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-light-darker dark:bg-dark p-6 rounded-2xl border border-light-darkest dark:border-dark-lightest space-y-4">
            {[
              { icon: ShieldCheck, text: '100% Secure Checkout' },
              { icon: Truck,       text: 'Free delivery above ₹499' },
              { icon: Zap,         text: 'Fast & Reliable Delivery', primary: true },
            ].map(({ icon: Icon, text, primary }) => (
              <div key={text} className="flex items-center gap-3 text-gray-500">
                <Icon size={18} className={primary ? 'text-primary' : ''} />
                <p className="text-[10px] font-black uppercase tracking-widest">{text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
