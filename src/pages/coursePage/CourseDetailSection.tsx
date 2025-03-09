import { useState } from "react";
import { DBTeacherType } from "../../types/course_type";

interface CourseDetailSectionProps {
  type: string;
  department: string;
  credits: number;
  course_year?: number;
  semester?: number;
  coordinating_teacher: string;
  website: string;
  requirements: string[];
  teacher: Array<DBTeacherType>;
}

export default function CourseDetailSection({
  type,
  department,
  credits,
  course_year,
  semester,
  coordinating_teacher,
  website,
  requirements,
  teacher,
}: CourseDetailSectionProps) {
  const [details, setDetails] = useState("Course Details");

  const printTeacher = (name: string) => {
    return name
      .split(",")
      .map((x) => x.trim())
      .reverse()
      .join(" ");
  };

  const handleDetailChange = (e: React.MouseEvent<HTMLHeadingElement>) => {
    setDetails(e.currentTarget.innerText);
    e.currentTarget.classList.add("selected");
    const siblings = e.currentTarget.parentElement?.children;
    if (siblings) {
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i] !== e.currentTarget) {
          siblings[i].classList.remove("selected");
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 border-t border-[#f0f0f0]">
      <div className="flex flex-row gap-6">
        <h3
          className={`m-2 cursor-pointer opacity-30 transition-colors hover:opacity-100 ${
            details === "Course Details" ? "cursor-auto opacity-100" : ""
          }`}
          onClick={handleDetailChange}
        >
          Course Details
        </h3>
        {teacher.length !== 0 && (
          <h3
            className={` m-2 cursor-pointer opacity-30 transition-colors hover:opacity-100 ${
              details === "Groups and Teachers" ? "cursor-auto opacity-100" : ""
            }`}
            onClick={handleDetailChange}
          >
            Groups and Teachers
          </h3>
        )}
        {requirements.length !== 0 && (
          <h3
            className={`m-2 cursor-pointer opacity-30 transition-colors hover:opacity-100 ${
              details === "Requirements" ? "cursor-auto opacity-100" : ""
            }`}
            onClick={handleDetailChange}
          >
            Requirements
          </h3>
        )}
      </div>
      <div className="course-detail-container">
        {/* Course Details */}
        {details === "Course Details" && (
          <div className="flex flex-col gap-2">
            {department && (
              <div className="flex flex-row">
                <span className="font-bold mr-2">Department:</span>
                <span>{department}</span>
              </div>
            )}
            {coordinating_teacher && (
              <div className="flex flex-row">
                <span className="font-bold mr-2">Coordinating Teacher:</span>
                <span>{printTeacher(coordinating_teacher)}</span>
              </div>
            )}
            <div className="flex flex-row">
              <span className="font-bold mr-2">Type:</span>
              <span>{type}</span>
            </div>
            <div className="flex flex-row">
              <span className="font-bold mr-2">Credits:</span>
              <span>{credits}</span>
            </div>
            <div className="flex flex-row">
              <span className="font-bold mr-2">Course Year:</span>
              <span>{course_year}</span>
            </div>
            <div className="flex flex-row">
              <span className="font-bold mr-2">Semester:</span>
              <span>{semester}</span>
            </div>
            <div className="flex flex-row">
              <span className="font-bold mr-2">Website:</span>
              <span>
                <a href={website} target="_blank" rel="noreferrer">
                  {website}
                </a>
              </span>
            </div>
          </div>
        )}
        {/* Groups and Teachers */}
        {details === "Groups and Teachers" && (
          <div className="flex flex-col gap-2">
            {teacher.map((teachersInFaculty) => (
              <div
                className="flex flex-col gap-2"
                key={teachersInFaculty.faculty}
              >
                <h4 className="my-0">{teachersInFaculty.faculty}</h4>
                {teachersInFaculty.teacher.map((teacherElem) => (
                  <div className="flex flex-col pl-4" key={teacherElem.group}>
                    <span className="font-bold">Group {teacherElem.group}</span>
                    <div className="pl-4">
                      <span className="font-bold mr-2">Lead Teacher:</span>
                      <span>{printTeacher(teacherElem.lead_teacher.name)}</span>
                    </div>
                    {teacherElem.aggregated_group_lead_teacher && (
                      <div className="pl-4">
                        <span className="font-bold mr-2">
                          Aggregated Teacher:
                        </span>
                        <span>
                          {printTeacher(
                            teacherElem.aggregated_group_lead_teacher.name
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {/* Requirements */}
        {details === "Requirements" && (
          <div className="flex flex-col gap-2">
            {requirements.map((req, index) => (
              <div className="flex flex-row" key={index}>
                <span> - </span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
