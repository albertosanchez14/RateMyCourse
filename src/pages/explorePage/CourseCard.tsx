import { Link } from "react-router-dom";
import { SearchResult } from "../../hooks/useSearch";

interface CourseCardProps {
  course: SearchResult;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/course/${course._id}`}>
      <div className="bg-white rounded-lg shadow-md pl-6 pt-2 pb-2 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
        <div className="flex items-start mb-1">
          <div className="flex items-start gap-2">
            <h2 className="text-lg">{course.code}</h2>
            <h3 className="text-lg text-gray-700">{course.title}</h3>
          </div>
          {/* TODO: Add rating component here if available */}
        </div>
        <p className="text-sm text-gray-600 mb-2">{course.degree_name}</p>
      </div>
    </Link>
  );
}
