import { useGetUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from '@/store/api/adminApiSlice';
import { Search, User, Shield, UserCheck, Trash2, MoreVertical, Filter, Loader2, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const { data, isLoading } = useGetUsersQuery();
  const [updateRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const users = data?.users;

  const handleRoleChange = async (id, role) => {
    try {
      await updateRole({ id, role }).unwrap();
      toast.success(`Role updated to ${role}`);
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user account? This action is permanent.')) {
      try {
        await deleteUser(id).unwrap();
        toast.info('User deleted');
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (isLoading) return <div className="container-custom py-20 text-center font-black uppercase tracking-widest">Scanning Users...</div>;

  return (
    <div className="container-custom py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">User Management</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Manage customer and seller accounts</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <input 
                type="text" 
                placeholder="Name, Email, ID..." 
                className="input-field pl-12 py-3 rounded-full w-full md:w-80"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           </div>
           <button className="btn-secondary py-3 px-6 rounded-full flex items-center gap-2">
             <Filter size={18} />
           </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-light-darker dark:bg-dark text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-8 py-5">User Account</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Joined</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-darkest dark:divide-dark-lightest">
              {users?.map((user) => (
                <tr key={user._id} className="hover:bg-light-darker/20 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black overflow-hidden border border-primary/20">
                         {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                       </div>
                       <div className="min-w-0">
                          <h4 className="text-sm font-black truncate max-w-[150px]">{user.name}</h4>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[150px]">
                            <Mail size={10} /> {user.email}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="relative group">
                       <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="appearance-none bg-light-darker/50 dark:bg-dark py-2 px-4 pr-10 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none border border-transparent focus:border-primary transition-all"
                       >
                         <option value="customer">Customer</option>
                         <option value="seller">Seller</option>
                         <option value="admin">Admin</option>
                       </select>
                       <Shield className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={14} />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                     <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${user.isVerified ? 'text-green-500 bg-green-500/10' : 'text-yellow-500 bg-yellow-500/10'}`}>
                       {user.isVerified ? 'Verified' : 'Unverified'}
                     </span>
                  </td>
                  <td className="px-8 py-5">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                       {new Date(user.createdAt).toLocaleDateString()}
                     </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <button className="p-2 hover:bg-light-darkest dark:hover:bg-dark-lightest rounded-lg transition-colors text-gray-400 hover:text-primary">
                         <UserCheck size={18} />
                       </button>
                       <button onClick={() => handleDelete(user._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-gray-400 hover:text-red-500">
                         <Trash2 size={18} />
                       </button>
                    </div>
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

export default AdminUsers;
