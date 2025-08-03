import { useState, useRef, useEffect } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

import RectangleChart from "../../components/charts/RectangleChart";
import SemiCircleChart from "../../components/charts/SemiCircleChart";

import { RatingType } from "../../types/reviews";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContentTruncated, setIsContentTruncated] = useState(false);
  const MAX_HEIGHT = 390;
  // Animation variants
  const tabVariants = {
    active: {
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
    inactive: {
      opacity: 0.3,
      transition: { duration: 0.3 },
    },
  };
  const descriptionVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };
  const [modifiedRating, setModifiedRating] = useState<RatingType | undefined>(
    rating
  );
  useEffect(() => {
    if (rating) {
      const newRating = { ...rating };
      delete newRating._id;
      // Ensure all rating values are integers
      Object.keys(newRating).forEach((key) => {
        if (typeof newRating[key] === "number") {
          newRating[key] = Number((newRating[key] as number).toFixed(1));
        }
      });
      setModifiedRating(newRating);
    } else {
      setModifiedRating(undefined);
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

  // Check if the content is truncated
  useEffect(() => {
    const checkTruncation = () => {
      const descriptionElement = descriptionRef.current;
      if (descriptionElement) {
        const isTruncated = descriptionElement.scrollHeight > MAX_HEIGHT;
        setIsContentTruncated(isTruncated);
        if (!isTruncated && isExpanded) {
          setIsExpanded(false);
        }
      }
    };
    checkTruncation();
    const timeoutId = setTimeout(checkTruncation, 400);
    window.addEventListener("resize", checkTruncation);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkTruncation);
    };
  }, [description, isExpanded]);

  const handleDescriptionChange = (e: React.MouseEvent<HTMLHeadingElement>) => {
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
    <div className="flex flex-col gap-4 border-t border-[#f0f0f0] px-4 sm:px-0">
      {objectives || skills_and_learning_outcomes || description_of_contents ? (
        <>
          <div
            className="flex flex-row gap-2 sm:gap-6 overflow-x-auto scrollbar-hide"
            ref={descriptionTitleContRef}
          >
            {objectives && (
              <motion.h3
                className="text-base sm:text-lg font-semibold m-2 cursor-pointer whitespace-nowrap flex-shrink-0"
                onClick={handleDescriptionChange}
                variants={tabVariants}
                animate={description === objectives ? "active" : "inactive"}
                whileHover={{ scale: 1.05, opacity: 1 }}
              >
                Objectives
              </motion.h3>
            )}
            {skills_and_learning_outcomes && (
              <motion.h3
                className="text-base sm:text-lg font-semibold m-2 cursor-pointer whitespace-nowrap flex-shrink-0"
                onClick={handleDescriptionChange}
                variants={tabVariants}
                animate={
                  description === skills_and_learning_outcomes
                    ? "active"
                    : "inactive"
                }
                whileHover={{ scale: 1.05, opacity: 1 }}
              >
                Skills and learning outcomes
              </motion.h3>
            )}
            {description_of_contents && (
              <motion.h3
                className="text-base sm:text-lg font-semibold m-2 cursor-pointer whitespace-nowrap flex-shrink-0"
                onClick={handleDescriptionChange}
                variants={tabVariants}
                animate={
                  description === description_of_contents
                    ? "active"
                    : "inactive"
                }
                whileHover={{ scale: 1.05, opacity: 1 }}
              >
                Description of contents
              </motion.h3>
            )}
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col flex-[2]">
              <div
                className={`relative ${
                  !isExpanded
                    ? "min-h-[280px] sm:min-h-[340px] max-h-[280px] sm:max-h-[340px] overflow-hidden"
                    : ""
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={description}
                    variants={descriptionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <p
                      className="text-sm sm:text-[0.95rem] mb-0"
                      ref={descriptionRef}
                    >
                      {generateDescription(description)}
                    </p>
                  </motion.div>
                </AnimatePresence>
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                )}
              </div>
              {isContentTruncated && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-fit text-blue-600 hover:text-blue-800 
                  mt-2 flex items-center gap-1
                  border border-transparent px-2 py-2
                  text-sm sm:text-base font-medium"
                >
                  {isExpanded ? (
                    <>
                      Show less
                      <MdOutlineKeyboardArrowUp />
                    </>
                  ) : (
                    <>
                      Show more
                      <MdOutlineKeyboardArrowDown />
                    </>
                  )}
                </button>
              )}
            </div>
            {modifiedRating && (
              <div
                className="flex flex-col gap-3 mt-4 lg:mt-0 lg:h-fit lg:flex-1"
                ref={ratingContainerRef}
              >
                {/* Desktop layout (lg and above) - current layout */}
                <div className="hidden lg:flex lg:flex-col lg:gap-3">
                  {Object.entries(modifiedRating)
                    .filter(([key]) => key !== "overall")
                    .map(([key, value]) => (
                      <div
                        className="flex flex-col"
                        id={`course-rating-${key}-container`}
                        key={key}
                      >
                        <h4 className="font-semibold text-sm sm:text-base">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </h4>
                        <RectangleChart rating={value as number} />
                      </div>
                    ))}
                  {modifiedRating.overall && (
                    <div
                      className="flex flex-col items-center lg:items-start"
                      id="course-rating-overall-container"
                    >
                      <h4 className="font-semibold text-sm sm:text-base">
                        Rating
                      </h4>
                      <SemiCircleChart rating={modifiedRating.overall} />
                    </div>
                  )}
                </div>

                {/* Tablet layout (md) - rectangles in rows with semicircle on the side */}
                <div className="hidden md:flex md:flex-row lg:hidden gap-6">
                  <div className="flex flex-col gap-3 flex-1">
                    {Object.entries(modifiedRating)
                      .filter(([key]) => key !== "overall")
                      .map(([key, value]) => (
                        <div
                          className="flex flex-col"
                          id={`course-rating-${key}-container`}
                          key={key}
                        >
                          <h4 className="font-semibold text-sm sm:text-base">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </h4>
                          <RectangleChart rating={value as number} />
                        </div>
                      ))}
                  </div>
                  {modifiedRating.overall && (
                    <div
                      className="flex flex-col items-center justify-center"
                      id="course-rating-overall-container"
                    >
                      <h4 className="font-semibold text-sm sm:text-base">
                        Rating
                      </h4>
                      <SemiCircleChart rating={modifiedRating.overall} />
                    </div>
                  )}
                </div>

                {/* Mobile layout (sm and below) - rectangles first, then semicircle below */}
                <div className="flex flex-col gap-3 md:hidden">
                  {Object.entries(modifiedRating)
                    .filter(([key]) => key !== "overall")
                    .map(([key, value]) => (
                      <div
                        className="flex flex-col"
                        id={`course-rating-${key}-container`}
                        key={key}
                      >
                        <h4 className="font-semibold text-sm sm:text-base">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </h4>
                        <RectangleChart rating={value as number} />
                      </div>
                    ))}
                  {modifiedRating.overall && (
                    <div
                      className="flex flex-col items-center mt-2"
                      id="course-rating-overall-container"
                    >
                      <h4 className="font-semibold text-sm sm:text-base mb-2 lg:mb-0">
                        Rating
                      </h4>
                      <SemiCircleChart rating={modifiedRating.overall} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="flex flex-col flex-1 gap-3">
            {modifiedRating &&
              Object.entries(modifiedRating)
                .filter(([key]) => key !== "overall")
                .map(([key, value]) => (
                  <div
                    className="flex flex-col"
                    id={`course-rating-${key}-container`}
                    key={key}
                  >
                    <h4 className="font-semibold text-sm sm:text-base">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </h4>
                    <RectangleChart rating={value as number} />
                  </div>
                ))}
          </div>
          <div className="flex flex-col flex-1 justify-center items-center mt-4 lg:mt-0">
            {modifiedRating && modifiedRating.overall && (
              <div className="flex flex-col items-center">
                <h4 className="font-semibold text-sm sm:text-base">Rating</h4>
                <SemiCircleChart rating={modifiedRating.overall} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
