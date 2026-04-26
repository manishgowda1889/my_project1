import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '@/store/api/ordersApiSlice';
import { Search, Filter, MoreVertical, Eye, Truck, CheckCircle2, XCircle, Clock, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const { data, isLoading } = useGetAllOrdersQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const orders = data?.orders;

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-500 bg-green-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      case 'shipped': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  if (isLoading) return <div className="container-custom py-20 text-center font-black uppercase tracking-widest italic">Synchronizing Orders...</div>;

  return (
    <div className="container-custom py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Order Fulfillment</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Platform-wide order oversight</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <input 
                type="text" 
                placeholder="Order #, Customer..." 
                className="input-field pl-12 py-3 rounded-full w-full md:w-80"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           </div>
           <button className="btn-secondary py-3 px-6 rounded-full">
             <Filter size={18} />
           </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-light-darker dark:bg-dark text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Update Status</th>
                <th className="px-8 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-darkest dark:divide-dark-lightest">
              {orders?.map((order) => (
                <tr key={order._id} className="hover:bg-light-darker/20 transition-colors">
                  <td className="px-8 py-5">
                     <span className="text-sm font-black">{order.orderNumber}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                       <span className="text-sm font-black">{order.user.name}</span>
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{order.user.email}</span>
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
                    <div className="relative">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="appearance-none bg-light-darker/50 dark:bg-dark py-2 px-4 pr-10 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none border border-transparent focus:border-primary transition-all"
                      >
                         <option value="pending">Pending</option>
                         <option value="confirmed">Confirmed</option>
                         <option value="processing">Processing</option>
                         <option value="shipped">Shipped</option>
                         <option value="delivered">Delivered</option>
                         <option value="cancelled">Cancelled</option>
                      </select>
                      <Package className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={14} />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <Link to={`/account/orders/${order._id}`} className="p-2 hover:bg-light-darkest dark:hover:bg-dark-lightest rounded-lg transition-colors text-gray-400 hover:text-primary">
                      <Eye size={20} />
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

export default AdminOrders;
