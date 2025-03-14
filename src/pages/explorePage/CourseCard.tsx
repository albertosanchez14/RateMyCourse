import { Link } from "react-router-dom";
import { SearchResult } from "../../hooks/useSearch";

interface CourseCardProps {
  course: SearchResult;
}

// export default function CourseCard1({ course }: CourseCardProps) {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <h2 className="text-xl font-semibold">{course.code}</h2>
//           <h3 className="text-lg text-gray-700">{course.title}</h3>
//         </div>
//         {/* Add rating component here if available */}
//       </div>
//       {course.degree_name && (
//         <p className="text-sm text-gray-600 mb-4">{course.degree_name}</p>
//       )}
//       <a
//         href={`/course/${course.code}`}
//         className="inline-block bg-gray-200 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
//       >
//         View Details
//       </a>
//     </div>
//   );
// }

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/course/${course._id}`}>
      <div className="bg-white rounded-lg shadow-md pl-6 pt-2 pb-2 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
        <div className="flex items-start mb-1">
          <div className="flex items-start gap-2">
            <h2 className="text-lg">{course.code}</h2>
            <h3 className="text-lg text-gray-700">{course.title}</h3>
          </div>
          {/* Add rating component here if available */}
        </div>
        <p className="text-sm text-gray-600 mb-2">{course.degree_name}</p>
      </div>
    </Link>
  );
}
