import { useState, useEffect, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { MdClose, MdOutlineWarningAmber } from "react-icons/md";

import { useEnrolled } from "../../hooks/useEnrolled";
import { useCourseData } from "../../hooks/useCourse";

import Calendar from "../../components/calendar/Calendar";
import CourseCard from "./CourseCard";

import { FREventType } from "../../types/course";
import CourseSearchBar from "../../components/common/CourseSearchBar";
import FacultySelector from "./FacultySelector";

interface PickScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PickScheduleModal({
  isOpen,
  onClose,
}: PickScheduleModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string>(
    "Escuela Politécnica Superior (Leganés)"
  );
  const [selectedCourses, setSelectedCourses] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [selectedGroups, setSelectedGroups] = useState<
    Record<string, number[]>
  >({});
  const [calendarEvents, setCalendarEvents] = useState<FREventType[]>([]);
  const [hasConflicts, setHasConflicts] = useState(false);
  const [conflictDate, setConflictDate] = useState<Date | null>(null);
  const { enrolledCourses, enrollInCourse, unenrollFromCourse } = useEnrolled();
  // For each selected course, fetch its details
  const { courseData } = useCourseData(selectedCourses);

  // Load existing enrolled courses when modal opens
  useEffect(() => {
    if (isOpen && enrolledCourses) {
      // Map enrolled courses to the format expected by the component
      const mappedCourses = enrolledCourses.map((course) => ({
        id: course.course_id,
        title: course.course_id,
      }));
      setSelectedCourses(mappedCourses);
      // Set selected faculty to the first enrolled course's faculty if available
      if (enrolledCourses.length > 0) {
        setSelectedFaculty(enrolledCourses[0].faculty);
      }
      // Set selected groups
      const groupsMap: Record<string, number[]> = {};
      enrolledCourses.forEach((course) => {
        groupsMap[course.course_id] = [course.group_number];
      });
      setSelectedGroups(groupsMap);
    }
  }, [isOpen, enrolledCourses]);
  // Disable body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalStyle;
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);
  // Update calendar events when selected courses or groups change
  useEffect(() => {
    // Only update events when we have course data and selections
    if (!Object.keys(courseData).length) return;
    // Filter events based on selected faculty and groups
    let allEvents: FREventType[] = [];
    selectedCourses.forEach((course) => {
      const courseDetails = courseData[course.id];
      if (courseDetails && selectedGroups[course.id]) {
        const filteredByFaculty = courseDetails.schedule.filter(
          (schedFaculty: { faculty: string }) =>
            schedFaculty.faculty === selectedFaculty
        );
        const courseEvents = filteredByFaculty.flatMap(
          (schedFaculty: { schedule: FREventType[] }) =>
            schedFaculty.schedule.filter((event: { groups: number[] }) =>
              event.groups.some((group: number) =>
                selectedGroups[course.id]?.includes(group)
              )
            )
        );
        allEvents = [...allEvents, ...courseEvents];
      }
    });
    setCalendarEvents(allEvents);

    // Check for time conflicts
    checkForTimeConflicts(allEvents);
  }, [selectedCourses, selectedGroups, selectedFaculty, courseData]);

  const checkForTimeConflicts = (events: FREventType[]) => {
    let conflicts = false;
    let firstConflictDate: SetStateAction<Date | null> = null;

    // Create a hash map to detect conflicts
    const timeSlots: Record<string, FREventType[]> = {};

    events.forEach((event) => {
      // Create a key based on date and time
      const dateObj = new Date(event.date);
      const key = `${dateObj.toISOString().split("T")[0]}_${event.start_time}`;

      if (!timeSlots[key]) {
        timeSlots[key] = [];
      }

      // If there's already an event with a different title, we have a conflict
      if (
        timeSlots[key].length > 0 &&
        timeSlots[key].some((existing) => existing.title !== event.title)
      ) {
        conflicts = true;
        if (!firstConflictDate) {
          firstConflictDate = dateObj;
        }
      }

      timeSlots[key].push(event);
    });

    setHasConflicts(conflicts);
    setConflictDate(firstConflictDate);
  };

  const handleCourseSelect = (courseId: string, courseTitle: string) => {
    // Check if course is already selected
    if (!selectedCourses.some((course) => course.id === courseId)) {
      setSelectedCourses([
        ...selectedCourses,
        { id: courseId, title: courseTitle },
      ]);
    }
  };

  const handleCourseRemove = (courseId: string) => {
    setSelectedCourses(
      selectedCourses.filter((course) => course.id !== courseId)
    );
    // Also remove any group selections for this course
    const newSelectedGroups = { ...selectedGroups };
    delete newSelectedGroups[courseId];
    setSelectedGroups(newSelectedGroups);
  };

  const handleGroupToggle = (
    courseId: string,
    group: number,
    isChecked: boolean
  ) => {
    setSelectedGroups((prev) => {
      const currentGroups = prev[courseId] || [];

      if (isChecked) {
        return { ...prev, [courseId]: [...currentGroups, group] };
      } else {
        return {
          ...prev,
          [courseId]: currentGroups.filter((g) => g !== group),
        };
      }
    });
  };

  const handleSaveSchedule = async () => {
    // Check if any course has multiple groups selected
    const hasMultipleGroupsSelected = selectedCourses.some((course) => {
      const groups = selectedGroups[course.id] || [];
      return groups.length > 1;
    });
    if (hasMultipleGroupsSelected) {
      setErrorMessage("Please select only one group for each course.");
      return;
    }
    // Clear any previous errors
    setErrorMessage(null);

    // Get list of currently enrolled courses
    const currentlyEnrolled =
      enrolledCourses?.map((course) => course.course_id) || [];
    // Find courses to unenroll (courses that were enrolled but are not in selectedCourses)
    const coursesToUnenroll = currentlyEnrolled.filter(
      (courseId) => !selectedCourses.some((course) => course.id === courseId)
    );

    // Unenroll from courses not in the selection
    for (const courseId of coursesToUnenroll) {
      unenrollFromCourse(courseId);
    }
    // Enroll/update each selected course with faculty and group info
    for (const course of selectedCourses) {
      const groups = selectedGroups[course.id] || [];
      enrollInCourse(course.id, selectedFaculty, groups[0]);
    }
    onClose();
  };

  const hasMultipleGroups = (courseId: string): boolean => {
    return (selectedGroups[courseId]?.length || 0) > 1;
  };

  if (!isOpen) return null;

    return (
    <div
      className="fixed inset-0 backdrop-blur-sm  bg-opacity-30 
        flex items-center justify-center z-50 overflow-y-auto p-2 sm:p-4"
    >
      <div
        className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full 
          max-w-xs sm:max-w-7xl max-h-[95vh] sm:max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div
          className="p-3 sm:p-4 border-b border-gray-200 flex 
            justify-between items-start sm:items-center gap-2"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              Pick Your Schedule
            </h2>
            {hasConflicts && (
              <div
                className="bg-red-100 text-red-700 px-2 sm:px-3 
              py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 flex-shrink-0"
              >
                <MdOutlineWarningAmber size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Schedule conflicts detected</span>
                <span className="sm:hidden">Conflicts</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700
            p-1 rounded-full hover:bg-red-50 transition-colors flex-shrink-0"
          >
            <MdClose size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Left Section: Course Selection */}
          <div
            className="w-full lg:w-1/3 p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 
            overflow-y-auto max-h-[40vh] sm:max-h-[50vh] lg:max-h-none"
          >
            <div className="space-y-3 sm:space-y-4">
              <FacultySelector
                selectedFaculty={selectedFaculty}
                setSelectedFaculty={setSelectedFaculty}
              />
              <CourseSearchBar onCourseSelect={handleCourseSelect} />

              <div>
                <h3 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                  Selected Courses
                </h3>
                {selectedCourses.length === 0 ? (
                  <p className="text-gray-500 text-xs sm:text-sm">No courses selected yet</p>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {selectedCourses.map((course, index) => (
                      <div key={course.id}>
                        {hasMultipleGroups(course.id) && (
                          <div
                            className="bg-yellow-100 border border-yellow-400 
                          text-yellow-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm mb-1
                          flex items-center gap-1 sm:gap-2"
                          >
                            <MdOutlineWarningAmber className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm">Can only be enrolled in one group.</span>
                          </div>
                        )}
                        <CourseCard
                          course={course}
                          index={index}
                          selectedFaculty={selectedFaculty}
                          selectedGroups={selectedGroups}
                          onCourseRemove={handleCourseRemove}
                          onGroupToggle={handleGroupToggle}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section: Calendar */}
          <div className="w-full lg:w-2/3 p-3 sm:p-4 flex flex-col flex-grow overflow-hidden">
            <div className="flex-grow overflow-auto h-[35vh] sm:h-[40vh] lg:h-auto">
              <Calendar
                events={calendarEvents}
                showTitle={true}
                hasConflicts={hasConflicts}
                conflictDate={conflictDate}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-200 flex flex-col gap-3">
          {errorMessage && (
            <div className="bg-yellow-100 border border-yellow-400 
            text-yellow-700 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm">
              {errorMessage}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <Link
              to="/generate-schedule"
              className="text-blue-600 hover:text-blue-800 
              flex items-center gap-1 text-xs sm:text-sm order-2 sm:order-1"
            >
              <span>Try our schedule generator</span>
            </Link>
            <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 
                rounded-md hover:bg-gray-300 transition-colors text-sm sm:text-base 
                font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSchedule}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 
                text-white rounded-md hover:bg-blue-700 transition-colors 
                text-sm sm:text-base font-medium disabled:opacity-50"
                disabled={selectedCourses.length === 0}
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
