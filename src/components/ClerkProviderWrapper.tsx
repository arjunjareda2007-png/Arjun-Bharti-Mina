import React, { useEffect } from 'react';
import { ClerkProvider, useUser, useClerk } from '@clerk/clerk-react';
import { CLERK_PUBLISHABLE_KEY, isClerkKeyConfigured, clerkAppearance } from '../clerkConfig';
import { useStore } from '../context/StoreContext';
import { AuthUser } from '../types';

interface ClerkProviderWrapperProps {
  children: React.ReactNode;
}

// Internal bridge that synchronizes Clerk user session into the store
const ClerkSyncBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();
  const { setClerkSession } = useStore();

  useEffect(() => {
    if (!isLoaded) {
      setClerkSession({
        user: null,
        isLoading: true,
        signOutFn: () => signOut(),
        openSignInFn: () => openSignIn(),
        openSignUpFn: () => openSignUp(),
      });
      return;
    }

    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || null;
      const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User';
      
      const mappedUser: AuthUser = {
        id: user.id,
        email: email,
        fullName: fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        username: user.username,
      };

      setClerkSession({
        user: mappedUser,
        isLoading: false,
        signOutFn: () => signOut(),
        openSignInFn: () => openSignIn(),
        openSignUpFn: () => openSignUp(),
      });
    } else {
      setClerkSession({
        user: null,
        isLoading: false,
        signOutFn: () => signOut(),
        openSignInFn: () => openSignIn(),
        openSignUpFn: () => openSignUp(),
      });
    }
  }, [isLoaded, isSignedIn, user, signOut, openSignIn, openSignUp, setClerkSession]);

  return <>{children}</>;
};

export const ClerkProviderWrapper: React.FC<ClerkProviderWrapperProps> = ({ children }) => {
  const isConfigured = isClerkKeyConfigured();

  if (!isConfigured) {
    // When Clerk key is not yet set in environment, render children with fallback store defaults
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} appearance={clerkAppearance}>
      <ClerkSyncBridge>
        {children}
      </ClerkSyncBridge>
    </ClerkProvider>
  );
};
