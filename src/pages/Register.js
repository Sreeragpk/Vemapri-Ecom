
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import api from '../utils/api';
// import toast from 'react-hot-toast';

// const Register = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     mobile: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [userId, setUserId] = useState('');
//   // avoid 'assigned but never used'
//   void userId;

//   const [otpData, setOtpData] = useState({
//     emailOtp: '',
//     mobileOtp: '',
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleOtpChange = (e) => {
//     setOtpData({
//       ...otpData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await api.post('/auth/register', formData);
//       setUserId(res.data.userId);
//       setStep(2);
//       toast.success(
//         'Registration successful! Please verify your email.'
//       );
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // await api.post('/auth/verify-otp', {
//       //   identifier: formData.email,
//       //   otp: otpData.emailOtp,
//       //   type: 'email',
//       // });
//       await api.post('/auth/verify-otp', {
//   identifier: formData.email,
//   otp: otpData.emailOtp,
//   type: 'email',
//   purpose: 'email-verification',
// });


//       toast.success('Verification successful! Please login.');
//       navigate('/login');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOtp = async (type) => {
//     try {
//       const identifier = type === 'email' ? formData.email : formData.mobile;
//       await api.post('/auth/resend-otp', {
//   identifier,
//   type,
//   purpose: 'email-verification',
// });

//       toast.success(`OTP sent to your ${type}`);
//     } catch (error) {
//       toast.error('Failed to resend OTP');
//     }
//   };

//   // Social login
//   const handleSocialLogin = (provider) => {
//     const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api')
//       .replace(/\/+$/, '');
//     window.location.href = `${base}/auth/${provider}`;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-white flex items-center">
//       <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//           {/* Left Panel: Brand / Benefits (hidden on small screens) */}
//           <div className="hidden lg:block">
//             <div className="mb-6">
//               <span className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-900">
//                 Welcome to Vemapri
//               </span>
//               <h1 className="mt-4 text-3xl font-bold text-slate-900 leading-tight">
//                 Fresh groceries, delivered with care.
//               </h1>
//               <p className="mt-3 text-sm text-slate-600">
//                 Create your Vemapri account to shop pulses, spices, nuts and
//                 more with fast delivery, secure checkout and easy order
//                 tracking.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//               <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
//                 <h3 className="font-semibold text-slate-900 mb-1">
//                   One account for everything
//                 </h3>
//                 <p className="text-xs text-slate-600">
//                   Save your addresses, view past orders and reorder your
//                   favourites in one click.
//                 </p>
//               </div>
//               <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
//                 <h3 className="font-semibold text-slate-900 mb-1">
//                   Secure & verified
//                 </h3>
//                 <p className="text-xs text-slate-600">
//                   Email verification helps keep your account and orders safe.
//                 </p>
//               </div>
//               <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
//                 <h3 className="font-semibold text-slate-900 mb-1">
//                   Smart offers
//                 </h3>
//                 <p className="text-xs text-slate-600">
//                   Get access to member-only discounts and bundle offers on daily
//                   essentials.
//                 </p>
//               </div>
//               <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
//                 <h3 className="font-semibold text-slate-900 mb-1">
//                   Fast support
//                 </h3>
//                 <p className="text-xs text-slate-600">
//                   Need help? Our team is just a message away for any order
//                   issues.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right Panel: Form */}
//           <div>
//             <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 border border-slate-200">
//               {/* Step Indicator */}
//               <div className="flex items-center justify-center mb-6">
//                 <div className="flex items-center space-x-3 text-xs font-medium">
//                   <div className="flex items-center">
//                     <div
//                       className={`w-7 h-7 rounded-full flex items-center justify-center ${
//                         step === 1
//                           ? 'bg-slate-900 text-white'
//                           : 'bg-slate-100 text-slate-900'
//                       }`}
//                     >
//                       1
//                     </div>
//                     <span className="ml-2 text-slate-800">
//                       Create account
//                     </span>
//                   </div>
//                   <div className="w-6 h-px bg-slate-200" />
//                   <div className="flex items-center">
//                     <div
//                       className={`w-7 h-7 rounded-full flex items-center justify-center ${
//                         step === 2
//                           ? 'bg-slate-900 text-white'
//                           : 'bg-slate-100 text-slate-900'
//                       }`}
//                     >
//                       2
//                     </div>
//                     <span className="ml-2 text-slate-800">Verify OTP</span>
//                   </div>
//                 </div>
//               </div>

//               <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900">
//                 {step === 1
//                   ? 'Create your Vemapri account'
//                   : 'Verify your account'}
//               </h2>
//               <p className="mt-2 text-center text-xs sm:text-sm text-gray-600">
//                 Already have an account?{' '}
//                 <Link
//                   to="/login"
//                   className="font-semibold text-slate-900 underline decoration-slate-300 hover:decoration-slate-500"
//                 >
//                   Sign in
//                 </Link>
//               </p>

//               <div className="mt-6">
//                 {step === 1 ? (
//                   <>
//                     {/* Social Login */}
//                     <div className="space-y-3 mb-6">
//                       <button
//                         type="button"
//                         onClick={() => handleSocialLogin('google')}
//                         className="w-full flex justify-center items-center px-4 py-2 border border-slate-200 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-slate-800 hover:bg-slate-50"
//                       >
//                         <img
//                           src="/google.jpg"
//                           alt="Google"
//                           className="w-5 h-5 mr-2"
//                         />
//                         Sign up with Google
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => handleSocialLogin('facebook')}
//                         className="w-full flex justify-center items-center px-4 py-2 border border-slate-200 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-slate-800 hover:bg-slate-50"
//                       >
//                         <img
//                           src="/facebook.webp"
//                           alt="Facebook"
//                           className="w-5 h-5 mr-2"
//                         />
//                         Sign up with Facebook
//                       </button>
//                     </div>

//                     <div className="relative mb-6">
//                       <div className="absolute inset-0 flex items-center">
//                         <div className="w-full border-t border-slate-200" />
//                       </div>
//                       <div className="relative flex justify-center text-xs">
//                         <span className="px-3 bg-white text-slate-500">
//                           Or continue with email
//                         </span>
//                       </div>
//                     </div>

//                     <form onSubmit={handleRegister} className="space-y-4">
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                           <label
//                             htmlFor="firstName"
//                             className="block text-xs font-medium text-gray-700"
//                           >
//                             First Name
//                           </label>
//                           <input
//                             id="firstName"
//                             name="firstName"
//                             type="text"
//                             required
//                             value={formData.firstName}
//                             onChange={handleChange}
//                             className="input mt-1"
//                             placeholder="e.g. Sreerag"
//                           />
//                         </div>

//                         <div>
//                           <label
//                             htmlFor="lastName"
//                             className="block text-xs font-medium text-gray-700"
//                           >
//                             Last Name
//                           </label>
//                           <input
//                             id="lastName"
//                             name="lastName"
//                             type="text"
//                             required
//                             value={formData.lastName}
//                             onChange={handleChange}
//                             className="input mt-1"
//                             placeholder="e.g. PK"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="email"
//                           className="block text-xs font-medium text-gray-700"
//                         >
//                           Email address
//                         </label>
//                         <input
//                           id="email"
//                           name="email"
//                           type="email"
//                           required
//                           value={formData.email}
//                           onChange={handleChange}
//                           className="input mt-1"
//                           placeholder="you@example.com"
//                         />
//                       </div>

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
//                           placeholder="10-digit mobile number"
//                         />
//                       </div>

//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                           <label
//                             htmlFor="password"
//                             className="block text-xs font-medium text-gray-700"
//                           >
//                             Password
//                           </label>
//                           <input
//                             id="password"
//                             name="password"
//                             type="password"
//                             required
//                             value={formData.password}
//                             onChange={handleChange}
//                             className="input mt-1"
//                             placeholder="Create a password"
//                           />
//                         </div>

//                         <div>
//                           <label
//                             htmlFor="confirmPassword"
//                             className="block text-xs font-medium text-gray-700"
//                           >
//                             Confirm Password
//                           </label>
//                           <input
//                             id="confirmPassword"
//                             name="confirmPassword"
//                             type="password"
//                             required
//                             value={formData.confirmPassword}
//                             onChange={handleChange}
//                             className="input mt-1"
//                             placeholder="Re-enter password"
//                           />
//                         </div>
//                       </div>

//                       <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full mt-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black disabled:opacity-60"
//                       >
//                         {loading ? 'Processing...' : 'Create account'}
//                       </button>

//                       <p className="mt-2 text-[11px] text-gray-500 text-center">
//                         By creating an account, you agree to Vemapri’s{' '}
//                         <Link
//                           to="/terms"
//                           className="underline decoration-slate-300 hover:decoration-slate-500 text-slate-900"
//                         >
//                           Terms
//                         </Link>{' '}
//                         and{' '}
//                         <Link
//                           to="/privacy"
//                           className="underline decoration-slate-300 hover:decoration-slate-500 text-slate-900"
//                         >
//                           Privacy Policy
//                         </Link>
//                         .
//                       </p>
//                     </form>
//                   </>
//                 ) : (
//                   <form onSubmit={handleVerifyOtp} className="space-y-5">
//                     <p className="text-xs sm:text-sm text-gray-600 mb-1">
//                       We&apos;ve sent a one-time code to your email. Enter it
//                       below to complete your registration.
//                     </p>

//                     <div>
//                       <label
//                         htmlFor="emailOtp"
//                         className="block text-xs font-medium text-gray-700"
//                       >
//                         Email OTP
//                       </label>
//                       <input
//                         id="emailOtp"
//                         name="emailOtp"
//                         type="text"
//                         required
//                         value={otpData.emailOtp}
//                         onChange={handleOtpChange}
//                         className="input mt-1 tracking-[0.35em] text-center text-lg"
//                         placeholder="000000"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleResendOtp('email')}
//                         className="text-xs text-slate-900 underline decoration-slate-300 hover:decoration-slate-500 mt-1"
//                       >
//                         Resend Email OTP
//                       </button>
//                     </div>

//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="w-full mt-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black disabled:opacity-60"
//                     >
//                       {loading
//                         ? 'Verifying...'
//                         : 'Verify & Complete Registration'}
//                     </button>
//                   </form>
//                 )}
//               </div>
//             </div>

//             {/* Small link under card on mobile */}
//             <div className="mt-4 text-center text-xs text-gray-600 lg:hidden">
//               Already have an account?{' '}
//               <Link
//                 to="/login"
//                 className="font-semibold text-slate-900 underline decoration-slate-300 hover:decoration-slate-500"
//               >
//                 Sign in
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [userId, setUserId] = useState('');
  void userId;

  const [otpData, setOtpData] = useState({
    emailOtp: '',
    mobileOtp: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtpData({ ...otpData, [e.target.name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      setUserId(res.data.userId);
      setStep(2);
      setResendTimer(30);
      toast.success('Registration successful! Please verify your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', {
        identifier: formData.email,
        otp: otpData.emailOtp,
        type: 'email',
        purpose: 'email-verification',
      });
      toast.success('Verification successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (type) => {
    if (resendTimer > 0) return;
    try {
      const identifier = type === 'email' ? formData.email : formData.mobile;
      await api.post('/auth/resend-otp', { identifier, type, purpose: 'email-verification' });
      setResendTimer(30);
      toast.success(`OTP sent to your ${type}`);
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  const handleSocialLogin = (provider) => {
    const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
    window.location.href = `${base}/auth/${provider}`;
  };

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, label: '', color: '', textColor: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-600' };
    if (score === 2) return { level: 2, label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-600' };
    if (score === 3) return { level: 3, label: 'Good', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
    return { level: 4, label: 'Strong', color: 'bg-emerald-600', textColor: 'text-emerald-700' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const inputClass =
    'w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50/80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all duration-300';

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#fafaf8]">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-orange-100/30 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-yellow-100/30 blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        </div>
        {/* Dot pattern */}
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
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Gradient accent line */}
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600" />

        <div className={`relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          {/* Top — Brand */}
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
                <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-semibold text-amber-300">Trusted by thousands</span>
              </div>

              <h1 className="text-4xl xl:text-[2.75rem] font-extrabold text-white leading-[1.15] tracking-tight">
                Fresh essentials,
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                  delivered with care.
                </span>
              </h1>
              <p className="mt-5 text-gray-400 text-[15px] leading-relaxed max-w-sm">
                Create your free account and discover premium pulses, spices,
                nuts and daily essentials at the best prices.
              </p>
            </div>

            {/* Feature cards */}
            <div className="space-y-3">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  ),
                  title: 'Free delivery on ₹499+',
                  desc: 'Fast, reliable delivery straight to your door.',
                  accent: 'from-emerald-400 to-emerald-500',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  ),
                  title: '100% quality guaranteed',
                  desc: 'Every product is quality-checked before dispatch.',
                  accent: 'from-blue-400 to-blue-500',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  ),
                  title: 'Member-only rewards',
                  desc: 'Exclusive discounts and early access to deals.',
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

          {/* Bottom — Social proof */}
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
                <div className="flex items-center gap-1 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
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
            {/* Top gradient accent */}
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500" />

            {/* Progress bar beneath */}
            <div className="h-0.5 bg-gray-100">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700 ease-out"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>

            <div className="p-7 sm:p-9">
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-7">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= 1 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/30' : 'bg-gray-100 text-gray-400'}`}>
                      {step > 1 ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : '1'}
                    </div>
                    <span className="text-xs font-semibold text-gray-700">Account</span>
                  </div>

                  <div className={`w-12 h-0.5 rounded-full transition-all duration-500 ${step > 1 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gray-200'}`} />

                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step === 2 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/30' : 'bg-gray-100 text-gray-400'}`}>
                      2
                    </div>
                    <span className={`text-xs font-semibold transition-colors ${step === 2 ? 'text-gray-700' : 'text-gray-400'}`}>Verify</span>
                  </div>
                </div>
              </div>

              {/* Heading */}
              <div className="text-center mb-7">
                <h2 className="text-2xl sm:text-[1.7rem] font-extrabold text-gray-900 tracking-tight">
                  {step === 1 ? 'Create your account' : 'Check your inbox'}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  {step === 1 ? (
                    <>
                      Already have an account?{' '}
                      <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                        Sign in
                      </Link>
                    </>
                  ) : (
                    <>
                      We sent a 6-digit code to{' '}
                      <span className="font-semibold text-gray-800">{formData.email}</span>
                    </>
                  )}
                </p>
              </div>

              {step === 1 ? (
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
                      <span className="px-4 bg-white text-xs text-gray-400 font-medium uppercase tracking-wider">
                        or
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="firstName" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                          First name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </div>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`${inputClass} pl-10`}
                            placeholder="Sreerag"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                          Last name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </div>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`${inputClass} pl-10`}
                            placeholder="PK"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                        Email address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={`${inputClass} pl-10`}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mobile" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                        Mobile number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                          </svg>
                        </div>
                        <input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          required
                          value={formData.mobile}
                          onChange={handleChange}
                          className={`${inputClass} pl-10`}
                          placeholder="10-digit mobile number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="password" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          </div>
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className={`${inputClass} pl-10 pr-10`}
                            placeholder="Min 8 chars"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                          Confirm
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          </div>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`${inputClass} pl-10 pr-10`}
                            placeholder="Re-enter"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password match indicator */}
                    {formData.confirmPassword && (
                      <div className="flex items-center gap-1.5">
                        {formData.password === formData.confirmPassword ? (
                          <>
                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            <span className="text-[11px] text-emerald-600 font-medium">Passwords match</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-[11px] text-red-500 font-medium">Passwords don't match</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Password Strength */}
                    {formData.password && (
                      <div className="space-y-1.5">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-100'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[11px] text-gray-500">
                          Strength:{' '}
                          <span className={`font-semibold ${passwordStrength.textColor}`}>
                            {passwordStrength.label}
                          </span>
                        </p>
                      </div>
                    )}

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
                          Creating account…
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Create account
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                      )}
                    </button>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-5 pt-2">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        <span className="text-[10px] font-medium">SSL Secure</span>
                      </div>
                      <div className="w-px h-3 bg-gray-200" />
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                        <span className="text-[10px] font-medium">Data Protected</span>
                      </div>
                      <div className="w-px h-3 bg-gray-200" />
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                        <span className="text-[10px] font-medium">Safe Payments</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                      By creating an account you agree to our{' '}
                      <Link to="/terms" className="text-amber-600 hover:text-amber-700 font-medium underline underline-offset-2">
                        Terms
                      </Link>{' '}
                      &{' '}
                      <Link to="/privacy" className="text-amber-600 hover:text-amber-700 font-medium underline underline-offset-2">
                        Privacy Policy
                      </Link>
                    </p>
                  </form>
                </>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* Animated email icon */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100 flex items-center justify-center">
                        <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="emailOtp" className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider text-center">
                      Enter verification code
                    </label>
                    <input
                      id="emailOtp"
                      name="emailOtp"
                      type="text"
                      required
                      maxLength={6}
                      value={otpData.emailOtp}
                      onChange={handleOtpChange}
                      className="w-full px-4 py-4 text-2xl tracking-[0.5em] text-center border-2 border-gray-200 rounded-2xl bg-gray-50/80 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all duration-300 font-mono font-bold"
                      placeholder="••••••"
                      autoFocus
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-400">
                        Didn't receive it?
                      </p>
                      <button
                        type="button"
                        onClick={() => handleResendOtp('email')}
                        disabled={resendTimer > 0}
                        className={`text-xs font-bold transition-colors ${
                          resendTimer > 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-amber-600 hover:text-amber-700'
                        }`}
                      >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpData.emailOtp.length !== 6}
                    className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_100%] hover:bg-right px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-500"
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
                        Verify & get started
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-semibold transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to registration
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Mobile footer */}
          <div className="mt-6 text-center lg:hidden">
            <p className="text-xs text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-amber-600 hover:text-amber-700">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;