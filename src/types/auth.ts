export type AuthType = {
  isAuthenticated: boolean;
  user: {
    username: string;
    userId: string;
    imageUrl: string;
  } | null;
  isLoading: boolean;
  getToken: () => Promise<string>;
};