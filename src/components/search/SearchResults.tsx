import { useEffect, useState } from "react";
import { SearchResult } from "../../hooks/useSearch";

import CourseCard from "./CourseCard";

interface SearchResultsProps {
  filteredResults: SearchResult[];
}

export default function SearchResults({ filteredResults }: SearchResultsProps) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Expand all sections by default
  useEffect(() => {
    const initialSections = filteredResults.reduce((acc, course) => {
      const degree = course.degree_name || "Other";
      acc[degree] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setOpenSections(initialSections);
  }, [filteredResults]);

  // Group courses by degree
  const coursesByDegree = filteredResults.reduce((acc, course) => {
    const degree = course.degree_name || "Other";
    if (!acc[degree]) {
      acc[degree] = [];
    }
    acc[degree].push(course);
    return acc;
  }, {} as { [key: string]: SearchResult[] });

  const toggleSection = (degree: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [degree]: !prev[degree],
    }));
  };

  return (
    <div className="flex flex-col gap-2 flex-grow">
      {Object.entries(coursesByDegree).map(([degree, courses]) => (
        <div key={degree} className="tree-menu">
          <div className="flex items-center">
            <button
              onClick={() => toggleSection(degree)}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 w-full transition-colors duration-200"
            >
              <span className="w-4 h-4 flex items-center justify-center text-gray-500 transition-transform duration-200">
                {openSections[degree] ? "−" : "+"}
              </span>
              <span className="font-medium text-gray-800">{degree}</span>
              <span className="text-gray-400 text-sm ml-2">
                ({courses.length})
              </span>
            </button>
          </div>
          <div 
            className={`ml-6 pl-4 pr-6 border-l border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
              openSections[degree] ? 'max-h-[1000px] opacity-100 pb-4' : 'max-h-0 opacity-0 pb-0'
            }`}
          >
            {courses.map((course) => (
              <div key={course._id} className="py-2">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
