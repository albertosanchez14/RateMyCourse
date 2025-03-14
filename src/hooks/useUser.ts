import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

import { User } from "../types/profile";

const fetchUser = async (token: string | null): Promise<User> => {
  const response = await fetch("http://localhost:8000/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  const data = (await response.json()) as User;
  return data;
};

export const useUser = () => {
  const { getToken } = useAuth();

  return useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const token = await getToken();
      return fetchUser(token);
    },
  });
};

export const addUser = async (user: User, token: string | null): Promise<User> => {
  const response = await fetch("http://localhost:8000/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error("Failed to add user");
  }
  const data = (await response.json()) as User;
  return data;
};
