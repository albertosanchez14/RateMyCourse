import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";

import { AuthType } from "../types/auth";

export function useAuth() {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user } = useUser();

  return {
    isAuthenticated: isLoaded && isSignedIn,
    user: user
      ? {
          username:
            user.username ||
            user.firstName ||
            user.primaryEmailAddress?.emailAddress ||
            "",
          userId: user.id,
          imageUrl: user.imageUrl,
        }
      : null,
    isLoading: !isLoaded,
    getToken: getToken,
  } as AuthType;
}
