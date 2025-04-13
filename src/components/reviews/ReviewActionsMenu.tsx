import { useRef, useState, useEffect } from "react";
import {
  MdDeleteOutline,
  MdMoreVert,
  MdOutlineEdit,
  MdFlag,
} from "react-icons/md";

interface ReviewActionsMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onReport: () => void;
  isAuth: boolean;
}

export default function ReviewActionsMenu({
  onEdit,
  onDelete,
  onReport,
  isAuth,
}: ReviewActionsMenuProps) {
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const toggleActionsMenu = () => {
    setShowActionsMenu((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      actionsMenuRef.current &&
      !actionsMenuRef.current.contains(event.target as Node)
    ) {
      setShowActionsMenu(false);
    }
  };

  useEffect(() => {
    if (showActionsMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionsMenu]);

  const handleEditClick = () => {
    if (onEdit) onEdit();
    setShowActionsMenu(false);
  };

  const handleDeleteClick = () => {
    if (onDelete) onDelete();
    setShowActionsMenu(false);
  };

  const handleReportClick = () => {
    onReport();
    setShowActionsMenu(false);
  };

  return (
    <div className="relative" ref={actionsMenuRef}>
      <button
        onClick={toggleActionsMenu}
        className="text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Actions"
        title="Actions"
      >
        <MdMoreVert size={25} />
      </button>
      {showActionsMenu && (
        <div
          className="absolute right-0 mt-2 w-40 bg-white border 
          border-gray-200 rounded-lg shadow-lg z-10"
        >
          {isAuth ? (
            <>
              <button
                onClick={handleEditClick}
                className="w-full text-left px-4 py-2 text-gray-700 
                hover:bg-gray-100 transition-colors"
              >
                <MdOutlineEdit className="inline-block mr-2" size={20} />
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full text-left px-4 py-2 text-red-600 
                hover:bg-gray-100 transition-colors"
              >
                <MdDeleteOutline className="inline-block mr-2" size={20} />
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={handleReportClick}
              className="w-full text-left px-4 py-2 text-yellow-600 
              hover:bg-gray-100 transition-colors"
            >
              <MdFlag className="inline-block mr-2" size={20} />
              Report
            </button>
          )}
        </div>
      )}
    </div>
  );
}
