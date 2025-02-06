export type RatingType = {
  overall: number;
  [key: string]: number; // Allows for additional rating properties
};

export type CommentCourseType = {
  id: number;
  course_id: number;
  title: string;
  date: string;
  description: string;
  rating: RatingType;
  by: string;
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