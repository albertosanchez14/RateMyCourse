import { useState, useEffect } from "react";

import "./GroupSelector.css";

interface GroupSelectorProps {
  groups: number[];
  onGroupChange: (group: number, isChecked: boolean) => void;
}

export default function GroupSelector({
  groups,
  onGroupChange,
}: GroupSelectorProps) {
  const [selectAll, setSelectAll] = useState(true);
  const [checkedGroups, setCheckedGroups] = useState<number[]>(groups);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    group: number
  ) => {
    // Update the checked groups -> onGroupChange
    const isChecked = e.target.checked;
    onGroupChange(group, isChecked);
    // Update the select all checkbox
    if (!isChecked) {
      setSelectAll(false);
    } else if (checkedGroups.length + 1 === groups.length) {
      setSelectAll(true);
    }
    // Update the checked groups -> local state
    setCheckedGroups((prevCheckedGroups) =>
      isChecked
        ? [...prevCheckedGroups, group]
        : prevCheckedGroups.filter((g) => g !== group)
    );
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setCheckedGroups(isChecked ? groups : []);
    groups.forEach((group) => onGroupChange(group, isChecked));
  };

  return (
    <div className="group-selector">
      <h3>Group Selector</h3>
      <div className="group">
        <input
          type="checkbox"
          id="select-all"
          checked={selectAll}
          onChange={handleSelectAllChange}
        />
        <label htmlFor="select-all">Select All</label>
      </div>
      {groups.map((group, index) => (
        <div key={index} className="group">
          <input
            type="checkbox"
            id={`group-${index}`}
            checked={checkedGroups.includes(group)}
            onChange={(e) => handleCheckboxChange(e, group)}
          />
          <label htmlFor={`group-${index}`}>{group}</label>
        </div>
      ))}
    </div>
  );
}
