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
  const [dropdownPosition, setDropdownPosition] = useState<'right' | 'left'>('right');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 320;
      const padding = 16;
      
      const spaceOnRight = viewportWidth - buttonRect.left - padding;
      const spaceOnLeft = buttonRect.right - padding;
      
      if (spaceOnRight >= dropdownWidth) {
        setDropdownPosition('right');
      }
      else if (spaceOnLeft >= dropdownWidth) {
        setDropdownPosition('left');
      }
      else {
        setDropdownPosition(spaceOnRight >= spaceOnLeft ? 'right' : 'left');
      }
    }
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
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-full touch-manipulation"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div
          className="w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] relative flex items-center 
        justify-center border border-gray-200 rounded-full overflow-hidden 
        hover:border-blue-500 transition-colors active:scale-95"
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
          className={`absolute mt-2 bg-white rounded-md shadow-lg z-50 py-1 
          border border-gray-200 transform transition-all duration-200 ease-out 
          opacity-100 scale-100
          w-72 sm:w-80 md:w-85
          max-w-[calc(100vw-2rem)]
          ${dropdownPosition === 'left' ? 'right-0' : 'left-0'}
          ${dropdownPosition === 'left' ? 'origin-top-right' : 'origin-top-left'}`}
        >
          <div className="px-3 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">
              Select a University
            </h3>
          </div>
          <div className="max-h-60 sm:max-h-80 overflow-y-auto">
            {universities.map((university) => (
              <button
                key={university.id}
                className={`flex items-center w-full px-3 sm:px-4 py-2 text-left
                ${
                  university.enabled
                    ? "hover:bg-gray-100 active:bg-gray-50"
                    : "cursor-not-allowed"
                } 
                transition-colors touch-manipulation`}
                onClick={() => handleSelectUniversity(university)}
                disabled={!university.enabled}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 mr-2 sm:mr-3">
                  <img
                    src={university.logoPath}
                    alt={`${university.name} logo`}
                    className={`h-full w-full object-contain 
                    ${university.enabled ? "" : "opacity-40 grayscale"}`}
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className={`text-sm leading-tight ${
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