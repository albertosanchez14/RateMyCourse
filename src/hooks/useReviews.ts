import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";

import supabase from "../utils/supabaseClient";

import {
  CourseReviewsType,
  FormCourseReviewType,
  UserCourseReviewType,
  CommentProfessorType,
  Professor,
} from "../types/reviews";

import commentsProfessorData from "../data/comments_professor.json"; // Adjust the path as necessary
import professorData from "../data/professors.json"; // Adjust the path as necessary
import { fetchCourse } from "./useCourse";

const fetchCourseReviews = async (
  courseId: string
): Promise<Array<CourseReviewsType>> => {
  if (!courseId) {
    throw new Error("Course ID is required");
  }

  const { data, error } = await supabase
    .from("course_reviews")
    .select("*")
    .eq("course_id", courseId);
  console.log("data", data);

  if (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }

  // Map the raw data to match the CourseReviewsType structure
  return data.map((review) => ({
    id: review.id.toString(),
    userId: review.user_id,
    full_name: review.full_name,
    course_id: review.course_id,
    rating: review.rating,
    title: review.title,
    review: review.review,
    date: new Date(review.date).toISOString(),
    professor: review.professor,
  }));
};

export const useCourseReviews = (courseId: string) => {
  return useQuery<Array<CourseReviewsType>, Error>({
    queryKey: ["comments", courseId],
    queryFn: () => fetchCourseReviews(courseId),
    enabled: !!courseId,
  });
};

// ****************************************************************************

export const addCourseReview = async (
  courseId: string,
  review: FormCourseReviewType
): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to submit a review");
  }

  // First check if the user has already reviewed this course
  const { data: existingReview, error: checkError } = await supabase
    .from("course_reviews")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    throw new Error("Failed to check existing reviews");
  }

  if (existingReview) {
    throw new Error("You have already submitted a review for this course");
  }

  // Get user profile to access full name
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    throw new Error(`Failed to fetch user profile: ${profileError.message}`);
  }

  // Insert the review
  const { error: insertError } = await supabase.from("course_reviews").insert({
    course_id: courseId,
    user_id: user.id,
    full_name: profile.full_name,
    rating: {
      overall: review.rating.overall,
      easy: review.rating.easy,
      useful: review.rating.useful,
      workload: review.rating.workload,
    },
    title: review.title,
    review: review.review,
    date: new Date().toISOString(),
    professor: review.professor,
  });

  if (insertError) {
    throw new Error(`Failed to add review: ${insertError.message}`);
  }

  // Update the reviews_count in the user's profile
  const { error: updateError } = await supabase.rpc("increment_reviews_count", {
    user_id: user.id,
  });

  if (updateError) {
    console.error("Failed to update review count:", updateError);
    // Don't throw an error here, as the review was added successfully
  }
};

export const editCourseReview = async (
  reviewId: string,
  review: FormCourseReviewType
): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to edit a review");
  }

  // Check if the review exists and belongs to the user
  const { error: checkError } = await supabase
    .from("course_reviews")
    .select("id")
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .single();
  if (checkError) {
    throw new Error("Review not found or you don't have permission to edit it");
  }

  // Update the review
  const { error: updateError } = await supabase
    .from("course_reviews")
    .update({
      rating: {
        overall: review.rating.overall,
        easy: review.rating.easy,
        useful: review.rating.useful,
        workload: review.rating.workload,
      },
      title: review.title,
      review: review.review,
      date: new Date().toISOString(), // Optionally update the date to reflect the edit time
      professor: review.professor,
    })
    .eq("id", reviewId)
    .eq("user_id", user.id); // Ensure only the owner can edit

  if (updateError) {
    throw new Error(`Failed to update review: ${updateError.message}`);
  }
};

// ****************************************************************************

const fetchUserCourseReviews = async (
  userId: string | undefined
): Promise<Array<UserCourseReviewType>> => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabase
    .from("course_reviews")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }

  // Fetch the course data from the API
  // TODO: Migrate to supabase
  const courses = await Promise.all(
    data.map(async (course) => {
      const courseData = await fetchCourse(course.course_id.toString());
      return courseData;
    })
  );

  // Map the raw data to match the UserCourseReviewType structure
  const mappedData = data.map((review) => {
    const course = courses.find((c) => c._id === review.course_id);
    return {
      ...review,
      course_id: {
        id: review.course_id.toString(),
        code: course?.code,
        title: course?.title,
        degree: {
          title: course?.degree.title,
        },
      },
    };
  });

  return mappedData as Array<UserCourseReviewType>;
};

export const useUserCourseReviews = () => {
  const { id } = useAuth();

  return useQuery<Array<UserCourseReviewType>, Error>({
    queryKey: ["userReviews"],
    queryFn: () => fetchUserCourseReviews(id),
    enabled: !!id,
  });
};

// ****************************************************************************

const fetchProffesorComents = async (
  professor_id: string
): Promise<Array<CommentProfessorType>> => {
  // Mock data
  const response = commentsProfessorData as Array<CommentProfessorType>;
  const filteredResponse = response.filter(
    (comment) => comment.professor.id === professor_id
  );

  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 1));
  return filteredResponse;
};

export const useProfessorComments = (professor_id: string) => {
  return useQuery<Array<CommentProfessorType>, Error>({
    queryKey: ["comments", professor_id],
    queryFn: () => fetchProffesorComents(professor_id),
  });
};

// ****************************************************************************

const fetchProffesorsComents = async (
  professors_id: Array<string>
): Promise<Map<Professor, Array<CommentProfessorType>>> => {
  // Mock data
  const commentsProfessor =
    commentsProfessorData as Array<CommentProfessorType>;
  const filteredResponse = commentsProfessor.filter((comment) =>
    professors_id.includes(comment.professor.id)
  );
  const professors = professorData as Array<Professor>;
  const commentsByProfessor = new Map() as Map<
    Professor,
    Array<CommentProfessorType>
  >;
  professors.forEach((professor) => {
    const comments = filteredResponse.filter(
      (comment) => comment.professor.id === professor.id
    );
    commentsByProfessor.set(professor, comments);
  });

  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 1));
  return commentsByProfessor;
};

export const useProfessorsComments = (professors_id: Array<string>) => {
  return useQuery<Map<Professor, Array<CommentProfessorType>>, Error>({
    queryKey: ["comments", professors_id],
    queryFn: () => fetchProffesorsComents(professors_id),
  });
};
