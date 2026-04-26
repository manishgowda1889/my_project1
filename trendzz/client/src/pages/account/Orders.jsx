import { useGetMyOrdersQuery } from '@/store/api/ordersApiSlice';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Search, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import SkeletonLoaders from '../../components/ui/SkeletonLoaders';

const Orders = () => {
  const { data, isLoading } = useGetMyOrdersQuery();
  const orders = data?.orders;

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-500 bg-green-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      case 'shipped': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      case 'shipped': return <Truck size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (isLoading) return <div className="container-custom py-20 text-center font-black">FETCHING YOUR ORDERS...</div>;

  return (
    <div className="container-custom py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">My Orders</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Manage your purchases and tracking</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search all orders..." 
            className="input-field pl-12 py-3 rounded-full w-full md:w-80"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="card py-20 text-center space-y-6">
          <Package size={60} className="mx-auto text-gray-300" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">No orders found</h3>
          <p className="text-gray-500">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn-primary py-3 px-8 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card group hover:border-primary transition-all duration-300">
               <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                  
                  {/* Order Images */}
                  <div className="flex -space-x-6">
                    {order.orderItems.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-4 border-white dark:border-dark-lighter shadow-xl">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="w-20 h-20 rounded-xl bg-light-darker dark:bg-dark border-4 border-white dark:border-dark-lighter flex items-center justify-center text-xs font-black">
                        +{order.orderItems.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex-grow space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                       <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                         {getStatusIcon(order.status)} {order.status}
                       </span>
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                         Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                       </span>
                    </div>
                    <h4 className="text-xl font-black truncate max-w-lg">
                      {order.orderItems.map(i => i.title).join(', ')}
                    </h4>
                    <p className="text-2xl font-black text-primary">₹{order.totalPrice.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link to={`/account/orders/${order._id}`} className="btn-secondary py-3 px-6 flex items-center gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                      View Details <ChevronRight size={18} />
                    </Link>
                  </div>

               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
