import { EmailAddressResource } from "@clerk/types";

export type AuthType = {
  isAuthenticated: boolean;
  user: {
    username: string;
    emailAddresses: EmailAddressResource[];
    userId: string;
    imageUrl: string;
  } | null;
  isLoading: boolean;
  getToken: () => Promise<string>;
  signOut: () => Promise<void>;
};