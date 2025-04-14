import { useState, useMemo } from "react";

import { useUser } from "../../hooks/useUser";
import { useEnrolled } from "../../hooks/useEnrolled";
import { useCourseData } from "../../hooks/useCourse";

import LoadingSpinnerScreen from "../../components/loading/LoadingSpinnerScreen";
import Calendar from "../../components/calendar/Calendar";
import PickScheduleModal from "./PickScheduleModal";

import { FREventType } from "../../types/course";

export default function ProfileCalendarSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enrolledCourses, isLoading, error } = useEnrolled();
  const { data: user } = useUser();
  // Transform enrolled courses into a format usable by useCourseData
  const enrolledCoursesFormatted = useMemo(
    () =>
      enrolledCourses?.map((course) => ({
        id: course.course_id,
        title: course.course_id, // We don't have the title here, but it's not used for fetching
      })) || [],
    [enrolledCourses]
  );
  // Fetch detailed data for all enrolled courses
  const { courseData } = useCourseData(enrolledCoursesFormatted);

  // Derive calendar events from courseData using useMemo to avoid unnecessary recalculations
  const calendarEvents = useMemo(() => {
    if (!Object.keys(courseData).length) return [];
    // Collect all events from enrolled courses
    let allEvents: FREventType[] = [];
    enrolledCoursesFormatted.forEach((course) => {
      const courseDetails = courseData[course.id];
      if (courseDetails) {
        // Get events from all faculties and schedules
        const courseEvents = courseDetails.schedule.flatMap(
          (schedFaculty: { schedule: FREventType[] }) => schedFaculty.schedule
        );
        allEvents = [...allEvents, ...courseEvents];
      }
    });
    return allEvents;
  }, [courseData, enrolledCoursesFormatted]);

  if (isLoading) return <LoadingSpinnerScreen />;
  if (error) return <p>Error loading calendar: {error.message}</p>;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {enrolledCourses && enrolledCourses.length > 0 ? (
        <div
          className="flex flex-col items-center justify-center h-full 
        bg-white rounded-xl shadow-sm p-8 mb-8"
        >
          <h3 className="text-xl font-bold ml-10 mb-2">Your Calendar</h3>
          <Calendar events={calendarEvents} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-8 mb-8">
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded-md 
                  hover:bg-blue-700 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:ring-offset-2 
                  transition-colors flex flex-col items-center gap-1"
            onClick={handleOpenModal}
          >
            <span className="text-lg font-semibold">
              {user?.first_name}, you have no enrolled courses.{" "}
            </span>
            <span className="text-sm font-medium">
              Click here to pick a schedule.
            </span>
          </button>
          {isModalOpen && (
            <PickScheduleModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          )}
        </div>
      )}
    </>
  );
}
