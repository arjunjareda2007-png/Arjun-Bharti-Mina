import { dark } from '@clerk/themes';

// Clerk configuration for Arjun Bharti Mina (ABM) Hub
// Linked Application ID: app_3IPHBCS80jcNmhUX13m2aAgm5uW

export const CLERK_APP_ID = 'app_3IPHBCS80jcNmhUX13m2aAgm5uW';

export const CLERK_PUBLISHABLE_KEY = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY || '';

export const isClerkKeyConfigured = (): boolean => {
  return Boolean(
    CLERK_PUBLISHABLE_KEY && 
    typeof CLERK_PUBLISHABLE_KEY === 'string' && 
    CLERK_PUBLISHABLE_KEY.trim().length > 0 &&
    CLERK_PUBLISHABLE_KEY.startsWith('pk_')
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
