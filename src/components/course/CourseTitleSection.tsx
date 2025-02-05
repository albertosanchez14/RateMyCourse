import { DegreeType } from "../../types/course_type";

interface CourseTitleSectionProps {
  title: string;
  degree: DegreeType;
}

export default function CourseTitleSection({
  title,
  degree,
}: CourseTitleSectionProps) {
  return (
    <div className="course-title-container">
      <h1 className="course-title">{title}</h1>
      <span className="course_degree">{degree.title}</span>
    </div>
  );
}
