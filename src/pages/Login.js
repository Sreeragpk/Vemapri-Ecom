
// // src/pages/Login.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import api from '../utils/api';
// import toast from 'react-hot-toast';

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     mobile: '',
//     password: '',
//   });

//   const [twoFactorData, setTwoFactorData] = useState({
//     userId: '',
//     token: '',
//   });

//   const [requires2FA, setRequires2FA] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Handle OAuth callback (?token=... or ?error=...)
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const token = params.get('token');
//     const error = params.get('error');

//     if (token) {
//       handleOAuthSuccess(token);
//     } else if (error) {
//       toast.error('Authentication failed. Please try again.');
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [location.search]);

//   const handleOAuthSuccess = async (token) => {
//     try {
//       localStorage.setItem('token', token);

//       const res = await api.get('/users/profile');
//       login(token, res.data);

//       const from = location.state?.from?.pathname || '/';
//       if (res.data.role === 'admin') {
//         navigate('/admin', { replace: true });
//       } else {
//         navigate(from, { replace: true });
//       }
//       toast.success('Login successful!');
//     } catch (error) {
//       console.error('OAuth login error', error);
//       localStorage.removeItem('token');
//       toast.error('Failed to complete login');
//     }
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handle2FAChange = (e) => {
//     setTwoFactorData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await api.post('/auth/login', formData);

//       if (res.data.requires2FA) {
//         setTwoFactorData((prev) => ({
//           ...prev,
//           userId: res.data.userId,
//         }));
//         setRequires2FA(true);
//         toast.success('Please enter your 2FA code');
//       } else {
//         login(res.data.token, res.data.user);

//         const from = location.state?.from?.pathname || '/';
//         if (res.data.user.role === 'admin') {
//           navigate('/admin', { replace: true });
//         } else {
//           navigate(from, { replace: true });
//         }
//         toast.success('Login successful!');
//       }
//     } catch (error) {
//       console.error('Login error', error);
//       toast.error(error.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerify2FA = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await api.post('/auth/verify-2fa', twoFactorData);
//       login(res.data.token, res.data.user);

//       const from = location.state?.from?.pathname || '/';
//       if (res.data.user.role === 'admin') {
//         navigate('/admin', { replace: true });
//       } else {
//         navigate(from, { replace: true });
//       }
//       toast.success('Login successful!');
//     } catch (error) {
//       console.error('2FA verify error', error);
//       toast.error(error.response?.data?.message || 'Verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSocialLogin = (provider) => {
//     const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api')
//       .replace(/\/+$/, '');
//     window.location.href = `${base}/auth/${provider}`;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-white flex items-center">
//       <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//           {/* Left panel (desktop only) */}
//           <div className="hidden lg:block">
//             <div className="mb-6">
//               <span className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-900">
//                 Welcome back to Vemapri
//               </span>
//               <h1 className="mt-4 text-3xl font-bold text-slate-900 leading-tight">
//                 Sign in to continue your grocery journey.
//               </h1>
//               <p className="mt-3 text-sm text-slate-600">
//                 Access your saved addresses, track orders, and reorder your
//                 favourite essentials in just a few clicks.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//               <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
//                 <h3 className="font-semibold text-slate-900 mb-1">
//                   Fast checkout
//                 </h3>
//                 <p className="text-xs text-slate-600">
//                   Your details are securely stored so you can complete orders
//                   quickly.
//                 </p>
//               </div>
//               <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
//                 <h3 className="font-semibold text-slate-900 mb-1">
//                   Smart recommendations
//                 </h3>
//                 <p className="text-xs text-slate-600">
//                   Get personalised suggestions based on your frequent purchases.
//                 </p>
//               </div>
//               <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
//                 <h3 className="font-semibold text-slate-900 mb-1">
//                   Order history
//                 </h3>
//                 <p className="text-xs text-slate-600">
//                   Quickly repeat previous orders without searching again.
//                 </p>
//               </div>
//               <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
//                 <h3 className="font-semibold text-slate-900 mb-1">
//                   Secure login
//                 </h3>
//                 <p className="text-xs text-slate-600">
//                   Two-factor authentication helps keep your account safe.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right panel: Card */}
//           <div>
//             <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 border border-slate-200">
//               {/* Step indicator */}
//               <div className="flex justify-center mb-4">
//                 <div className="flex items-center space-x-3 text-xs font-medium">
//                   <div className="flex items-center">
//                     <div
//                       className={`w-7 h-7 rounded-full flex items-center justify-center ${
//                         !requires2FA
//                           ? 'bg-slate-900 text-white'
//                           : 'bg-slate-100 text-slate-800'
//                       }`}
//                     >
//                       1
//                     </div>
//                     <span className="ml-2 text-slate-800">Sign in</span>
//                   </div>
//                   <div className="w-6 h-px bg-gray-200" />
//                   <div className="flex items-center">
//                     <div
//                       className={`w-7 h-7 rounded-full flex items-center justify-center ${
//                         requires2FA
//                           ? 'bg-slate-900 text-white'
//                           : 'bg-slate-100 text-slate-800'
//                       }`}
//                     >
//                       2
//                     </div>
//                     <span className="ml-2 text-slate-800">2FA</span>
//                   </div>
//                 </div>
//               </div>

//               <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900">
//                 {requires2FA
//                   ? 'Two-Factor Authentication'
//                   : 'Sign in to your account'}
//               </h2>
//               {!requires2FA && (
//                 <p className="mt-2 text-center text-xs sm:text-sm text-gray-600">
//                   New to Vemapri?{' '}
//                   <Link
//                     to="/register"
//                     className="font-semibold text-slate-900 hover:underline"
//                   >
//                     Create an account
//                   </Link>
//                 </p>
//               )}

//               <div className="mt-6">
//                 {!requires2FA ? (
//                   <>
//                     {/* Social Login */}
//                     <div className="space-y-3 mb-6">
//                       <button
//                         onClick={() => handleSocialLogin('google')}
//                         type="button"
//                         className="w-full flex justify-center items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-800 hover:bg-gray-50"
//                       >
//                         <svg
//                           className="w-5 h-5 mr-2"
//                           viewBox="0 0 24 24"
//                           aria-hidden="true"
//                         >
//                           <path
//                             fill="#4285F4"
//                             d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                           />
//                           <path
//                             fill="#34A853"
//                             d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                           />
//                           <path
//                             fill="#FBBC05"
//                             d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                           />
//                           <path
//                             fill="#EA4335"
//                             d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                           />
//                         </svg>
//                         Sign in with Google
//                       </button>

//                       <button
//                         onClick={() => handleSocialLogin('facebook')}
//                         type="button"
//                         className="w-full flex justify-center items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-800 hover:bg-gray-50"
//                       >
//                         <svg
//                           className="w-5 h-5 mr-2"
//                           fill="#1877F2"
//                           viewBox="0 0 24 24"
//                           aria-hidden="true"
//                         >
//                           <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                         </svg>
//                         Sign in with Facebook
//                       </button>
//                     </div>

//                     <div className="relative mb-6">
//                       <div className="absolute inset-0 flex items-center">
//                         <div className="w-full border-t border-gray-200" />
//                       </div>
//                       <div className="relative flex justify-center text-xs">
//                         <span className="px-3 bg-white text-gray-500">
//                           Or continue with mobile
//                         </span>
//                       </div>
//                     </div>

//                     {/* Mobile/password login */}
//                     <form onSubmit={handleLogin} className="space-y-5">
//                       <div>
//                         <label
//                           htmlFor="mobile"
//                           className="block text-xs font-medium text-gray-700"
//                         >
//                           Mobile Number
//                         </label>
//                         <input
//                           id="mobile"
//                           name="mobile"
//                           type="tel"
//                           required
//                           value={formData.mobile}
//                           onChange={handleChange}
//                           className="input mt-1"
//                           placeholder="Enter your mobile number"
//                         />
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="password"
//                           className="block text-xs font-medium text-gray-700"
//                         >
//                           Password
//                         </label>
//                         <input
//                           id="password"
//                           name="password"
//                           type="password"
//                           required
//                           value={formData.password}
//                           onChange={handleChange}
//                           className="input mt-1"
//                           placeholder="Enter your password"
//                         />
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <input
//                             id="remember-me"
//                             name="remember-me"
//                             type="checkbox"
//                             className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-gray-300 rounded"
//                           />
//                           <label
//                             htmlFor="remember-me"
//                             className="ml-2 block text-xs sm:text-sm text-gray-900"
//                           >
//                             Remember me
//                           </label>
//                         </div>

//                         <div className="text-xs sm:text-sm">
//                           <Link
//                             to="/forgot-password"
//                             className="font-medium text-slate-900 hover:underline"
//                           >
//                             Forgot your password?
//                           </Link>
//                         </div>
//                       </div>

//                       <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full mt-1 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
//                       >
//                         {loading ? 'Signing in...' : 'Sign in'}
//                       </button>
//                     </form>
//                   </>
//                 ) : (
//                   // 2FA form
//                   <form onSubmit={handleVerify2FA} className="space-y-6">
//                     <p className="text-xs sm:text-sm text-gray-600 mb-1 text-center">
//                       Enter the 6-digit code from your authenticator app to
//                       complete login.
//                     </p>

//                     <div>
//                       <label
//                         htmlFor="token"
//                         className="block text-xs font-medium text-gray-700"
//                       >
//                         Authentication Code
//                       </label>
//                       <input
//                         id="token"
//                         name="token"
//                         type="text"
//                         required
//                         maxLength={6}
//                         value={twoFactorData.token}
//                         onChange={handle2FAChange}
//                         className="input mt-1 text-center text-2xl tracking-[0.4em]"
//                         placeholder="000000"
//                       />
//                     </div>

//                     <div className="flex space-x-3">
//                       <button
//                         type="button"
//                         onClick={() => setRequires2FA(false)}
//                         className="flex-1 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
//                       >
//                         Back
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={loading}
//                         className="flex-1 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
//                       >
//                         {loading ? 'Verifying...' : 'Verify'}
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>

//             {/* Small link under card on mobile */}
//             <div className="mt-4 text-center text-xs text-gray-600 lg:hidden">
//               New to Vemapri?{' '}
//               <Link
//                 to="/register"
//                 className="font-semibold text-slate-900 hover:underline"
//               >
//                 Create an account
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  Eye,
  EyeOff,
  Smartphone,
  Lock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Check,
  Fingerprint,
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ mobile: '', password: '' });
  const [twoFactorData, setTwoFactorData] = useState({ userId: '', token: '' });
  const [requires2FA, setRequires2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');
    if (token) handleOAuthSuccess(token);
    else if (error) toast.error('Authentication failed. Please try again.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleOAuthSuccess = async (token) => {
    try {
      localStorage.setItem('token', token);
      const res = await api.get('/users/profile');
      login(token, res.data);
      const from = location.state?.from?.pathname || '/';
      navigate(res.data.role === 'admin' ? '/admin' : from, { replace: true });
      toast.success('Login successful!');
    } catch (error) {
      console.error('OAuth login error', error);
      localStorage.removeItem('token');
      toast.error('Failed to complete login');
    }
  };

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handle2FAChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setTwoFactorData((p) => ({ ...p, [e.target.name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      if (res.data.requires2FA) {
        setTwoFactorData((p) => ({ ...p, userId: res.data.userId }));
        setRequires2FA(true);
        toast.success('Please enter your 2FA code');
      } else {
        login(res.data.token, res.data.user);
        const from = location.state?.from?.pathname || '/';
        navigate(res.data.user.role === 'admin' ? '/admin' : from, { replace: true });
        toast.success('Login successful!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-2fa', twoFactorData);
      login(res.data.token, res.data.user);
      const from = location.state?.from?.pathname || '/';
      navigate(res.data.user.role === 'admin' ? '/admin' : from, { replace: true });
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
    window.location.href = `${base}/auth/${provider}`;
  };

  const inputClass =
    'w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50/80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all duration-300';

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#fafaf8]">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-orange-100/30 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-yellow-100/30 blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #92400e 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Left Panel — Dark premium sidebar */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600" />

        <div className={`relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <span className="text-white font-black text-lg">V</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">Vemapri</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-gray-400 font-medium">Premium Grocery Store</span>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-amber-300">Welcome back</span>
              </div>

              <h1 className="text-4xl xl:text-[2.75rem] font-extrabold text-white leading-[1.15] tracking-tight">
                Your essentials
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                  are waiting for you.
                </span>
              </h1>
              <p className="mt-5 text-gray-400 text-[15px] leading-relaxed max-w-sm">
                Sign in to access your saved addresses, track orders, and
                reorder your favourite products instantly.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {[
                {
                  icon: <Truck className="w-5 h-5" />,
                  title: 'Lightning-fast delivery',
                  desc: 'Get your groceries delivered within hours, not days.',
                  accent: 'from-emerald-400 to-emerald-500',
                },
                {
                  icon: <RotateCcw className="w-5 h-5" />,
                  title: 'Quick reorder',
                  desc: 'Repeat your last order with a single tap.',
                  accent: 'from-blue-400 to-blue-500',
                },
                {
                  icon: <ShieldCheck className="w-5 h-5" />,
                  title: 'Secure & private',
                  desc: 'Your data is encrypted with bank-grade security.',
                  accent: 'from-amber-400 to-orange-500',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.accent} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-10">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
              <div className="flex -space-x-2.5">
                {['🧑‍🍳', '👩‍💼', '👨‍💻', '👩‍🎨', '🧑‍🔬'].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 border-2 border-gray-800 flex items-center justify-center text-sm shadow-md"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  <strong className="text-white">4.9/5</strong> from 150+ happy customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 relative z-10">
        <div className={`w-full max-w-[480px] transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {/* Mobile brand header */}
          <div className="flex items-center justify-center gap-2.5 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-white font-black text-base">V</span>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">Vemapri</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
            {/* Top accent */}
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500" />
            <div className="h-0.5 bg-gray-100">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700 ease-out"
                style={{ width: requires2FA ? '100%' : '50%' }}
              />
            </div>

            <div className="p-7 sm:p-9">
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-7">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${!requires2FA ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/30' : 'bg-gray-100 text-gray-400'}`}>
                      {requires2FA ? <Check className="w-4 h-4" /> : '1'}
                    </div>
                    <span className="text-xs font-semibold text-gray-700">Sign in</span>
                  </div>
                  <div className={`w-12 h-0.5 rounded-full transition-all duration-500 ${requires2FA ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gray-200'}`} />
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${requires2FA ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/30' : 'bg-gray-100 text-gray-400'}`}>
                      2
                    </div>
                    <span className={`text-xs font-semibold transition-colors ${requires2FA ? 'text-gray-700' : 'text-gray-400'}`}>Verify</span>
                  </div>
                </div>
              </div>

              {/* Heading */}
              <div className="text-center mb-7">
                <h2 className="text-2xl sm:text-[1.7rem] font-extrabold text-gray-900 tracking-tight">
                  {requires2FA ? 'Two-factor verification' : 'Welcome back'}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  {requires2FA ? (
                    'Enter the code from your authenticator app'
                  ) : (
                    <>
                      New to Vemapri?{' '}
                      <Link to="/register" className="font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                        Create an account <ChevronRight className="w-3 h-3 inline" />
                      </Link>
                    </>
                  )}
                </p>
              </div>

              {!requires2FA ? (
                <>
                  {/* Google Login */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="w-full flex justify-center items-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-[0.98] transition-all duration-200"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative my-7">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-white text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label htmlFor="mobile" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                        Mobile number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Smartphone className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          required
                          value={formData.mobile}
                          onChange={handleChange}
                          className={`${inputClass} pl-10`}
                          placeholder="Enter your mobile number"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Password
                        </label>
                        <Link
                          to="/forgot-password"
                          className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className={`${inputClass} pl-10 pr-10`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRememberMe(!rememberMe)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                          rememberMe
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-500 shadow-sm shadow-amber-500/30'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        {rememberMe && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </button>
                      <label
                        onClick={() => setRememberMe(!rememberMe)}
                        className="text-sm text-gray-600 cursor-pointer select-none"
                      >
                        Keep me signed in
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_100%] hover:bg-right px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-500"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Signing in…
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Sign in
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </button>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-5 pt-3">
                      {[
                        { icon: <Lock className="w-3.5 h-3.5" />, label: 'SSL Secure' },
                        { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: 'Data Protected' },
                        { icon: <Fingerprint className="w-3.5 h-3.5" />, label: '2FA Ready' },
                      ].map((badge, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <div className="w-px h-3 bg-gray-200" />}
                          <div className="flex items-center gap-1.5 text-gray-400">
                            {badge.icon}
                            <span className="text-[10px] font-medium">{badge.label}</span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </form>
                </>
              ) : (
                <form onSubmit={handleVerify2FA} className="space-y-6">
                  {/* 2FA Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100 flex items-center justify-center">
                        <ShieldCheck className="w-10 h-10 text-amber-500" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Lock className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 text-center leading-relaxed">
                    Open your authenticator app and enter the 6-digit code to verify your identity.
                  </p>

                  <div>
                    <label htmlFor="token" className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider text-center">
                      Authentication code
                    </label>
                    <input
                      id="token"
                      name="token"
                      type="text"
                      required
                      maxLength={6}
                      value={twoFactorData.token}
                      onChange={handle2FAChange}
                      className="w-full px-4 py-4 text-2xl tracking-[0.5em] text-center border-2 border-gray-200 rounded-2xl bg-gray-50/80 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all duration-300 font-mono font-bold"
                      placeholder="••••••"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRequires2FA(false)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || twoFactorData.token.length !== 6}
                      className="flex-[2] rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_100%] hover:bg-right px-4 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-500"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Verifying…
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Verify & sign in
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    Lost access to your authenticator?{' '}
                    <Link to="/forgot-password" className="text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-2">
                      Get help
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Mobile footer */}
          <div className="mt-6 text-center lg:hidden">
            <p className="text-xs text-gray-400">
              New to Vemapri?{' '}
              <Link to="/register" className="font-bold text-amber-600 hover:text-amber-700">
                Create an account →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;