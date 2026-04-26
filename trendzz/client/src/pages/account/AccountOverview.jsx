import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, Bell, CreditCard, ChevronRight, LogOut } from 'lucide-react';

const AccountOverview = () => {
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { id: 'orders', title: 'My Orders', desc: 'Track, return or buy things again', icon: <Package size={28} className="text-blue-500" />, link: '/account/orders' },
    { id: 'wishlist', title: 'My Wishlist', desc: 'View your saved items', icon: <Heart size={28} className="text-red-500" />, link: '/account/wishlist' },
    { id: 'addresses', title: 'My Addresses', desc: 'Manage your shipping addresses', icon: <MapPin size={28} className="text-green-500" />, link: '/account/addresses' },
    { id: 'profile', title: 'Profile Settings', desc: 'Edit your name, phone and avatar', icon: <User size={28} className="text-primary" />, link: '/account/profile' },
    { id: 'payment', title: 'Saved Cards', desc: 'Manage your payment methods', icon: <CreditCard size={28} className="text-purple-500" />, link: '#' },
    { id: 'notifications', title: 'Notifications', desc: 'Set your email preferences', icon: <Bell size={28} className="text-yellow-500" />, link: '#' },
  ];

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary ring-8 ring-primary/10">
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=FF6B00&color=fff&size=128`} 
            alt={user.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Hello, {user.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm flex items-center justify-center md:justify-start gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px]">{user.role} Account</span>
            Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link 
            key={item.id} 
            to={item.link}
            className="card group p-8 flex items-center gap-6 hover:border-primary hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
          >
            <div className="w-16 h-16 bg-light-darker dark:bg-dark rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
               {item.icon}
            </div>
            <div className="flex-grow">
               <h4 className="font-black text-lg group-hover:text-primary transition-colors">{item.title}</h4>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-light-darkest dark:border-dark-lightest">
         <button className="flex items-center gap-3 text-red-500 font-black uppercase tracking-widest hover:underline">
           <LogOut size={20} /> Sign Out from All Devices
         </button>
      </div>
    </div>
  );
};

export default AccountOverview;
