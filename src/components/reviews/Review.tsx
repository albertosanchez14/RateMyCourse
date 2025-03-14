import { useRef } from "react";
import { MdOutlineEdit } from "react-icons/md";

import { useAuth } from "../../hooks/useAuth";
import { RatingType } from "../../types/reviews";

import RectangleChart from "../charts/RectangleChart";

interface ReviewProps {
  id: string;
  title: string;
  date: string;
  description: string;
  rating: RatingType;
  by: string;
  professor?: string;
  onEdit?: () => void;
}

export default function Review({
  id,
  title,
  date,
  description,
  rating,
  by,
  professor,
  onEdit,
}: ReviewProps) {
  const { user } = useAuth();
  const ratingContainerRef = useRef<HTMLDivElement>(null);

  const printableDate = new Date(date)
    .toDateString()
    .split(" ")
    .slice(1)
    .join(" ");

  return (
    <div
      className="flex flex-col gap-6 p-4 bg-white border border-gray-200 rounded-xl
               shadow-sm hover:shadow-md transition-all duration-300"
      key={`review-${id}`}
      id={`review-${id}`}
    >
      {/* Profile Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={"/blank-profile-picture.png"}
              alt="profile"
              className="w-12 h-12 rounded-full border-2 border-gray-100 shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
              {by}
            </span>
            <span className="text-gray-400 text-sm">{printableDate}</span>
          </div>
        </div>
        {user && user.username === by && (
          <button
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <MdOutlineEdit size={25}/>
          </button>
        )}
      </div>

      {/* Comment Section */}
      <div className="flex flex-col h-full flex-[2] space-y-3">
        <h3 className="font-bold text-xl text-gray-800 mb-0.5">{title}</h3>
        <div className="flex gap-2">
          <div className="flex flex-col h-full flex-[2] space-y-3">
            <p className="text-gray-600 leading-relaxed text-[0.95rem]">
              {description}
            </p>
          </div>
          <div
            className="flex flex-col flex-1 gap-4 rounded-lg"
            ref={ratingContainerRef}
          >
            {Object.keys(rating).map(
              (key) =>
                key !== "_id" && (
                  <div key={key} className="flex items-center gap-3 group">
                    <div className="flex flex-1 justify-end">
                      <h4 className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </h4>
                    </div>
                    <div className="flex flex-[2]">
                      <RectangleChart
                        rating={rating[key as keyof RatingType] as number}
                      />
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
        {professor && (
          <div className="flex items-center h-fit gap-2">
            <span className="text-gray-400 text-sm">Taught by</span>
            <a
              href=""
              className="text-blue-500 hover:text-blue-700 text-sm transition-colors"
            >
              {professor}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
