import { DegreeType } from "../../types/course_type";

interface CourseTitleSectionProps {
  title: string;
  course: number;
  degree: DegreeType;
}

export default function CourseTitleSection({
  title,
  course,
  degree,
}: CourseTitleSectionProps) {
  return (
    <div className="course-title-container">
      <div>
        <h1 className="course-title">{title}</h1>
        <p className="course-code">({course})</p>
      </div>
      <span className="course_degree">{degree.title}</span>
    </div>
  );
}
