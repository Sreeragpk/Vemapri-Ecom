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
//     password: ''
//   });
//   const [twoFactorData, setTwoFactorData] = useState({
//     userId: '',
//     token: ''
//   });
//   const [requires2FA, setRequires2FA] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Handle OAuth callback
//     const params = new URLSearchParams(location.search);
//     const token = params.get('token');
//     const error = params.get('error');

//     if (token) {
//       handleOAuthSuccess(token);
//     } else if (error) {
//       toast.error('Authentication failed. Please try again.');
//     }
//   }, [location]);

//   const handleOAuthSuccess = async (token) => {
//     try {
//       // Set token and get user data
//       localStorage.setItem('token', token);
//       const res = await api.get('/users/profile');
//       login(token, res.data);
      
//       if (res.data.role === 'admin') {
//         navigate('/admin');
//       } else {
//         navigate('/');
//       }
//       toast.success('Login successful!');
//     } catch (error) {
//       toast.error('Failed to complete login');
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handle2FAChange = (e) => {
//     setTwoFactorData({
//       ...twoFactorData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await api.post('/auth/login', formData);

//       if (res.data.requires2FA) {
//         setTwoFactorData({
//           ...twoFactorData,
//           userId: res.data.userId
//         });
//         setRequires2FA(true);
//         toast.success('Please enter your 2FA code');
//       } else {
//         login(res.data.token, res.data.user);
        
//         if (res.data.user.role === 'admin') {
//           navigate('/admin');
//         } else {
//           const from = location.state?.from?.pathname || '/';
//           navigate(from);
//         }
//         toast.success('Login successful!');
//       }
//     } catch (error) {
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
      
//       if (res.data.user.role === 'admin') {
//         navigate('/admin');
//       } else {
//         const from = location.state?.from?.pathname || '/';
//         navigate(from);
//       }
//       toast.success('Login successful!');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

// const handleSocialLogin = (provider) => {
//   // REACT_APP_API_URL = http://localhost:5000/api
//   const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api')
//     .replace(/\/+$/, ''); // remove trailing slash if any

//   // Result: http://localhost:5000/api/auth/google or /facebook
//   window.location.href = `${base}/auth/${provider}`;
// };


//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           {requires2FA ? 'Two-Factor Authentication' : 'Sign in to your account'}
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Or{' '}
//           <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
//             create a new account
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           {!requires2FA ? (
//             <>
//               {/* Social Login */}
//               <div className="space-y-3 mb-6">
//                 <button
//                   onClick={() => handleSocialLogin('google')}
//                   className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
//                 >
//                   <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                   </svg>
//                   Sign in with Google
//                 </button>

//                 <button
//                   onClick={() => handleSocialLogin('facebook')}
//                   className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
//                 >
//                   <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
//                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                   </svg>
//                   Sign in with Facebook
//                 </button>
//               </div>

//               <div className="relative mb-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                 </div>
//               </div>

//               <form onSubmit={handleLogin} className="space-y-6">
//                 <div>
//                   <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
//                     Mobile Number
//                   </label>
//                   <input
//                     id="mobile"
//                     name="mobile"
//                     type="tel"
//                     required
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     className="input mt-1"
//                     placeholder="Enter your mobile number"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                     Password
//                   </label>
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="input mt-1"
//                     placeholder="Enter your password"
//                   />
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <input
//                       id="remember-me"
//                       name="remember-me"
//                       type="checkbox"
//                       className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                     />
//                     <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                       Remember me
//                     </label>
//                   </div>

//                   <div className="text-sm">
//                     <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
//                       Forgot your password?
//                     </Link>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full btn btn-primary"
//                 >
//                   {loading ? 'Signing in...' : 'Sign in'}
//                 </button>
//               </form>
//             </>
//           ) : (
//             <form onSubmit={handleVerify2FA} className="space-y-6">
//               <div>
//                 <p className="text-sm text-gray-600 mb-4">
//                   Enter the 6-digit code from your authenticator app
//                 </p>
//                 <label htmlFor="token" className="block text-sm font-medium text-gray-700">
//                   Authentication Code
//                 </label>
//                 <input
//                   id="token"
//                   name="token"
//                   type="text"
//                   required
//                   maxLength="6"
//                   value={twoFactorData.token}
//                   onChange={handle2FAChange}
//                   className="input mt-1 text-center text-2xl tracking-widest"
//                   placeholder="000000"
//                 />
//               </div>

//               <div className="flex space-x-4">
//                 <button
//                   type="button"
//                   onClick={() => setRequires2FA(false)}
//                   className="flex-1 btn btn-secondary"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 btn btn-primary"
//                 >
//                   {loading ? 'Verifying...' : 'Verify'}
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
  });

  const [twoFactorData, setTwoFactorData] = useState({
    userId: '',
    token: '',
  });

  const [requires2FA, setRequires2FA] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle OAuth callback (?token=... or ?error=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      handleOAuthSuccess(token);
    } else if (error) {
      toast.error('Authentication failed. Please try again.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleOAuthSuccess = async (token) => {
    try {
      // Get user profile using the token, then call login()
      // api interceptor will attach token from localStorage, so we temporarily store it:
      localStorage.setItem('token', token);

      const res = await api.get('/users/profile');
      // now let AuthContext own token+user state
      login(token, res.data);

      const from = location.state?.from?.pathname || '/';
      if (res.data.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
      toast.success('Login successful!');
    } catch (error) {
      console.error('OAuth login error', error);
      localStorage.removeItem('token');
      toast.error('Failed to complete login');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handle2FAChange = (e) => {
    setTwoFactorData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);

      // backend shape: { requires2FA, userId? , token?, user? }
      if (res.data.requires2FA) {
        setTwoFactorData((prev) => ({
          ...prev,
          userId: res.data.userId,
        }));
        setRequires2FA(true);
        toast.success('Please enter your 2FA code');
      } else {
        // normal login
        login(res.data.token, res.data.user);

        const from = location.state?.from?.pathname || '/';
        if (res.data.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('Login error', error);
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
      if (res.data.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
      toast.success('Login successful!');
    } catch (error) {
      console.error('2FA verify error', error);
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // REACT_APP_API_URL should be like "https://vemapri-backend.onrender.com/api"
    const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api')
      .replace(/\/+$/, ''); // trim trailing slash
    // sends user to backend /auth/google or /auth/facebook
    window.location.href = `${base}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-emerald-50/40 to-white flex items-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left panel (desktop only) */}
          <div className="hidden lg:block">
            <div className="mb-6">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                Welcome back to Vemapri
              </span>
              <h1 className="mt-4 text-3xl font-bold text-slate-900 leading-tight">
                Sign in to continue your grocery journey.
              </h1>
              <p className="mt-3 text-sm text-slate-600">
                Access your saved addresses, track your orders, and reorder your
                favourite pulses, spices, nuts and more in a few taps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-white shadow-sm border border-emerald-50 p-4">
                <h3 className="font-semibold text-slate-900 mb-1">
                  Fast checkout
                </h3>
                <p className="text-xs text-slate-600">
                  Your details are securely stored so you can complete orders
                  quickly.
                </p>
              </div>
              <div className="rounded-2xl bg-white shadow-sm border border-emerald-50 p-4">
                <h3 className="font-semibold text-slate-900 mb-1">
                  Smart recommendations
                </h3>
                <p className="text-xs text-slate-600">
                  See personalised suggestions based on what you buy most.
                </p>
              </div>
              <div className="rounded-2xl bg-white shadow-sm border border-emerald-50 p-4">
                <h3 className="font-semibold text-slate-900 mb-1">
                  Order history
                </h3>
                <p className="text-xs text-slate-600">
                  Quickly repeat previous orders without searching again.
                </p>
              </div>
              <div className="rounded-2xl bg-white shadow-sm border border-emerald-50 p-4">
                <h3 className="font-semibold text-slate-900 mb-1">
                  Secure login
                </h3>
                <p className="text-xs text-slate-600">
                  Two-factor authentication keeps your account safe.
                </p>
              </div>
            </div>
          </div>

          {/* Right panel: Card */}
          <div>
            <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 border border-emerald-50">
              {/* Step indicator */}
              <div className="flex justify-center mb-4">
                <div className="flex items-center space-x-3 text-xs font-medium">
                  <div className="flex items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        !requires2FA
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      1
                    </div>
                    <span className="ml-2 text-slate-800">Sign in</span>
                  </div>
                  <div className="w-6 h-px bg-gray-200" />
                  <div className="flex items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        requires2FA
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      2
                    </div>
                    <span className="ml-2 text-slate-800">2FA</span>
                  </div>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900">
                {requires2FA
                  ? 'Two-Factor Authentication'
                  : 'Sign in to your account'}
              </h2>
              {!requires2FA && (
                <p className="mt-2 text-center text-xs sm:text-sm text-gray-600">
                  New to Vemapri?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Create an account
                  </Link>
                </p>
              )}

              <div className="mt-6">
                {!requires2FA ? (
                  <>
                    {/* Social Login */}
                    <div className="space-y-3 mb-6">
                      <button
                        onClick={() => handleSocialLogin('google')}
                        type="button"
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        {/* Google icon */}
                        <svg
                          className="w-5 h-5 mr-2"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Sign in with Google
                      </button>

                      <button
                        onClick={() => handleSocialLogin('facebook')}
                        type="button"
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        {/* Facebook icon */}
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="#1877F2"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Sign in with Facebook
                      </button>
                    </div>

                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white text-gray-500">
                          Or continue with mobile
                        </span>
                      </div>
                    </div>

                    {/* Mobile/password login */}
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div>
                        <label
                          htmlFor="mobile"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Mobile Number
                        </label>
                        <input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          required
                          value={formData.mobile}
                          onChange={handleChange}
                          className="input mt-1"
                          placeholder="Enter your mobile number"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="input mt-1"
                          placeholder="Enter your password"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="remember-me"
                            className="ml-2 block text-xs sm:text-sm text-gray-900"
                          >
                            Remember me
                          </label>
                        </div>

                        <div className="text-xs sm:text-sm">
                          <Link
                            to="/forgot-password"
                            className="font-medium text-emerald-600 hover:text-emerald-700"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn btn-primary mt-1 disabled:opacity-60"
                      >
                        {loading ? 'Signing in...' : 'Sign in'}
                      </button>
                    </form>
                  </>
                ) : (
                  // 2FA form
                  <form onSubmit={handleVerify2FA} className="space-y-6">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 text-center">
                      Enter the 6-digit code from your authenticator app to
                      complete login.
                    </p>

                    <div>
                      <label
                        htmlFor="token"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Authentication Code
                      </label>
                      <input
                        id="token"
                        name="token"
                        type="text"
                        required
                        maxLength={6}
                        value={twoFactorData.token}
                        onChange={handle2FAChange}
                        className="input mt-1 text-center text-2xl tracking-[0.4em]"
                        placeholder="000000"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setRequires2FA(false)}
                        className="flex-1 btn btn-secondary"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 btn btn-primary"
                      >
                        {loading ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Small link under card on mobile */}
            <div className="mt-4 text-center text-xs text-gray-600 lg:hidden">
              New to Vemapri?{' '}
              <Link
                to="/register"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

