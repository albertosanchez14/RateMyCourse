export type CommentCourseType = {
  id: number;
  course_id: number;
  comment: string;
  rating: RatingType;
  by: string;
};

type RatingType = {
  easy: number;
  useful: number;
  rating: number; // Overall rating
};
