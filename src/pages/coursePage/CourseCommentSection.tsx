import React, { useState } from "react";

import {
  useCourseComments,
  useProfessorsComments,
} from "../../hooks/useComents";
import {
  CommentCourseType,
  CommentProfessorType,
  Professor,
} from "../../types/comments_type";

import Comment from "../../components/comments/Comment";
import ProfessorCommentCard from "../../components/comments/ProfessorCommentCard";

interface CourseCommentSectionProps {
  course_id: number;
  professors: Set<{ id?: string; name?: string } | undefined>;
}

export default function CommentSection({
  course_id,
  professors,
}: CourseCommentSectionProps) {
  // Load comments data now from folder data
  const [commentsType, setCommentsType] = useState<"course" | "professor">(
    "course"
  );
  const courseComments = useCourseComments(course_id);

  // TODO: Implement useProfessorsComments
  // const professorComments = useProfessorsComments(
  //   Array.from(professors).map((professor) => professor.id)
  // );

  if (courseComments.isLoading) return <div>Loading...</div>;
  if (courseComments.error)
    return <div>Error: {courseComments.error.message}</div>;
  if (!courseComments.data) return <div>No data</div>;

  // if (professorComments.isLoading) return <div>Loading...</div>;
  // if (professorComments.error)
  //   return <div>Error: {professorComments.error.message}</div>;
  // if (!professorComments.data) return <div>No data</div>;

  // Handle comments type
  const handleCommentsType = (e: React.MouseEvent<HTMLDivElement>) => {
    const types = document.getElementsByClassName("course-comments-type-title");
    for (let i = 0; i < types.length; i++) {
      types[i].id = "unselected";
    }
    e.currentTarget.id = "selected";
    e.currentTarget.textContent === "Course Reviews"
      ? setCommentsType("course")
      : setCommentsType("professor");
  };

  return (
    <div className="flex flex-row gap-4 border-t border-[#f0f0f0]">
      <div className="flex flex-col flex-[3] gap-4">
        <div className="flex flex-row gap-6">
          <div>
            <h3
              className={`m-2 cursor-pointer transition-opacity hover:opacity-100 ${
                commentsType === "course" ? "opacity-100" : "opacity-30"
              }`}
              onClick={handleCommentsType}
            >
              Course Reviews
            </h3>
          </div>
          <div>
            <h3
              className={`m-2 cursor-pointer transition-opacity hover:opacity-100 ${
                commentsType === "professor" ? "opacity-100" : "opacity-30"
              }`}
              onClick={handleCommentsType}
            >
              Profesor Reviews
            </h3>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-lg">
          {courseComments.data.length !== 0 && (
            <div className="flex flex-row gap-4">
              <select name="sortOption" className="sort-option" defaultValue="">
                <option value="" disabled>
                  Sort by
                </option>
                <option value="date">Date</option>
                <option value="rating">Rating</option>
              </select>
              <select
                name="professor"
                className="professor-select"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Professor
                </option>
                <option value="prof1">Professor 1</option>
                <option value="prof2">Professor 2</option>
              </select>
            </div>
          )}
          {/* Course Reviews */}
          {commentsType === "course" && (
            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-4 flex-1 empty:flex-0">
                {courseComments.data.map((comment: CommentCourseType) => (
                  <Comment
                    key={comment.id}
                    id={comment.id}
                    title={comment.title}
                    date={comment.date}
                    description={comment.description}
                    rating={comment.rating}
                    by={comment.by}
                    professor={comment.professor}
                  />
                ))}
              </div>
              <div className="flex flex-col h-fit w-60 gap-4 p-4 rounded-lg border border-[#e0e0e0]">
                <h3 className="m-0">Share Your Experience!</h3>
                <div className="flex flex-row justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value}>
                      <label>
                        {value}
                        <input type="radio" name="rating" value={value} />
                      </label>
                    </div>
                  ))}
                </div>
                <button>Write a Review</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
