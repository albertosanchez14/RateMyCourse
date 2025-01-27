import { useState } from "react";

import "./Course.css";

import Header from "../navigation/Header";
import Calendar from "../calendar/Calendar";

import { useCourse } from "../../hooks/useCourse";

export default function Course() {
  const [course, setCourse] = useState();
  // Load course data now from folder data
  const { data, isLoading, error } = useCourse();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;
  console.log(data);

  return (
    <>
      <Header />
      <div className="course-content">
        <div className="course-title-container">
          <h2>{data?.title}</h2>
          <p>{data?.degree.title}</p>
        </div>

        <div className="course-description-rating-container">
          <div className="course-description-container">
            <h3>Course Description</h3>
            <p>
              The Bachelor of Computer Science and Engineering (BCompScEng) is a
              four-year programme that provides students with a strong
              foundation in computer science and engineering, as well as the
              broad intellectual framework
            </p>
          </div>
          <div className="course-rating-container">
            <div className="course-rating-easy-container">
              <h4>Easy</h4>
              <p>4.5/5</p>
            </div>
            <div className="course-rating-useful-container">
              <h4>Useful</h4>
              <p>4.5/5</p>
            </div>
            <div className="course-rating-overall-container">
              <h4>Rating (Semi-Chart)</h4>
              <p>4.5/5</p>
            </div>
          </div>
        </div>

        <div className="course-schedule-container">
          <Calendar events={data?.schedule}/>
        </div>

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
            <button>
              Load More
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
