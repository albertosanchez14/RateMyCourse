import { useState } from "react";

import { SearchResult } from "../../hooks/useSearch";

import FilterElementCard from "./FilterElementCard";

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

  const formatDegreeLabel = (degree: string) => {
    return degree.split(" ").slice(2).join(" ");
  };

  return (
    <div className="bg-white h-fit w-100 flex-shrink-0 p-4 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-2">Filter Options</h3>
      <div className="flex flex-col gap-5">
        {/* Degree Section */}
        <FilterElementCard
          title="Degree"
          type="degrees"
          items={[...new Set(results.map((result) => result.degree_name))]}
          selectedItems={selectedDegrees}
          onFilterChange={handleFilterChange}
          formatLabel={formatDegreeLabel}
        />
        {/* Semester Section */}
        <FilterElementCard
          title="Semester"
          type="semesters"
          items={[...new Set(results.map((result) => result.semester))]}
          selectedItems={selectedSemesters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
}
