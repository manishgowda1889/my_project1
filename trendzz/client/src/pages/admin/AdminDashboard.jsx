import { useGetAdminDashboardQuery, useGetAnalyticsQuery } from '@/store/api/adminApiSlice';
import { Users, ShoppingBag, DollarSign, TrendingUp, BarChart3, ShieldCheck, Activity, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { data, isLoading } = useGetAdminDashboardQuery();
  const { data: analytics } = useGetAnalyticsQuery();
  const stats = data?.stats;

  const cards = [
    { title: 'Platform Revenue', value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, icon: <DollarSign />, color: 'text-green-500 bg-green-500/10', trend: '+24%' },
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: <Users />, color: 'text-blue-500 bg-blue-500/10', trend: '+150' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingBag />, color: 'text-primary bg-primary/10', trend: '+8.4%' },
    { title: 'Active Sellers', value: stats?.totalSellers || 0, icon: <ShieldCheck />, color: 'text-purple-500 bg-purple-500/10', trend: '+12' },
  ];

  if (isLoading) return <div className="container-custom py-20 text-center font-black">LOADING ADMIN CONSOLE...</div>;

  return (
    <div className="container-custom py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Admin Console</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Global Platform Overview</p>
        </div>
        <div className="flex gap-4">
           <Link to="/admin/users" className="btn-secondary py-3 px-6 flex items-center gap-2">
             <Users size={20} /> Manage Users
           </Link>
           <button className="btn-primary py-3 px-8 flex items-center gap-2">
             <BarChart3 size={20} /> Export Reports
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="card p-8 space-y-4 hover:border-primary transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
               {card.icon && <div className="w-24 h-24">{card.icon}</div>}
            </div>
            <div className="flex justify-between items-start relative z-10">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                 {card.icon}
               </div>
               <span className="text-[10px] font-black text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded">
                 <ArrowUpRight size={10} /> {card.trend}
               </span>
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{card.title}</p>
              <h3 className="text-3xl font-black mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Performance Chart (Placeholder) */}
        <div className="lg:col-span-8 space-y-6">
           <div className="card p-8 h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2"><Activity size={18} className="text-primary" /> Sales Performance</h3>
                <div className="flex gap-2">
                   {['7D', '1M', '1Y'].map(t => <button key={t} className="px-3 py-1 text-[10px] font-black rounded-lg bg-light-darker dark:bg-dark hover:bg-primary hover:text-white transition-all uppercase">{t}</button>)}
                </div>
              </div>
              <div className="flex-grow flex items-end gap-2 md:gap-4 px-4">
                 {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 100].map((h, i) => (
                   <div key={i} className="flex-grow bg-primary/20 hover:bg-primary rounded-t-lg transition-all duration-500 group relative" style={{ height: `${h}%` }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{(h*1000).toLocaleString()}</div>
                   </div>
                 ))}
              </div>
              <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase tracking-widest mt-4">
                 <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
              </div>
           </div>
        </div>

        {/* Recent Platform Activity */}
        <div className="lg:col-span-4 space-y-6">
           <div className="card p-8">
             <h3 className="font-black uppercase tracking-widest text-sm mb-8">System Activity</h3>
             <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-light-darkest dark:before:bg-dark-lightest">
                {[
                  { text: 'New seller registered: GadgetWorld', time: '2m ago', type: 'user' },
                  { text: 'High value order placed: ₹45,000', time: '15m ago', type: 'order' },
                  { text: 'System update completed v2.4.1', time: '1h ago', type: 'system' },
                  { text: 'Refund request processed for ID: #992', time: '3h ago', type: 'refund' },
                  { text: 'New category added: Home Decor', time: '5h ago', type: 'system' },
                ].map((act, i) => (
                  <div key={i} className="flex gap-6 relative">
                    <div className="w-6 h-6 rounded-full bg-primary border-4 border-white dark:border-dark-lighter z-10 flex-shrink-0"></div>
                    <div>
                      <p className="text-xs font-bold leading-relaxed">{act.text}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase mt-1">{act.time}</p>
                    </div>
                  </div>
                ))}
             </div>
             <button className="btn-secondary w-full py-3 mt-8 text-xs font-black uppercase tracking-widest">View All Logs</button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
