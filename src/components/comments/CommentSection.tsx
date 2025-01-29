import React from "react";

import { useComments } from "../../hooks/useComents";
import { CommentCourseType } from "../../types/comments_type";

interface CommentSectionProps {
  course_id: number;
}

export default function CommentSection({ course_id }: CommentSectionProps) {
  // Load comments data now from folder data
  const { data, isLoading, error } = useComments(course_id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  console.log(data);

  return (
    <div className="course-comments-container">
      <div className="course-comments-type-container">
        <div>
          <h3>Comments</h3>
        </div>
        <div>
          <h3>Profesor</h3>
        </div>
      </div>
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
        <div className="course-comment-container">
          <p>Comment 1</p>
          <p>Rating: 4.5/5</p>
          <p>By: Student 1</p>
        </div>
        <div className="course-comment-container">
          <p>Comment 2</p>
          <p>Rating: 4.5/5</p>
          <p>By: Student 2</p>
        </div>
        <div className="course-comment-container">
          <p>Comment 3</p>
          <p>Rating: 5/5</p>
          <p>By: Student 3</p>
        </div>
      </div>
      <div>
        <button>Load More</button>
      </div>
    </div>
  );
}
