import "./GroupSelector.css";

interface GroupSelectorProps {
  groups: number[];
  onGroupChange: (group: number, isChecked: boolean) => void;
}

export default function GroupSelector({
  groups,
  onGroupChange,
}: GroupSelectorProps) {
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    group: number
  ) => {
    onGroupChange(group, e.target.checked);
  };

  return (
    <div className="group-selector">
      <h3>Group Selector</h3>
      {groups.map((group, index) => (
        <div key={index} className="group">
          <input
            type="checkbox"
            id={`group-${index}`}
            onChange={(e) => handleCheckboxChange(e, group)}
          />
          <label htmlFor={`group-${index}`}>{group}</label>
        </div>
      ))}
    </div>
  );
}
