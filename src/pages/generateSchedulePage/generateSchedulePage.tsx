import { useState, useEffect } from "react";

import { useCourseData } from "../../hooks/useCourse";
import { useAuth } from "../../hooks/useAuth";
import { useEnrolled } from "../../hooks/useEnrolled";
import useDegrees from "../../hooks/useDegrees";

import CourseSearchBar from "../../components/common/CourseSearchBar";
import TimePickCalendar from "../../components/calendar/TimePickCalendar";
import CourseCard from "../profilePage/CourseCard";
import { getGenSchedules } from "../../hooks/useGenSchedule";
import ScheduleVisualization from "./scheduleVisualization";
import { MdClose } from "react-icons/md";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import LoginModal from "../../components/auth/LoginModal";

export default function GenerateSchedulePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { enrollInCourse } = useEnrolled();
  const [selectedCourses, setSelectedCourses] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [selectedGroups, setSelectedGroups] = useState<
    Record<string, number[]>
  >({});
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({});
  const [selectedFaculty, setSelectedFaculty] = useState<string>(
    "Escuela Politécnica Superior (Leganés)"
  );
  const [selectedDegree, setSelectedDegree] = useState<string | null>(null);
  const { courseData } = useCourseData(selectedCourses);
  const { data: degrees, isLoading: degreesLoading } = useDegrees(
    "University Carlos III of Madrid"
  );
  const [generatedSchedules, setGeneratedSchedules] = useState<any[]>([]);
  const [coursesEventsMap, setCoursesEventsMap] = useState<
    Record<string, any[]>
  >({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);

  // Add course from search bar
  const handleCourseSelect = (id: string, title: string) => {
    if (!selectedCourses.some((c) => c.id === id)) {
      setSelectedCourses([...selectedCourses, { id, title }]);
    }
  };

  // Remove course from list
  const handleCourseRemove = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== courseId));
    const newGroups = { ...selectedGroups };
    delete newGroups[courseId];
    setSelectedGroups(newGroups);
  };

  // Toggle group selection for a course
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

  // By default, select all groups when a course is added
  useEffect(() => {
    selectedCourses.forEach((course) => {
      if (!selectedGroups[course.id] && courseData[course.id]) {
        // Initialize with an empty array to have no groups selected
        setSelectedGroups((prev) => ({
          ...prev,
          [course.id]: [],
        }));
      }
    });
  }, [selectedCourses, courseData, selectedFaculty]);

  const handleSubmit = async () => {
    const coursesWithGroups = selectedCourses.map((course) => ({
      id: course.id,
      groups: selectedGroups[course.id] || [],
    }));

    try {
      const result = await getGenSchedules(
        selectedFaculty,
        coursesWithGroups,
        selectedTimeSlots
      );
      // Handle the result, e.g., navigate to a results page or show a success message
      console.log("Generated schedule:", result);
      setGeneratedSchedules(result.validSchedules || []);
      setCoursesEventsMap(result.coursesEventsMap || {});
      setCurrentScheduleIndex(0);
    } catch (error) {
      console.error("Error generating schedule:", error);
      alert("Failed to generate schedule.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    // After successful login, try to save the schedule again
    handleSaveSchedule(generatedSchedules[currentScheduleIndex]);
  };

  const handleSaveSchedule = async (schedule: any) => {
    // If not authenticated, show login modal
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      // For each item in the schedule, create an enrollment
      const savePromises = schedule.map(async (item: any) => {
        const { courseId, groupId } = item;

        // Enroll in the course with selected faculty and group
        await enrollInCourse(courseId, selectedFaculty, groupId);
      });
      await Promise.all(savePromises);
      // Show success notification
      alert("Schedule saved successfully!");
      // Clear generated schedules and return to main view
      setGeneratedSchedules([]);
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Failed to save schedule. Please try again.");
    }
  };

  return (
    <div className="flex flex-col px-4 py-8">
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Generate Your Schedule
        </h1>
        <div className="w-full max-w-xl mt-6 mb-2">
          <CourseSearchBar
            onCourseSelect={handleCourseSelect}
            filterByDegree={selectedDegree}
          />
        </div>
        {/* Faculty & Degree Dropdowns */}
        <div className="w-full max-w-3xl mb-8 flex gap-4">
          {/* Faculty Dropdown */}
          <div className="flex-1">
            <label
              htmlFor="faculty-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Limit search to faculty
            </label>
            <div className="relative">
              <select
                id="faculty-select"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="block w-full px-3 py-2 bg-white border 
                  border-gray-300 rounded-md shadow-sm focus:outline-none 
                  focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                {/* Add your faculty options here */}
                <option value="Escuela Politécnica Superior (Leganés)">
                  Escuela Politécnica Superior (Leganés)
                </option>
                <option value="Escuela Politécnica Superior (Colmenarejo)">
                  Escuela Politécnica Superior (Colmenarejo)
                </option>
                {/* Add more faculties as needed */}
              </select>
              {/* Dropdown icon */}
              <svg
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 10l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          {/* Degree Dropdown */}
          <div className="flex-1">
            <label
              htmlFor="degree-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Limit search to degree
            </label>
            <div className="relative">
              <select
                id="degree-select"
                value={selectedDegree || ""}
                onChange={(e) =>
                  setSelectedDegree(
                    e.target.value === "" ? null : e.target.value
                  )
                }
                className="block w-full px-3 py-2 bg-white border 
                  border-gray-300 rounded-md shadow-sm focus:outline-none 
                  focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">All degrees</option>
                {degreesLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  degrees &&
                  degrees.map((degree: string) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))
                )}
              </select>
              {/* Dropdown icon */}
              <svg
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 10l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Selected Courses List */}
        <div className="w-full md:w-1/3">
          <div className="flex justify-center mb-4">
            <h2 className="text-xl font-semibold mb-6">Selected Courses</h2>
          </div>
          {selectedCourses.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No courses selected yet.</p>
            </div>
          ) : (
            selectedCourses.map((course, idx) => (
              <CourseCard
                key={course.id}
                course={course}
                index={idx}
                selectedFaculty={selectedFaculty}
                selectedGroups={selectedGroups}
                onCourseRemove={handleCourseRemove}
                onGroupToggle={handleGroupToggle}
              />
            ))
          )}
        </div>
        {/* Calendar */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-center mb-4">
            <h2 className="text-xl font-semibold mb-2">Time Pick</h2>
          </div>
          <div style={{ maxHeight: "900px", overflowY: "auto" }}>
            <TimePickCalendar
              value={selectedTimeSlots}
              onChange={setSelectedTimeSlots}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold 
          hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={selectedCourses.length === 0}
        >
          Generate Schedule
        </button>
      </div>

      {isGenerating ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-lg font-medium">
                Generating schedules...
              </p>
            </div>
          </div>
        </div>
      ) : generatedSchedules.length > 0 ? (
        <div className="fixed inset-0 bg-white z-40 overflow-auto">
          <div className="container mx-auto p-8">
            <div className="flex flex-col items-center mb-12 relative">
              <h2 className="text-3xl font-bold">Generated Schedules</h2>
              <button
                onClick={() => setGeneratedSchedules([])}
                className="text-red-500 hover:text-red-700 p-1 rounded-full
                hover:bg-red-50 transition-colors absolute right-0 top-0"
              >
                <MdClose size={30} />
              </button>
            </div>

            {generatedSchedules.length > 0 ? (
              <>
                <div className="flex justify-center items-center">
                  <button
                    onClick={() =>
                      setCurrentScheduleIndex(
                        Math.max(0, currentScheduleIndex - 1)
                      )
                    }
                    disabled={currentScheduleIndex === 0}
                    className={`px-3 py-1 rounded flex items-center justify-center ${
                      currentScheduleIndex === 0
                        ? "text-gray-400 cursor-default"
                        : "text-blue-800 hover:bg-blue-100 cursor-pointer"
                    }`}
                  >
                    <FaArrowLeftLong size={18} />
                  </button>
                  <span className="mx-4">
                    Option {currentScheduleIndex + 1} of{" "}
                    {generatedSchedules.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentScheduleIndex(
                        Math.min(
                          generatedSchedules.length - 1,
                          currentScheduleIndex + 1
                        )
                      )
                    }
                    disabled={
                      currentScheduleIndex === generatedSchedules.length - 1
                    }
                    className={`px-3 py-1 rounded flex items-center justify-center ${
                      currentScheduleIndex === generatedSchedules.length - 1
                        ? "text-gray-400 cursor-default"
                        : "text-blue-800 hover:bg-blue-100 cursor-pointer"
                    }`}
                  >
                    <FaArrowRightLong size={18} />
                  </button>
                </div>

                {/* Display the current schedule */}
                <div className="p-4 mb-6 rounded-lg max-w-5xl mx-auto">
                  <ScheduleVisualization
                    schedule={generatedSchedules[currentScheduleIndex]}
                    courses={selectedCourses}
                    coursesEventsMap={coursesEventsMap}
                  />
                </div>

                <div className="flex justify-center mt-4 space-x-4">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 
                    text-white py-2 px-6 rounded-full hover:from-blue-600 
                    hover:to-blue-800 shadow-lg transform transition-transform 
                    hover:scale-105 flex items-center gap-2"
                    onClick={() =>
                      handleSaveSchedule(
                        generatedSchedules[currentScheduleIndex]
                      )
                    }
                  >
                    Save This Schedule
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-xl">
                  No schedules could be generated with your criteria.
                </p>
                <p className="text-gray-600 mt-2">
                  Try selecting more courses or fewer constraints.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
