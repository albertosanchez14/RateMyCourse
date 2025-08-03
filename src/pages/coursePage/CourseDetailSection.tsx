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
    <div className="flex flex-col gap-4 border-t border-[#f0f0f0] px-4 sm:px-0">
      <div className="flex flex-row gap-2 sm:gap-6 overflow-x-auto scrollbar-hide">
        <motion.h3
          className="text-base sm:text-lg font-semibold m-2 cursor-pointer whitespace-nowrap flex-shrink-0"
          onClick={handleDetailChange}
          variants={tabVariants}
          animate={details === "Course Details" ? "active" : "inactive"}
          whileHover={{ scale: 1.05, opacity: 1 }}
        >
          Course Details
        </motion.h3>
        {teacher.length !== 0 && (
          <motion.h3
            className="text-base sm:text-lg font-semibold m-2 cursor-pointer whitespace-nowrap flex-shrink-0"
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
            className="text-base sm:text-lg font-semibold m-2 cursor-pointer whitespace-nowrap flex-shrink-0"
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
                <div className="flex flex-col sm:flex-row">
                  <span className="font-bold mr-2 text-sm sm:text-base">Department:</span>
                  <span className="text-sm sm:text-base">{department}</span>
                </div>
              )}
              {coordinating_teacher && (
                <div className="flex flex-col sm:flex-row">
                  <span className="font-bold mr-2 text-sm sm:text-base">Coordinating Teacher:</span>
                  <span className="text-sm sm:text-base">{printTeacher(coordinating_teacher)}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row">
                <span className="font-bold mr-2 text-sm sm:text-base">Type:</span>
                <span className="text-sm sm:text-base">{type}</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="font-bold mr-2 text-sm sm:text-base">Credits:</span>
                <span className="text-sm sm:text-base">{credits}</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="font-bold mr-2 text-sm sm:text-base">Course Year:</span>
                <span className="text-sm sm:text-base">{course_year}</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="font-bold mr-2 text-sm sm:text-base">Semester:</span>
                <span className="text-sm sm:text-base">{semester}</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="font-bold mr-2 text-sm sm:text-base">Website:</span>
                <span className="text-sm sm:text-base">
                  <a
                    className="text-blue-500 hover:text-blue-700 break-all"
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
                  <h4 className="my-0 text-base sm:text-lg font-semibold">{teachersInFaculty.faculty}</h4>
                  {teachersInFaculty.teacher.map((teacherElem, index) => (
                    <div
                      className="flex flex-col pl-2 sm:pl-4"
                      key={`faculty-${teachersInFaculty.faculty}-group-${
                        teacherElem.group || index
                      }`}
                    >
                      <span className="font-bold text-sm sm:text-base">
                        Group {teacherElem.group}
                      </span>
                      <div className="pl-2 sm:pl-4">
                        <span className="font-bold mr-2 text-sm sm:text-base">Lead Teacher:</span>
                        <span className="text-sm sm:text-base">
                          {printTeacher(teacherElem.lead_teacher.name)}
                        </span>
                      </div>
                      {teacherElem.aggregated_group_lead_teacher && (
                        <div className="pl-2 sm:pl-4">
                          <span className="font-bold mr-2 text-sm sm:text-base">
                            Aggregated Teacher:
                          </span>
                          <span className="text-sm sm:text-base">
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
                  <span className="text-sm sm:text-base"> - </span>
                  <span className="text-sm sm:text-base">{req}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
