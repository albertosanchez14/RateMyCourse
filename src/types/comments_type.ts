export type RatingType = {
  overall: number;
  [key: string]: number; // Allows for additional rating properties
};

export type CourseReviewsType = {
  _id: number;
  user_id: string;
  course_id: number;
  rating: RatingType;
  title: string;
  review: string;
  date: string;
  professor: string;
};

export type CommentProfessorType = {
  id: number;
  professor: {
    id: string;
    name: string;
  }
  title: string;
  date: string;
  description: string;
  rating: RatingType;
  by: string;
};

export type Professor = {
  id: string;
  name: string;
  department: string;
  rating: RatingType;
};