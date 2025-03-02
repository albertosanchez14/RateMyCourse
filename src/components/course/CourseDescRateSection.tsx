import { useState, useRef, useEffect, useLayoutEffect } from "react";

import RectangleChart from "./RectangleChart";
import SemiCircleChart from "./SemiCircleChart";

import { RatingType } from "../../types/comments_type";

interface CourseDescRateSectionProps {
  objectives: string | undefined;
  skills_and_learning_outcomes: string | undefined;
  description_of_contents: string | undefined;
  rating: RatingType | undefined;
}

export default function CourseDescRateSection({
  objectives,
  skills_and_learning_outcomes,
  description_of_contents,
  rating,
}: CourseDescRateSectionProps) {
  const [description, setDescription] = useState("");
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [maxDescriptionHeight, setMaxDescriptionHeight] = useState(0);
  const descriptionTitleContRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);
  const ratingContainerRef = useRef<HTMLDivElement>(null);

  // Eliminate the _id field from the rating object
  const [modifiedRating, setModifiedRating] = useState<RatingType | undefined>(rating);
  useEffect(() => {
    if (rating) {
      const newRating = { ...rating };
      console.log(newRating);
      delete newRating._id;
      setModifiedRating(newRating);
    }
  }, [rating]);
  // Set the description to the first one
  useEffect(() => {
    if (objectives) {
      setDescription(objectives);
    } else if (skills_and_learning_outcomes) {
      setDescription(skills_and_learning_outcomes);
    } else if (description_of_contents) {
      setDescription(description_of_contents);
    }
  }, [objectives, skills_and_learning_outcomes, description_of_contents]);
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
        newDescription = objectives || "";
        break;
      case "Skills and learning outcomes":
        newDescription = skills_and_learning_outcomes || "";
        break;
      case "Description of contents":
        newDescription = description_of_contents || "";
        break;
      default:
        newDescription = objectives || "";
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

  return (
    <div className="course-description-rating-container">
      <div className="course-description-container">
        <div
          className="course-description-title-container"
          ref={descriptionTitleContRef}
        >
          {objectives && (
            <h3
              className="course-description-title"
              id="selected"
              onClick={handleDescriptionChange}
            >
              Objectives
            </h3>
          )}
          {skills_and_learning_outcomes && (
            <h3
              className="course-description-title"
              id="unselected"
              onClick={handleDescriptionChange}
            >
              Skills and learning outcomes
            </h3>
          )}
          {description_of_contents && (
            <h3
              className="course-description-title"
              id="unselected"
              onClick={handleDescriptionChange}
            >
              Description of contents
            </h3>
          )}
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
        {modifiedRating &&
          Object.entries(modifiedRating).map(([key, value]) => (
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
  );
}
