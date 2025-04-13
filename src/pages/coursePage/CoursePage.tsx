import { useParams } from "react-router-dom";

import { useCourse } from "../../hooks/useCourse";

import CourseTitleSection from "./CourseTitleSection";
import CourseDescRateSection from "./CourseDescRateSection";
import CourseScheduleSection from "./CourseScheduleSection";
import CourseDetailSection from "./CourseDetailSection";
import CourseReviewSection from "./CourseReviewSection";

import LoadingSpinnerScreen from "../../components/loading/LoadingSpinnerScreen";

export default function CoursePage() {
  // Get course_code from URL
  const { courseId } = useParams();
  // Load course data now from folder data
  const { data, isLoading, error } = useCourse(courseId ?? "");

  if (isLoading) return <LoadingSpinnerScreen />;
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
    <div className="flex flex-col gap-8 px-4">
      <CourseTitleSection
        id={data._id}
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
      <CourseDetailSection
        type={data.type}
        department={data.department}
        credits={data.credits}
        course_year={data.course_year}
        semester={data.semester}
        coordinating_teacher={data.coordinating_teacher}
        website={data.website}
        requirements={data.requirements}
        teacher={data.teacher}
      />
      <CourseReviewSection courseId={data._id} professors={uniqueTeachers} />
    </div>
  );
}
