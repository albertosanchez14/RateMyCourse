import { useQuery } from "@tanstack/react-query";
import { CommentCourseType } from "../types/comments_type";
import commentsData from "../data/comments.json"; // Adjust the path as necessary

const fetchComents = async (course_id: number): Promise<Array<CommentCourseType>> => {
  // Mock data
  const response = commentsData as Array<CommentCourseType>;
  const filteredResponse = response.filter((comment) => comment.course_id === course_id);

  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 1));
  return filteredResponse;
};

export const useComments = (course_id: number) => {
  return useQuery<Array<CommentCourseType>, Error>({
    queryKey: ["comments", course_id],
    queryFn: () => fetchComents(course_id),
  });
};
