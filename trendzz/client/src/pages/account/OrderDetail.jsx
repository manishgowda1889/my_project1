import { useParams, Link } from 'react-router-dom';
import { useGetOrderDetailsQuery, useCancelOrderMutation } from '@/store/api/ordersApiSlice';
import { Package, MapPin, CreditCard, ChevronLeft, Truck, CheckCircle2, Clock, AlertCircle, ShieldCheck, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { imgError } from '@/utils/getProductImage';

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderDetailsQuery(id);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const order = data?.order;

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder({ id, reason: 'User request' }).unwrap();
        toast.success('Order cancelled successfully');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to cancel order');
      }
    }
  };

  if (isLoading) return <div className="container-custom py-20 text-center font-black">LOADING ORDER DETAILS...</div>;
  if (!order) return <div className="container-custom py-20 text-center font-black">ORDER NOT FOUND</div>;

  const timelineSteps = [
    { status: 'pending', icon: <Clock size={24} />, title: 'Order Placed', label: 'We have received your order' },
    { status: 'confirmed', icon: <CheckCircle2 size={24} />, title: 'Confirmed', label: 'Seller has confirmed your order' },
    { status: 'processing', icon: <Package size={24} />, title: 'Processing', label: 'Your order is being packed' },
    { status: 'shipped', icon: <Truck size={24} />, title: 'Shipped', label: 'Out for delivery' },
    { status: 'delivered', icon: <CheckCircle2 size={24} />, title: 'Delivered', label: 'Order reached you' },
  ];

  const currentStatusIdx = timelineSteps.findIndex(s => s.status === order.status);

  return (
    <div className="container-custom py-12 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link to="/account/orders" className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary hover:underline">
            <ChevronLeft size={16} /> Back to Orders
          </Link>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Order Detail</h1>
          <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>ID: {order.orderNumber}</span>
            <span>Placed on {new Date(order.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="btn-secondary py-3 px-6 flex items-center gap-2">
            <Download size={18} /> Invoice
          </button>
          {['pending', 'confirmed'].includes(order.status) && (
            <button 
              onClick={handleCancel}
              disabled={isCancelling}
              className="btn-secondary text-red-500 border-red-500 hover:bg-red-500 hover:text-white py-3 px-6"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="card p-8 md:p-12 overflow-x-auto">
        <div className="min-w-[800px] flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-light-darker dark:bg-dark -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-1000" 
            style={{ width: `${(currentStatusIdx / (timelineSteps.length - 1)) * 100}%` }}
          ></div>
          
          {timelineSteps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-4 bg-white dark:bg-dark-lighter px-4 text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${i <= currentStatusIdx ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-light-darker dark:bg-dark text-gray-400'}`}>
                {step.icon}
              </div>
              <div className="space-y-1">
                <p className={`text-xs font-black uppercase tracking-widest ${i <= currentStatusIdx ? 'text-primary' : 'text-gray-400'}`}>{step.title}</p>
                <p className="text-[10px] text-gray-400 font-bold max-w-[120px]">{step.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Items */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card overflow-hidden">
            <div className="p-6 bg-light-darker dark:bg-dark border-b border-light-darkest dark:border-dark-lightest">
              <h3 className="font-black uppercase tracking-widest text-sm">Order Items</h3>
            </div>
            <div className="divide-y divide-light-darkest dark:divide-dark-lightest">
              {order.orderItems.map((item, i) => (
                <div key={i} className="p-6 flex items-center gap-6">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-light-darker">
                    <img 
                      src={item.image || `https://source.unsplash.com/80x80/?product&sig=${item._id || i}`} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://source.unsplash.com/80x80/?product&sig=${Math.random()}`; }}
                    />
                  </div>
                  <div className="flex-grow space-y-1">
                    <h4 className="font-black text-lg line-clamp-1">{item.title}</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Qty: {item.qty} | Price: ₹{item.price.toLocaleString()}</p>
                  </div>
                  <p className="text-xl font-black">₹{(item.price * item.qty).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Shipping Address */}
          <div className="card p-8 space-y-6">
            <div className="flex items-center gap-3">
              <MapPin className="text-primary" />
              <h3 className="font-black uppercase tracking-tighter">Shipping To</h3>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-black text-lg">{order.shippingAddress.fullName}</p>
              <p className="text-gray-500">{order.shippingAddress.street}</p>
              <p className="text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="font-bold pt-2">{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="card p-8 space-y-6">
            <div className="flex items-center gap-3">
              <CreditCard className="text-primary" />
              <h3 className="font-black uppercase tracking-tighter">Payment</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Method</p>
                <p className="text-sm font-black uppercase">{order.paymentMethod}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Status</p>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.isPaid ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                  {order.isPaid ? 'PAID' : 'PENDING'}
                </span>
              </div>
              
              <div className="h-px bg-light-darkest dark:bg-dark-lightest"></div>
              
              <div className="space-y-2 text-sm font-bold">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{order.itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>₹{order.shippingPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax</span>
                  <span>₹{order.taxPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4">
                  <span>Total</span>
                  <span className="text-primary">₹{order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Banner */}
          <div className="bg-primary/5 p-6 rounded-2xl flex items-center gap-4 border border-primary/10">
            <ShieldCheck className="text-primary flex-shrink-0" size={32} />
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-primary">Buyer Protection</h4>
              <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase leading-tight">Your order is protected by Trendzz Guarantee.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetail;
