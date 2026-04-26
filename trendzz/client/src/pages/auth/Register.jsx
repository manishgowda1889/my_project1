import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '@/store/api/authApiSlice';
import { setCredentials } from '@/store/slices/authSlice';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Loader2, ArrowRight, Store } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      const res = await register(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Registration successful! Please check your email for verification.');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-light-darker dark:bg-dark transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-lighter p-8 md:p-12 rounded-3xl shadow-xl border border-light-darkest dark:border-dark-lightest">
        
        <div className="text-center">
          <Link to="/" className="text-4xl font-heading font-black text-primary tracking-tighter italic">
            Trendzz<span className="text-dark dark:text-white">.</span>
          </Link>
          <h2 className="mt-6 text-3xl font-black tracking-tighter text-dark dark:text-white uppercase">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500 font-bold uppercase tracking-widest">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          <div className="flex p-1 bg-light-darker dark:bg-dark rounded-xl border border-light-darkest dark:border-dark-lightest mb-4">
             <button 
              type="button"
              onClick={() => setFormData({...formData, role: 'customer'})}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${formData.role === 'customer' ? 'bg-white dark:bg-dark-lighter shadow-sm text-primary' : 'text-gray-400'}`}
             >
               <User size={16} /> Customer
             </button>
             <button 
              type="button"
              onClick={() => setFormData({...formData, role: 'seller'})}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${formData.role === 'seller' ? 'bg-white dark:bg-dark-lighter shadow-sm text-primary' : 'text-gray-400'}`}
             >
               <Store size={16} /> Seller
             </button>
          </div>

          <div className="relative">
            <input
              type="text"
              required
              className="input-field pl-12 py-3"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <div className="relative">
            <input
              type="email"
              required
              className="input-field pl-12 py-3"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <div className="relative">
            <input
              type="password"
              required
              className="input-field pl-12 py-3"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <div className="relative">
            <input
              type="password"
              required
              className="input-field pl-12 py-3"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center py-2">
            By creating an account, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
              <>Create Account <ArrowRight size={22} /></>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-light-darkest dark:border-dark-lightest"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
              <span className="px-4 bg-white dark:bg-dark-lighter text-gray-400">Or Register with</span>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full flex justify-center items-center py-4 border border-light-darkest dark:border-dark-lightest rounded-xl hover:bg-light-darker dark:hover:bg-dark transition-all duration-300 font-black text-sm gap-3 group">
               <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-5 group-hover:scale-110 transition-transform" alt="Google" /> 
               <span className="uppercase tracking-widest">Sign up with Google</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
