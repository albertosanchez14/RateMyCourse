import { useEffect, useState, useRef } from "react";

import "./RectangleChart.css";

export default function RectangleChart() {
  const [rating, setRating] = useState(2);
  // Calculate the width based on the rating (assuming rating is out of 5)
  const width = (rating / 5) * 300;

  const [targetWidth, setTargetWidth] = useState(width);

  useEffect(() => {
    setTargetWidth(width);
  }, [width]);

  return (
    <div className="rectangle-chart">
      <div className="rectangle-chart-container">
        <div
          className="rectangle-chart-bar"
          style={
            { "--target-width": `${targetWidth}px` } as React.CSSProperties
          }
        ></div>
      </div>
      <span>{rating * 20}%</span>
    </div>
  );
}
