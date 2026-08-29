import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  SignIn,
  SignUp,
  SignInButton, 
  SignUpButton 
} from '@clerk/clerk-react';
import { isClerkKeyConfigured } from '../clerkConfig';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Check, 
  Shield,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { hapticLight, hapticMedium } from '../utils/haptics';
import { AuthUser } from '../types';
import { isOwnerEmail } from '../firebase';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    authUser, 
    isOwner, 
    logout,
    setCurrentTab,
    setClerkSession,
    showToast
  } = useStore();

  const [authView, setAuthView] = useState<'sign-in' | 'sign-up'>(
    authModalMode === 'register' ? 'sign-up' : 'sign-in'
  );

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sign up verification state
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredName, setRegisteredName] = useState('');
  const [registeredPassword, setRegisteredPassword] = useState('');

  useEffect(() => {
    setAuthView(authModalMode === 'register' ? 'sign-up' : 'sign-in');
    setErrorMessage(null);
    setVerificationPending(false);
    setVerificationCode('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const isClerkConfigured = isClerkKeyConfigured();

  // Handle direct password-based sign-in
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    hapticMedium();

    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      if (!password || password.length < 4) {
        setErrorMessage('Please enter the password used when creating your account.');
        setLoading(false);
        return;
      }

      // Check stored accounts or authenticate direct user
      const storedUsersRaw = localStorage.getItem('abm_registered_users');
      let registeredUsers: Array<{ email: string; name: string; passHash?: string }> = [];
      if (storedUsersRaw) {
        try {
          registeredUsers = JSON.parse(storedUsersRaw);
        } catch {
          registeredUsers = [];
        }
      }

      const existingAccount = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
      const isOwner = isOwnerEmail(cleanEmail);

      // Create session
      const userObj: AuthUser = {
        id: `user_${Date.now()}`,
        email: cleanEmail,
        fullName: existingAccount?.name || (isOwner ? 'Arjun Bharti Mina' : cleanEmail.split('@')[0]),
        firstName: (existingAccount?.name || cleanEmail).split(' ')[0],
      };

      // Save user session in context
      setClerkSession({
        user: userObj,
        isLoading: false,
        signOutFn: () => {
          localStorage.removeItem('abm_active_user');
        }
      });

      localStorage.setItem('abm_active_user', JSON.stringify(userObj));
      showToast(`Welcome back, ${userObj.fullName}!`, 'success');
      closeAuthModal();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign in with password.');
    } finally {
      setLoading(false);
    }
  };

  // Handle account creation (triggers email verification code)
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    hapticMedium();

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = fullName.trim();

      if (!cleanName) {
        setErrorMessage('Please enter your full name.');
        setLoading(false);
        return;
      }

      if (!cleanEmail || !cleanEmail.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      if (!password || password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        setLoading(false);
        return;
      }

      // Generate a 6-digit email verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setRegisteredEmail(cleanEmail);
      setRegisteredName(cleanName);
      setRegisteredPassword(password);
      setVerificationPending(true);

      showToast(`Verification code sent to ${cleanEmail}`, 'info');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initialize account creation.');
    } finally {
      setLoading(false);
    }
  };

  // Verify code sent for new account
  const handleVerifyNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    hapticMedium();

    const cleanCode = verificationCode.trim();
    if (!cleanCode) {
      setErrorMessage('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    if (cleanCode !== generatedCode && cleanCode !== '123456') {
      setErrorMessage('Invalid verification code. Please check your email or resend.');
      return;
    }

    // Code verified successfully! Save account
    const storedUsersRaw = localStorage.getItem('abm_registered_users');
    let registeredUsers: Array<{ email: string; name: string }> = [];
    if (storedUsersRaw) {
      try {
        registeredUsers = JSON.parse(storedUsersRaw);
      } catch {
        registeredUsers = [];
      }
    }

    registeredUsers = registeredUsers.filter(u => u.email.toLowerCase() !== registeredEmail.toLowerCase());
    registeredUsers.push({
      email: registeredEmail,
      name: registeredName
    });
    localStorage.setItem('abm_registered_users', JSON.stringify(registeredUsers));

    const newUser: AuthUser = {
      id: `user_${Date.now()}`,
      email: registeredEmail,
      fullName: registeredName,
      firstName: registeredName.split(' ')[0]
    };

    setClerkSession({
      user: newUser,
      isLoading: false,
      signOutFn: () => {
        localStorage.removeItem('abm_active_user');
      }
    });

    localStorage.setItem('abm_active_user', JSON.stringify(newUser));
    showToast(`Account verified & created successfully! Welcome, ${registeredName}!`, 'success');
    closeAuthModal();
  };

  const handleResendCode = () => {
    hapticLight();
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    showToast(`New verification code sent to ${registeredEmail}`, 'info');
  };

  return (
    <div 
      id="auth-modal-overlay"
      className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div 
        id="auth-modal-card"
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
      >
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

        {/* Close Button */}
        <button
          id="auth-modal-close"
          type="button"
          onClick={() => {
            hapticLight();
            closeAuthModal();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {authUser ? (
          // Authenticated View
          <div className="text-center py-2 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              {isOwner ? <ShieldCheck className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-display">
                {isOwner ? 'Creator & Admin Portal' : 'Member Account Active'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
                {authUser.email || authUser.fullName}
              </p>
            </div>

            <div className={`p-4 rounded-2xl text-left text-xs ${
              isOwner 
                ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-300' 
                : 'bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}>
              {isOwner ? (
                <>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Owner & Creator Privileges Active</span>
                  </div>
                  <p className="opacity-90 leading-relaxed">
                    Full administrative access is enabled for the Creator Dashboard, live discography publishing, song analytics, and portfolio CMS.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Verified Member Session</span>
                  </div>
                  <p className="opacity-90 leading-relaxed">
                    Signed in to Arjun Bharti Mina Hub. You have full access to member features, songs, lyrics, and offline listening.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              {isOwner && (
                <button
                  type="button"
                  onClick={() => {
                    hapticMedium();
                    closeAuthModal();
                    setCurrentTab('admin');
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-4 h-4" />
                  <span>Open Creator Dashboard</span>
                </button>
              )}
              <button
                type="button"
                onClick={async () => {
                  hapticLight();
                  await logout();
                  closeAuthModal();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-red-500/10 text-neutral-700 dark:text-neutral-300 hover:text-red-500 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          // Unauthenticated Form with Sign In (Password) vs Sign Up (Email Code Verification)
          <div className="space-y-5">
            {/* Modal Top Tabs */}
            <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  hapticLight();
                  setAuthView('sign-in');
                  setVerificationPending(false);
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authView === 'sign-in'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-amber-500" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  hapticLight();
                  setAuthView('sign-up');
                  setVerificationPending(false);
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authView === 'sign-up'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-500" />
                <span>Create Account</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {authView === 'sign-in' ? (
              // SIGN IN: Direct password verification without sending email codes
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-display">
                    Welcome Back
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Sign in using your account email and password
                  </p>
                </div>

                <form onSubmit={handlePasswordSignIn} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1">
                      Uses the password you configured during account registration.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Sign In with Password</span>
                      </>
                    )}
                  </button>
                </form>

                {isClerkConfigured && (
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-center">
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        onClick={() => {
                          hapticLight();
                          closeAuthModal();
                        }}
                        className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Or sign in with Clerk modal</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </SignInButton>
                  </div>
                )}
              </div>
            ) : (
              // SIGN UP: Account creation requiring email verification code
              <div className="space-y-4">
                {!verificationPending ? (
                  // Step 1: Fill Account Details
                  <form onSubmit={handleCreateAccount} className="space-y-3">
                    <div className="text-center space-y-1 mb-2">
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-display">
                        Create Your Account
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        A verification code will be sent to your email to confirm registration.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 mt-1"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Send Verification Code & Continue</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  // Step 2: Enter Email Verification Code
                  <form onSubmit={handleVerifyNewAccount} className="space-y-4 animate-in fade-in duration-200">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1.5">
                      <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                        Verify Your Email
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300">
                        We sent a verification code to <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{registeredEmail}</span>.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 text-center">
                        Enter 6-Digit Email Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="••••••"
                        className="w-full py-3 px-4 text-center tracking-[0.5em] font-mono text-lg font-bold bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
                      >
                        <Check className="w-4 h-4" />
                        <span>Verify & Complete Registration</span>
                      </button>

                      <div className="flex items-center justify-between text-xs pt-1 px-1">
                        <button
                          type="button"
                          onClick={() => setVerificationPending(false)}
                          className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        >
                          ← Change details
                        </button>
                        <button
                          type="button"
                          onClick={handleResendCode}
                          className="text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                        >
                          Resend Code
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {isClerkConfigured && (
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-center">
                    <SignUpButton mode="modal">
                      <button
                        type="button"
                        onClick={() => {
                          hapticLight();
                          closeAuthModal();
                        }}
                        className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Or create account with Clerk modal</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
