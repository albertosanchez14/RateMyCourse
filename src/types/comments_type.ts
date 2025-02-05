export type CommentCourseType = {
  id: number;
  course_id: number;
  title: string;
  date: string;
  description: string;
  rating: RatingCourseType;
  by: string;
  professor: string;
};

export type RatingCourseType = {
  easy: number;
  useful: number;
  workload: number;
  overall: number; // Overall rating
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
  rating: RatingProfessorType;
  by: string;
};

export type RatingProfessorType = {
  clarity: number;
  helpfulness: number;
  engaging: number;
  overall: number; // Overall rating
};

export type Professor = {
  id: string;
  name: string;
  department: string;
  rating: RatingProfessorType;
};