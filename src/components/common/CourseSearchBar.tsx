import SearchBar from "./SearchBar";

interface CourseSearchBarProps {
  onCourseSelect: (id: string, title: string) => void;
}

export default function CourseSearchBar({
  onCourseSelect,
}: CourseSearchBarProps) {
  const handleCustomResultClick = (id: string, title: string) => {
    onCourseSelect(id, title);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Search Courses
      </label>
      <SearchBar
        placeholder="Search for courses..."
        onResultClick={handleCustomResultClick}
      />
    </div>
  );
}
