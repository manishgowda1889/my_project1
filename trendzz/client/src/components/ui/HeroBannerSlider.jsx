import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2070',
    title: 'The Future of Fashion',
    subtitle: 'Explore our latest collection of premium clothing and accessories.',
    cta: 'Shop Now',
    link: '/products?category=fashion',
    color: 'text-white'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=2024',
    title: 'Next-Gen Electronics',
    subtitle: 'Experience cutting-edge technology with our new smartphone range.',
    cta: 'Discover',
    link: '/products?category=electronics',
    color: 'text-white'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2070',
    title: 'Summer Flash Sale',
    subtitle: 'Get up to 70% off on all trending products this weekend only.',
    cta: 'Get Deals',
    link: '/products?discount=50',
    color: 'text-white'
  }
];

const HeroBannerSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === banners.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? banners.length - 1 : current - 1);

  return (
    <section className="relative overflow-hidden bg-light-darker dark:bg-dark group">
      <div 
        className="flex transition-transform duration-700 ease-in-out h-[400px] md:h-[600px]"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-full relative">
            <img 
              src={banner.image} 
              alt={banner.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="container-custom py-12 px-8">
                <div className={`max-w-xl space-y-4 md:space-y-6 ${banner.color}`}>
                  <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[1.1] animate-in slide-in-from-left duration-700">
                    {banner.title}
                  </h1>
                  <p className="text-lg md:text-xl font-medium opacity-90 animate-in slide-in-from-left delay-150 duration-700">
                    {banner.subtitle}
                  </p>
                  <div className="pt-4 animate-in slide-in-from-left delay-300 duration-700">
                    <Link to={banner.link} className="btn-primary py-3 px-8 flex items-center gap-2 w-fit group/btn">
                      {banner.cta} <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {banners.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${current === index ? 'bg-primary w-8 md:w-12' : 'bg-white/50 hover:bg-white'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBannerSlider;
