import ProductCard from './ProductCard';
import SkeletonLoaders from '../ui/SkeletonLoaders';

// cols prop lets the parent control max columns (default 4 — safe inside sidebar layout)
const ProductGrid = ({ products, isLoading, count = 12, cols = 4 }) => {
  const gridClass = {
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  }[cols] || 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  if (isLoading) {
    return (
      <div className={`grid ${gridClass} gap-4 md:gap-6`}>
        {[...Array(count)].map((_, i) => (
          <SkeletonLoaders.ProductCard key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔍</p>
        <h3 className="text-xl font-black uppercase tracking-tighter mb-2">No products found</h3>
        <p className="text-gray-500 font-bold text-sm">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridClass} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
