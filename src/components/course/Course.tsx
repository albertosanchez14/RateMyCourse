import { useState, useEffect } from "react";

import "./Course.css";

import Header from "../navigation/Header";
import Calendar from "../calendar/Calendar";
import SemiCircleChart from "./SemiCircleChart";
import RectangleChart from "./RectangleChart";

import { useCourse } from "../../hooks/useCourse";

export default function Course() {
  // Load course data now from folder data
  const { data, isLoading, error } = useCourse();
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (data) {
      setDescription(data.objectives);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;


  const handleDescriptionChange = (e: React.MouseEvent<HTMLHeadingElement>) => {
    // Change the selected title
    const titles = document.getElementsByClassName("course-description-title");
    for (let i = 0; i < titles.length; i++) {
      titles[i].id = "unselected";
    }
    e.currentTarget.id = "selected";
    // Change the description
    const selectedDescription = e.currentTarget.textContent;
    let newDescription = '';
    switch (selectedDescription) {
      case 'Objectives':
        newDescription = data?.objectives;
        break;
      case 'Skills and learning outcomes':
        newDescription = data?.skills_and_learning_outcomes;
        break;
      case 'Description of contents':
        newDescription = data?.description_of_contents;
        break;
      default:
        newDescription = data?.objectives;
    }
    setDescription(newDescription);
  };
  const generateDescription = (description: string) => {
    return description.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ))
  };

  return (
    <>
      <Header />
      <div className="course-content">
        <div className="course-title-container">
          <h2 className="course-title">{data?.title}</h2>
          <span className="course_degree">{data?.degree.title}</span>
        </div>

        <div className="course-description-rating-container">
          <div className="course-description-container">
            <div className="course-description-title-container">
              <h3
                className="course-description-title"
                id="selected"
                onClick={handleDescriptionChange}
              >
                Objectives
              </h3>
              <h3
                className="course-description-title"
                id="unselected"
                onClick={handleDescriptionChange}
              >
                Skills and learning outcomes
              </h3>
              <h3
                className="course-description-title"
                id="unselected"
                onClick={handleDescriptionChange}
              >
                Description of contents
              </h3>
            </div>
            <p className="course-description">
              {generateDescription(description)}
            </p>
          </div>
          <div className="course-rating-container">
            <div
              className="course-rating-type-container"
              id="course-rating-easy-container"
            >
              <h4 className="course-rating-title">Easy</h4>
              <RectangleChart />
            </div>
            <div
              className="course-rating-type-container"
              id="course-rating-useful-container"
            >
              <h4 className="course-rating-title">Useful</h4>
              <RectangleChart />
            </div>
            <div
              className="course-rating-type-container"
              id="course-rating-overall-container"
            >
              <h4>Rating (Semi-Chart)</h4>
              <SemiCircleChart />
            </div>
          </div>
        </div>

        <div className="course-schedule-container">
          <Calendar events={data?.schedule} />
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
      </div>
    </>
  );
}
