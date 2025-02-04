import React, { useState } from "react";

import "./CommentSection.css";

import { useComments } from "../../hooks/useComents";
import { CommentCourseType } from "../../types/comments_type";

import Comment from "./Comment";

interface CommentSectionProps {
  course_id: number;
}

export default function CommentSection({ course_id }: CommentSectionProps) {
  // Load comments data now from folder data
  const { data, isLoading, error } = useComments(course_id);
  const [commentsType, setCommentsType] = useState<"course" | "professor">(
    "course"
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

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
        <div className="course-comments-list-container">
          {data.map((comment: CommentCourseType) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
        <div>
          <button>Load More</button>
        </div>
      </div>
    </div>
  );
}
