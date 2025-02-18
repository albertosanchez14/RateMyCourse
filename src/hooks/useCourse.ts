import { useQuery } from "@tanstack/react-query";
import {
  DBCourseType,
  DBEventType,
  FRCourseType,
  FREventType,
} from "../types/course_type";

const fetchCourse = async (course_code: number): Promise<FRCourseType> => {
  console.log("Fetching course data for course code", course_code);
  // Fetch course data from the server
  const response = await fetch(`http://localhost:8000/course/${course_code}`);
  if (!response.ok) {
    throw new Error(`Course with code ${course_code} not found`);
  }

  const course: DBCourseType = await response.json();
  console.log("Course data fetched successfully", course);
  // Transform the course data to frontend format
  const transformedCourse = transformCourse(course);
  return transformedCourse;
};

export const useCourse = (course_code: number) => {
  return useQuery<FRCourseType, Error>({
    queryKey: ["course"],
    queryFn: () => fetchCourse(course_code),
  });
};

/**
 * Transforms a course object by mapping its schedule to a new format.
 *
 * @param {DBCourseType} course - The course object to transform.
 * @returns {FRCourseType} The transformed course object with the schedule mapped to a new format.
 */
const transformCourse = (course: DBCourseType): FRCourseType => {
  if (!course.schedule) return { ...course, schedule: undefined };
  const transformedSchedule = course.schedule.map((schFaculty) => {
    return {
      faculty: schFaculty.faculty,
      schedule: transformSchedule(schFaculty.schedule),
    };
  });
  const transformedCourse = { ...course, schedule: transformedSchedule };
  return transformedCourse;
};

/**
 * Transforms a schedule of events from the database format to the frontend format.
 *
 * @param schedule - An array of events from the database.
 * @returns An array of transformed events suitable for the frontend.
 */
const transformSchedule = (schedule: DBEventType[]): FREventType[] => {
  const newEvents = schedule
    .map((event) => {
      const { sessions, ...rest } = event;
      return sessions.map((session) => {
        return session.date.map((date, index) => ({
          ...rest,
          week: session.weeks[index],
          date: date,
          classroom: session.classroom,
        }));
      });
    })
    .flat(2);
  return newEvents;
};
