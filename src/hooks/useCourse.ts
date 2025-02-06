import { useQuery } from "@tanstack/react-query";
import { CourseType, EventType } from "../types/course_type";
import courseData from "../data/courses.json"; // Adjust the path as necessary

const fetchCourse = async (course_code: number): Promise<CourseType> => {
  // Mock data
  const response = courseData as CourseType[];

  // Transform start_time and end_time to Date objects
  // const a = response.schedule.map((event: EventType) => ({
  //   ...event,
  //   start_time: new Date(event.start_time),
  //   end_time: new Date(event.end_time),
  // }));
  // console.log(a);

  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 1));
  const course = response.find((course) => course.code === course_code);
  if (!course) {
    throw new Error(`Course with code ${course_code} not found`);
  }
  return course;
};

export const useCourse = (course_code: number) => {
  return useQuery<CourseType, Error>({
    queryKey: ["course"],
    queryFn: () => fetchCourse(course_code),
  });
};
