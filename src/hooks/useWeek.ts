import { useQuery } from "@tanstack/react-query";

import weekScheduleData from "../data/week_schedule.json";

const fetchWeekSchedule = async () => {
  // Mock data
  const response = weekScheduleData;
  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 1));
  return response;
};

export const useWeekSchedule = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: () => fetchWeekSchedule(),
  });
};
