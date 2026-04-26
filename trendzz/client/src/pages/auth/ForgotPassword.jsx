import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation } from '@/store/api/authApiSlice';
import { Mail, Loader2, ArrowRight, CheckCircle2, ChevronLeft, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail]           = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      setIsSubmitted(true);

      // Dev mode — backend returns the link directly
      if (res.devResetUrl) {
        setDevResetUrl(res.devResetUrl);
        toast.success('Reset link ready — click below to reset your password');
      } else {
        toast.success('Reset link sent to your email');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-light-darker dark:bg-dark transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-lighter p-8 md:p-12 rounded-3xl shadow-xl border border-light-darkest dark:border-dark-lightest">

        <div className="text-center">
          <Link to="/login" className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary hover:underline mb-8">
            <ChevronLeft size={16} /> Back to Login
          </Link>
          <h2 className="text-3xl font-black tracking-tighter text-dark dark:text-white uppercase">Recover Access</h2>
          <p className="mt-2 text-sm text-gray-500 font-bold uppercase tracking-widest">
            Enter your email to receive a password reset link
          </p>
        </div>

        {isSubmitted ? (
          <div className="py-4 text-center space-y-6 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto text-green-500">
              <CheckCircle2 size={40} />
            </div>

            {devResetUrl ? (
              /* ── Dev mode: show clickable reset link ── */
              <div className="space-y-4">
                <h4 className="text-xl font-black uppercase tracking-tighter">Reset Link Ready</h4>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                  Email sending is not configured yet. Click the button below to reset your password directly.
                </p>
                <button
                  onClick={() => navigate(devResetUrl.replace(window.location.origin, '').replace('http://localhost:5173', ''))}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-base"
                >
                  <ExternalLink size={18} /> Click Here to Reset Password
                </button>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  This link expires in 30 minutes
                </p>
              </div>
            ) : (
              /* ── Production mode: email sent ── */
              <div className="space-y-2">
                <h4 className="text-xl font-black uppercase tracking-tighter">Check Your Inbox</h4>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                  We've sent a recovery link to <strong>{email}</strong>. It will expire in 30 minutes.
                </p>
              </div>
            )}

            <button
              onClick={() => { setIsSubmitted(false); setDevResetUrl(null); }}
              className="text-xs font-black text-primary hover:underline uppercase tracking-widest"
            >
              Didn't receive? Try again
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="email"
                required
                className="input-field pl-12 py-4"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg"
            >
              {isLoading
                ? <Loader2 className="animate-spin" size={24} />
                : <> Send Reset Link <ArrowRight size={22} /> </>
              }
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
