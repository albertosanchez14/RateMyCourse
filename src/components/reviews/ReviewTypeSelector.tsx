interface ReviewTypeSelectorProps {
  commentsType: "course" | "professor";
  onTypeChange: (type: "course" | "professor") => void;
}

export default function ReviewTypeSelector({
  commentsType,
  onTypeChange,
}: ReviewTypeSelectorProps) {
  return (
    <div className="flex flex-row gap-6">
      <div>
        <h3
          className={`text-lg font-semibold m-2 cursor-pointer transition-opacity hover:opacity-100 ${
            commentsType === "course" ? "opacity-100" : "opacity-30"
          }`}
          onClick={() => onTypeChange("course")}
        >
          Course Reviews
        </h3>
      </div>
      <div>
        <h3
          className={`text-lg font-semibold m-2 cursor-pointer transition-opacity hover:opacity-100 ${
            commentsType === "professor" ? "opacity-100" : "opacity-30"
          }`}
          onClick={() => onTypeChange("professor")}
        >
          Professor Reviews
        </h3>
      </div>
    </div>
  );
}
