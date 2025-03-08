import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useSearch } from "../../hooks/useSearch";

import ResultsSection from "./ResultsSection";
import FilterCard from "./FilterCard";

export default function Explore() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";

  const { data: results, isLoading, searchItems } = useSearch("");
  const [filteredResults, setFilteredResults] = useState(results);

  useEffect(() => {
    if (initialQuery) {
      searchItems(initialQuery, 100);
    }
  }, [initialQuery]);

  useEffect(() => {
    setFilteredResults(results);
  }, [results]);

  const handleFilterChange = ({
    degrees,
    semesters,
  }: {
    degrees: string[];
    semesters: string[];
  }) => {
    let filtered = [...results];
    if (degrees.length > 0) {
      filtered = filtered.filter((result) =>
        degrees.includes(result.degree_name)
      );
    }
    if (semesters.length > 0) {
      filtered = filtered.filter((result) =>
        semesters.includes(result.semester)
      );
    }
    setFilteredResults(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Search Results for "{initialQuery}"
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading results...</div>
        </div>
      ) : results.length > 0 ? (
        <div className="flex flex-row gap-8">
          <ResultsSection filteredResults={filteredResults} />
          <FilterCard results={results} onFilterChange={handleFilterChange} />
        </div>
      ) : (
        <div className="text-center text-gray-500 h-64 flex items-center justify-center">
          <p>No results found for "{initialQuery}"</p>
        </div>
      )}
    </div>
  );
}
