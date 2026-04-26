import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVerifyEmailQuery, useResendVerificationMutation } from '@/store/api/authApiSlice';
import { CheckCircle2, XCircle, Loader2, ArrowRight, RefreshCw, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const { token } = useParams();
  const { isLoading, error, isSuccess } = useVerifyEmailQuery(token);
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();
  const [email, setEmail] = useState('');
  const [resendSent, setResendSent] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');
    try {
      await resendVerification({ email }).unwrap();
      setResendSent(true);
      toast.success('Verification email sent! Check your inbox.');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to resend. Please try again.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in duration-500">

        {isLoading && (
          <div className="space-y-6">
            <Loader2 size={64} className="mx-auto text-primary animate-spin" />
            <h2 className="text-3xl font-black uppercase tracking-tighter">Verifying your email...</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">This will only take a moment</p>
          </div>
        )}

        {isSuccess && (
          <div className="space-y-8">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-xl shadow-green-500/10">
              <CheckCircle2 size={50} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Email Verified!</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm max-w-xs mx-auto">
                Your account is now fully active. You can start shopping and enjoying all features.
              </p>
            </div>
            <Link to="/login" className="btn-primary py-4 px-10 flex items-center justify-center gap-3 mx-auto w-fit">
              Start Shopping <ArrowRight size={20} />
            </Link>
          </div>
        )}

        {error && (
          <div className="space-y-8">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto text-red-500">
              <XCircle size={50} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Verification Failed</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm max-w-xs mx-auto">
                This link is invalid or has expired. Enter your email below to get a new one.
              </p>
            </div>

            {resendSent ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 space-y-3">
                <Mail className="mx-auto text-green-500" size={32} />
                <p className="text-sm font-black uppercase tracking-widest text-green-700 dark:text-green-400">
                  New verification link sent! Check your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResend} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12 py-4 w-full"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <button
                  type="submit"
                  disabled={isResending}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2"
                >
                  {isResending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <><RefreshCw size={18} /> Resend Verification Email</>
                  )}
                </button>
              </form>
            )}

            <Link to="/login" className="text-xs font-black text-primary hover:underline uppercase tracking-widest block">
              Back to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
