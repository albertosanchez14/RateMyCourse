import { useQuery } from "@tanstack/react-query";

import { useAuth } from "./useAuth";

import supabase from "../utils/supabaseClient";

import { User } from "../types/profile";

const fetchUser = async (userId: string): Promise<User> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      user_id,
      first_name,
      last_name,
      full_name,
      email,
      course_year,
      university,
      degree,
      created_at,
      reviews_count
    `)
    .eq('user_id', userId)
    .single();

  console.log(data, error);

  if (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }

  if (!data) {
    throw new Error('User not found');
  }

  return data as User;
};

export const useUser = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user', user?.userId],
    queryFn: () => fetchUser(user?.userId || ''),
    enabled: !!user?.userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const likeCouse = async (
  courseId: string,
  token: string | null
): Promise<User> => {
  const response = await fetch(`http://localhost:8000/user/likes/${courseId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to like course");
  }
  const data = (await response.json()) as User;
  return data;
};

export const unlikeCouse = async (
  courseId: string,
  token: string | null
): Promise<User> => {
  const response = await fetch(`http://localhost:8000/user/likes/${courseId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to unlike course");
  }
  const data = (await response.json()) as User;
  return data;
};
