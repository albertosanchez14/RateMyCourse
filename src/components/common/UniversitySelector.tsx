import { useEffect, useRef, useState } from "react";

interface University {
  id: string;
  name: string;
  logoPath: string;
  enabled: boolean;
}

const universities: University[] = [
  {
    id: "1",
    name: "Universidad Carlos III de Madrid",
    logoPath: "/logo-uc3m.png",
    enabled: true,
  },
  {
    id: "2",
    name: "Universidad Politécnica de Madrid",
    logoPath: "/logo-upm.png",
    enabled: false,
  },
  {
    id: "3",
    name: "Universidad Complutense de Madrid",
    logoPath: "/logo-ucm.png",
    enabled: false,
  },
  {
    id: "4",
    name: "Universidad Autónoma de Madrid",
    logoPath: "/logo-uam.png",
    enabled: false,
  },
  {
    id: "5",
    name: "Universidad Rey Juan Carlos",
    logoPath: "/logo-urjc.png",
    enabled: false,
  },
  {
    id: "6",
    name: "Universidad de Alcalá",
    logoPath: "/logo-alcala.png",
    enabled: false,
  },
];

export default function UniversitySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(universities[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectUniversity = (university: University) => {
    if (university.enabled) {
      setSelectedUniversity(university);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-full"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div
          className="w-[40px] h-[40px] relative flex items-center 
        justify-center border border-gray-200 rounded-full overflow-hidden 
        hover:border-blue-500 transition-colors"
        >
          <img
            src={selectedUniversity.logoPath}
            alt={`${selectedUniversity.name} logo`}
            className="h-full w-full object-contain p-1"
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-85 bg-white rounded-md 
        shadow-lg z-10 py-1 border border-gray-200
        transform transition-all duration-200 ease-out 
        opacity-100 scale-100"
        >
          <div className="px-3 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">
              Select a University
            </h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {universities.map((university) => (
              <button
                key={university.id}
                className={`flex items-center w-full px-4 py-2 text-left
                ${
                  university.enabled
                    ? "hover:bg-gray-100"
                    : "cursor-not-allowed"
                } 
                transition-colors`}
                onClick={() => handleSelectUniversity(university)}
                disabled={!university.enabled}
              >
                <div className="w-8 h-8 flex-shrink-0 mr-3">
                  <img
                    src={university.logoPath}
                    alt={`${university.name} logo`}
                    className={`h-full w-full object-contain 
                    ${university.enabled ? "" : "opacity-40 grayscale"}`}
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-sm ${
                      university.enabled ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {university.name}
                  </span>
                  {!university.enabled && (
                    <span className="text-xs text-blue-500 font-medium">
                      Coming soon...
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
