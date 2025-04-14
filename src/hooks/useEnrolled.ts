import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "./useAuth";
import supabase from "../utils/supabaseClient";

import { EnrolledCourse } from "../types/course";

export const useEnrolled = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch enrolled courses for the current user
  const {
    data: enrolledCourses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["enrolledCourses", user?.userId],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("profile_enrolled_courses")
        .select("*")
        .eq("profile_id", user.userId);

      if (error) throw error;
      return data as EnrolledCourse[];
    },
    enabled: !!user,
  });

  // Check if a user is enrolled in a specific course
  const isEnrolled = (courseId: string): boolean => {
    if (!enrolledCourses) return false;
    return enrolledCourses.some((course) => course.course_id === courseId);
  };

  // Enroll in a course
  const enrollInCourse = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("profile_enrolled_courses").insert({
        profile_id: user.userId,
        course_id: courseId,
      });

      if (error) throw error;
      return courseId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["enrolledCourses", user?.userId],
      });
    },
  });

  // Unenroll from a course
  const unenrollFromCourse = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profile_enrolled_courses")
        .delete()
        .match({
          profile_id: user.userId,
          course_id: courseId,
        });

      if (error) throw error;
      return courseId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["enrolledCourses", user?.userId],
      });
    },
  });

  return {
    enrolledCourses,
    isLoading,
    error,
    isEnrolled,
    enrollInCourse: enrollInCourse.mutate,
    unenrollFromCourse: unenrollFromCourse.mutate,
    enrollInCourseStatus: enrollInCourse.status,
    unenrollFromCourseStatus: unenrollFromCourse.status,
  };
};
