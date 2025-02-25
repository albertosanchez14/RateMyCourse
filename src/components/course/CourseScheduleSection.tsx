import { useEffect, useState } from "react";

import Calendar from "../calendar/Calendar";
import GroupSelector from "./GroupSelector";

import { FREventType } from "../../types/course_type";

interface ScheduleSectionProps {
  teacher: Array<{
    faculty: string;
    teacher: Array<{
      group: number;
      lead_teacher: {
        id: string | undefined;
        name: string;
      };
      aggregated_group_lead_teacher:
        | { id: string | undefined; name: string }
        | undefined;
    }>;
  }>;
  schedule: Array<{
    faculty: string;
    schedule: Array<FREventType>;
  }>;
}

export default function CourseScheduleSection({
  teacher,
  schedule,
}: ScheduleSectionProps) {
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string>(
    teacher[0].faculty
  );

  // Initialize all groups of the faculty selected
  useEffect(() => {
    if (teacher) {
      // Initialize selectedGroups with the groups of the faculty selected
      setSelectedGroups(
        teacher
          .find((t) => t.faculty === selectedFaculty)
          ?.teacher.map((t) => t.group) || []
      );
      console.log(teacher);
    }
  }, [teacher, selectedFaculty]);

  // Filter the events by faculty and groups
  const filteredEvents =
    selectedGroups.length === 0 || !schedule
      ? []
      : schedule
          // Filter the events by faculty
          .filter(
            (facultySchedules) => facultySchedules.faculty === selectedFaculty
          )
          // Filter the events by groups
          .flatMap((facultySch) =>
            facultySch.schedule.filter((event) =>
              event.groups.some((group) => selectedGroups.includes(group))
            )
          );

  // Handle the change of the selected faculty
  const handleChangeFaculty = (event: React.MouseEvent<HTMLHeadingElement>) => {
    setSelectedFaculty(event.currentTarget.innerText);
  };

  // Handle the change of the selected groups of the faculty
  const handleGroupChange = (group: number, isChecked: boolean) => {
    setSelectedGroups((prevSelectedGroups) =>
      isChecked
        ? [...prevSelectedGroups, group]
        : prevSelectedGroups.filter((g) => g !== group)
    );
  };

  return (
    <div className="course-schedule-section">
      <div className="course-description-title-container">
        {schedule.map((facultySchedule) => (
          <h3
          className={`course-schedule-title ${
            selectedFaculty === facultySchedule.faculty ? "selected" : ""
          }`}
            onClick={handleChangeFaculty}
            key={facultySchedule.faculty}
          >
            {facultySchedule.faculty}
          </h3>
        ))}
      </div>
      <div className="course-schedule-container">
        <Calendar events={filteredEvents} />
        <GroupSelector
          groups={
            teacher
              .find((t) => t.faculty === selectedFaculty)
              ?.teacher.map((t) => t.group) || []
          }
          selectedGroups={selectedGroups}
          onGroupChange={handleGroupChange}
        />
      </div>
    </div>
  );
}
