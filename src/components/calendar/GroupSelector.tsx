import { useEffect, useState } from "react";

import "./GroupSelector.css";

interface GroupSelectorProps {
  groups: number[];
  selectedGroups: number[];
  onGroupChange: (group: number, isChecked: boolean) => void;
}

export default function GroupSelector({
  groups,
  selectedGroups,
  onGroupChange,
}: GroupSelectorProps) {
  const [selectAll, setSelectAll] = useState(true);

  // Update selectAll state when groups or selectedGroups change
  useEffect(() => {
    const allSelected = groups.length === selectedGroups.length;
    setSelectAll(allSelected);
  }, [groups, selectedGroups]);

  const handleButtonClick = (group: number) => {
    const isCurrentlySelected = selectedGroups.includes(group);
    onGroupChange(group, !isCurrentlySelected);

    if (isCurrentlySelected) {
      setSelectAll(false);
    } else if (selectedGroups.length + 1 === groups.length) {
      setSelectAll(true);
    }
  };

  const handleSelectAllClick = () => {
    const newSelectAll = !selectAll;
    groups.forEach((group) => {
      if (newSelectAll !== selectedGroups.includes(group)) {
        onGroupChange(group, newSelectAll);
      }
    });
    setSelectAll(newSelectAll);
  };

  return (
    <div className="group-selector">
      <div className="groups-container">
        {groups.map((group, index) => (
          <button
            key={index}
            className={`group sticky-note ${
              selectedGroups.includes(group) ? "selected" : ""
            }`}
            onClick={() => handleButtonClick(group)}
          >
            {group}
          </button>
        ))}
      </div>
      <div className="group">
        <button
          className={`select-all-button ${selectAll ? "selected" : ""}`}
          onClick={handleSelectAllClick}
        >
          {selectAll ? "Deselect All" : "Select All"}
        </button>
      </div>
    </div>
  );
}
