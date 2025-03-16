import { DegreeType } from "./course";
import { RatingType } from "./reviews";

export type User = {
  userId: string;
  name: string;
  email: string;
  joinDate: string;
  university: string;
  degree: string;
  yearOfStudy: number;
  reviewsCount: number;
  likedCourses: Array<{
    id: string;
    title: string;
    code: number;
    rating: RatingType;
    degree: DegreeType;
  }>;
};
