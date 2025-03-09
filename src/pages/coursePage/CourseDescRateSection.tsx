import { useState, useRef, useEffect } from "react";

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
  const descriptionTitleContRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ratingContainerRef = useRef<HTMLDivElement>(null);

  // Eliminate the _id field from the rating object
  const [modifiedRating, setModifiedRating] = useState<RatingType | undefined>(
    rating
  );
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

  const handleDescriptionChange = (e: React.MouseEvent<HTMLHeadingElement>) => {
    // Change the description based on the clicked title
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

  return (
    <div className="flex flex-col gap-4 border-t border-[#f0f0f0]">
      <div className="flex flex-row gap-6" ref={descriptionTitleContRef}>
        {objectives && (
            <h3
            className={`text-lg font-semibold m-2 cursor-pointer transition-opacity ${
              description === objectives
              ? "opacity-100"
              : "opacity-30 hover:opacity-100"
            }`}
            onClick={handleDescriptionChange}
            >
            Objectives
            </h3>
        )}
        {skills_and_learning_outcomes && (
          <h3
            className={`text-lg font-semibold m-2 cursor-pointer transition-opacity ${
              description === skills_and_learning_outcomes
                ? "opacity-100"
                : "opacity-30 hover:opacity-100"
            }`}
            onClick={handleDescriptionChange}
          >
            Skills and learning outcomes
          </h3>
        )}
        {description_of_contents && (
          <h3
            className={`text-lg font-semibold m-2 cursor-pointer transition-opacity ${
              description === description_of_contents
                ? "opacity-100"
                : "opacity-30 hover:opacity-100"
            }`}
            onClick={handleDescriptionChange}
          >
            Description of contents
          </h3>
        )}
      </div>
      <div className="flex flex-row gap-6">
        <div className="flex flex-col flex-[2]">
          <p className="h-full text-[0.95rem] mb-0" ref={descriptionRef}>
            {generateDescription(description)}
          </p>
        </div>
        <div className="flex flex-col h-fit flex-1 gap-3" ref={ratingContainerRef}>
          {modifiedRating &&
            Object.entries(modifiedRating).map(([key, value]) => (
              <div
                className="flex flex-col"
                id={`course-rating-${key}-container`}
                key={key}
              >
                <h4 className="font-semibold">
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
    </div>
  );
}
