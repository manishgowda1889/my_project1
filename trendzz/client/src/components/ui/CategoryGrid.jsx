import { Link } from 'react-router-dom';

// picsum.photos/seed/<seed>/W/H — free, no API key, always works
const categories = [
  { name: 'Electronics',    icon: '📱', seed: 'elec1',   link: '/products?category=electronics' },
  { name: 'Fashion',        icon: '👗', seed: 'fash1',   link: '/products?category=fashion' },
  { name: 'Home & Kitchen', icon: '🏠', seed: 'home1',   link: '/products?category=home' },
  { name: 'Books',          icon: '📚', seed: 'book1',   link: '/products?category=books' },
  { name: 'Beauty',         icon: '💄', seed: 'beau1',   link: '/products?category=beauty' },
  { name: 'Sports',         icon: '⚽', seed: 'sprt1',   link: '/products?category=sports' },
  { name: 'Groceries',      icon: '🛒', seed: 'groc1',   link: '/products?category=groceries' },
  { name: 'Health',         icon: '💊', seed: 'hlth1',   link: '/products?category=health' },
];

const CategoryGrid = () => (
  <section className="container-custom">
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
      {categories.map((cat) => (
        <Link
          key={cat.name}
          to={cat.link}
          className="group flex flex-col items-center gap-3 rounded-2xl border border-light-darkest dark:border-dark-lightest bg-white dark:bg-dark-lighter overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-full aspect-square overflow-hidden relative">
            <img
              src={`https://picsum.photos/seed/${cat.seed}/300/300`}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Emoji fallback if image fails */}
            <div
              className="absolute inset-0 items-center justify-center text-5xl bg-light-darker dark:bg-dark"
              style={{ display: 'none' }}
            >
              {cat.icon}
            </div>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-center group-hover:text-primary transition-colors pb-3 px-2">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  </section>
);

export default CategoryGrid;
