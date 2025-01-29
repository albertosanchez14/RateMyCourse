import { useState, useEffect, useRef } from "react";

import "./Course.css";

import Header from "../navigation/Header";
import Calendar from "../calendar/Calendar";

import SemiCircleChart from "./SemiCircleChart";
import RectangleChart from "./RectangleChart";
import GroupSelector from "./GroupSelector";

import { useCourse } from "../../hooks/useCourse";

export default function Course() {
  // Load course data now from folder data
  const { data, isLoading, error } = useCourse();
  const [description, setDescription] = useState("");
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

  // Set the description to the first one
  useEffect(() => {
    if (data) {
      setDescription(data.objectives);
      setSelectedGroups(data.teacher.map((teacher) => teacher.group)); // Initialize selectedGroups with all group numbers
    }
  }, [data]);
  // Check if the description is overflowing
  useEffect(() => {
    if (descriptionRef.current) {
      if (
        descriptionRef.current.scrollHeight >
        descriptionRef.current.clientHeight
      ) {
        setIsOverflowing(true);
      } else {
        setIsOverflowing(false);
      }
    }
  }, [descriptionRef, description]);

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
    let newDescription = "";
    switch (selectedDescription) {
      case "Objectives":
        newDescription = data?.objectives;
        break;
      case "Skills and learning outcomes":
        newDescription = data?.skills_and_learning_outcomes;
        break;
      case "Description of contents":
        newDescription = data?.description_of_contents;
        break;
      default:
        newDescription = data?.objectives;
    }
    if (!descriptionRef.current) return;
    descriptionRef.current.className = "course-description";
    const loadMoreButton = document.getElementsByClassName(
      "course-description-load"
    )[0] as HTMLButtonElement | undefined;
    if (loadMoreButton) loadMoreButton.textContent = "Load More";
    setDescription(newDescription);
  };
  const generateDescription = (description: string) => {
    return description.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const handleLoadMoreDesc = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!descriptionRef.current) return;
    if (descriptionRef.current.className === "course-description") {
      descriptionRef.current.className = "course-description-expanded";
      e.currentTarget.textContent = "Show Less";
    } else {
      descriptionRef.current.className = "course-description";
      e.currentTarget.textContent = "Load More";
    }
  };

  const handleGroupChange = (group: number, isChecked: boolean) => {
    setSelectedGroups((prevSelectedGroups) =>
      isChecked
        ? [...prevSelectedGroups, group]
        : prevSelectedGroups.filter((g) => g !== group)
    );
  };
  const filteredEvents = selectedGroups.length === 0
    ? []
    : data?.schedule.filter((event) =>
        event.groups.some((group: number) => selectedGroups.includes(group))
      );
  console.log(filteredEvents);

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
            <p className="course-description" ref={descriptionRef}>
              {generateDescription(description)}
            </p>
            {isOverflowing && (
              <button
                className="course-description-load"
                onClick={handleLoadMoreDesc}
              >
                Load More
              </button>
            )}
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
              <h4>Rating</h4>
              <SemiCircleChart />
            </div>
          </div>
        </div>

        <div className="course-schedule-container">
          <Calendar events={filteredEvents} />
          <GroupSelector
            groups={data.teacher.map((teacher) => teacher.group)}
            onGroupChange={handleGroupChange}
          />
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
