import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSearch, SearchResult } from "../../hooks/useSearch";

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Search courses...",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const { data: results, isLoading, searchItems } = useSearch();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  console.log("Results", results);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    searchItems(value);
    setIsOpen(true);
  };

  const handleResultClick = (result: SearchResult,) => {
    setSearchTerm(result.title);
    setIsOpen(false);
    navigate(`/course/${result.code}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : prev
        );
        break;
      case 'Enter':
        event.preventDefault();
        const selectedResult = results[selectedIndex === -1 ? 0 : selectedIndex];
        if (selectedResult) {
          handleResultClick(selectedResult);
        }
        break;
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
        aria-label="Search"
      />
      <svg
        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {isOpen && searchTerm.length > 0 && (
        <div className="absolute w-full h-fit mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-hidden z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result, index) => (
                <li
                  key={result._id}
                  className={`px-4 py-2 cursor-pointer ${
                    index === selectedIndex 
                      ? 'bg-blue-50 hover:bg-blue-100' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleResultClick(result)}
                >
                  <Link to={`/course/${result.code}`} className="block">
                    <div className="font-medium">
                      {result.code}-{result.title}
                    </div>
                    {result.degree_name && (
                      <div className="text-sm text-gray-500">
                        {result.degree_name}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
