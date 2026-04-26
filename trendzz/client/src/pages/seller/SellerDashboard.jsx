import { useGetSellerDashboardQuery, useGetSellerAnalyticsQuery } from '@/store/api/sellerApiSlice';
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
  const { data, isLoading } = useGetSellerDashboardQuery();
  const { data: analytics } = useGetSellerAnalyticsQuery();
  const stats = data?.stats;
  const recentOrders = data?.recentOrders;

  const cards = [
    { title: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, icon: <DollarSign />, color: 'text-green-500 bg-green-500/10', trend: '+12.5%' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingCart />, color: 'text-blue-500 bg-blue-500/10', trend: '+5.2%' },
    { title: 'Active Products', value: stats?.totalProducts || 0, icon: <Package />, color: 'text-primary bg-primary/10', trend: '+2' },
    { title: 'Avg. Rating', value: '4.8', icon: <TrendingUp />, color: 'text-yellow-500 bg-yellow-500/10', trend: '+0.1' },
  ];

  if (isLoading) return <div className="container-custom py-20 text-center font-black">LOADING SELLER DASHBOARD...</div>;

  return (
    <div className="container-custom py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Seller Dashboard</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Monitor your business performance</p>
        </div>
        <Link to="/seller/products/new" className="btn-primary py-3 px-8 flex items-center gap-2">
          <Package size={20} /> Add New Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="card p-8 space-y-4 hover:border-primary transition-all duration-300">
            <div className="flex justify-between items-start">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                 {card.icon}
               </div>
               <span className="text-[10px] font-black text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded">
                 <ArrowUpRight size={10} /> {card.trend}
               </span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{card.title}</p>
              <h3 className="text-3xl font-black mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card overflow-hidden">
            <div className="p-6 bg-light-darker dark:bg-dark border-b border-light-darkest dark:border-dark-lightest flex justify-between items-center">
              <h3 className="font-black uppercase tracking-widest text-sm">Recent Orders</h3>
              <Link to="/seller/orders" className="text-xs font-black text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-light-darker/30 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-darkest dark:divide-dark-lightest">
                  {recentOrders?.map((order) => (
                    <tr key={order._id} className="hover:bg-light-darker/20 transition-colors">
                      <td className="px-6 py-4 text-sm font-black">{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-light-darkest dark:bg-dark-lightest flex items-center justify-center text-[10px] font-bold">
                             {order.user.name.charAt(0)}
                           </div>
                           <span className="text-sm font-bold truncate max-w-[100px]">{order.user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary">
                           {order.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-black">₹{order.totalPrice.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Link to={`/account/orders/${order._id}`} className="text-primary hover:underline text-xs font-black">Detail</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products Analytics */}
        <div className="lg:col-span-4 space-y-6">
           <div className="card p-8">
             <h3 className="font-black uppercase tracking-widest text-sm mb-8">Top Selling Products</h3>
             <div className="space-y-6">
                {analytics?.topProducts?.map((p, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="text-xl font-black text-gray-300 w-6">0{i+1}</div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-black truncate">{p.title}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.totalSold} Units Sold</p>
                    </div>
                    <div className="text-sm font-black text-primary">₹{p.revenue.toLocaleString()}</div>
                  </div>
                ))}
             </div>
             <Link to="/seller/products" className="btn-secondary w-full py-3 mt-8 text-xs">Manage Products</Link>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;
