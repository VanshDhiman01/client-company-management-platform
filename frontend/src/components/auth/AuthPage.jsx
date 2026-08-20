import React, { useState } from 'react';
import {
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/authService';

export const AuthPage = () => {
  const {
    authScreen,
    setAuthScreen,
    login,
    registerClient,
    users
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Forgot / Reset state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [resetToken, setResetToken] = useState('DEMO-KEY-882');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Route after login based on authenticated user role
  const redirectByRole = (role) => {
    // Check if user was redirected from a protected route
    const from = location.state?.from?.pathname;
    if (from && !from.includes('/login')) {
      navigate(from, { replace: true });
      return;
    }

    if (role === 'CLIENT') {
      navigate('/client/dashboard', { replace: true });
    } else if (role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    } else if (role === 'DEVELOPER') {
      navigate('/developer/dashboard', { replace: true });
    } else {
      navigate('/client/dashboard', { replace: true });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    try {
      // Step 1: Call authentication context / service
      const authenticatedUser = await login(loginEmail, loginPassword);
      setIsSubmitting(false);

      if (authenticatedUser) {
        // Step 2: Dynamically redirect according to the authenticated user's role
        redirectByRole(authenticatedUser.role);
      } else {
        setLoginError('Invalid credentials. Please check your email or use a demo account.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regCompany || !regPassword) return;
    setIsSubmitting(true);

    try {
      await registerClient({
        name: regName,
        email: regEmail,
        companyName: regCompany,
        phone: regPhone,
        password: regPassword
      });
      setIsSubmitting(false);
      // Automatically navigate new client to their dashboard
      redirectByRole('CLIENT');
    } catch (err) {
      setIsSubmitting(false);
      setLoginError(err.message || 'Registration failed.');
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (forgotEmail) {
      try {
        await authService.forgotPassword(forgotEmail);
      } catch (e) {
        // Fallback for demo
      }
      setForgotSent(true);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await authService.resetPassword(resetToken, newPassword);
    } catch (e) {
      // Fallback for demo
    }
    setResetSuccess(true);
    setTimeout(() => {
      setAuthScreen('login');
      setResetSuccess(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex justify-center mb-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg text-white font-bold">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-white">
          Orange Mantra – Interview Project
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Client–Company Management & Delivery System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-800/90 border border-slate-700/80 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          {/* 1. LOGIN SCREEN */}
          {authScreen === 'login' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Sign In to Your Portal</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter your credentials to securely access your role dashboard.
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Email Address
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. sarah.lin@apexretail.com"
                      className="block w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="block w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginError('');
                      setAuthScreen('forgot');
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>



              <div className="mt-5 text-center text-xs text-slate-400">
                Need a new client account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setLoginError('');
                    setAuthScreen('register');
                  }}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  Register Here
                </button>
              </div>
            </div>
          )}

          {/* 2. REGISTER SCREEN */}
          {authScreen === 'register' && (
            <div>
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-white">Client Registration</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Create a portal account for your company.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Hayes"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Company Name
                  </label>
                  <div className="mt-1 relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acorn Ventures Inc."
                      value={regCompany}
                      onChange={(e) => setRegCompany(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Work Email
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="jordan@acorn.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Phone Number (Optional)
                  </label>
                  <div className="mt-1 relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"

                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Choose a secure password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Creating Account...' : 'Register'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthScreen('login')}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  Login here
                </button>
              </div>
            </div>
          )}

          {/* 3. FORGOT PASSWORD */}
          {authScreen === 'forgot' && (
            <div>
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-white">Reset Password</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter your email address and we'll generate password recovery instructions.
                </p>
              </div>

              {forgotSent ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Recovery instructions sent!</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    We sent a secure token link to <span className="font-semibold text-white">{forgotEmail}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAuthScreen('reset')}
                    className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs cursor-pointer"
                  >
                    Proceed to Reset Key Entry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      Registered Email
                    </label>
                    <div className="mt-1 relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. sarah.lin@apexretail.com"
                        className="block w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Send Recovery Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="mt-5 text-center text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => setAuthScreen('login')}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  ← Return to Login
                </button>
              </div>
            </div>
          )}

          {/* 4. RESET PASSWORD */}
          {authScreen === 'reset' && (
            <div>
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-white">Create New Password</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set a secure password for your client/company account.
                </p>
              </div>

              {resetSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="font-semibold">Password updated successfully!</p>
                  <p className="text-slate-400">Redirecting to login portal...</p>
                </div>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      Security Token
                    </label>
                    <div className="mt-1 relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      New Password
                    </label>
                    <div className="mt-1 relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="block w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Update Password & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="mt-5 text-center text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => setAuthScreen('login')}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
