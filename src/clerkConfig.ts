import { dark } from '@clerk/themes';

// Clerk configuration for Arjun Bharti Mina (ABM) Hub
// Linked Application ID: app_3IPHBCS80jcNmhUX13m2aAgm5uW
export const CLERK_APP_ID = 'app_3IPHBCS80jcNmhUX13m2aAgm5uW';
export const DEFAULT_CLERK_PUBLISHABLE_KEY = 'pk_test_cHJvZm91bmQtc3F1aXJyZWwtMTc0LmNsZXJrLmFjY291bnRzLmRldiQ';
const LOCAL_STORAGE_KEY = 'abm_clerk_publishable_key';

export const getClerkPublishableKey = (): string => {
  const envKey = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored && typeof stored === 'string' && stored.trim().length > 0) {
      return stored.trim();
    }
  } catch {
    // ignore
  }
  return DEFAULT_CLERK_PUBLISHABLE_KEY;
};

export const setClerkPublishableKey = (key: string): void => {
  try {
    if (!key || !key.trim()) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
    }
    // Dispatch custom event to notify listeners (e.g., ClerkProviderWrapper)
    window.dispatchEvent(new CustomEvent('abm_clerk_key_updated', { detail: key ? key.trim() : '' }));
  } catch (e) {
    console.error('Failed to store Clerk key:', e);
  }
};

export const isClerkKeyConfigured = (): boolean => {
  const key = getClerkPublishableKey();
  return Boolean(
    key && 
    typeof key === 'string' && 
    key.trim().length > 0 &&
    (key.startsWith('pk_test_') || key.startsWith('pk_live_') || key.startsWith('pk_'))
  );
};

export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: '#f59e0b', // Amber-500
    colorText: '#ffffff',
    colorBackground: '#0a0a0a', // Neutral-950
    colorInputBackground: '#171717', // Neutral-900
    colorInputText: '#ffffff',
    borderRadius: '0.75rem',
  },
  elements: {
    card: 'bg-neutral-950 border border-neutral-800 shadow-2xl rounded-2xl',
    headerTitle: 'text-white font-black font-display',
    headerSubtitle: 'text-neutral-400 text-xs',
    socialButtonsBlockButton: 'bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-white transition-all',
    formButtonPrimary: 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-all shadow-md',
    footerActionLink: 'text-amber-400 hover:text-amber-300 font-semibold',
    userButtonAvatarBox: 'w-8 h-8 rounded-full border border-neutral-700 ring-2 ring-amber-500/20',
  }
};
