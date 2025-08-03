import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Calendar from "../../components/calendar/Calendar";
import GroupSelector from "../../components/calendar/GroupSelector";

import { FREventType } from "../../types/course";

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
  const tabVariants = {
    active: {
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
    inactive: {
      opacity: 0.3,
      transition: { duration: 0.3 },
    },
  };

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
    <div className="flex flex-col gap-6 border-t border-[#f0f0f0] px-4 sm:px-0">
      <div className="flex flex-row gap-2 sm:gap-6 overflow-x-auto scrollbar-hide">
        {schedule.map((facultySchedule) => (
          <motion.h3
            className="text-base sm:text-lg font-semibold m-2 cursor-pointer whitespace-nowrap flex-shrink-0"
            onClick={handleChangeFaculty}
            key={facultySchedule.faculty}
            variants={tabVariants}
            animate={selectedFaculty === facultySchedule.faculty ? "active" : "inactive"}
            whileHover={{ scale: 1.05, opacity: 1 }}
          >
            {facultySchedule.faculty}
          </motion.h3>
        ))}
      </div>
      <div className="flex flex-row items-start w-full">
        <Calendar events={filteredEvents} />
        <div className="hidden md:block">
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
    </div>
  );
}
