import React, { useState } from "react";

import "./CourseCommentSection.css";

import {
  useCourseComments,
  useProfessorsComments,
} from "../../hooks/useComents";
import {
  CommentCourseType,
  CommentProfessorType,
  Professor,
} from "../../types/comments_type";

import Comment from "../comments/Comment";
import ProfessorCommentCard from "../comments/ProfessorCommentCard";

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
    <div className="course-comments-section">
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
          {courseComments.data.length !== 0 && (
            <div className="course-comments-query-container">
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
            <div className="course-comments-content">
              <div className="course-comments-list-container">
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
              <div className="course-comments-form-container">
                <h3 className="">Share Your Experience!</h3>
                <div className="course-comments-form">
                  <div>
                    <label>
                      1<input type="radio" name="rating" value="1" />
                    </label>
                  </div>
                  <div>
                    <label>
                      2<input type="radio" name="rating" value="2" />
                    </label>
                  </div>
                  <div>
                    <label>
                      3<input type="radio" name="rating" value="3" />
                    </label>
                  </div>
                  <div>
                    <label>
                      4<input type="radio" name="rating" value="4" />
                    </label>
                  </div>
                  <div>
                    <label>
                      5<input type="radio" name="rating" value="5" />
                    </label>
                  </div>
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
