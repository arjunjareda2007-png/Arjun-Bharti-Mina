import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  SignIn, 
  SignUp, 
  SignInButton, 
  SignUpButton, 
  UserButton 
} from '@clerk/clerk-react';
import { isClerkKeyConfigured, CLERK_APP_ID } from '../clerkConfig';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  KeyRound, 
  LogIn, 
  UserPlus, 
  LogOut 
} from 'lucide-react';
import { hapticLight } from '../utils/haptics';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    authUser, 
    isOwner, 
    logout,
    loginWithGoogle,
    setCurrentTab
  } = useStore();

  if (!isAuthModalOpen) return null;

  const isClerkConfigured = isClerkKeyConfigured();

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
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        {/* Ambient Top Glow */}
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
          // Logged in state
          <div className="text-center py-2 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              {isOwner ? <ShieldCheck className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-display">
                {isOwner ? 'Creator & Admin Verified' : 'Member Account Active'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
                {authUser.email || authUser.fullName}
              </p>
            </div>

            {isOwner && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-left text-xs text-amber-800 dark:text-amber-300">
                <p className="font-semibold mb-0.5">👑 Owner Privileges Active</p>
                <p className="opacity-90">Full access enabled for the Creator Dashboard, live discography publishing, and portfolio management.</p>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              {isOwner && (
                <button
                  type="button"
                  onClick={() => {
                    closeAuthModal();
                    setCurrentTab('admin');
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  Open Dashboard
                </button>
              )}
              <button
                type="button"
                onClick={async () => {
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
          // Signed out view
          <div className="space-y-5 pt-2">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-display">
                {authModalMode === 'register' ? 'Create Your Account' : 'Sign In with Clerk'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Unlock creator management tools and member preferences.
              </p>
            </div>

            {isClerkConfigured ? (
              <div className="space-y-3">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    onClick={() => closeAuthModal()}
                    className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Continue with Clerk Sign In</span>
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button
                    type="button"
                    onClick={() => closeAuthModal()}
                    className="w-full py-2.5 px-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-neutral-900 dark:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-amber-500" />
                    <span>Create New Member Account</span>
                  </button>
                </SignUpButton>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={async () => {
                    await loginWithGoogle();
                    closeAuthModal();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Instant Creator Access</span>
                </button>

                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1">
                  <div className="text-neutral-800 dark:text-neutral-200 font-semibold flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    <span>Clerk App ID: {CLERK_APP_ID.slice(0, 14)}...</span>
                  </div>
                  <p>
                    Set <code className="text-amber-600 dark:text-amber-400 font-mono">VITE_CLERK_PUBLISHABLE_KEY</code> in environment variables to link your live Clerk production instance.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
