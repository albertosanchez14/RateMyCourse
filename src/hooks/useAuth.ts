import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";

import { AuthType } from "../types/auth";

export function useAuth() {
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth();
  const { user } = useUser();

  return {
    isAuthenticated: isLoaded && isSignedIn,
    user: user
      ? {
          username: user.username,
          emailAddresses: user.emailAddresses,
          userId: user.id,
          imageUrl: user.imageUrl,
        }
      : null,
    isLoading: !isLoaded,
    getToken: getToken,
    signOut: signOut,
  } as AuthType;
}
