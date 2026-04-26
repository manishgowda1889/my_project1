import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation, useGoogleAuthMutation } from '@/store/api/authApiSlice';
import { setCredentials } from '@/store/slices/authSlice';
import { toast } from 'react-toastify';
import { Mail, Lock, Loader2, ArrowRight, X, User } from 'lucide-react';

// ── Google Demo Modal ─────────────────────────────────────────────────────────
// Works without any OAuth credentials — user enters their Google email/name
// and we create/login their account directly.
const GoogleDemoModal = ({ onClose, onSuccess }) => {
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleAuth] = useGoogleAuthMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await googleAuth({
        googleAccessToken: 'demo-token',
        userInfo: {
          sub:     'google-' + email.replace(/[^a-z0-9]/gi, ''),
          email,
          name:    name || email.split('@')[0],
          picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=FF6B00&color=fff`,
        },
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success(`Welcome, ${res.user?.name}!`);
      onSuccess();
    } catch (err) {
      toast.error(err?.data?.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-dark-lighter rounded-3xl shadow-2xl p-8 w-full max-w-sm space-y-6 animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-light-darker dark:hover:bg-dark rounded-full transition-colors">
          <X size={18} />
        </button>

        {/* Google branding */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <svg className="h-8 w-8" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-xl font-black">Sign in with Google</span>
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            Enter your Google account details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field pl-12 py-3"
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="Google Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-12 py-3"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <> Continue <ArrowRight size={18} /> </>}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Main Login Page ───────────────────────────────────────────────────────────
const Login = () => {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams]  = useSearchParams();
  const redirect        = searchParams.get('redirect') || '/';

  const [login, { isLoading }]  = useLoginMutation();
  const { isAuthenticated }     = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate(redirect);
  }, [isAuthenticated, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Welcome back to Trendzz!');
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      {showGoogleModal && (
        <GoogleDemoModal
          onClose={() => setShowGoogleModal(false)}
          onSuccess={() => setShowGoogleModal(false)}
        />
      )}

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-light-darker dark:bg-dark transition-colors duration-300">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-lighter p-8 md:p-12 rounded-3xl shadow-xl border border-light-darkest dark:border-dark-lightest">

          <div className="text-center">
            <Link to="/" className="text-4xl font-heading font-black text-primary tracking-tighter italic">
              Trendzz<span className="text-dark dark:text-white">.</span>
            </Link>
            <h2 className="mt-6 text-3xl font-black tracking-tighter text-dark dark:text-white uppercase">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-500 font-bold uppercase tracking-widest">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">Sign up</Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  required
                  className="input-field pl-12 py-3"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="input-field pl-12 py-3"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/20"
            >
              {isLoading
                ? <Loader2 className="animate-spin" size={24} />
                : <> Sign In <ArrowRight size={22} /> </>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-light-darkest dark:border-dark-lightest" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
              <span className="px-4 bg-white dark:bg-dark-lighter text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google button — opens modal, no OAuth credentials needed */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full flex justify-center items-center py-4 border border-light-darkest dark:border-dark-lightest rounded-xl hover:bg-light-darker dark:hover:bg-dark transition-all duration-300 font-black text-sm gap-3 group"
          >
            <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="uppercase tracking-widest">Sign in with Google</span>
          </button>

        </div>
      </div>
    </>
  );
};

export default Login;
