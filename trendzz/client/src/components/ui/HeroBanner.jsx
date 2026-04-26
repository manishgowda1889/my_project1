import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    title: 'Upgrade Your Tech Lifestyle',
    subtitle: 'Premium Gadgets & Electronics',
    desc: 'Experience the next generation of performance with up to 40% off on top-tier laptops and smartphones.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=2070',
    cta: 'Shop Electronics',
    link: '/products?category=electronics',
    color: 'from-blue-600 to-indigo-900',
  },
  {
    id: 2,
    title: 'Summer Collection 2025',
    subtitle: 'New Arrivals in Fashion',
    desc: 'Unleash your style with our curated summer essentials. Bold colors, breathable fabrics, and timeless designs.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070',
    cta: 'Explore Fashion',
    link: '/products?category=fashion',
    color: 'from-primary to-orange-700',
  },
  {
    id: 3,
    title: 'Sports & Fitness',
    subtitle: 'Gear Up for Your Best Performance',
    desc: 'From running shoes to gym equipment — everything you need to crush your fitness goals.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2070',
    cta: 'Shop Sports',
    link: '/products?category=sports',
    color: 'from-green-600 to-emerald-900',
  },
  {
    id: 4,
    title: 'Beauty Essentials',
    subtitle: 'Glow Up with Premium Skincare',
    desc: 'Discover top-rated skincare, makeup, and wellness products from the brands you love.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=2070',
    cta: 'Shop Beauty',
    link: '/products?category=beauty',
    color: 'from-pink-600 to-rose-900',
  },
  {
    id: 5,
    title: 'Home & Kitchen',
    subtitle: 'Make Your Home Smarter',
    desc: 'Upgrade your living space with smart appliances, stylish furniture, and kitchen essentials.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=2070',
    cta: 'Shop Home',
    link: '/products?category=home',
    color: 'from-teal-600 to-cyan-900',
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((c) => (c === banners.length - 1 ? 0 : c + 1));
  const prevSlide = () => setCurrent((c) => (c === 0 ? banners.length - 1 : c - 1));

  return (
    <section className="relative h-[500px] md:h-[650px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/45 z-10" />
          <img
            src={banners[current].image}
            alt={banners[current].title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://picsum.photos/seed/banner${current}/1200/650`;
            }}
          />

          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container-custom">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-3xl space-y-6"
              >
                <div className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${banners[current].color} text-white text-xs font-black uppercase tracking-widest`}>
                  {banners[current].subtitle}
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
                  {banners[current].title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed">
                  {banners[current].desc}
                </p>
                <div className="pt-4">
                  <Link
                    to={banners[current].link}
                    className="btn-primary py-4 px-10 text-lg flex items-center gap-2 group w-fit"
                  >
                    {banners[current].cta}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 transition-all duration-300 rounded-full ${current === i ? 'w-10 bg-primary' : 'w-2 bg-white/50 hover:bg-white'}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <div className="hidden md:flex absolute inset-y-0 left-8 z-30 items-center">
        <button onClick={prevSlide} className="p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all">
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="hidden md:flex absolute inset-y-0 right-8 z-30 items-center">
        <button onClick={nextSlide} className="p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default HeroBanner;
