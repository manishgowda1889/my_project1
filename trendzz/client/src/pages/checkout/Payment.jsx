import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderMutation, useCreatePaymentIntentMutation } from '@/store/api/ordersApiSlice';
import { clearCartItems } from '@/store/slices/cartSlice';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShieldCheck, Loader2, CreditCard, Landmark, ArrowRight, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ clientSecret, orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      toast.error(result.error.message);
      setIsProcessing(false);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        dispatch(clearCartItems());
        navigate(`/checkout/success?orderId=${orderId}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="p-6 bg-light-darker dark:bg-dark rounded-2xl border border-light-darkest dark:border-dark-lightest shadow-inner">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#111827',
              '::placeholder': { color: '#9ca3af' },
            },
            invalid: { color: '#ef4444' },
          }
        }} />
      </div>
      <button 
        disabled={!stripe || isProcessing}
        className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-lg shadow-lg shadow-primary/25 disabled:opacity-50"
      >
        {isProcessing ? <Loader2 className="animate-spin" /> : <>Pay & Place Order <Lock size={20} /></>}
      </button>
    </form>
  );
};

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [isPreparing, setIsPreparing] = useState(true);

  const [createOrder] = useCreateOrderMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  useEffect(() => {
    const initOrder = async () => {
      if (!shippingAddress || cartItems.length === 0) {
        navigate('/checkout');
        return;
      }

      try {
        // Create order first (pending)
        const orderRes = await createOrder({
          shippingAddress,
          paymentMethod: paymentMethod.toLowerCase(),
          orderItems: cartItems.map(i => ({
            product: i._id,
            title: i.title,
            image: i.thumbnail || i.images[0],
            price: i.price,
            qty: i.qty,
            variant: i.variant
          })),
          itemsPrice: cartItems.reduce((acc, i) => acc + i.price * i.qty, 0),
          totalPrice: cartItems.reduce((acc, i) => acc + i.price * i.qty, 0) + (cartItems.reduce((acc, i) => acc + i.price * i.qty, 0) > 500 ? 0 : 49) + Math.round(cartItems.reduce((acc, i) => acc + i.price * i.qty, 0) * 0.18)
        }).unwrap();

        setOrderId(orderRes.order._id);

        if (paymentMethod === 'Stripe') {
          const piRes = await createPaymentIntent(orderRes.order._id).unwrap();
          setClientSecret(piRes.clientSecret);
        } else if (paymentMethod === 'COD') {
           // For COD, we are already done
           dispatch(clearCartItems());
           navigate(`/checkout/success?orderId=${orderRes.order._id}`);
        }
      } catch (err) {
        toast.error('Failed to prepare checkout. Please try again.');
        console.error(err);
      } finally {
        setIsPreparing(false);
      }
    };

    initOrder();
  }, []);

  if (isPreparing) {
    return (
      <div className="container-custom py-20 text-center flex flex-col items-center gap-6">
        <Loader2 size={60} className="animate-spin text-primary" />
        <h2 className="text-3xl font-black uppercase tracking-tighter">Preparing your checkout...</h2>
      </div>
    );
  }

  return (
    <div className="container-custom py-12 flex justify-center">
      <div className="max-w-2xl w-full bg-white dark:bg-dark-lighter p-8 md:p-12 rounded-3xl shadow-xl border border-light-darkest dark:border-dark-lightest">
        <div className="text-center space-y-4 mb-12">
          <ShieldCheck size={60} className="mx-auto text-green-500" />
          <h2 className="text-3xl font-black uppercase tracking-tighter">Secure Payment</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Complete your purchase using Stripe</p>
        </div>

        {paymentMethod === 'Stripe' && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} orderId={orderId} />
          </Elements>
        )}

        <div className="mt-12 pt-8 border-t border-light-darkest dark:border-dark-lightest flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
           <div className="flex items-center gap-2">
             <Lock size={14} className="text-green-500" /> AES-256 Encryption
           </div>
           <div className="flex gap-4">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 grayscale" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 grayscale" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
