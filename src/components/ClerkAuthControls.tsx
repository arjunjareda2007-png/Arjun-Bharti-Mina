import React, { useState, useRef, useEffect } from 'react';
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignUpButton, 
  useUser,
  useClerk
} from '@clerk/clerk-react';
import { isClerkKeyConfigured } from '../clerkConfig';
import { useStore } from '../context/StoreContext';
import { LogIn, UserPlus, ShieldCheck, User, LogOut, Settings } from 'lucide-react';
import { hapticLight, hapticMedium } from '../utils/haptics';

// Resilient Custom User Avatar & Menu (Bypasses Clerk headless UI mount errors)
export const CustomUserMenu: React.FC = () => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { isOwner, setCurrentTab, logout } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    hapticLight();
    try {
      if (signOut) {
        await signOut();
      }
      await logout();
    } catch {
      await logout();
    }
  };

  const displayName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || 'Account';
  const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || '';
  const avatarUrl = user?.imageUrl;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => {
          hapticLight();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-amber-500/40 transition-all cursor-pointer"
        title={`Logged in as ${displayName}`}
      >
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover border border-neutral-300 dark:border-neutral-700 ring-1 ring-amber-500/40"
            referrerPolicy="no-referrer" 
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
            {(user?.firstName?.[0] || displayName[0] || 'U').toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-2 z-50 text-neutral-800 dark:text-neutral-200 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
            <p className="text-xs font-bold truncate text-neutral-900 dark:text-white">{displayName}</p>
            {email && <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{email}</p>}
            {isOwner && (
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-mono text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3" /> Creator Admin
              </span>
            )}
          </div>

          <div className="py-1 space-y-0.5">
            {isOwner && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  hapticLight();
                  setCurrentTab('admin');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left font-medium cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Creator Admin Dashboard</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                hapticLight();
                if (openUserProfile) {
                  openUserProfile();
                }
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left cursor-pointer"
            >
              <Settings className="w-4 h-4 text-neutral-400" />
              <span>Manage Profile</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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
          <CustomUserMenu />
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
        <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 flex items-center justify-center font-bold text-xs">
                {(authUser.firstName?.[0] || authUser.fullName?.[0] || 'U').toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                  {authUser.fullName || authUser.email}
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate flex items-center gap-1">
                  {isOwner ? (
                    <span className="text-amber-500 font-medium flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Creator
                    </span>
                  ) : (
                    <span>Member</span>
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
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold shrink-0 cursor-pointer"
              >
                Admin
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openAuthModal('login');
              }}
              className="py-1.5 px-3 rounded-lg bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 text-xs font-medium border border-neutral-200 dark:border-neutral-700/60 text-center cursor-pointer"
            >
              Account
            </button>
            <button
              type="button"
              onClick={async () => {
                await logout();
              }}
              className="py-1.5 px-3 rounded-lg bg-white dark:bg-neutral-800 hover:bg-red-500/10 hover:text-red-500 text-neutral-700 dark:text-neutral-300 text-xs font-medium border border-neutral-200 dark:border-neutral-700/60 text-center cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              closeMenu();
              openAuthModal('login');
            }}
            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-amber-500" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              openAuthModal('register');
            }}
            className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
      <SignedOut>
        <div className="grid grid-cols-2 gap-2">
          <SignInButton mode="modal">
            <button
              type="button"
              onClick={() => {
                hapticLight();
                closeMenu();
              }}
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-500" />
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
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <CustomUserMenu />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                {authUser?.fullName || authUser?.email || 'Account'}
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate flex items-center gap-1">
                {isOwner ? (
                  <span className="text-amber-500 font-medium flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Creator
                  </span>
                ) : (
                  <span>Member</span>
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
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold shrink-0 cursor-pointer"
            >
              Admin
            </button>
          )}
        </div>
      </SignedIn>
    </div>
  );
};
