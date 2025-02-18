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
  schedule:
    | Array<{
        faculty: string;
        schedule: Array<FREventType>;
      }>
    | undefined;
  semester: number | undefined;
}

export default function CourseScheduleSection({
  teacher,
  schedule,
  semester,
}: ScheduleSectionProps) {
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  // TODO: Add functionality to change the selected faculty
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
    }
  }, [teacher]);

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

  // Handle the change of the selected groups of the faculty
  const handleGroupChange = (group: number, isChecked: boolean) => {
    setSelectedGroups((prevSelectedGroups) =>
      isChecked
        ? [...prevSelectedGroups, group]
        : prevSelectedGroups.filter((g) => g !== group)
    );
  };

  return (
    <div className="course-schedule-container">
      <Calendar
        faculty={selectedFaculty}
        events={filteredEvents}
        // TODO: Fix the semester default number
        semester={semester ?? 1}
      />
      <GroupSelector
        groups={
          teacher
            .find((t) => t.faculty === selectedFaculty)
            ?.teacher.map((t) => t.group) || []
        }
        onGroupChange={handleGroupChange}
      />
    </div>
  );
}
