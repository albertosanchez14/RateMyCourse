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
    <div className="flex flex-col self-start mt-4">
      <div className="flex flex-row items-end gap-2">
        <h1 className="text-5xl font-semibold mb-0">{title}</h1>
        <p className="text-2xl mb-0">({course})</p>
      </div>
      <span className="mt-2">{degree.title}</span>
    </div>
  );
}
