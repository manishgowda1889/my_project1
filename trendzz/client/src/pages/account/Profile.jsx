import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/store/api/authApiSlice';
import { updateUser } from '@/store/slices/authSlice';
import { User, Mail, Phone, Lock, Loader2, Camera, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(profileData).unwrap();
      dispatch(updateUser(res.user));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      await changePassword(passwordData).unwrap();
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to change password');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      // Direct call to upload endpoint
      const { data } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const res = await updateProfile({ avatar: data.url }).unwrap();
      dispatch(updateUser(res.user));
      toast.success('Avatar updated');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container-custom py-12 space-y-12">
      <div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Profile Settings</h1>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side - Avatar & Summary */}
        <div className="lg:col-span-4 space-y-8">
           <div className="card p-8 text-center space-y-6">
              <div className="relative inline-block group">
                 <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary ring-8 ring-primary/10">
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=FF6B00&color=fff&size=128`} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="text-white animate-spin" size={32} />
                      </div>
                    )}
                 </div>
                 <label className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors shadow-lg group-hover:scale-110 duration-300">
                    <Camera size={20} />
                    <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                 </label>
              </div>
              <div>
                <h3 className="text-2xl font-black truncate">{user.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{user.role} Account</p>
              </div>
              <div className="pt-6 grid grid-cols-2 gap-4 border-t border-light-darkest dark:border-dark-lightest">
                 <div className="text-center">
                    <p className="text-xl font-black">12</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Orders</p>
                 </div>
                 <div className="text-center">
                    <p className="text-xl font-black">₹4.5k</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Spent</p>
                 </div>
              </div>
           </div>

           <div className="card p-6 bg-primary/5 border-primary/20 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                 <ShieldCheck size={24} />
                 <h4 className="font-black uppercase tracking-tighter">Account Security</h4>
              </div>
              <ul className="space-y-3">
                 <li className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <CheckCircle2 size={14} className="text-green-500" /> Email Verified
                 </li>
                 <li className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <CheckCircle2 size={14} className="text-green-500" /> 2FA Enabled
                 </li>
              </ul>
           </div>
        </div>

        {/* Right Side - Forms */}
        <div className="lg:col-span-8 space-y-12">
           
           {/* Profile Update */}
           <div className="card p-8 md:p-12 space-y-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Personal Information</h3>
              <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name</label>
                    <div className="relative">
                       <input type="text" className="input-field pl-12" required value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Email Address</label>
                    <div className="relative">
                       <input type="email" className="input-field pl-12 bg-light-darker/50" disabled value={profileData.email} />
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <p className="text-[8px] font-bold text-gray-400 uppercase">Email cannot be changed</p>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Phone Number</label>
                    <div className="relative">
                       <input type="text" className="input-field pl-12" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                 </div>
                 <div className="md:col-span-2 pt-4">
                    <button type="submit" disabled={isUpdatingProfile} className="btn-primary py-4 px-12">
                       {isUpdatingProfile ? <Loader2 className="animate-spin mx-auto" /> : 'Update Information'}
                    </button>
                 </div>
              </form>
           </div>

           {/* Password Change */}
           <div className="card p-8 md:p-12 space-y-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Security & Password</h3>
              <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Current Password</label>
                    <div className="relative">
                       <input type="password" required className="input-field pl-12" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} />
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">New Password</label>
                    <div className="relative">
                       <input type="password" required className="input-field pl-12" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Confirm New Password</label>
                    <div className="relative">
                       <input type="password" required className="input-field pl-12" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                 </div>
                 <div className="md:col-span-2 pt-4">
                    <button type="submit" disabled={isChangingPassword} className="btn-secondary py-4 px-12 border-2">
                       {isChangingPassword ? <Loader2 className="animate-spin mx-auto" /> : 'Change Password'}
                    </button>
                 </div>
              </form>
           </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
