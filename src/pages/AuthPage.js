// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Panel state: 'login' or 'register'
  const [activePanel, setActivePanel] = useState('login');
  const [isFlipping, setIsFlipping] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    mobile: '',
    password: '',
  });

  const [twoFactorData, setTwoFactorData] = useState({
    userId: '',
    token: '',
  });

  const [requires2FA, setRequires2FA] = useState(false);

  // Register form state
  const [registerStep, setRegisterStep] = useState(1);
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [otpData, setOtpData] = useState({
    emailOtp: '',
    mobileOtp: '',
  });

  const [loading, setLoading] = useState(false);

  // Handle OAuth callback
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

  // Check URL to set initial panel
  useEffect(() => {
    if (location.pathname === '/register') {
      setActivePanel('register');
    } else {
      setActivePanel('login');
    }
  }, [location.pathname]);

  const handleOAuthSuccess = async (token) => {
    try {
      localStorage.setItem('token', token);
      const res = await api.get('/users/profile');
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

  const handleFlip = (panel) => {
    if (isFlipping) return;
    setIsFlipping(true);
    setActivePanel(panel);

    // Update URL without page reload
    const newPath = panel === 'register' ? '/register' : '/login';
    window.history.pushState({}, '', newPath);

    setTimeout(() => {
      setIsFlipping(false);
    }, 700);
  };

  // Login handlers
  const handleLoginChange = (e) => {
    setLoginData((prev) => ({
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
      const res = await api.post('/auth/login', loginData);

      if (res.data.requires2FA) {
        setTwoFactorData((prev) => ({
          ...prev,
          userId: res.data.userId,
        }));
        setRequires2FA(true);
        toast.success('Please enter your 2FA code');
      } else {
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

  // Register handlers
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
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

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', registerData);
      setRegisterStep(2);
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
        identifier: registerData.email,
        otp: otpData.emailOtp,
        type: 'email',
      });

      toast.success('Verification successful! Please login.');
      setRegisterStep(1);
      setRegisterData({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
      });
      setOtpData({ emailOtp: '', mobileOtp: '' });
      handleFlip('login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (type) => {
    try {
      const identifier =
        type === 'email' ? registerData.email : registerData.mobile;
      await api.post('/auth/resend-otp', { identifier, type });
      toast.success(`OTP sent to your ${type}`);
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  // Social login
  const handleSocialLogin = (provider) => {
    const base = (
      process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
    ).replace(/\/+$/, '');
    window.location.href = `${base}/auth/${provider}`;
  };

  // Custom styles for 3D flip effect
  const flipContainerStyle = {
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const flipPanelStyle = {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  };

  const flipFrontStyle = {
    ...flipPanelStyle,
    transform: activePanel === 'register' ? 'rotateY(-180deg)' : 'rotateY(0deg)',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const flipBackStyle = {
    ...flipPanelStyle,
    transform: activePanel === 'register' ? 'rotateY(0deg)' : 'rotateY(180deg)',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const flipBackContentStyle = {
    transform: 'rotateY(180deg)',
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white flex items-center justify-center p-4"
      style={{ perspective: '2000px' }}
    >
      <div
        className="w-full max-w-[950px] min-h-[600px] bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden relative flex"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ==================== LOGIN PANEL (Left) ==================== */}
        <div
          className={`w-1/2 min-h-full flex items-center justify-center bg-white transition-all duration-500 ease-in-out z-10 max-lg:w-full max-lg:absolute max-lg:inset-0 ${
            activePanel === 'register'
              ? 'opacity-0 scale-90 pointer-events-none'
              : 'opacity-100 scale-100'
          }`}
        >
          <div className="w-full max-w-[380px] p-6 lg:p-8">
            {/* 2FA Step Indicator */}
            {requires2FA && (
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-3 text-xs font-medium">
                  <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-200 text-slate-600">
                      1
                    </div>
                    <span className="ml-2 text-slate-500">Sign in</span>
                  </div>
                  <div className="w-8 h-px bg-slate-200" />
                  <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-900 text-white">
                      2
                    </div>
                    <span className="ml-2 text-slate-900 font-semibold">
                      2FA
                    </span>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-2xl lg:text-3xl font-bold text-center text-slate-900 mb-2">
              {requires2FA ? 'Verify Identity' : 'Welcome Back'}
            </h2>

            {!requires2FA && (
              <p className="text-center text-sm text-slate-500 mb-6">
                Sign in to continue shopping
              </p>
            )}

            {!requires2FA ? (
              <>
                {/* Social Login Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => handleSocialLogin('google')}
                    type="button"
                    className="w-full flex justify-center items-center px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
                    Continue with Google
                  </button>

                  <button
                    onClick={() => handleSocialLogin('facebook')}
                    type="button"
                    className="w-full flex justify-center items-center px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="#1877F2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Continue with Facebook
                  </button>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-white text-slate-400 uppercase tracking-wider">
                      or
                    </span>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="login-mobile"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Mobile Number
                    </label>
                    <input
                      id="login-mobile"
                      name="mobile"
                      type="tel"
                      required
                      value={loginData.mobile}
                      onChange={handleLoginChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 bg-slate-50 focus:bg-white"
                      placeholder="Enter your mobile number"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Password
                    </label>
                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      required
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 bg-slate-50 focus:bg-white"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900 cursor-pointer"
                      />
                      <span className="ml-2 text-slate-600">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-slate-900 hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-slate-900/20"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                {/* Mobile: Show link to register */}
                <p className="mt-6 text-center text-sm text-slate-600 lg:hidden">
                  Don't have an account?{' '}
                  <button
                    onClick={() => handleFlip('register')}
                    className="text-slate-900 font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </>
            ) : (
              /* 2FA Verification Form */
              <form onSubmit={handleVerify2FA} className="space-y-5 mt-6">
                <p className="text-sm text-slate-600 text-center">
                  Enter the 6-digit code from your authenticator app
                </p>

                <div>
                  <label
                    htmlFor="token"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
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
                    className="w-full px-4 py-4 border border-slate-200 rounded-xl text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none font-mono bg-slate-50 focus:bg-white"
                    placeholder="000000"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setRequires2FA(false)}
                    className="flex-1 py-3 px-4 border border-slate-200 bg-white text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 disabled:opacity-60 transition-all duration-200"
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ==================== FLIP CONTAINER (Center) ==================== */}
        <div
          className={`absolute top-0 h-full w-1/2 z-50 max-lg:hidden ${
            activePanel === 'register' ? 'left-0' : 'left-1/2'
          }`}
          style={{
            ...flipContainerStyle,
            transformOrigin:
              activePanel === 'register' ? 'right center' : 'left center',
          }}
        >
          {/* Front Panel - "New Here? Sign Up" */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-l-3xl"
            style={{
              ...flipFrontStyle,
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            }}
          >
            <div className="text-center text-white p-8">
              <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-3">New Here?</h3>
              <p className="text-sm text-white/80 mb-8 max-w-[220px] mx-auto leading-relaxed">
                Sign up and discover fresh groceries delivered right to your
                doorstep
              </p>
              <button
                onClick={() => handleFlip('register')}
                disabled={isFlipping}
                className="px-8 py-3 border-2 border-white rounded-full font-semibold text-sm hover:bg-white hover:text-slate-900 transition-all duration-300 disabled:opacity-60 inline-flex items-center gap-2"
              >
                Sign Up
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 16 16 12 12 8" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Back Panel - "Welcome Back! Sign In" */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-r-3xl"
            style={{
              ...flipBackStyle,
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
            }}
          >
            <div className="text-center text-white p-8" style={flipBackContentStyle}>
              <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                Welcome Back!
              </h3>
              <p className="text-sm text-white/80 mb-8 max-w-[220px] mx-auto leading-relaxed">
                Already have an account? Sign in to continue your shopping
                journey
              </p>
              <button
                onClick={() => handleFlip('login')}
                disabled={isFlipping}
                className="px-8 py-3 border-2 border-white rounded-full font-semibold text-sm hover:bg-white hover:text-orange-600 transition-all duration-300 disabled:opacity-60 inline-flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 8 8 12 12 16" />
                  <line x1="16" y1="12" x2="8" y2="12" />
                </svg>
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* ==================== REGISTER PANEL (Right) ==================== */}
        <div
          className={`w-1/2 min-h-full flex items-center justify-center bg-white transition-all duration-500 ease-in-out z-10 max-lg:w-full max-lg:absolute max-lg:inset-0 ${
            activePanel === 'login'
              ? 'opacity-0 scale-90 pointer-events-none'
              : 'opacity-100 scale-100'
          }`}
        >
          <div className="w-full max-w-[400px] p-6 lg:p-8 overflow-y-auto max-h-[580px]">
            {/* Step Indicator */}
            <div className="flex justify-center mb-5">
              <div className="flex items-center space-x-3 text-xs font-medium">
                <div className="flex items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      registerStep === 1
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    1
                  </div>
                  <span
                    className={`ml-2 transition-colors duration-300 ${
                      registerStep === 1
                        ? 'text-slate-900 font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    Details
                  </span>
                </div>
                <div className="w-8 h-px bg-slate-200" />
                <div className="flex items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      registerStep === 2
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`ml-2 transition-colors duration-300 ${
                      registerStep === 2
                        ? 'text-slate-900 font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    Verify
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-center text-slate-900 mb-2">
              {registerStep === 1 ? 'Create Account' : 'Verify Email'}
            </h2>
            <p className="text-center text-sm text-slate-500 mb-5">
              {registerStep === 1
                ? 'Join Vemapri today'
                : 'Check your inbox for the code'}
            </p>

            {registerStep === 1 ? (
              <>
                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="flex justify-center items-center px-3 py-2.5 border border-slate-200 rounded-xl bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('facebook')}
                    className="flex justify-center items-center px-3 py-2.5 border border-slate-200 rounded-xl bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="#1877F2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>

                {/* Divider */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-white text-slate-400 uppercase tracking-wider">
                      or
                    </span>
                  </div>
                </div>

                {/* Register Form */}
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={registerData.firstName}
                        onChange={handleRegisterChange}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none bg-slate-50 focus:bg-white transition-all duration-200"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={registerData.lastName}
                        onChange={handleRegisterChange}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none bg-slate-50 focus:bg-white transition-all duration-200"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      required
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none bg-slate-50 focus:bg-white transition-all duration-200"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reg-mobile"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Mobile Number
                    </label>
                    <input
                      id="reg-mobile"
                      name="mobile"
                      type="tel"
                      required
                      value={registerData.mobile}
                      onChange={handleRegisterChange}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none bg-slate-50 focus:bg-white transition-all duration-200"
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="reg-password"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Password
                      </label>
                      <input
                        id="reg-password"
                        name="password"
                        type="password"
                        required
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none bg-slate-50 focus:bg-white transition-all duration-200"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Confirm
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none bg-slate-50 focus:bg-white transition-all duration-200"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-slate-900/20 mt-2"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    By signing up, you agree to our{' '}
                    <Link to="/terms" className="underline hover:text-slate-900">
                      Terms
                    </Link>{' '}
                    &{' '}
                    <Link
                      to="/privacy"
                      className="underline hover:text-slate-900"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </form>

                {/* Mobile: Show link to login */}
                <p className="mt-5 text-center text-sm text-slate-600 lg:hidden">
                  Already have an account?{' '}
                  <button
                    onClick={() => handleFlip('login')}
                    className="text-slate-900 font-semibold hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </>
            ) : (
              /* OTP Verification Form */
              <form onSubmit={handleVerifyOtp} className="space-y-5 mt-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-600">
                    We sent a verification code to
                    <br />
                    <strong className="text-slate-900">
                      {registerData.email}
                    </strong>
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="emailOtp"
                    className="block text-xs font-semibold text-slate-700 mb-1.5 text-center"
                  >
                    Enter 6-digit OTP
                  </label>
                  <input
                    id="emailOtp"
                    name="emailOtp"
                    type="text"
                    required
                    maxLength={6}
                    value={otpData.emailOtp}
                    onChange={handleOtpChange}
                    className="w-full px-4 py-4 border border-slate-200 rounded-xl text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none font-mono bg-slate-50 focus:bg-white transition-all duration-200"
                    placeholder="000000"
                  />
                  <button
                    type="button"
                    onClick={() => handleResendOtp('email')}
                    className="text-xs text-slate-600 hover:text-slate-900 underline mt-2 block mx-auto"
                  >
                    Didn't receive code? Resend OTP
                  </button>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegisterStep(1)}
                    className="flex-1 py-3 px-4 border border-slate-200 bg-white text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 disabled:opacity-60 transition-all duration-200"
                  >
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
      </div>
    </div>
  );
};

export default AuthPage;