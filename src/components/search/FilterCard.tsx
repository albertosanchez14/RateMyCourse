import { useState } from "react";

import { SearchResult } from "../../hooks/useSearch";

interface FilterCardProps {
  results: SearchResult[];
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  degrees: string[];
  semesters: string[];
}

export default function FilterCard({
  results,
  onFilterChange,
}: FilterCardProps) {
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedSemesters, setSelectedSemesters] = useState<string[]>([]);

  const handleFilterChange = (type: "degrees" | "semesters", value: string) => {
    const updateFilters = (prev: string[], value: string) => {
      const newFilters = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];

      return newFilters;
    };

    if (type === "degrees") {
      const newDegrees = updateFilters(selectedDegrees, value);
      setSelectedDegrees(newDegrees);
      onFilterChange({ degrees: newDegrees, semesters: selectedSemesters });
    } else {
      const newSemesters = updateFilters(selectedSemesters, value);
      setSelectedSemesters(newSemesters);
      onFilterChange({ degrees: selectedDegrees, semesters: newSemesters });
    }
  };

  return (
    <div className="bg-white h-fit w-80 flex-shrink-0 p-4 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold">Filter</h3>
      <div className="flex flex-col gap-4">
        <div className="mt-4">
          <label className="text-xl font-semibold mb-4">Degree</label>
          <div className="flex flex-col gap-1">
            {[...new Set(results.map((result) => result.degree_name))]
              .sort()
              .map((degree) => (
                <label key={degree} className="flex items-center">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="degree"
                    value={degree}
                    checked={selectedDegrees.includes(degree)}
                    onChange={() => handleFilterChange("degrees", degree)}
                  />
                  {degree.split(" ").slice(2).join(" ")}
                </label>
              ))}
          </div>
        </div>
        <div>
          <label className="text-xl font-semibold mb-5">Semester</label>
          <div className="flex flex-row gap-4">
            {[...new Set(results.map((result) => result.semester))].map(
              (semester) => (
                <label key={semester} className="flex items-center">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="semester"
                    value={semester}
                    checked={selectedSemesters.includes(semester)}
                    onChange={() => handleFilterChange("semesters", semester)}
                  />
                  {semester}
                </label>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
