import { Link } from 'react-router-dom';
import HeroBanner from '@/components/ui/HeroBanner';
import CategoryGrid from '@/components/ui/CategoryGrid';
import DealsSection from '@/components/ui/DealsSection';
import BrandsSection from '@/components/ui/BrandsSection';
import ProductGrid from '@/components/product/ProductGrid';
import { 
  useGetProductsQuery 
} from '@/store/api/productsApiSlice';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShoppingBag,
  BookOpen,
  Zap
} from 'lucide-react';

const Home = () => {
  // Fetch products for different sections
  const { data: featuredData, isLoading: isFeaturedLoading } = useGetProductsQuery({ limit: 8, isFeatured: true });
  const { data: flashData, isLoading: isFlashLoading } = useGetProductsQuery({ limit: 4, sort: '-discountPercent' });
  const { data: newArrivalsData, isLoading: isNewArrivalsLoading } = useGetProductsQuery({ limit: 8, sort: '-createdAt' });
  const { data: groceryData, isLoading: isGroceryLoading } = useGetProductsQuery({ limit: 8, category: 'groceries-food' });
  const { data: bookData, isLoading: isBookLoading } = useGetProductsQuery({ limit: 8, category: 'books' });
  const { data: trendingData, isLoading: isTrendingLoading } = useGetProductsQuery({ limit: 8, sort: '-ratings.average' });

  return (
    <div className="space-y-20 pb-32">
      
      {/* 1. HeroBanner */}
      <HeroBanner />

      {/* 2. CategoryGrid */}
      <CategoryGrid />

      {/* 3. Brands */}
      <BrandsSection />

      {/* 4. DealsOfTheDay (Countdown) */}
      <DealsSection products={flashData?.products} isLoading={isFlashLoading} />

      {/* 4. FeaturedProducts */}
      <section className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Sparkles className="text-primary" size={32} />
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Featured Picks</h2>
          </div>
          <Link to="/products?featured=true" className="btn-secondary rounded-full py-2.5 px-6 font-black text-xs uppercase tracking-widest border-2">
            View All
          </Link>
        </div>
        <ProductGrid products={featuredData?.products} isLoading={isFeaturedLoading} count={8} />
      </section>

      {/* 5. New Arrivals */}
      <section className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Zap className="text-primary" size={32} />
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">New Arrivals</h2>
          </div>
          <Link to="/products?sort=-createdAt" className="btn-secondary rounded-full py-2.5 px-6 font-black text-xs uppercase tracking-widest border-2">
            Explore New
          </Link>
        </div>
        <ProductGrid products={newArrivalsData?.products} isLoading={isNewArrivalsLoading} count={8} />
      </section>

      {/* 6. Grocery Section */}
      <section className="bg-green-500/5 py-20 border-y border-green-500/10">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3 text-green-600">
              <ShoppingBag size={32} />
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Fresh Groceries</h2>
            </div>
            <Link to="/products?category=groceries" className="text-green-600 font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-2">
              Shop Grocery <ArrowRight size={18} />
            </Link>
          </div>
          <ProductGrid products={groceryData?.products} isLoading={isGroceryLoading} count={8} />
        </div>
      </section>

      {/* 7. Books Section */}
      <section className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 text-orange-600">
            <BookOpen size={32} />
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Literary Corner</h2>
          </div>
          <Link to="/products?category=books" className="text-orange-600 font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-2">
            Explore Books <ArrowRight size={18} />
          </Link>
        </div>
        <ProductGrid products={bookData?.products} isLoading={isBookLoading} count={8} />
      </section>

      {/* 8. Trending Now */}
      <section className="container-custom">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <TrendingUp className="text-primary" size={40} />
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Trending Now</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm max-w-lg">
            The most loved products by our community this week.
          </p>
        </div>
        <ProductGrid products={trendingData?.products} isLoading={isTrendingLoading} count={8} />
      </section>

      {/* Call to Action Banner */}
      <section className="container-custom pb-20">
        <div className="relative rounded-[40px] overflow-hidden bg-dark text-white p-12 md:p-24 text-center space-y-8 shadow-2xl">
           <img 
            src="https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=2070" 
            alt="Promo" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none max-w-5xl mx-auto italic">
              JOIN THE <span className="text-primary">TRENDZZ</span> TRIBE.
            </h2>
            <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium">
              Get exclusive early access to drops, member-only pricing, and free shipping on your first 3 orders.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link to="/register" className="btn-primary py-5 px-12 text-xl rounded-2xl shadow-2xl shadow-primary/40">Create Free Account</Link>
              <Link to="/products" className="btn-secondary py-5 px-12 text-xl rounded-2xl bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-xl">Start Shopping</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
