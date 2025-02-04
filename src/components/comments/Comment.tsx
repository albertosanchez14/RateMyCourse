import { useLayoutEffect, useRef } from "react";

import "./Comment.css";

import { CommentCourseType } from "../../types/comments_type";
import { RatingType } from "../../types/comments_type";

import RectangleChart from "../course/RectangleChart";

interface CommentProps {
  comment: CommentCourseType;
}

export default function Comment({ comment }: CommentProps) {
  const ratingContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ratingContainerRef.current) {
      const titles = ratingContainerRef.current.getElementsByClassName(
        "course-comment-rating-title"
      );
      let maxWidth = 0;
      Array.from(titles).forEach((title) => {
        const width = title.getBoundingClientRect().width;
        if (width > maxWidth) {
          maxWidth = width;
        }
      });
      maxWidth += 20; // TODO: Ver como hacerlo mejor
      Array.from(titles).forEach((title) => {
        (title as HTMLElement).style.width = `${maxWidth}px`;
      });
    }
  }, [comment.rating]);

  return (
    <div className="course-comment-container" key={comment.id}>
      <div className="course-comment-profile-container">
        <img
          src={"/blank-profile-picture.png"}
          alt="profile"
          className="course-comment-profile"
        />
        <div>
        <span className="course-comment-profile-user">{comment.by}</span>
        <span className="course-comment-profile-date">{comment.date}</span>
        </div>
      </div>
      <div className="course-comment-description-rating">
        <div className="course-comment-description-container">
          <h3 className="title">{comment.title}</h3>
          <p>{comment.description}</p>
        </div>
        <div
          className="course-comment-rating-container"
          ref={ratingContainerRef}
        >
          {Object.keys(comment.rating).map((key) => (
            <div key={key}>
              <div className="course-comment-rating-title">
                <h4>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </h4>
              </div>
              <RectangleChart
                rating={comment.rating[key as keyof RatingType] as number}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
