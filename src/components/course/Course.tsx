import "./Course.css";

import CourseTitleSection from "./CourseTitleSection";
import CourseDescRateSection from "./CourseDescRateSection";
import CourseScheduleSection from "./CourseScheduleSection";
import CourseCommentSection from "./CourseCommentSection";

import { useCourse } from "../../hooks/useCourse";

export default function Course() {
  // Get course_code from URL
  const url = window.location.href;
  const course_code = url.substring(url.lastIndexOf("/") + 1);
  // Load course data now from folder data
  const { data, isLoading, error } = useCourse(Number(course_code));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  const uniqueTeachers = new Set<{ id?: string; name?: string } | undefined>();
  data.teacher.forEach((teachersInFaculty) => {
    teachersInFaculty.teacher.forEach((teacherElem) => {
      uniqueTeachers.add(teacherElem.lead_teacher);
      uniqueTeachers.add(teacherElem.aggregated_group_lead_teacher);
    });
  });

  return (
    <>
      <div className="course-content">
        <CourseTitleSection
          title={data.title}
          course={data.code}
          degree={data.degree}
        />
        <CourseDescRateSection
          objectives={data.objectives}
          skills_and_learning_outcomes={data.skills_and_learning_outcomes}
          description_of_contents={data.description_of_contents}
          rating={data.rating}
        />
        {data.schedule.length > 0 && (
          <CourseScheduleSection
            teacher={data.teacher}
            schedule={data.schedule}
          />
        )}
        <CourseCommentSection
          course_id={data.code}
          professors={uniqueTeachers}
        />
      </div>
    </>
  );
}
