import { useGetSellerProductsQuery, useDeleteProductMutation } from '@/store/api/sellerApiSlice';
import { Plus, Search, MoreVertical, Edit3, Trash2, Eye, ExternalLink, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const SellerProducts = () => {
  const { data, isLoading } = useGetSellerProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const products = data?.products;

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.info('Product removed successfully');
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (isLoading) return <div className="container-custom py-20 text-center font-black">LOADING YOUR PRODUCTS...</div>;

  return (
    <div className="container-custom py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">My Products</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Inventory Management</p>
        </div>
        <div className="flex gap-4">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Filter products..." 
              className="input-field pl-12 py-3 rounded-full w-64"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Link to="/seller/products/new" className="btn-primary py-3 px-8 flex items-center gap-2">
            <Plus size={20} /> Add Product
          </Link>
        </div>
      </div>

      {!products || products.length === 0 ? (
        <div className="card py-24 text-center border-dashed border-2">
          <Package size={60} className="mx-auto text-gray-300 mb-6" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">No products listed</h3>
          <p className="text-gray-500 max-w-md mx-auto">Start listing your products to reach millions of customers on Trendzz.</p>
          <Link to="/seller/products/new" className="btn-primary py-3 px-12 mt-8 inline-block">List Your First Product</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-light-darker dark:bg-dark text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <th className="px-8 py-5">Product Info</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Stock</th>
                    <th className="px-8 py-5">Price</th>
                    <th className="px-8 py-5">Sales</th>
                    <th className="px-8 py-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-darkest dark:divide-dark-lightest">
                   {products.map((p) => (
                     <tr key={p._id} className="hover:bg-light-darker/20 transition-colors">
                       <td className="px-8 py-5">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-light-darker flex-shrink-0">
                               <img src={p.thumbnail || p.images[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                               <h4 className="text-sm font-black truncate max-w-[200px]">{p.title}</h4>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">SKU: {p.sku || 'N/A'}</p>
                            </div>
                         </div>
                       </td>
                       <td className="px-8 py-5">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-500">{p.category?.name || 'General'}</span>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className={`text-sm font-black ${p.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>{p.stock} Units</span>
                            {p.stock < 10 && <span className="text-[8px] font-black uppercase tracking-tighter text-red-400">Low Stock</span>}
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex flex-col">
                             <span className="text-sm font-black">₹{p.price.toLocaleString()}</span>
                             {p.discountPrice && <span className="text-[10px] text-gray-400 line-through">₹{p.discountPrice}</span>}
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <span className="text-sm font-black">{p.soldCount || 0}</span>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                             <Link to={`/products/${p.slug}`} target="_blank" className="p-2 hover:bg-light-darkest dark:hover:bg-dark-lightest rounded-lg transition-colors text-gray-400 hover:text-primary">
                               <ExternalLink size={18} />
                             </Link>
                             <Link to={`/seller/products/edit/${p._id}`} className="p-2 hover:bg-light-darkest dark:hover:bg-dark-lightest rounded-lg transition-colors text-gray-400 hover:text-primary">
                               <Edit3 size={18} />
                             </Link>
                             <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-gray-400 hover:text-red-500">
                               <Trash2 size={18} />
                             </button>
                          </div>
                       </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
