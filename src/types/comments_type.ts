export type CommentCourseType = {
  id: number;
  course_id: number;
  title: string;
  date: string;
  description: string;
  rating: RatingType;
  by: string;
};

export type RatingType = {
  easy: number;
  useful: number;
  workload: number;
  overall: number; // Overall rating
};
