import { useGetSellerOrdersQuery } from '@/store/api/sellerApiSlice';
import { Search, ListOrdered, ChevronRight, CheckCircle2, Clock, Truck, XCircle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const SellerOrders = () => {
  const { data, isLoading } = useGetSellerOrdersQuery();
  const orders = data?.orders;

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-500 bg-green-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      case 'shipped': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  if (isLoading) return <div className="container-custom py-20 text-center font-black">LOADING SELLER ORDERS...</div>;

  return (
    <div className="container-custom py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Customer Orders</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Fulfill your orders efficiently</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <input 
                type="text" 
                placeholder="Order ID / Customer..." 
                className="input-field pl-12 py-3 rounded-full w-full md:w-64"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           </div>
           <button className="btn-secondary py-3 px-6 rounded-full flex items-center gap-2">
             <Filter size={18} /> Filter
           </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-light-darker dark:bg-dark text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-8 py-5">Order Details</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Order Items</th>
                <th className="px-8 py-5">Revenue</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-darkest dark:divide-dark-lightest">
              {orders?.map((order) => (
                <tr key={order._id} className="hover:bg-light-darker/20 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                       <span className="text-sm font-black">{order.orderNumber}</span>
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                         {new Date(order.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                       <span className="text-sm font-black">{order.user.name}</span>
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{order.shippingAddress.city}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex -space-x-3">
                       {order.orderItems.slice(0, 3).map((item, i) => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-lighter overflow-hidden shadow-sm">
                           <img src={item.image} alt="" className="w-full h-full object-cover" />
                         </div>
                       ))}
                       {order.orderItems.length > 3 && (
                         <div className="w-8 h-8 rounded-full bg-light-darker dark:bg-dark border-2 border-white dark:border-dark-lighter flex items-center justify-center text-[8px] font-black">
                           +{order.orderItems.length - 3}
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                     <span className="text-sm font-black text-primary">₹{order.totalPrice.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                       {order.status}
                     </span>
                  </td>
                  <td className="px-8 py-5">
                    <Link to={`/account/orders/${order._id}`} className="btn-secondary py-2 px-4 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                      Details
                    </Link>
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

export default SellerOrders;
