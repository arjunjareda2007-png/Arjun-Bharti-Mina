import React from 'react';
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignUpButton, 
  UserButton 
} from '@clerk/clerk-react';
import { isClerkKeyConfigured, CLERK_APP_ID } from '../clerkConfig';
import { useStore } from '../context/StoreContext';
import { LogIn, UserPlus, Shield, ShieldCheck, KeyRound, Sparkles, User } from 'lucide-react';
import { hapticLight, hapticMedium } from '../utils/haptics';

export const ClerkNavAuthControls: React.FC = () => {
  const isConfigured = isClerkKeyConfigured();
  const { authUser, isOwner, setCurrentTab, openAuthModal, logout } = useStore();

  if (!isConfigured) {
    if (authUser) {
      return (
        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              type="button"
              onClick={() => {
                hapticLight();
                setCurrentTab('admin');
              }}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-bold transition-all cursor-pointer"
              title="Open Creator Control Center"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Creator Admin</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              hapticLight();
              openAuthModal('login');
            }}
            className="flex items-center gap-1.5 h-8.5 px-2.5 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer"
            title={`Signed in as ${authUser.fullName || authUser.email}`}
          >
            {authUser.imageUrl ? (
              <img 
                src={authUser.imageUrl} 
                alt="Avatar" 
                className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-500/40"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] font-bold">
                {(authUser.firstName?.[0] || authUser.fullName?.[0] || 'U').toUpperCase()}
              </div>
            )}
            <span className="max-w-[80px] sm:max-w-[110px] truncate text-[11px]">
              {authUser.firstName || authUser.fullName?.split(' ')[0] || 'Account'}
            </span>
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            hapticLight();
            openAuthModal('login');
          }}
          className="h-8.5 px-3 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-amber-500/10 text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs hover:scale-103 active:scale-97 cursor-pointer"
          title="Sign In with Clerk / Account"
        >
          <LogIn className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => {
            hapticMedium();
            openAuthModal('register');
          }}
          className="hidden sm:flex h-8.5 px-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold items-center gap-1.5 transition-all shadow-sm hover:scale-103 active:scale-97 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Sign Up</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <div className="flex items-center gap-1.5">
          <SignInButton mode="modal">
            <button
              type="button"
              onClick={() => hapticLight()}
              className="h-8.5 px-3 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs hover:scale-103 active:scale-97 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-500" />
              <span>Sign In</span>
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button
              type="button"
              onClick={() => hapticMedium()}
              className="hidden sm:flex h-8.5 px-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold items-center gap-1.5 transition-all shadow-sm hover:scale-103 active:scale-97 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              type="button"
              onClick={() => {
                hapticLight();
                setCurrentTab('admin');
              }}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-bold transition-all cursor-pointer"
              title="Open Creator Control Center"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Creator Admin</span>
            </button>
          )}
          <UserButton 
            afterSignOutUrl="/"
            userProfileMode="modal"
            appearance={{
              elements: {
                userButtonAvatarBox: 'w-8 h-8 rounded-full ring-2 ring-amber-500/30 border border-neutral-700',
              }
            }}
          />
        </div>
      </SignedIn>
    </div>
  );
};

export const ClerkDrawerAuthCard: React.FC = () => {
  const isConfigured = isClerkKeyConfigured();
  const { authUser, isOwner, setCurrentTab, closeMenu, openAuthModal, logout } = useStore();

  if (!isConfigured) {
    if (authUser) {
      return (
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm">
                {(authUser.firstName?.[0] || authUser.fullName?.[0] || 'U').toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {authUser.fullName || authUser.email}
                </div>
                <div className="text-[10px] text-neutral-400 truncate flex items-center gap-1">
                  {isOwner ? (
                    <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Creator Owner
                    </span>
                  ) : (
                    <span>Verified Member</span>
                  )}
                </div>
              </div>
            </div>
            {isOwner && (
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  setCurrentTab('admin');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold shrink-0 cursor-pointer"
              >
                Dashboard
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openAuthModal('login');
              }}
              className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-semibold"
            >
              Account Details
            </button>
            <button
              type="button"
              onClick={async () => {
                await logout();
              }}
              className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-red-500/20 hover:text-red-400 text-neutral-300 text-xs font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Member & Creator Access</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-400">
            Clerk Auth
          </span>
        </div>
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Sign in or create your account to unlock creator features, discography management, and member tools.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              closeMenu();
              openAuthModal('login');
            }}
            className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-amber-400" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              openAuthModal('register');
            }}
            className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
      <SignedOut>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Member Access
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Powered by Clerk</span>
          </div>
          <p className="text-[11px] text-neutral-400">
            Sign in to unlock creator tools, manage your content discography, and personalize settings.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <SignInButton mode="modal">
              <button
                type="button"
                onClick={() => {
                  hapticLight();
                  closeMenu();
                }}
                className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign In</span>
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button
                type="button"
                onClick={() => {
                  hapticMedium();
                  closeMenu();
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <UserButton afterSignOutUrl="/" userProfileMode="modal" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {authUser?.fullName || authUser?.email || 'Authenticated User'}
              </div>
              <div className="text-[10px] text-neutral-400 truncate flex items-center gap-1">
                {isOwner ? (
                  <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Creator Owner
                  </span>
                ) : (
                  <span>Verified Member</span>
                )}
              </div>
            </div>
          </div>
          {isOwner && (
            <button
              type="button"
              onClick={() => {
                closeMenu();
                setCurrentTab('admin');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold shrink-0 cursor-pointer"
            >
              Dashboard
            </button>
          )}
        </div>
      </SignedIn>
    </div>
  );
};
