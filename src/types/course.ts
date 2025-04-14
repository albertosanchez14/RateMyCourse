import { RatingType } from "./reviews";

export type DBCourseType = {
  _id: string;
  title: string;
  code: number;
  degree: DegreeType;
  course: string;
  coordinating_teacher: string;
  department: string;
  type: "Basic Core" | "Compulsory" | "Electives" | "Bachelor Thesis";
  credits: number;
  course_year: number | undefined;
  semester: number | undefined;
  requirements: Array<string>;
  teacher: Array<DBTeacherType>;
  objectives: string | undefined;
  skills_and_learning_outcomes: string | undefined;
  description_of_contents: string | undefined;

  rating: RatingType | undefined;
  schedule: Array<{
    faculty: string;
    schedule: Array<DBEventType>;
  }>;
  website: string;
};

export type DBTeacherType = {
  faculty: string;
  teacher: Array<{
    group: number;
    lead_teacher: {
      id: string | undefined;
      name: string;
    };
    aggregated_group_lead_teacher:
      | { id: string | undefined; name: string }
      | undefined;
  }>;
};

export type FRCourseType = Omit<DBCourseType, "schedule"> & {
  schedule:
    | Array<{
        faculty: string;
        schedule: Array<FREventType>;
      }>;
};

export type DegreeType = {
  title: string;
  plan: number;
  estudio: number;
};

export type DBEventType = {
  type: "Magistral" | "Practice" | "Laboratory";
  groups: Array<number>;
  start_time: string;
  end_time: string;
  sessions: Array<{
    date: Array<string>;
    classroom: string;
    weeks: Array<number>;
  }>;
};

// Add type definition for transformed event
export type FREventType = {
  type: "Magistral" | "Practice" | "Laboratory";
  groups: number[];
  week: number;
  start_time: string;
  end_time: string;
  date: string;
  classroom: string;
};

export interface EnrolledCourse {
  profile_id: string;
  course_id: string;
  enrolled_at: string;
}
