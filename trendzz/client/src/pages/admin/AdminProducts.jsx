import { useGetProductsQuery, useDeleteProductMutation } from '@/store/api/productsApiSlice';
import { Search, Plus, Trash2, Edit3, Eye, MoreVertical, Filter, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductImage, imgError } from '@/utils/getProductImage';

const AdminProducts = () => {
  const { data, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const products = data?.products;

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product permanently?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.info('Product removed');
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  if (isLoading) return <div className="container-custom py-20 text-center font-black uppercase tracking-widest">Indexing Catalog...</div>;

  return (
    <div className="container-custom py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Global Inventory</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Manage all platform listings</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <input 
                type="text" 
                placeholder="Product name, SKU..." 
                className="input-field pl-12 py-3 rounded-full w-full md:w-80"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           </div>
           <Link to="/seller/products/new" className="btn-primary py-3 px-8 flex items-center gap-2">
             <Plus size={20} /> Add Product
           </Link>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-light-darker dark:bg-dark text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5">Seller</th>
                <th className="px-8 py-5">Inventory</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5">Performance</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-darkest dark:divide-dark-lightest">
              {products?.map((p) => (
                <tr key={p._id} className="hover:bg-light-darker/20 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-lg overflow-hidden bg-light-darker flex-shrink-0">
                         <img src={getProductImage(p)} alt="" className="w-full h-full object-cover" onError={imgError(p)} />
                       </div>
                       <div className="min-w-0">
                          <h4 className="text-sm font-black truncate max-w-[200px]">{p.title}</h4>
                          <span className="bg-light-darker/50 dark:bg-dark px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-gray-400">{p.category?.name || 'Uncategorized'}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                     <div className="flex flex-col">
                        <span className="text-xs font-black truncate max-w-[120px]">{p.seller?.name || 'Official Store'}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary">Partner</span>
                     </div>
                  </td>
                  <td className="px-8 py-5">
                     <span className={`text-sm font-black ${p.stock < 20 ? 'text-orange-500' : 'text-gray-500'}`}>{p.stock}</span>
                  </td>
                  <td className="px-8 py-5">
                     <span className="text-sm font-black">₹{p.price.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                     <div className="flex items-center gap-1 text-accent">
                        <Tag size={12} className="text-primary" />
                        <span className="text-xs font-black">{p.soldCount || 0} Sold</span>
                     </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <Link to={`/products/${p.slug}`} target="_blank" className="p-2 hover:bg-light-darkest dark:hover:bg-dark-lightest rounded-lg transition-colors text-gray-400 hover:text-primary">
                         <Eye size={18} />
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
    </div>
  );
};

export default AdminProducts;
