import { useQuery } from "@tanstack/react-query";
import {
  CommentCourseType,
  CommentProfessorType,
} from "../types/comments_type";

import commentsCourseData from "../data/comments_course.json"; // Adjust the path as necessary
import commentsProfessorData from "../data/comments_professor.json"; // Adjust the path as necessary

const fetchCourseComents = async (
  course_id: number
): Promise<Array<CommentCourseType>> => {
  // Mock data
  const response = commentsCourseData as Array<CommentCourseType>;
  const filteredResponse = response.filter(
    (comment) => comment.course_id === course_id
  );

  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 1));
  return filteredResponse;
};

export const useCourseComments = (course_id: number) => {
  return useQuery<Array<CommentCourseType>, Error>({
    queryKey: ["comments", course_id],
    queryFn: () => fetchCourseComents(course_id),
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
): Promise<Array<CommentProfessorType>> => {
  // Mock data
  const response = commentsProfessorData as Array<CommentProfessorType>;
  const filteredResponse = response.filter((comment) =>
    professors_id.includes(comment.professor.id)
  );

  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 1));
  return filteredResponse;
};

export const useProfessorsComments = (professors_id: Array<string>) => {
  return useQuery<Array<CommentProfessorType>, Error>({
    queryKey: ["comments", professors_id],
    queryFn: () => fetchProffesorsComents(professors_id),
  });
};
