import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetAddressesQuery, useAddAddressMutation } from '@/store/api/addressesApiSlice';
import { useCreateOrderMutation } from '@/store/api/ordersApiSlice';
import { saveShippingAddress, savePaymentMethod } from '@/store/slices/cartSlice';
import { MapPin, Plus, Truck, CreditCard, Landmark, CheckCircle2, Loader2, ArrowRight, ChevronLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', pincode: '', addressType: 'home'
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const { data: addressData, isLoading: addressesLoading } = useGetAddressesQuery();
  const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleNextStep = () => {
    if (step === 1 && !selectedAddress) {
      return toast.error('Please select a shipping address');
    }
    if (step === 1) {
      dispatch(saveShippingAddress(selectedAddress));
    }
    setStep(step + 1);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addAddress(newAddress).unwrap();
      setSelectedAddress(res.address);
      setShowAddressForm(false);
      toast.success('Address added successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add address');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 500 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left Side - Stepper */}
        <div className="lg:col-span-8 flex-grow space-y-8">
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-12">
             {[1, 2, 3].map((s) => (
               <div key={s} className="flex items-center flex-1 last:flex-none">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${step >= s ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-light-darker dark:bg-dark text-gray-400'}`}>
                   {step > s ? <CheckCircle2 size={24} /> : s}
                 </div>
                 {s < 3 && (
                   <div className={`flex-grow h-1 mx-4 rounded-full ${step > s ? 'bg-primary' : 'bg-light-darker dark:bg-dark'}`}></div>
                 )}
               </div>
             ))}
          </div>

          {/* Step 1: Address Selection */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-left duration-300">
               <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-black uppercase tracking-tighter">Shipping Address</h2>
                 <button 
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="btn-secondary py-2 px-4 flex items-center gap-2 text-xs"
                 >
                   <Plus size={16} /> Add New Address
                 </button>
               </div>

               {showAddressForm ? (
                 <form onSubmit={handleAddAddress} className="card p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" className="input-field" required value={newAddress.fullName} onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})} />
                    <input type="text" placeholder="Phone Number" className="input-field" required value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} />
                    <div className="md:col-span-2">
                      <input type="text" placeholder="Street / House No." className="input-field" required value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} />
                    </div>
                    <input type="text" placeholder="City" className="input-field" required value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                    <input type="text" placeholder="State" className="input-field" required value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} />
                    <input type="text" placeholder="Pincode" className="input-field" required value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} />
                    <div className="flex gap-4">
                      {['home', 'work'].map(t => (
                        <button key={t} type="button" onClick={() => setNewAddress({...newAddress, addressType: t})} className={`flex-1 py-2 rounded-lg font-bold text-xs border uppercase tracking-widest ${newAddress.addressType === t ? 'bg-primary/10 border-primary text-primary' : 'bg-light-darker dark:bg-dark border-transparent'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="md:col-span-2 flex gap-4 pt-4">
                      <button type="submit" disabled={isAddingAddress} className="btn-primary py-3 px-8 flex-grow">
                        {isAddingAddress ? <Loader2 className="animate-spin mx-auto" /> : 'Save Address'}
                      </button>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="btn-secondary py-3 px-8">Cancel</button>
                    </div>
                 </form>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addressData?.addresses?.map((addr) => (
                      <div 
                        key={addr._id} 
                        onClick={() => setSelectedAddress(addr)}
                        className={`card p-6 cursor-pointer transition-all border-2 ${selectedAddress?._id === addr._id ? 'border-primary bg-primary/5 shadow-lg' : 'border-transparent'}`}
                      >
                         <div className="flex justify-between items-start mb-4">
                            <span className="bg-light-darker dark:bg-dark px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest text-gray-500">{addr.addressType}</span>
                            {selectedAddress?._id === addr._id && <CheckCircle2 className="text-primary" size={20} />}
                         </div>
                         <h4 className="font-black text-lg">{addr.fullName}</h4>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                         <p className="text-sm font-bold mt-4">{addr.phone}</p>
                      </div>
                    ))}
                    {addressData?.addresses?.length === 0 && (
                      <div className="md:col-span-2 py-12 text-center card bg-light-darker/50">
                        <MapPin className="mx-auto text-gray-400 mb-4" size={40} />
                        <p className="text-gray-500 font-bold">No addresses found. Add one to continue.</p>
                      </div>
                    )}
                 </div>
               )}
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-left duration-300">
               <h2 className="text-3xl font-black uppercase tracking-tighter">Payment Method</h2>
               <div className="space-y-4">
                 {[
                   { id: 'Stripe', icon: <CreditCard size={24} />, title: 'Credit / Debit Card', desc: 'Secure payment via Stripe' },
                   { id: 'COD', icon: <Landmark size={24} />, title: 'Cash on Delivery', desc: 'Pay when you receive the order' }
                 ].map((method) => (
                   <div 
                    key={method.id}
                    onClick={() => dispatch(savePaymentMethod(method.id))}
                    className={`card p-6 flex items-center gap-6 cursor-pointer border-2 transition-all ${paymentMethod === method.id ? 'border-primary bg-primary/5 shadow-lg' : 'border-transparent'}`}
                   >
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${paymentMethod === method.id ? 'bg-primary text-white' : 'bg-light-darker dark:bg-dark text-gray-400'}`}>
                        {method.icon}
                     </div>
                     <div className="flex-grow">
                        <h4 className="font-black text-lg">{method.title}</h4>
                        <p className="text-sm text-gray-500">{method.desc}</p>
                     </div>
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                        {paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-8">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="btn-secondary py-4 px-8 flex items-center gap-2"
              >
                <ChevronLeft size={20} /> Back
              </button>
            )}
            <button 
              onClick={step === 2 ? () => navigate('/checkout/payment') : handleNextStep}
              className="flex-grow btn-primary py-4 px-8 flex items-center justify-center gap-3 text-lg"
            >
              Continue <ArrowRight size={22} />
            </button>
          </div>

        </div>

        {/* Right Side - Order Summary */}
        <aside className="lg:w-96 flex-shrink-0">
           <div className="card p-8 bg-light-darker dark:bg-dark-lighter sticky top-24">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item._id}-${JSON.stringify(item.variant)}`} className="flex gap-3 text-xs">
                    <img src={item.thumbnail || item.images[0]} alt="" className="w-12 h-12 rounded object-cover" />
                    <div className="flex-grow">
                      <p className="font-black truncate">{item.title}</p>
                      <p className="text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <p className="font-black">₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="h-px bg-light-darkest dark:bg-dark-lightest my-6"></div>
              
              <div className="space-y-3 text-sm font-bold">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-primary/10 rounded-xl space-y-2">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                   <Truck size={14} /> Estimated Delivery
                 </div>
                 <p className="text-xs font-bold">Expected by {new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString()}</p>
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
};

export default Checkout;
