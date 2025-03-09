import { useLayoutEffect, useRef } from "react";

import "./Comment.css";

import { RatingType } from "../../types/comments_type";

import RectangleChart from "../../pages/coursePage/RectangleChart";

interface CommentProps {
  id: number;
  title: string;
  date: string;
  description: string;
  rating: RatingType;
  by: string;
  professor?: string;
}

export default function Comment({
  id,
  title,
  date,
  description,
  rating,
  by,
  professor,
}: CommentProps) {
  const ratingContainerRef = useRef<HTMLDivElement>(null);

  // Set the width of the rating titles to be the same
  // useLayoutEffect(() => {
  //   if (ratingContainerRef.current) {
  //     const titles = ratingContainerRef.current.getElementsByClassName(
  //       "course-comment-rating-title"
  //     );
  //     let maxWidth = 0;
  //     Array.from(titles).forEach((title) => {
  //       const width = title.getBoundingClientRect().width;
  //       if (width > maxWidth) {
  //         maxWidth = width;
  //       }
  //     });
  //     maxWidth += 20; // TODO: Ver como hacerlo mejor
  //     Array.from(titles).forEach((title) => {
  //       (title as HTMLElement).style.width = `${maxWidth}px`;
  //     });
  //   }
  // }, [rating]);

  return (
    <div className="course-comment-container" key={id}>
      <div className="course-comment-profile-container">
        <img
          src={"/blank-profile-picture.png"}
          alt="profile"
          className="course-comment-profile"
        />
        <div>
          <span className="course-comment-profile-user">{by}</span>
          <span className="course-comment-profile-date">{date}</span>
        </div>
      </div>
      <div className="course-comment-description-rating">
        <div className="course-comment-description-container">
          <h3 className="title">{title}</h3>
          <span>{description}</span>
            {professor && (
            <div className="professor">
              <span className="professor">Taught by</span>
              <a href="">{professor}</a>
            </div>
            )}
        </div>
        <div
          className="course-comment-rating-container"
          ref={ratingContainerRef}
        >
          {Object.keys(rating).map((key) => (
            <div key={key}>
              <div className="course-comment-rating-title">
                <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
              </div>
              <RectangleChart
                rating={rating[key as keyof RatingType] as number}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
