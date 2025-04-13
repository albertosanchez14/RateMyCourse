export interface AuthType {
  isAuthenticated: boolean;
  user: {
    username: string;
    emailAddresses: { emailAddress: string }[];
    userId: string;
    imageUrl: string;
    displayName: string;
  } | null;
  id?: string;
  avatar_url?: string;
  isLoading: boolean;
  getToken: () => Promise<string | undefined>;
  signOut: () => Promise<void>;
}