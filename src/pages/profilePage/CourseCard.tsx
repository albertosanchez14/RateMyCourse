import { MdClose } from "react-icons/md";
import { FiCheck } from "react-icons/fi";

import { useCourse } from "../../hooks/useCourse";

interface CourseCardProps {
  course: { id: string; title: string };
  index: number;
  selectedFaculty: string;
  selectedGroups: Record<string, number[]>;
  onCourseRemove: (courseId: string) => void;
  onGroupToggle: (courseId: string, group: number, isChecked: boolean) => void;
}

export default function CourseCard({
  course,
  selectedFaculty,
  selectedGroups,
  onCourseRemove,
  onGroupToggle,
}: CourseCardProps) {
  const { data: courseData, isLoading } = useCourse(course.id);

  if (isLoading || !courseData) {
    return (
      <div className="bg-white rounded-lg shadow p-3 mb-2 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  // Get available groups for the selected faculty
  const availableGroups = courseData.schedule
    .filter((s) => s.faculty === selectedFaculty)
    .flatMap((s) => s.schedule)
    .flatMap((e) => e.groups)
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => a - b);

  return (
    <div className="bg-white rounded-lg shadow p-3 mb-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-800">
            {courseData.code} - {courseData.title}
          </h3>
          <p className="text-sm text-gray-600">{courseData.degree.title}</p>
        </div>
        <button
          onClick={() => onCourseRemove(course.id)}
          className="text-red-500 hover:text-red-700 p-1 rounded-full 
          hover:bg-red-50 transition-colors"
        >
          <MdClose size={18} />
        </button>
      </div>

      {availableGroups.length > 0 ? (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700 mb-1">Groups:</p>
          <div className="flex flex-wrap gap-2">
            {availableGroups.map((group) => {
              const isChecked =
                selectedGroups[course.id]?.includes(group) || false;
              return (
                <label key={group} className="flex items-center cursor-pointer">
                  <div
                    className={`w-5 h-5 flex items-center justify-center rounded border 
                  ${
                    isChecked
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 bg-white"
                  } 
                  transition-all mr-1.5`}
                  >
                    {isChecked && <FiCheck size={14} />}
                  </div>
                  <span className="text-sm">{group}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      onGroupToggle(course.id, group, e.target.checked)
                    }
                    className="hidden"
                  />
                </label>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-2">
          No groups available for this campus
        </p>
      )}
    </div>
  );
}
