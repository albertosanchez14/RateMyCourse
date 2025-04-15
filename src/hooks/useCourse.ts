import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  DBCourseType,
  DBEventType,
  FRCourseType,
  FREventType,
} from "../types/course";

export const fetchCourse = async (courseId: string): Promise<FRCourseType> => {
  // Fetch course data from the server
  const response = await fetch(`https://rate-my-course-node-cuexa.ondigitalocean.app/${courseId}`);
  if (!response.ok) {
    throw new Error(`Course with code ${courseId} not found`);
  }

  const course: DBCourseType = await response.json();

  // Transform the course data to frontend format
  const transformedCourse = transformCourse(course);
  return transformedCourse;
};

export const useCourse = (courseId: string) => {
  return useQuery<FRCourseType, Error>({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourse(courseId),
    enabled: !!courseId,
  });
};

// ************************************************************************************************

export const useCourseData = (
  selectedCourses: Array<{ id: string; title: string }>
) => {
  // Stable reference to selectedCourseIds
  const selectedCourseIds = selectedCourses.map((course) => course.id);
  const coursesQueries = useQuery({
    queryKey: ["courses", selectedCourseIds],
    queryFn: async () => {
      // If no courses selected, return empty object
      if (selectedCourseIds.length === 0) return {};

      // Create an object to store course data by ID
      const courseData: Record<string, FRCourseType> = {};

      // Fetch all courses in parallel
      await Promise.all(
        selectedCourses.map(async (course) => {
          try {
            const data = await fetchCourse(course.id);
            courseData[course.id] = data;
          } catch (error) {
            console.error(`Error fetching course ${course.id}:`, error);
          }
        })
      );

      return courseData;
    },
    placeholderData: keepPreviousData,
    enabled: selectedCourseIds.length > 0,
  });

  return {
    courseData: coursesQueries.data || {},
    isLoading: coursesQueries.isLoading,
    isError: coursesQueries.isError,
    error: coursesQueries.error,
  };
};

// ************************************************************************************************

/**
 * Transforms a course object by mapping its schedule to a new format.
 *
 * @param {DBCourseType} course - The course object to transform.
 * @returns {FRCourseType} The transformed course object with the schedule mapped to a new format.
 */
const transformCourse = (course: DBCourseType): FRCourseType => {
  if (!course.schedule) return { ...course, schedule: [] };
  const transformedSchedule = course.schedule.map((schFaculty) => {
    return {
      faculty: schFaculty.faculty,
      schedule: transformSchedule(schFaculty.schedule, course.title),
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
const transformSchedule = (schedule: DBEventType[], title: string): FREventType[] => {
  const newEvents = schedule
    .map((event) => {
      const { sessions, ...rest } = event;
      return sessions.map((session) => {
        return session.date.map((date, index) => ({
          ...rest,
          week: session.weeks[index],
          date: date,
          classroom: session.classroom,
          title: title,
        }));
      });
    })
    .flat(2);
  return newEvents;
};
