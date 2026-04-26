import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Star } from 'lucide-react';
import { getProductImage, imgError } from '@/utils/getProductImage';

const DealsSection = ({ products, isLoading }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { seconds = 59; minutes--; }
        else if (hours > 0) { minutes = 59; seconds = 59; hours--; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (n) => n.toString().padStart(2, '0');

  return (
    <section className="bg-primary/5 py-16 border-y border-primary/10">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-3">
              <Zap className="text-primary animate-bounce" size={40} fill="currentColor" />
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Flash Deals</h2>
            </div>
            
            <div className="flex items-center gap-3 bg-dark text-white px-6 py-3 rounded-2xl shadow-xl">
              <div className="text-center">
                <span className="block text-2xl font-black tabular-nums leading-none">{formatNum(timeLeft.hours)}</span>
                <span className="text-[10px] uppercase font-bold text-gray-500">Hrs</span>
              </div>
              <span className="text-2xl font-black text-primary animate-pulse">:</span>
              <div className="text-center">
                <span className="block text-2xl font-black tabular-nums leading-none">{formatNum(timeLeft.minutes)}</span>
                <span className="text-[10px] uppercase font-bold text-gray-500">Min</span>
              </div>
              <span className="text-2xl font-black text-primary animate-pulse">:</span>
              <div className="text-center">
                <span className="block text-2xl font-black tabular-nums leading-none">{formatNum(timeLeft.seconds)}</span>
                <span className="text-[10px] uppercase font-bold text-gray-500">Sec</span>
              </div>
              <div className="ml-4 border-l border-white/10 pl-4">
                <span className="text-xs font-black text-primary uppercase tracking-widest block">Ends Soon!</span>
              </div>
            </div>
          </div>
          
          <Link to="/products?deal=flash" className="btn-primary py-4 px-8 rounded-full flex items-center gap-2 group shadow-xl shadow-primary/20">
            Shop All Deals <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            [...Array(4)].map((_, i) => <div key={i} className="h-80 bg-gray-200 dark:bg-dark animate-pulse rounded-3xl" />)
          ) : (
            products?.slice(0, 4).map((product) => (
              <Link key={product._id} to={`/products/${product.slug}`} className="group bg-white dark:bg-dark-lighter rounded-3xl overflow-hidden border border-light-darkest dark:border-dark-lightest hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={getProductImage(product)} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={imgError(product)} />
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    -{Math.round(product.discountPercent || 0)}% OFF
                  </div>
                </div>
                <div className="p-6 space-y-3 flex-grow">
                  <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
                  <div className="flex items-center gap-1 text-accent">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-black text-dark dark:text-white">{product.ratings.average}</span>
                    <span className="text-xs text-gray-400 font-bold">({product.ratings.count})</span>
                  </div>
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-2xl font-black text-primary">₹{Math.round(product.price).toLocaleString('en-IN')}</span>
                    <span className="text-sm text-gray-400 line-through font-bold">₹{Math.round(product.originalPrice || product.price).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-dark h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-primary h-full w-[70%] rounded-full animate-pulse" />
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 pt-1">
                    <span>Sold: 42</span>
                    <span>Available: 15</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
