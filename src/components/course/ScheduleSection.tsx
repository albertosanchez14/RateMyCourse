import { useEffect, useState } from "react";

import Calendar from "../calendar/Calendar";
import GroupSelector from "./GroupSelector";

import { EventType } from "../../types/course_type";

interface ScheduleSectionProps {
  teacher: {
    group: number;
  }[];
  schedule: Array<EventType>;
}

export default function ScheduleSection({
  teacher,
  schedule,
}: ScheduleSectionProps) {
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

  useEffect(() => {
    if (teacher) {
      setSelectedGroups(teacher.map((teacher) => teacher.group)); // Initialize selectedGroups with all group numbers
    }
  }, [teacher]);

  const filteredEvents =
    selectedGroups.length === 0
      ? []
      : schedule.filter((event) =>
          event.groups.some((group: number) => selectedGroups.includes(group))
        );

  const handleGroupChange = (group: number, isChecked: boolean) => {
    setSelectedGroups((prevSelectedGroups) =>
      isChecked
        ? [...prevSelectedGroups, group]
        : prevSelectedGroups.filter((g) => g !== group)
    );
  };

  return (
    <div className="course-schedule-container">
      <Calendar events={filteredEvents} />
      <GroupSelector
        groups={teacher.map((teacher) => teacher.group)}
        onGroupChange={handleGroupChange}
      />
    </div>
  );
}
