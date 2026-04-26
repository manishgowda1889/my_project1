import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResetPasswordMutation } from '@/store/api/authApiSlice';
import { Lock, Loader2, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      await resetPassword({ token, password }).unwrap();
      setIsSuccess(true);
      toast.success('Password reset successfully');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err?.data?.message || 'Link expired or invalid');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-light-darker dark:bg-dark transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-lighter p-8 md:p-12 rounded-3xl shadow-xl border border-light-darkest dark:border-dark-lightest">
        
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary mb-6">
             <ShieldAlert size={32} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-dark dark:text-white uppercase">Set New Password</h2>
          <p className="mt-2 text-sm text-gray-500 font-bold uppercase tracking-widest">
            Create a strong password for your account
          </p>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-6 animate-in zoom-in duration-500">
             <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                <CheckCircle2 size={40} />
             </div>
             <div className="space-y-2">
                <h4 className="text-xl font-black uppercase tracking-tighter">Password Updated!</h4>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  Redirecting you to login in a few seconds...
                </p>
             </div>
             <Link to="/login" className="btn-primary py-3 px-8 inline-block">Login Now</Link>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="password"
                required
                className="input-field pl-12 py-4"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <div className="relative">
              <input
                type="password"
                required
                className="input-field pl-12 py-4"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                <>Update Password <ArrowRight size={22} /></>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;
