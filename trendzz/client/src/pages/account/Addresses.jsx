import { useState } from 'react';
import { useGetAddressesQuery, useAddAddressMutation, useDeleteAddressMutation, useSetDefaultAddressMutation } from '@/store/api/addressesApiSlice';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase, MoreVertical, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Addresses = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', pincode: '', addressType: 'home', isDefault: false
  });

  const { data, isLoading } = useGetAddressesQuery();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefault] = useSetDefaultAddressMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAddress(formData).unwrap();
      setShowForm(false);
      setFormData({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '', addressType: 'home', isDefault: false });
      toast.success('Address added successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add address');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this address?')) {
      try {
        await deleteAddress(id).unwrap();
        toast.info('Address removed');
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  if (isLoading) return <div className="container-custom py-20 text-center font-black">LOADING ADDRESSES...</div>;

  return (
    <div className="container-custom py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">My Addresses</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Manage your shipping destinations</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary py-3 px-8 flex items-center gap-2"
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> Add New Address</>}
        </button>
      </div>

      {showForm && (
        <div className="card p-8 md:p-12 animate-in slide-in-from-top duration-300">
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name</label>
                <input type="text" className="input-field" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Phone Number</label>
                <input type="text" className="input-field" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Street / Area / House No.</label>
                <input type="text" className="input-field" required value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500">City</label>
                <input type="text" className="input-field" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500">State</label>
                <input type="text" className="input-field" required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Pincode</label>
                <input type="text" className="input-field" required value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Address Type</label>
                <div className="flex gap-4">
                  {['home', 'work'].map(t => (
                    <button key={t} type="button" onClick={() => setFormData({...formData, addressType: t})} className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] border transition-all ${formData.addressType === t ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-light-darker dark:bg-dark border-transparent'}`}>
                       {t === 'home' ? <Home size={14} className="inline mr-2" /> : <Briefcase size={14} className="inline mr-2" />} {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 flex items-center gap-4 pt-4">
                <button type="submit" disabled={isAdding} className="btn-primary py-4 px-12 flex-grow">
                   {isAdding ? <Loader2 className="animate-spin mx-auto" /> : 'Save Address'}
                </button>
              </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.addresses?.map((addr) => (
          <div key={addr._id} className={`card p-8 space-y-6 relative transition-all duration-300 ${addr.isDefault ? 'border-primary ring-4 ring-primary/5' : ''}`}>
             <div className="flex justify-between items-center">
                <span className="bg-light-darker dark:bg-dark px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  {addr.addressType === 'home' ? <Home size={12} /> : <Briefcase size={12} />} {addr.addressType}
                </span>
                {addr.isDefault && (
                  <span className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 size={14} /> Default
                  </span>
                )}
             </div>

             <div className="space-y-1">
               <h4 className="text-xl font-black">{addr.fullName}</h4>
               <p className="text-gray-500 text-sm leading-relaxed">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
               <p className="font-bold pt-4">{addr.phone}</p>
             </div>

             <div className="pt-6 flex items-center gap-4 border-t border-light-darkest dark:border-dark-lightest">
                {!addr.isDefault && (
                  <button 
                    onClick={() => setDefault(addr._id)}
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                  >
                    Set as Default
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(addr._id)}
                  className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline ml-auto flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
             </div>
          </div>
        ))}

        {data?.addresses?.length === 0 && !showForm && (
          <div className="md:col-span-2 lg:col-span-3 py-20 text-center card bg-light-darker/30 border-dashed border-2">
            <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest">No shipping addresses saved.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
