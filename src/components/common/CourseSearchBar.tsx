import { useEffect, useState } from "react";

import { useUser } from "../../hooks/useUser";

import SearchBar from "./SearchBar";

interface CourseSearchBarProps {
  onCourseSelect: (id: string, title: string) => void;
  filterByDegree?: string | null;
}

export default function CourseSearchBar({
  onCourseSelect,
  filterByDegree,
}: CourseSearchBarProps) {
  const { data: user } = useUser();
  const [userDegree, setUserDegree] = useState<string | null>(null);

  useEffect(() => {
    if (filterByDegree) {
      setUserDegree(filterByDegree);
    } else if (user?.degree) {
      setUserDegree(user.degree);
    }
  }, [user, filterByDegree]);

  const handleCustomResultClick = (id: string, title: string) => {
    onCourseSelect(id, title);
  };

  return (
    <div className="mb-4 w-full flex justify-center">
      {/* <label className="block text-sm font-medium text-gray-700 mb-1">
        Search Courses
      </label> */}
      <SearchBar
        placeholder="Search for courses..."
        onResultClick={handleCustomResultClick}
        filterByDegree={userDegree}
      />
    </div>
  );
}
