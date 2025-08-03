import React from "react";
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdExpandMore,
} from "react-icons/md";

interface SortDirection {
  date: boolean;
  rating: boolean | undefined;
}

interface ReviewControlsProps {
  sortDirection: SortDirection;
  onSort: (sortType: string) => void;
  professors: string[];
  onProfessorFilter: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

// ...existing code...
export default function ReviewControls({
  sortDirection,
  onSort,
  professors,
  onProfessorFilter,
}: ReviewControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
      <div className="flex flex-row items-center gap-2 sm:gap-4">
        <button
          onClick={() => onSort("date")}
          className="flex items-center gap-1 p-0 text-gray-700 hover:text-blue-500
                     transition-all duration-200 text-sm font-medium
                     border border-transparent px-2 py-2 whitespace-nowrap"
        >
          Date
          {sortDirection.date ? (
            <MdKeyboardArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <MdKeyboardArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        <button
          onClick={() => onSort("rating")}
          className="flex items-center gap-1 p-0 text-gray-700 hover:text-blue-500
                      transition-all duration-200 text-sm font-medium
                      border border-transparent px-2 py-2 whitespace-nowrap"
        >
          <span>Rating</span>
          {sortDirection.rating === undefined ? (
            <span className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : sortDirection.rating ? (
            <MdKeyboardArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <MdKeyboardArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>

      {professors.length > 0 && (
        <div className="relative w-full sm:w-auto min-w-0 sm:min-w-[200px]">
          <select
            name="professor"
            defaultValue=""
            onChange={onProfessorFilter}
            className="appearance-none w-full px-3 sm:px-4 py-2 pr-8 sm:pr-10 text-gray-700 bg-white border 
            border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 
            transition-all duration-200 text-sm font-medium cursor-pointer 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:border-transparent"
          >
            <option value="" className="text-gray-700">
              All Professors
            </option>
            {professors.map((professor: string, index: number) => (
              <option key={index} value={professor}>
                {professor}
              </option>
            ))}
          </select>
          <MdExpandMore className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 pointer-events-none" />
        </div>
      )}
    </div>
  );
}
