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
    <div className="course-detail-section">
      <div className="course-detail-title-container">
        <h3 className="course-detail-title selected" onClick={handleDetailChange}>
          Course Details
        </h3>
        <h3 className="course-detail-title" onClick={handleDetailChange}>
          Groups and Teachers
        </h3>
        <h3 className="course-detail-title" onClick={handleDetailChange}>
          Requirements
        </h3>
      </div>
      <div className="course-detail-container">
        {/* Course Details */}
        {details === "Course Details" && (
          <div className="course-detail">
            <div className="course-detail-item">
              <span className="course-detail-item-subtitle">Department:</span>
              <span>{department}</span>
            </div>
            <div className="course-detail-item">
              <span className="course-detail-item-subtitle">
                Coordinating Teacher:
              </span>
              <span>{coordinating_teacher}</span>
            </div>
            <div className="course-detail-item">
              <span className="course-detail-item-subtitle">Type:</span>
              <span>{type}</span>
            </div>
            <div className="course-detail-item">
              <span className="course-detail-item-subtitle">Credits:</span>
              <span>{credits}</span>
            </div>
            <div className="course-detail-item">
              <span className="course-detail-item-subtitle">Course Year:</span>
              <span>{course_year}</span>
            </div>
            <div className="course-detail-item">
              <span className="course-detail-item-subtitle">Semester:</span>
              <span>{semester}</span>
            </div>
            <div className="course-detail-item">
              <span className="course-detail-item-subtitle">Website:</span>
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
          <div className="course-detail">
            {teacher.map((teachersInFaculty) => (
              <div
                className="faculty-detail-container"
                key={teachersInFaculty.faculty}
              >
                <h4>{teachersInFaculty.faculty}</h4>
                {teachersInFaculty.teacher.map((teacherElem) => (
                  <div
                    className="faculty-group-detail-container"
                    key={teacherElem.group}
                  >
                    <span className="course-detail-item-subtitle">
                      Group {teacherElem.group}
                    </span>
                    <div>
                      <span className="course-detail-item-subtitle">
                        Lead Teacher:
                      </span>
                      <span>{teacherElem.lead_teacher.name}</span>
                    </div>
                    {teacherElem.aggregated_group_lead_teacher && (
                      <div>
                        <span className="course-detail-item-subtitle">
                          Aggregated Teacher:
                        </span>
                        <span>
                          {teacherElem.aggregated_group_lead_teacher.name}
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
          <div className="course-detail">
            {requirements.map((req, index) => (
              <div className="course-requirement-container" key={index}>
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
