import "./Course.css";

import CourseTitleSection from "./CourseTitleSection";
import CourseDescRateSection from "./CourseDescRateSection";
import CourseScheduleSection from "./CourseScheduleSection";
import CourseCommentSection from "./CourseCommentSection";

import { useCourse } from "../../hooks/useCourse";

export default function Course() {
  // Load course data now from folder data
  const { data, isLoading, error } = useCourse();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  const uniqueTeachers = new Map();
  data.teacher.forEach((teacher) => {
    uniqueTeachers.set(teacher.lead_teacher.id, teacher.lead_teacher);
    uniqueTeachers.set(
      teacher.aggregated_group_lead_teacher.id,
      teacher.aggregated_group_lead_teacher
    );
  });
  const uniqueTeacherSet = new Set(uniqueTeachers.values());

  return (
    <>
      <div className="course-content">
        <CourseTitleSection title={data.title} degree={data.degree} />
        <CourseDescRateSection
          objectives={data.objectives}
          skills_and_learning_outcomes={data.skills_and_learning_outcomes}
          description_of_contents={data.description_of_contents}
          rating={data.rating}
        />
        <CourseScheduleSection
          teacher={data.teacher}
          schedule={data.schedule}
        />
        <CourseCommentSection
          course_id={data.code}
          professors={uniqueTeacherSet}
        />
      </div>
    </>
  );
}
