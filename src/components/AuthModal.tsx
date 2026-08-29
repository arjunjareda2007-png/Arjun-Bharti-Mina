import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  SignIn,
  SignUp,
  SignInButton, 
  SignUpButton, 
  UserButton,
  useClerk
} from '@clerk/clerk-react';
import { 
  isClerkKeyConfigured, 
  getClerkPublishableKey, 
  setClerkPublishableKey, 
  CLERK_APP_ID 
} from '../clerkConfig';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  KeyRound, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Check, 
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';
import { hapticLight, hapticMedium } from '../utils/haptics';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    authUser, 
    isOwner, 
    logout,
    setCurrentTab
  } = useStore();

  const [activeTab, setActiveTab] = useState<'auth' | 'key'>(
    authModalMode === 'clerk_config' ? 'key' : 'auth'
  );
  const [clerkKeyInput, setClerkKeyInput] = useState<string>(getClerkPublishableKey());
  const [keySaved, setKeySaved] = useState<boolean>(false);
  const [authView, setAuthView] = useState<'sign-in' | 'sign-up'>(
    authModalMode === 'register' ? 'sign-up' : 'sign-in'
  );

  useEffect(() => {
    if (authModalMode === 'clerk_config') {
      setActiveTab('key');
    } else {
      setActiveTab('auth');
      setAuthView(authModalMode === 'register' ? 'sign-up' : 'sign-in');
    }
    setClerkKeyInput(getClerkPublishableKey());
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const isClerkConfigured = isClerkKeyConfigured();

  const handleSaveClerkKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = clerkKeyInput.trim();
    setClerkPublishableKey(cleanKey);
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      if (cleanKey) {
        setActiveTab('auth');
      }
    }, 1500);
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
        className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
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

        {/* Modal Top Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <button
            type="button"
            onClick={() => {
              hapticLight();
              setActiveTab('auth');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'auth'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Clerk Authentication</span>
          </button>

          <button
            type="button"
            onClick={() => {
              hapticLight();
              setActiveTab('key');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'key'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>Clerk API Key</span>
            {isClerkConfigured && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            )}
          </button>
        </div>

        {/* Tab 1: Clerk Authentication */}
        {activeTab === 'auth' && (
          <div>
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
                        Signed in via Clerk. To manage songs, lyrics, and creator portfolio settings, sign in with the designated creator email account (<span className="font-mono text-amber-500 font-bold">arjunjareda2007@gmail.com</span>).
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
            ) : isClerkConfigured ? (
              // Clerk is live and ready
              <div className="space-y-5">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-display">
                    {authView === 'sign-in' ? 'Sign In to ABM Hub' : 'Create Member Account'}
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Universal Clerk Authentication for visitors, fans & creator owner
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-3 pt-2">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      onClick={() => {
                        hapticMedium();
                        closeAuthModal();
                      }}
                      className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In with Clerk (OAuth / Email / Passkey)</span>
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button
                      type="button"
                      onClick={() => {
                        hapticMedium();
                        closeAuthModal();
                      }}
                      className="w-full py-3 px-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-neutral-900 dark:text-white text-xs font-bold transition-all border border-neutral-200 dark:border-neutral-700 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
                    >
                      <UserPlus className="w-4 h-4 text-amber-500" />
                      <span>Create New Account with Clerk</span>
                    </button>
                  </SignUpButton>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Protected by Clerk Identity Platform</span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-400">
                    App: {CLERK_APP_ID.slice(0, 10)}...
                  </span>
                </div>
              </div>
            ) : (
              // Clerk Key Missing Prompt
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    Clerk Publishable Key Required
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                    To enable Clerk Authentication with your Clerk Application (<span className="font-mono text-amber-500">{CLERK_APP_ID}</span>), paste your Publishable Key below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    hapticLight();
                    setActiveTab('key');
                  }}
                  className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Configure Clerk Key</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Clerk API Key Configuration */}
        {activeTab === 'key' && (
          <div className="space-y-4 pt-1">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-500" />
                <span>Clerk Application Credentials</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Connected to Clerk App: <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{CLERK_APP_ID}</span>
              </p>
            </div>

            <form onSubmit={handleSaveClerkKey} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Publishable Key (<code className="text-amber-500 font-mono">pk_test_...</code> or <code className="text-amber-500 font-mono">pk_live_...</code>)
                </label>
                <input
                  type="text"
                  required
                  value={clerkKeyInput}
                  onChange={(e) => setClerkKeyInput(e.target.value)}
                  placeholder="pk_test_xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
                <p className="text-[11px] text-neutral-400 mt-1.5">
                  Find this in your <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline inline-flex items-center gap-0.5">Clerk Dashboard <ExternalLink className="w-2.5 h-2.5" /></a> &gt; API Keys.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {keySaved ? (
                    <>
                      <Check className="w-4 h-4 text-neutral-950" />
                      <span>Key Saved & Live!</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Save & Activate Clerk</span>
                    </>
                  )}
                </button>

                {clerkKeyInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setClerkKeyInput('');
                      setClerkPublishableKey('');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-red-500/10 text-neutral-500 hover:text-red-500 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold"
                    title="Clear key"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>

            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1">
              <div className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span>Zero-Cruft Clerk System</span>
              </div>
              <p>
                All sign-in, registration, session management, and OAuth flows run exclusively on Clerk. No third-party or mock auth is used.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
