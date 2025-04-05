import { useAuth as useClerkAuth, useUser, useSignUp } from "@clerk/clerk-react";

import { AuthType } from "../types/auth";

export function useAuth() {
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth();
  // const { signUp } = useSignUp();
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
    // signUp: signUp,
  } as AuthType;
}
