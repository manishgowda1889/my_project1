import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle, Package, ArrowRight, Home, ShoppingBag } from 'lucide-react';

const Success = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-custom py-20 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 shadow-lg shadow-green-500/20 ring-8 ring-green-50 dark:ring-green-900/10">
        <CheckCircle size={50} strokeWidth={3} />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Order Confirmed!</h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Thank you for shopping with Trendzz.</p>
      </div>

      <div className="card p-8 bg-white dark:bg-dark-lighter max-w-lg w-full border-dashed border-2 border-primary/30">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Order ID</p>
        <p className="text-2xl font-black text-primary truncate">#{orderId?.slice(-12) || 'TRZ-000000000000'}</p>
        <p className="text-xs text-gray-400 mt-4">We've sent a confirmation email with all the details to your inbox.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-8">
        <Link to="/account/orders" className="btn-primary py-4 px-8 flex items-center gap-3 text-lg">
          <Package size={22} /> Track Order
        </Link>
        <Link to="/" className="btn-secondary py-4 px-8 flex items-center gap-3 text-lg">
          <Home size={22} /> Back to Home
        </Link>
      </div>

      <p className="text-xs font-bold text-gray-400 flex items-center gap-2 pt-12 uppercase tracking-widest">
        Need help? <Link to="/contact" className="text-primary hover:underline">Contact Support</Link>
      </p>
    </div>
  );
};

export default Success;
