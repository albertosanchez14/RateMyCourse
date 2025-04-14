import { MdExpandMore } from "react-icons/md";

interface FacultySelectorProps {
  selectedFaculty: string;
  setSelectedFaculty: (faculty: string) => void;
}

export default function FacultySelector({
  selectedFaculty,
  setSelectedFaculty,
}: FacultySelectorProps) {
  return (
    <div className="mb-4 relative">
      <label
        htmlFor="faculty-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Select Campus
      </label>
      <div className="relative">
        <select
          id="faculty-select"
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
          className="block w-full px-3 py-2 bg-white border 
              border-gray-300 rounded-md shadow-sm focus:outline-none 
              focus:ring-blue-500 focus:border-blue-500 appearance-none"
        >
          <option value="Escuela Politécnica Superior (Leganés)">
            Escuela Politécnica Superior (Leganés)
          </option>
          <option value="Escuela Politécnica Superior (Colmenarejo)">
            Escuela Politécnica Superior (Colmenarejo)
          </option>
        </select>
        <MdExpandMore
          className="absolute right-2 top-1/2 transform 
              -translate-y-1/2 text-gray-500 pointer-events-none"
          size={24}
        />
      </div>
    </div>
  );
}
