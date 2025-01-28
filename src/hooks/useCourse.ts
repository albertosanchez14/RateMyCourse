import { useQuery } from "@tanstack/react-query";
import { CourseType, EventType } from "../types/course_type";
import courseData from "../data/courses.json"; // Adjust the path as necessary

const fetchCourse = async (): Promise<CourseType> => {
  // Mock data
  const response = courseData as CourseType;

  // Transform start_time and end_time to Date objects
  const a = response.schedule.map((event: EventType) => ({
    ...event,
    start_time: new Date(event.start_time),
    end_time: new Date(event.end_time),
  }));
  // console.log(a);


  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 1));
  return response;
};

export const useCourse = () => {
  return useQuery<CourseType, Error>({
    queryKey: ["course"],
    queryFn: () => fetchCourse(),
  });
};
