import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import {
  CourseReviewsType,
  FormCourseReviewType,
  UserCourseReviewType,
  CommentProfessorType,
  Professor,
} from "../types/reviews";

import commentsProfessorData from "../data/comments_professor.json"; // Adjust the path as necessary
import professorData from "../data/professors.json"; // Adjust the path as necessary

const fetchCourseReviews = async (
  courseId: string
): Promise<Array<CourseReviewsType>> => {
  // Mock data
  const response = await fetch(
    `http://localhost:8000/course/${courseId}/reviews`
  );
  const data = (await response.json()) as Array<CourseReviewsType>;

  return data;
};

export const useCourseReviews = (courseId: string) => {
  return useQuery<Array<CourseReviewsType>, Error>({
    queryKey: ["comments", courseId],
    queryFn: () => fetchCourseReviews(courseId),
  });
};

export const addCourseReview = async (
  courseId: string,
  review: FormCourseReviewType,
  token: string | null
): Promise<void> => {
  const response = await fetch(
    `http://localhost:8000/course/${courseId}/reviews`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(review),
    }
  );
  if (response.status === 409) {
    throw new Error("You have already submitted a review for this course");
  }
  if (!response.ok) {
    throw new Error("Failed to add review");
  }
};

// ****************************************************************************

const fetchUserCourseReviews = async (
  token: string | null
): Promise<Array<UserCourseReviewType>> => {
  const response = await fetch("http://localhost:8000/user/reviews", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }
  const data = (await response.json()) as Array<UserCourseReviewType>;
  return data;
};

export const useUserCourseReviews = () => {
  const { getToken } = useAuth();

  return useQuery<Array<UserCourseReviewType>, Error>({
    queryKey: ["userReviews"],
    queryFn: async () => {
      const token = await getToken();
      return fetchUserCourseReviews(token);
    },
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
