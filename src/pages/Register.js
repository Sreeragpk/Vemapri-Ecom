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
//     confirmPassword: ''
//   });
//   const [userId, setUserId] = useState('');
//   const [otpData, setOtpData] = useState({
//     emailOtp: '',
//     mobileOtp: ''
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleOtpChange = (e) => {
//     setOtpData({
//       ...otpData,
//       [e.target.name]: e.target.value
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
//       toast.success('Registration successful! Please verify your email and mobile.');
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
//       await api.post('/auth/verify-otp', {
//         identifier: formData.email,
//         otp: otpData.emailOtp,
//         type: 'email'
//       });

//       await api.post('/auth/verify-otp', {
//         identifier: formData.mobile,
//         otp: otpData.mobileOtp,
//         type: 'mobile'
//       });

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
//       await api.post('/auth/resend-otp', { identifier, type });
//       toast.success(`OTP sent to your ${type}`);
//     } catch (error) {
//       toast.error('Failed to resend OTP');
//     }
//   };

//   // 👇 keep this INSIDE Register, after other handlers, before return
//   const handleSocialLogin = (provider) => {
//     // REACT_APP_API_URL = http://localhost:5000/api
//     const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api')
//       .replace(/\/+$/, ''); // remove trailing slash if any

//     // This becomes: http://localhost:5000/api/auth/google
//     window.location.href = `${base}/auth/${provider}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           {step === 1 ? "Create your account" : "Verify your account"}
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Or{" "}
//           <Link
//             to="/login"
//             className="font-medium text-primary-600 hover:text-primary-500"
//           >
//             sign in to your account
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           {step === 1 ? (
//             <>
//               {/* Social Login */}
//               <div className="space-y-3 mb-6">
//                 <button
//                   onClick={() => handleSocialLogin("google")}
//                   className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
//                 >
//                   <img
//                     src="/google.jpg"
//                     alt="Google"
//                     className="w-5 h-5 mr-2"
//                   />
//                   Sign up with Google
//                 </button>

//                 <button
//                   onClick={() => handleSocialLogin("facebook")}
//                   className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
//                 >
//                   <img
//                     src="/facebook.webp"
//                     alt="Facebook"
//                     className="w-5 h-5 mr-2"
//                   />
//                   Sign up with Facebook
//                 </button>
//               </div>

//               <div className="relative mb-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">
//                     Or continue with
//                   </span>
//                 </div>
//               </div>

//               <form onSubmit={handleRegister} className="space-y-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label
//                       htmlFor="firstName"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       First Name
//                     </label>
//                     <input
//                       id="firstName"
//                       name="firstName"
//                       type="text"
//                       required
//                       value={formData.firstName}
//                       onChange={handleChange}
//                       className="input mt-1"
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="lastName"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Last Name
//                     </label>
//                     <input
//                       id="lastName"
//                       name="lastName"
//                       type="text"
//                       required
//                       value={formData.lastName}
//                       onChange={handleChange}
//                       className="input mt-1"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Email address
//                   </label>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     required
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="input mt-1"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="mobile"
//                     className="block text-sm font-medium text-gray-700"
//                   >
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
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="password"
//                     className="block text-sm font-medium text-gray-700"
//                   >
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
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="confirmPassword"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Confirm Password
//                   </label>
//                   <input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type="password"
//                     required
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="input mt-1"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full btn btn-primary"
//                 >
//                   {loading ? "Processing..." : "Sign up"}
//                 </button>
//               </form>
//             </>
//           ) : (
//             <form onSubmit={handleVerifyOtp} className="space-y-6">
//               <div>
//                 <label
//                   htmlFor="emailOtp"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Email OTP
//                 </label>
//                 <input
//                   id="emailOtp"
//                   name="emailOtp"
//                   type="text"
//                   required
//                   value={otpData.emailOtp}
//                   onChange={handleOtpChange}
//                   className="input mt-1"
//                   placeholder="Enter email OTP"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleResendOtp("email")}
//                   className="text-sm text-primary-600 hover:text-primary-500 mt-1"
//                 >
//                   Resend Email OTP
//                 </button>
//               </div>

//               <div>
//                 <label
//                   htmlFor="mobileOtp"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Mobile OTP
//                 </label>
//                 <input
//                   id="mobileOtp"
//                   name="mobileOtp"
//                   type="text"
//                   required
//                   value={otpData.mobileOtp}
//                   onChange={handleOtpChange}
//                   className="input mt-1"
//                   placeholder="Enter mobile OTP"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleResendOtp("mobile")}
//                   className="text-sm text-primary-600 hover:text-primary-500 mt-1"
//                 >
//                   Resend Mobile OTP
//                 </button>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full btn btn-primary"
//               >
//                 {loading ? "Verifying..." : "Verify & Complete Registration"}
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from 'react';
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
  const [otpData, setOtpData] = useState({
    emailOtp: '',
    mobileOtp: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpChange = (e) => {
    setOtpData({
      ...otpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register', formData);
      setUserId(res.data.userId);
      setStep(2);
      toast.success(
        'Registration successful! Please verify your email and mobile.'
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // const handleVerifyOtp = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     await api.post('/auth/verify-otp', {
  //       identifier: formData.email,
  //       otp: otpData.emailOtp,
  //       type: 'email',
  //     });

  //     await api.post('/auth/verify-otp', {
  //       identifier: formData.mobile,
  //       otp: otpData.mobileOtp,
  //       type: 'mobile',
  //     });

  //     toast.success('Verification successful! Please login.');
  //     navigate('/login');
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Verification failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await api.post('/auth/verify-otp', {
      identifier: formData.email,
      otp: otpData.emailOtp,
      type: 'email',
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
    try {
      const identifier = type === 'email' ? formData.email : formData.mobile;
      await api.post('/auth/resend-otp', { identifier, type });
      toast.success(`OTP sent to your ${type}`);
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  // Social login
  const handleSocialLogin = (provider) => {
    const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api')
      .replace(/\/+$/, '');
    window.location.href = `${base}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-emerald-50/40 to-white flex items-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Panel: Brand / Benefits (hidden on small screens) */}
          <div className="hidden lg:block">
            <div className="mb-6">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                Welcome to Vemapri
              </span>
              <h1 className="mt-4 text-3xl font-bold text-slate-900 leading-tight">
                Fresh groceries, delivered with care.
              </h1>
              <p className="mt-3 text-sm text-slate-600">
                Create your Vemapri account to shop pulses, spices, nuts and
                more with fast delivery, secure checkout and easy order
                tracking.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-white shadow-sm border border-emerald-50 p-4">
                <h3 className="font-semibold text-slate-900 mb-1">
                  One account for everything
                </h3>
                <p className="text-xs text-slate-600">
                  Save your addresses, view past orders and reorder your
                  favourites in one click.
                </p>
              </div>
              <div className="rounded-2xl bg-white shadow-sm border border-emerald-50 p-4">
                <h3 className="font-semibold text-slate-900 mb-1">
                  Secure & verified
                </h3>
                <p className="text-xs text-slate-600">
                  Email and mobile verification keeps your account and orders
                  safe.
                </p>
              </div>
              <div className="rounded-2xl bg-white shadow-sm border border-emerald-50 p-4">
                <h3 className="font-semibold text-slate-900 mb-1">
                  Smart offers
                </h3>
                <p className="text-xs text-slate-600">
                  Get access to member-only discounts and bundle offers on daily
                  essentials.
                </p>
              </div>
              <div className="rounded-2xl bg-white shadow-sm border border-emerald-50 p-4">
                <h3 className="font-semibold text-slate-900 mb-1">
                  Fast support
                </h3>
                <p className="text-xs text-slate-600">
                  Need help? Our team is just a message away for any order
                  issues.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Form */}
          <div>
            <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 border border-emerald-50">
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-3 text-xs font-medium">
                  <div className="flex items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        step === 1
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      1
                    </div>
                    <span className="ml-2 text-slate-800">Create account</span>
                  </div>
                  <div className="w-6 h-px bg-gray-200" />
                  <div className="flex items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        step === 2
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      2
                    </div>
                    <span className="ml-2 text-slate-800">Verify OTP</span>
                  </div>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900">
                {step === 1 ? 'Create your Vemapri account' : 'Verify your account'}
              </h2>
              <p className="mt-2 text-center text-xs sm:text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Sign in
                </Link>
              </p>

              <div className="mt-6">
                {step === 1 ? (
                  <>
                    {/* Social Login */}
                    <div className="space-y-3 mb-6">
                      <button
                        type="button"
                        onClick={() => handleSocialLogin('google')}
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <img
                          src="/google.jpg"
                          alt="Google"
                          className="w-5 h-5 mr-2"
                        />
                        Sign up with Google
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSocialLogin('facebook')}
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <img
                          src="/facebook.webp"
                          alt="Facebook"
                          className="w-5 h-5 mr-2"
                        />
                        Sign up with Facebook
                      </button>
                    </div>

                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white text-gray-500">
                          Or continue with email
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-xs font-medium text-gray-700"
                          >
                            First Name
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="input mt-1"
                            placeholder="e.g. Sreerag"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-xs font-medium text-gray-700"
                          >
                            Last Name
                          </label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="input mt-1"
                            placeholder="e.g. PK"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Email address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="input mt-1"
                          placeholder="you@example.com"
                        />
                      </div>

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
                          placeholder="10-digit mobile number"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            placeholder="Create a password"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-xs font-medium text-gray-700"
                          >
                            Confirm Password
                          </label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="input mt-1"
                            placeholder="Re-enter password"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn btn-primary mt-2 disabled:opacity-60"
                      >
                        {loading ? 'Processing...' : 'Create account'}
                      </button>

                      <p className="mt-2 text-[11px] text-gray-500 text-center">
                        By creating an account, you agree to Vemapri’s{' '}
                        <Link
                          to="/terms"
                          className="underline text-emerald-600"
                        >
                          Terms
                        </Link>{' '}
                        and{' '}
                        <Link
                          to="/privacy"
                          className="underline text-emerald-600"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </form>
                  </>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      We&apos;ve sent OTPs to your email and mobile number.
                      Please enter them below to complete your registration.
                    </p>

                    <div>
                      <label
                        htmlFor="emailOtp"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Email OTP
                      </label>
                      <input
                        id="emailOtp"
                        name="emailOtp"
                        type="text"
                        required
                        value={otpData.emailOtp}
                        onChange={handleOtpChange}
                        className="input mt-1 tracking-widest text-center"
                        placeholder="Enter email OTP"
                      />
                      <button
                        type="button"
                        onClick={() => handleResendOtp('email')}
                        className="text-xs text-emerald-600 hover:text-emerald-700 mt-1"
                      >
                        Resend Email OTP
                      </button>
                    </div>

                    {/* <div>
                      <label
                        htmlFor="mobileOtp"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Mobile OTP
                      </label>
                      <input
                        id="mobileOtp"
                        name="mobileOtp"
                        type="text"
                        required
                        value={otpData.mobileOtp}
                        onChange={handleOtpChange}
                        className="input mt-1 tracking-widest text-center"
                        placeholder="Enter mobile OTP"
                      />
                      <button
                        type="button"
                        onClick={() => handleResendOtp('mobile')}
                        className="text-xs text-emerald-600 hover:text-emerald-700 mt-1"
                      >
                        Resend Mobile OTP
                      </button>
                    </div> */}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn btn-primary mt-2 disabled:opacity-60"
                    >
                      {loading
                        ? 'Verifying...'
                        : 'Verify & Complete Registration'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
