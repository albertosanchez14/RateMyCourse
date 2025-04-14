import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { useEnrolled } from "../../hooks/useEnrolled";

// import Calendar from "../../components/calendar/Calendar";
import LoadingSpinnerScreen from "../../components/loading/LoadingSpinnerScreen";
import PickScheduleModal from "./PickScheduleModal";

export default function ProfileCalendarSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enrolledCourses, isLoading, error } = useEnrolled();
  const { data: user } = useUser();

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
        <div className="profile-calendar-section">
          <h2 className="section-title">Calendar</h2>
          {/* // <Calendar events={enrolledCourses} /> */}
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
            <span className="text-lg font-semibold">{user?.first_name}, you have no enrolled courses. </span>
            <span className="text-sm font-medium">Click here to pick a schedule.</span>
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
