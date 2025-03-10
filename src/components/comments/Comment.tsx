import { useRef } from "react";

import { RatingType } from "../../types/comments_type";

import RectangleChart from "../charts/RectangleChart";

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

  const printableDate = new Date(date)
    .toDateString()
    .split(" ")
    .slice(1)
    .join(" ");

  return (
    <div
      className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg"
      key={id}
    >
      <div className="flex gap-2">
        <img
          src={"/blank-profile-picture.png"}
          alt="profile"
          className="w-[50px] h-[50px] rounded-full"
        />
        <div className="flex flex-col">
          <span className="font-semibold">{by}</span>
          <span className="text-gray-400 text-sm">{printableDate}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col h-full flex-[2]">
          <h3 className="font-semibold text-lg">{title}</h3>
          <span className="text-[0.95em]">{description}</span>
          {professor && (
            <div className="flex items-end h-full gap-1">
              <span className="text-gray-400 text-sm">Taught by</span>
              <a href="" className="text-[0.85em]">
                {professor}
              </a>
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 gap-3" ref={ratingContainerRef}>
          {Object.keys(rating).map(
            (key) =>
              key !== "_id" && (
                <div key={key} className="flex h-fit gap-2">
                  <div className="flex flex-1 self-center justify-end">
                    <h4 className="font-semibold">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </h4>
                  </div>
                  <div className="flex flex-2">
                    <RectangleChart
                      rating={rating[key as keyof RatingType] as number}
                    />
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
