import { useQuery } from "@tanstack/react-query";
import {
  CommentCourseType,
  CommentProfessorType,
  Professor,
} from "../types/comments_type";

import commentsCourseData from "../data/comments_course.json"; // Adjust the path as necessary
import commentsProfessorData from "../data/comments_professor.json"; // Adjust the path as necessary
import professorData from "../data/professors.json"; // Adjust the path as necessary

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
): Promise<Map<Professor, Array<CommentProfessorType>>> => {
  // Mock data
  const commentsProfessor = commentsProfessorData as Array<CommentProfessorType>;
  const filteredResponse = commentsProfessor.filter((comment) =>
    professors_id.includes(comment.professor.id)
  );
  const professors = professorData as Array<Professor>;
  const commentsByProfessor = new Map() as Map<Professor, Array<CommentProfessorType>>;
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
