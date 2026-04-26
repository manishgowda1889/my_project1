import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
  const { id } = useParams();

  useEffect(() => {
    // Fire confetti!
    const duration = 3 * 1000;
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
    <div className="container-custom py-24 flex flex-col items-center text-center space-y-8">
      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 animate-bounce">
        <CheckCircle size={48} className="text-white" />
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Order Confirmed!</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
          Thank you for shopping with Trendzz. Your order is being processed.
        </p>
      </div>

      <div className="bg-light-darker dark:bg-dark p-8 rounded-3xl border border-light-darkest dark:border-dark-lightest max-w-lg w-full">
         <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Order ID</span>
            <span className="font-black text-primary">#{id?.slice(-8).toUpperCase()}</span>
         </div>
         <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
               <Package size={24} />
            </div>
            <div>
               <p className="font-bold">Estimated Delivery</p>
               <p className="text-xs text-gray-500">3-5 Business Days</p>
            </div>
         </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/account/orders" className="btn-primary py-4 px-10 rounded-2xl flex items-center gap-2">
           View My Orders <ArrowRight size={20} />
        </Link>
        <Link to="/" className="btn-secondary py-4 px-10 rounded-2xl flex items-center gap-2">
           <Home size={20} /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
