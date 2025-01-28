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
    lead_teacher: string;
    aggregated_group_lead_teacher: string;
  }>;
  objectives: string;
  skills_and_learning_outcomes: string;
  description_of_contents: string; 

  schedule: Array<EventType>;
};

type DegreeType = {
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

// Date has year, month, day, hour, minute
const dateRegex = /\d{4}  \d{2} \d{2} \d{2}:\d{2}$/;