import { useState, useEffect, useRef, useLayoutEffect } from "react";

import "./Course.css";

import Header from "../navigation/Header";
import CourseTitleSection from "./CourseTitleSection";
import Calendar from "../calendar/Calendar";

import SemiCircleChart from "./SemiCircleChart";
import RectangleChart from "./RectangleChart";
import GroupSelector from "./GroupSelector";
import CommentSection from "../comments/CommentSection";

import { useCourse } from "../../hooks/useCourse";

export default function Course() {
  // Load course data now from folder data
  const { data, isLoading, error } = useCourse();
  const [description, setDescription] = useState("");
  const [maxDescriptionHeight, setMaxDescriptionHeight] = useState(0);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ratingContainerRef = useRef<HTMLDivElement>(null);
  const descriptionTitleContRef = useRef<HTMLDivElement>(null);
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);
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
    if (!descriptionRef.current) return;
    if (!ratingContainerRef.current) return;
    if (!descriptionTitleContRef.current) return;
    // Set the max height of the description
    const marginTop = parseFloat(
      window.getComputedStyle(descriptionRef.current).marginTop
    );
    let maxHeight =
      ratingContainerRef.current.clientHeight -
      descriptionTitleContRef.current.clientHeight -
      marginTop;
    // Check if the description is overflowing
    if (
      descriptionRef.current.clientHeight < descriptionRef.current.scrollHeight
    ) {
      console.log("overflowing");
      setIsOverflowing(true);
      const loadMoreButtonHeight = loadMoreButtonRef.current
        ? loadMoreButtonRef.current.offsetHeight
        : 0;
      maxHeight -= loadMoreButtonHeight;
    } else {
      setIsOverflowing(false);
    }
    descriptionRef.current.style.maxHeight = `${maxHeight}px`;
    setMaxDescriptionHeight(maxHeight);
  }, [descriptionRef, description]);
  // Adjust maxHeight after isOverflowing state is set
  useLayoutEffect(() => {
    if (isOverflowing && loadMoreButtonRef.current && descriptionRef.current) {
      const loadMoreButtonHeight = loadMoreButtonRef.current.offsetHeight;
      const currentMaxHeight = parseFloat(
        descriptionRef.current.style.maxHeight
      );
      descriptionRef.current.style.maxHeight = `${
        currentMaxHeight - loadMoreButtonHeight
      }px`;
    }
  }, [isOverflowing]);

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
    if (!descriptionRef.current || !loadMoreButtonRef.current) return;
    if (descriptionRef.current.className === "course-description") {
      descriptionRef.current.className = "course-description-expanded";
      descriptionRef.current.style.maxHeight = "none";
      e.currentTarget.textContent = "Show Less";
    } else {
      descriptionRef.current.className = "course-description";
      descriptionRef.current.style.maxHeight = `${
        maxDescriptionHeight - loadMoreButtonRef.current.clientHeight
      }px`;
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
  const filteredEvents =
    selectedGroups.length === 0
      ? []
      : data?.schedule.filter((event) =>
          event.groups.some((group: number) => selectedGroups.includes(group))
        );

  const uniqueTeachers = new Map();
  data.teacher.forEach((teacher) => {
    uniqueTeachers.set(teacher.lead_teacher.id, teacher.lead_teacher);
    uniqueTeachers.set(
      teacher.aggregated_group_lead_teacher.id,
      teacher.aggregated_group_lead_teacher
    );
  });
  const uniqueTeacherSet = new Set(uniqueTeachers.values());

  return (
    <>
      <Header />
      <div className="course-content">
        <CourseTitleSection title={data.title} degree={data.degree} />
        <CourseDescRateSection /> 

        <div className="course-description-rating-container">
          <div className="course-description-container">
            <div
              className="course-description-title-container"
              ref={descriptionTitleContRef}
            >
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
                ref={loadMoreButtonRef}
              >
                Load More
              </button>
            )}
          </div>
          <div className="course-rating-container" ref={ratingContainerRef}>
            {Object.entries(data.rating).map(([key, value]) => (
              <div
                className="course-rating-type-container"
                id={`course-rating-${key}-container`}
                key={key}
              >
                <h4 className="course-rating-title">
                  {key === "overall"
                    ? "Rating"
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </h4>
                {key === "overall" ? (
                  <SemiCircleChart rating={value as number} />
                ) : (
                  <RectangleChart rating={value as number} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="course-schedule-container">
          <Calendar events={filteredEvents} />
          <GroupSelector
            groups={data.teacher.map((teacher) => teacher.group)}
            onGroupChange={handleGroupChange}
          />
        </div>

        <CommentSection course_id={data.code} professors={uniqueTeacherSet} />
      </div>
    </>
  );
}
