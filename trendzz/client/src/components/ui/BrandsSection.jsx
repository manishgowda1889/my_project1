import { Link } from 'react-router-dom';

// Inline SVG logos — no external API needed, always works offline
const brands = [
  {
    name: 'Nike', slug: 'nike',
    logo: (
      <svg viewBox="0 0 80 30" className="w-16 h-8 fill-current">
        <path d="M80 0L20.9 30 0 20.2 54.5 0z"/>
      </svg>
    ),
  },
  {
    name: 'Adidas', slug: 'adidas',
    logo: (
      <svg viewBox="0 0 60 60" className="w-10 h-10 fill-current">
        <path d="M30 0L0 52h12L30 20l18 32h12z"/>
        <rect x="0" y="56" width="60" height="4"/>
      </svg>
    ),
  },
  {
    name: 'Apple', slug: 'apple',
    logo: (
      <svg viewBox="0 0 814 1000" className="w-8 h-10 fill-current">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.5-49 30.8 0 108.2 2.6 168.6 71.9zm-174.5-89.3c-27.5-32.5-67.5-56.8-109.3-56.8-5.1 0-10.3.6-15.4 1.3 1.3-5.8 1.9-11.6 1.9-17.4 0-57.8-38.2-118.3-103.1-118.3-64.9 0-103.1 60.5-103.1 118.3 0 5.8.6 11.6 1.9 17.4-5.1-.6-10.3-1.3-15.4-1.3-41.8 0-81.8 24.3-109.3 56.8 27.5 32.5 67.5 56.8 109.3 56.8 5.1 0 10.3-.6 15.4-1.3-1.3 5.8-1.9 11.6-1.9 17.4 0 57.8 38.2 118.3 103.1 118.3 64.9 0 103.1-60.5 103.1-118.3 0-5.8-.6-11.6-1.9-17.4 5.1.6 10.3 1.3 15.4 1.3 41.8 0 81.8-24.3 109.3-56.8z"/>
      </svg>
    ),
  },
  {
    name: 'Samsung', slug: 'samsung',
    logo: (
      <span className="text-[11px] font-black tracking-widest uppercase">SAMSUNG</span>
    ),
  },
  {
    name: 'Sony', slug: 'sony',
    logo: (
      <span className="text-lg font-black tracking-widest uppercase italic">SONY</span>
    ),
  },
  {
    name: 'Puma', slug: 'puma',
    logo: (
      <span className="text-lg font-black tracking-widest uppercase">PUMA</span>
    ),
  },
  {
    name: 'Boat', slug: 'boat',
    logo: (
      <span className="text-base font-black tracking-widest uppercase">boAt</span>
    ),
  },
  {
    name: 'Lakme', slug: 'lakme',
    logo: (
      <span className="text-base font-black tracking-widest uppercase italic">Lakmé</span>
    ),
  },
  {
    name: 'Himalaya', slug: 'himalaya',
    logo: (
      <span className="text-[11px] font-black tracking-widest uppercase">HIMALAYA</span>
    ),
  },
  {
    name: 'Prestige', slug: 'prestige',
    logo: (
      <span className="text-[11px] font-black tracking-widest uppercase">PRESTIGE</span>
    ),
  },
  {
    name: 'Fastrack', slug: 'fastrack',
    logo: (
      <span className="text-[11px] font-black tracking-widest uppercase">FASTRACK</span>
    ),
  },
  {
    name: 'Wildcraft', slug: 'wildcraft',
    logo: (
      <span className="text-[10px] font-black tracking-widest uppercase">WILDCRAFT</span>
    ),
  },
  {
    name: 'Mamaearth', slug: 'mamaearth',
    logo: (
      <span className="text-[10px] font-black tracking-widest uppercase">mamaearth</span>
    ),
  },
  {
    name: 'Decathlon', slug: 'decathlon',
    logo: (
      <span className="text-[10px] font-black tracking-widest uppercase">DECATHLON</span>
    ),
  },
  {
    name: 'Reebok', slug: 'reebok',
    logo: (
      <span className="text-[11px] font-black tracking-widest uppercase">REEBOK</span>
    ),
  },
  {
    name: 'Philips', slug: 'philips',
    logo: (
      <span className="text-[11px] font-black tracking-widest uppercase">PHILIPS</span>
    ),
  },
];

const BrandsSection = () => (
  <section className="container-custom">
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Top Brands</h2>
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">
        Shop from the world's most trusted names
      </p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {brands.map((brand) => (
        <Link
          key={brand.slug}
          to={`/products?brand=${brand.slug}`}
          className="group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-light-darkest dark:border-dark-lightest bg-white dark:bg-dark-lighter hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 min-h-[90px]"
        >
          <div className="h-10 flex items-center justify-center text-dark dark:text-white group-hover:text-primary transition-colors duration-300 group-hover:scale-110 transform">
            {brand.logo}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-primary transition-colors text-center">
            {brand.name}
          </span>
        </Link>
      ))}
    </div>
  </section>
);

export default BrandsSection;
