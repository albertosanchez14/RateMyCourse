import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "./useAuth";

import supabase from "../utils/supabaseClient";

import { User } from "../types/profile";

// TODO: Change
import { fetchCourse } from "./useCourse";

const fetchUser = async (userId: string): Promise<User> => {
  // First fetch the user profile
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select(
      `
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
    `
    )
    .eq("user_id", userId)
    .single();
  if (userError) {
    throw new Error(`Error fetching user: ${userError.message}`);
  }
  if (!userData) {
    throw new Error("User not found");
  }

  // TODO: Uncomment this when the database is ready
  // Then fetch the liked courses for this user
  const { data: likedCoursesData, error: likedCoursesError } = await supabase
    .from('profile_liked_courses')
    .select(`course_id`)
    .eq('profile_id', userId);

  if (likedCoursesError) {
    throw new Error(`Error fetching liked courses: ${likedCoursesError.message}`);
  }
  // Fetch the course data from the API
  // TODO: Migrate to supabase
  const course = await Promise.all(
    likedCoursesData?.map(async (course) => {
      const courseData = await fetchCourse(course.course_id);
      return courseData;
    })
  );
  // Map the liked courses to the desired format
  const liked_courses = course?.map((course) => {
    return {
      id: course._id,
      title: course.title,
      code: course.code,
      rating: course.rating,
      degree: course.degree,
    };
  });

  // Return the user data with liked courses
  return {
    ...userData,
    liked_courses,
  } as User;
};

export const useUser = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user", user?.userId],
    queryFn: () => fetchUser(user?.userId || ""),
    enabled: !!user?.userId,
    staleTime: 5 * 60 * 1000,
  });
};

// ****************************************************************************
// Fixed functions that don't use hooks directly

// Helper functions that don't use React hooks
const likeCourseForUser = async (
  userId: string,
  courseId: string
): Promise<boolean> => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Insert the like relationship into profile_liked_courses table
  const { error } = await supabase.from("profile_liked_courses").insert({
    profile_id: userId,
    course_id: courseId,
  });

  if (error) {
    // If the error is because the relationship already exists (unique constraint violation)
    if (error.code === "23505") {
      return false; // Already liked
    }
    throw new Error(`Failed to like course: ${error.message}`);
  }

  return true; // Successfully liked
};

const unlikeCourseForUser = async (
  userId: string,
  courseId: string
): Promise<boolean> => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Delete the like relationship from profile_liked_courses table
  const { error } = await supabase
    .from("profile_liked_courses")
    .delete()
    .eq("profile_id", userId)
    .eq("course_id", courseId);

  if (error) {
    throw new Error(`Failed to unlike course: ${error.message}`);
  }

  return true; // Successfully unliked
};

const isCourseLikedByUser = async (
  userId: string,
  courseId: string
): Promise<boolean> => {
  if (!userId) {
    return false;
  }

  const { count, error } = await supabase
    .from("profile_liked_courses")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", userId)
    .eq("course_id", courseId);

  if (error) {
    throw new Error(`Error checking liked status: ${error.message}`);
  }

  return count ? count > 0 : false;
};

const getLikedCoursesForUser = async (userId: string) => {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("profile_liked_courses")
    .select(
      `
      course_id,
      liked_at,
      courses:course_id (
        id, 
        title, 
        code,
        rating:ratings(overall, easy, useful, workload),
        degree:degrees(title, plan, estudio)
      )
    `
    )
    .eq("profile_id", userId);

  if (error) {
    throw new Error(`Error fetching liked courses: ${error.message}`);
  }

  return data || [];
};

// ****************************************************************************
// Hook wrappers that use the useAuth() hook and call the functions above
export const useLikeCourse = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) =>
      likeCourseForUser(user?.userId || "", courseId),
    onMutate: async (courseId) => {
      // Cancel outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["courseLiked", user?.userId, courseId] });
      
      // Store previous value
      const previousValue = queryClient.getQueryData(["courseLiked", user?.userId, courseId]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(["courseLiked", user?.userId, courseId], true);
      
      return { previousValue };
    },
    onError: (err, courseId, context) => {
      // If the mutation fails, restore the previous value
      queryClient.setQueryData(
        ["courseLiked", user?.userId, courseId], 
        context?.previousValue
      );
    },
    onSuccess: (_, courseId) => {
      // Only invalidate the specific course liked status and liked courses list
      queryClient.invalidateQueries({ queryKey: ["courseLiked", user?.userId, courseId] });
      queryClient.invalidateQueries({ queryKey: ["likedCourses", user?.userId] });
    },
  });
};

export const useUnlikeCourse = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) =>
      unlikeCourseForUser(user?.userId || "", courseId),
    onMutate: async (courseId) => {
      // Cancel outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["courseLiked", user?.userId, courseId] });
      
      // Store previous value
      const previousValue = queryClient.getQueryData(["courseLiked", user?.userId, courseId]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(["courseLiked", user?.userId, courseId], false);
      
      return { previousValue };
    },
    onError: (err, courseId, context) => {
      // If the mutation fails, restore the previous value
      queryClient.setQueryData(
        ["courseLiked", user?.userId, courseId], 
        context?.previousValue
      );
    },
    onSuccess: (_, courseId) => {
      // Only invalidate the specific course liked status and liked courses list
      queryClient.invalidateQueries({ queryKey: ["courseLiked", user?.userId, courseId] });
      queryClient.invalidateQueries({ queryKey: ["likedCourses", user?.userId] });
    },
  });
};

export const useIsCourseLiked = (courseId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["courseLiked", user?.userId, courseId],
    queryFn: () => isCourseLikedByUser(user?.userId || "", courseId),
    enabled: !!user?.userId && !!courseId,
  });
};

export const useGetLikedCourses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["likedCourses", user?.userId],
    queryFn: () => getLikedCoursesForUser(user?.userId || ""),
    enabled: !!user?.userId,
  });
};
