import { DegreeType } from "./course";
import { RatingType } from "./reviews";

export type CourseYear = "1" | "2" | "3" | "4" | "5" | "Graduate";

export type User = {
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  university: string | null;
  course_year: CourseYear | null;
  degree: string | null;
  reviews_count: number;
  liked_courses: Array<{
    id: string;
    title: string;
    code: number;
    rating: RatingType;
    degree: DegreeType;
  }>;
  created_at: string;
};
