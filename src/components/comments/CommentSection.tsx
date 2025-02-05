import React, { useEffect, useState } from "react";

import "./CommentSection.css";

import {
  useCourseComments,
  useProfessorsComments,
} from "../../hooks/useComents";
import {
  CommentCourseType,
  CommentProfessorType,
  Professor,
} from "../../types/comments_type";

import Comment from "./Comment";
import ProfessorCommentCard from "./ProfessorCommentCard";

interface CommentSectionProps {
  course_id: number;
  professors: Set<Professor>;
}

export default function CommentSection({ course_id, professors }: CommentSectionProps) {
  // Load comments data now from folder data
  const [commentsType, setCommentsType] = useState<"course" | "professor">(
    "course"
  );
  const courseComments = useCourseComments(course_id);
  console.log(professors);
  // const professorComments = useProfessorsComments(professors);

  useEffect(() => {
  }, [commentsType]);

  if (courseComments.isLoading) return <div>Loading...</div>;
  if (courseComments.error)
    return <div>Error: {courseComments.error.message}</div>;
  if (!courseComments.data) return <div>No data</div>;

  // if (professorComments.isLoading) return <div>Loading...</div>;
  // if (professorComments.error)
  //   return <div>Error: {professorComments.error.message}</div>;
  // if (!professorComments.data) return <div>No data</div>;

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
    <div className="course-comments-container">
      <div className="course-comments-type-container">
        <div className="course-comments-type">
          <h3
            className="course-comments-type-title"
            id="selected"
            onClick={handleCommentsType}
          >
            Course Reviews
          </h3>
        </div>
        <div className="course-comments-type">
          <h3
            className="course-comments-type-title"
            id="unselected"
            onClick={handleCommentsType}
          >
            Profesor Reviews
          </h3>
        </div>
      </div>
      <div className="course-comments-content-container">
        <div className="course-comments-query-container">
          <select name="sortOption" className="sort-option" defaultValue="">
            <option value="" disabled>
              Sort by
            </option>
            <option value="date">Date</option>
            <option value="rating">Rating</option>
          </select>
          <select name="professor" className="professor-select" defaultValue="">
            <option value="" disabled>
              Select Professor
            </option>
            <option value="prof1">Professor 1</option>
            <option value="prof2">Professor 2</option>
          </select>
        </div>
        {/* Course Reviews */}
        {commentsType === "course" && (
          <div className="course-comments-list-container">
            {courseComments.data.map((comment: CommentCourseType) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        )}
        {/* Professor Reviews */}
        {/* {commentsType === "professor" && (
          <div className="course-professor-comments-list-container">
            {professorComments.data.map((comment: CommentProfessorType) => (
              <ProfessorCommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
}
