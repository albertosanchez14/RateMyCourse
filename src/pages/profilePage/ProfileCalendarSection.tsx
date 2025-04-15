import { useState, useMemo } from "react";
import { MdDelete } from "react-icons/md";

import { useUser } from "../../hooks/useUser";
import { useEnrolled } from "../../hooks/useEnrolled";
import { useCourseData } from "../../hooks/useCourse";

import LoadingSpinnerScreen from "../../components/loading/LoadingSpinnerScreen";
import Calendar from "../../components/calendar/Calendar";
import PickScheduleModal from "./PickScheduleModal";

import { FREventType } from "../../types/course";

export default function ProfileCalendarSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enrolledCourses, isLoading, error, unenrollFromCourse } =
    useEnrolled();
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
      if (courseDetails && enrolledCourses) {
        // Find the faculty and group for this course
        const enrollment = enrolledCourses.find(
          (e) => e.course_id === course.id
        );
        if (enrollment) {
          // Get events from the specific faculty and group
          const facultySchedule = courseDetails.schedule.find(
            (schedFaculty: { faculty: string }) =>
              schedFaculty.faculty === enrollment.faculty
          );

          if (facultySchedule) {
            const courseEvents = facultySchedule.schedule.filter(
              (event: { groups: number[] }) =>
                event.groups.includes(enrollment.group_number)
            );
            allEvents = [...allEvents, ...courseEvents];
          }
        }
      }
    });
    return allEvents;
  }, [courseData, enrolledCoursesFormatted, enrolledCourses]);

  if (isLoading) return <LoadingSpinnerScreen />;
  if (error) return <p>Error loading calendar: {error.message}</p>;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUnenroll = (courseId: string) => {
    if (window.confirm("Are you sure you want to unenroll from this course?")) {
      unenrollFromCourse(courseId);
    }
  };

  return (
    <>
      {enrolledCourses && enrolledCourses.length > 0 ? (
        <div
          className="flex flex-col items-center justify-center h-full 
        bg-white rounded-xl shadow-sm p-8 mb-8"
        >
          <div className="w-full flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4">Your Schedule</h3>
            <div className="w-full flex flex-col md:flex-row gap-4">
              {/* Enrolled Courses List */}
              <div className="w-full md:w-1/4 md:mt-15">
                <ul className="space-y-3">
                  {enrolledCourses.map((course) => {
                    const courseInfo = courseData[course.course_id];
                    return (
                      <li
                        key={course.course_id}
                        className="bg-white p-3 rounded-md shadow-sm"
                      >
                        <div className="flex flex-col justify-between items-start">
                          <div>
                            <h5 className="font-medium">
                              {courseInfo?.code} -{" "}
                              {courseInfo?.title || course.course_id}
                            </h5>

                            <p className="text-sm text-gray-600">
                              {course.faculty}
                            </p>
                            <div className="flex flex-row">
                              {course.group_number && (
                                <p className="text-sm text-gray-600">
                                  Group: {course.group_number}
                                </p>
                              )}
                              <button
                                onClick={() => handleUnenroll(course.course_id)}
                                className="flex text-red-500 hover:text-red-700 text-sm ml-auto"
                              >
                                <MdDelete size={20}/>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <button
                  className="w-full mt-3 bg-blue-500 text-white py-2 px-4 rounded-md 
                    hover:bg-blue-600 transition-colors text-sm"
                  onClick={handleOpenModal}
                >
                  Edit Schedule
                </button>
              </div>

              {/* Calendar */}
              <div className="w-full md:w-3/4">
                <Calendar events={calendarEvents} showTitle={true} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-8 mb-8">
            <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-8 rounded-full 
                hover:from-blue-600 hover:to-blue-800 shadow-lg transform 
                transition-transform hover:scale-105 flex flex-col items-center gap-2"
            onClick={handleOpenModal}
            >
            <span className="text-lg font-bold">
              {user?.first_name}, you have no enrolled courses.
            </span>
            <span className="text-sm font-medium">
              Click here to pick a schedule.
            </span>
            </button>
        </div>
      )}
      {/* Render the modal only once, outside of the conditional rendering */}
      {isModalOpen && (
        <PickScheduleModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </>
  );
}
