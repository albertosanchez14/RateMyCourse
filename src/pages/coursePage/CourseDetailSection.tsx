import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { DBTeacherType } from "../../types/course";

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
  const contentVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

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
        <motion.h3
          className="text-lg font-semibold m-2 cursor-pointer"
          onClick={handleDetailChange}
          variants={tabVariants}
          animate={details === "Course Details" ? "active" : "inactive"}
          whileHover={{ scale: 1.05, opacity: 1 }}
        >
          Course Details
        </motion.h3>
        {teacher.length !== 0 && (
          <motion.h3
            className="text-lg font-semibold m-2 cursor-pointer"
            onClick={handleDetailChange}
            variants={tabVariants}
            animate={details === "Groups and Teachers" ? "active" : "inactive"}
            whileHover={{ scale: 1.05, opacity: 1 }}
          >
            Groups and Teachers
          </motion.h3>
        )}
        {requirements.length !== 0 && (
          <motion.h3
            className="text-lg font-semibold m-2 cursor-pointer"
            onClick={handleDetailChange}
            variants={tabVariants}
            animate={details === "Requirements" ? "active" : "inactive"}
            whileHover={{ scale: 1.05, opacity: 1 }}
          >
            Requirements
          </motion.h3>
        )}
      </div>
      <div className="course-detail-container">
        <AnimatePresence mode="wait">
          {/* Course Details */}
          {details === "Course Details" && (
            <motion.div
              className="flex flex-col gap-2"
              key="details"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
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
                  <a
                    className="text-blue-500 hover:text-blue-700"
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {website}
                  </a>
                </span>
              </div>
            </motion.div>
          )}
          {/* Groups and Teachers */}
          {details === "Groups and Teachers" && (
            <motion.div
              className="flex flex-col gap-2"
              key="teachers-container"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {teacher.map((teachersInFaculty, facultyIndex) => (
                <div
                  className="flex flex-col gap-2"
                  key={`faculty-${teachersInFaculty.faculty || facultyIndex}`}
                >
                  <h4 className="my-0">{teachersInFaculty.faculty}</h4>
                  {teachersInFaculty.teacher.map((teacherElem, index) => (
                    <div
                      className="flex flex-col pl-4"
                      key={`faculty-${teachersInFaculty.faculty}-group-${
                        teacherElem.group || index
                      }`}
                    >
                      <span className="font-bold">
                        Group {teacherElem.group}
                      </span>
                      <div className="pl-4">
                        <span className="font-bold mr-2">Lead Teacher:</span>
                        <span>
                          {printTeacher(teacherElem.lead_teacher.name)}
                        </span>
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
            </motion.div>
          )}
          {/* Requirements */}
          {details === "Requirements" && (
            <motion.div
              className="flex flex-col gap-2"
              key={"requirements"}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {requirements.map((req, index) => (
                <div className="flex flex-row" key={index}>
                  <span> - </span>
                  <span>{req}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
