import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Mail, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  KeyRound, 
  AlertCircle,
  Loader2,
  ShieldCheck,
  UserPlus,
  LogIn
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    openAuthModal,
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    resetPassword,
    authLoading, 
    authError,
    authUser,
    isOwner,
    logout
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!email.trim()) {
      setValidationError('Please enter your email address.');
      return;
    }

    if (authModalMode === 'forgot') {
      await resetPassword(email);
      return;
    }

    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }

    if (authModalMode === 'register') {
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
      await registerWithEmail(email, password);
    } else {
      await loginWithEmail(email, password);
    }
  };

  return (
    <div 
      id="auth-modal-overlay"
      className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div 
        id="auth-modal-card"
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

        {/* Close Button */}
        <button
          id="auth-modal-close"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {authUser ? (
          // Logged in state
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              {isOwner ? <ShieldCheck className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {isOwner ? 'Creator & Admin Verified' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
                {authUser.email}
              </p>
            </div>

            {isOwner && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-left text-xs text-amber-800 dark:text-amber-300">
                <p className="font-semibold mb-0.5">👑 Owner Account Active</p>
                <p className="opacity-90">Full access enabled for the Creator Dashboard, live content publishing, media library, and site settings.</p>
              </div>
            )}

            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  closeAuthModal();
                }}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-xl transition-colors"
              >
                Continue to Portal
              </button>
              <button
                onClick={async () => {
                  await logout();
                }}
                className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium rounded-xl transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          // Auth forms
          <div>
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {authModalMode === 'login' && 'Sign In to Hub'}
                {authModalMode === 'register' && 'Create Account'}
                {authModalMode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {authModalMode === 'login' && 'Access creator controls or connect your visitor profile'}
                {authModalMode === 'register' && 'Join the community and save lyrical favorites'}
                {authModalMode === 'forgot' && "Enter your email and we'll send a password reset link"}
              </p>
            </div>

            {/* Error alerts */}
            {(authError || validationError) && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{validationError || authError}</span>
              </div>
            )}

            {/* Google One-Click Button */}
            {authModalMode !== 'forgot' && (
              <div className="mb-5">
                <button
                  type="button"
                  id="auth-google-btn"
                  onClick={loginWithGoogle}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-100 font-semibold rounded-xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-60"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white dark:bg-neutral-900 px-3 text-neutral-400 dark:text-neutral-500 font-mono">
                      or use email
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {authModalMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Password
                    </label>
                    {authModalMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => openAuthModal('forgot')}
                        className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {authModalMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                id="auth-submit-btn"
                disabled={authLoading}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {authModalMode === 'login' && (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Sign In</span>
                      </>
                    )}
                    {authModalMode === 'register' && (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Create Account</span>
                      </>
                    )}
                    {authModalMode === 'forgot' && (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </form>

            {/* Mode Switcher */}
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500 dark:text-neutral-400">
              {authModalMode === 'login' ? (
                <p>
                  Don't have an account yet?{' '}
                  <button
                    onClick={() => openAuthModal('register')}
                    className="font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Create one now
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => openAuthModal('login')}
                    className="font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Back to Sign In
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
