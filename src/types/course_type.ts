import { RatingCourseType, Professor } from "./comments_type";

export type CourseType = {
  title: string;
  code: number;
  degree: DegreeType;
  course: string;
  coordinating_teacher: string;
  department: string;
  type: "Basic Core" | "Compulsory" | "Optional";
  credits: number;
  course_year: number;
  semester: number;
  requirements: Array<string>;
  teacher: Array<{
    group: number;
    lead_teacher: Professor;
    aggregated_group_lead_teacher: Professor;
  }>;
  objectives: string;
  skills_and_learning_outcomes: string;
  description_of_contents: string; 

  rating: RatingCourseType;
  schedule: Array<EventType>;
};

export type DegreeType = {
  title: string;
  plan: number;
  estudio: number;
};

export type EventType = {
  title: CourseType["title"];
  type: "Magistral" | "Practice" | "Laboratory";
  groups: Array<number>;
  week: number; // 1-16
  start_time: Date;
  end_time: Date;
  classroom: string;
};
