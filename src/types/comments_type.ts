export type CommentCourseType = {
  id: number;
  course_id: number;
  comment: string;
  rating: RatingType;
  by: string;
};

export type RatingType = {
  easy: number;
  useful: number;
  overall: number; // Overall rating
};
