import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '@/store/api/productsApiSlice';
import { useGetCategoriesQuery } from '@/store/api/categoriesApiSlice';
import ProductGrid from '../components/product/ProductGrid';
import { SlidersHorizontal, ChevronDown, LayoutGrid, List } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const page = searchParams.get('page') || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';

  const { data, isLoading, isFetching } = useGetProductsQuery({
    q: query,
    category,
    sort,
    page,
    minPrice,
    maxPrice,
    rating
  });

  const { data: catData } = useGetCategoriesQuery();

  const handleSort = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    setSearchParams(params);
  };

  const updateFilter = (name, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    // Only reset to page 1 when changing a filter — NOT when changing the page itself
    if (name !== 'page') {
      params.set('page', '1');
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="container-custom py-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            {query ? `Search results for "${query}"` : category ? `Category: ${category}` : 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
            {data?.total || 0} Products Found
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden flex items-center gap-2 btn-secondary py-2 px-4"
          >
            <SlidersHorizontal size={18} /> Filters
          </button>

          <div className="hidden md:flex items-center gap-2 bg-light-darker dark:bg-dark p-1 rounded-lg border border-light-darkest dark:border-dark-lightest">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-dark-lighter shadow-sm text-primary' : 'text-gray-400'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-dark-lighter shadow-sm text-primary' : 'text-gray-400'}`}
            >
              <List size={20} />
            </button>
          </div>

          <div className="relative group">
            <select 
              value={sort}
              onChange={handleSort}
              className="appearance-none bg-light-darker dark:bg-dark border border-light-darkest dark:border-dark-lightest py-2.5 pl-4 pr-10 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
            >
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-ratings.average">Avg. Rating</option>
              <option value="-soldCount">Most Popular</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={18} />
          </div>
        </div>
      </div>

      <div className="flex gap-8 min-w-0">
        
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-56 flex-shrink-0 space-y-8">
          
          {/* Category Filter */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-4">Category</h4>
            <div className="space-y-2">
              <button 
                onClick={() => updateFilter('category', '')}
                className={`block text-sm font-bold transition-colors ${!category ? 'text-primary' : 'text-gray-500 hover:text-dark dark:hover:text-white'}`}
              >
                All Categories
              </button>
              {catData?.categories?.map((cat) => (
                <button 
                  key={cat._id}
                  onClick={() => updateFilter('category', cat.slug)}
                  className={`block text-sm font-bold transition-colors ${category === cat.slug ? 'text-primary' : 'text-gray-500 hover:text-dark dark:hover:text-white'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Categories */}
          {data?.filters?.priceRanges && (
            <div>
              <h4 className="font-black uppercase tracking-widest text-sm mb-4">Price Range</h4>
              <div className="space-y-2">
                {[
                  { id: 'budget', label: 'Budget', count: data.filters.priceRanges.budget },
                  { id: 'mid', label: 'Mid-Range', count: data.filters.priceRanges.mid },
                  { id: 'premium', label: 'Premium', count: data.filters.priceRanges.premium },
                  { id: 'luxury', label: 'Luxury', count: data.filters.priceRanges.luxury },
                ].map((range) => (
                  <label key={range.id} className={`flex items-center justify-between cursor-pointer group ${range.count === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="priceRange" 
                        className="accent-primary" 
                        checked={searchParams.get('priceRange') === range.id}
                        onChange={() => updateFilter('priceRange', range.id)}
                      />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {range.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-bold bg-light-darker dark:bg-dark px-2 py-0.5 rounded-md">
                      {range.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Custom Price Range */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-4 text-gray-400">Custom Range</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="input-field py-1.5 text-xs" 
                  value={minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                />
                <span className="text-gray-300">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="input-field py-1.5 text-xs" 
                  value={maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-4">Customer Rating</h4>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="rating" 
                    className="accent-primary" 
                    checked={Number(rating) === r}
                    onChange={() => updateFilter('rating', r.toString())}
                  />
                  <span className="text-sm font-medium flex items-center gap-1 group-hover:text-primary transition-colors">
                    {r}★ & above
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button 
            onClick={clearFilters}
            className="w-full btn-secondary py-2 text-xs"
          >
            Clear All Filters
          </button>
        </aside>

        {/* Product Listing */}
        <div className="flex-grow min-w-0">
          {isLoading || isFetching ? (
            <ProductGrid isLoading={true} count={12} />
          ) : (
            <>
              <ProductGrid products={data?.products} isLoading={false} />
              
              {/* Pagination */}
              {data?.pages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                  {/* Prev */}
                  <button
                    disabled={Number(page) === 1}
                    onClick={() => updateFilter('page', (Number(page) - 1).toString())}
                    className="p-2 bg-white dark:bg-dark-lighter border border-light-darkest dark:border-dark-lightest rounded-lg disabled:opacity-30 hover:border-primary transition-colors"
                  >
                    <ChevronDown className="rotate-90" size={18} />
                  </button>

                  {/* Page numbers — sliding window of 5 */}
                  {(() => {
                    const total = data.pages;
                    const cur   = Number(page);
                    let start = Math.max(1, cur - 2);
                    let end   = Math.min(total, start + 4);
                    if (end - start < 4) start = Math.max(1, end - 4);
                    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
                      <button
                        key={p}
                        onClick={() => updateFilter('page', p.toString())}
                        className={`w-10 h-10 rounded-lg font-black transition-all text-sm ${
                          cur === p
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                            : 'bg-white dark:bg-dark-lighter border border-light-darkest dark:border-dark-lightest hover:border-primary'
                        }`}
                      >
                        {p}
                      </button>
                    ));
                  })()}

                  {/* Next */}
                  <button
                    disabled={Number(page) === data.pages}
                    onClick={() => updateFilter('page', (Number(page) + 1).toString())}
                    className="p-2 bg-white dark:bg-dark-lighter border border-light-darkest dark:border-dark-lightest rounded-lg disabled:opacity-30 hover:border-primary transition-colors"
                  >
                    <ChevronDown className="-rotate-90" size={18} />
                  </button>

                  <span className="text-xs text-gray-400 font-bold ml-2">
                    Page {page} of {data.pages}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

      </div>

      {/* Mobile Filter Sidebar Drawer (Portal would be better, but simplified here) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-dark-lighter p-6 animate-in slide-in-from-left duration-300">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black uppercase tracking-tighter">Filters</h3>
               <button onClick={() => setIsSidebarOpen(false)} className="p-2"><ChevronDown className="rotate-90" /></button>
             </div>
             {/* Duplicate filter logic here for mobile... */}
             <button onClick={() => setIsSidebarOpen(false)} className="w-full btn-primary py-3">Apply Filters</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
