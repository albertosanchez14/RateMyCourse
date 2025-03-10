import { useEffect, useState, useRef } from "react";

import "./RectangleChart.css";

interface RectangleChartProps {
  rating: number;
}

export default function RectangleChart( { rating }: RectangleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Calculate the width based on the rating (assuming rating is out of 5)
  const width_ratio = (rating / 5);
  const [targetWidth, setTargetWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container_width = containerRef.current.clientWidth;
    setTargetWidth(container_width * width_ratio);
  }, []);

  return (
    <div className="rectangle-chart">
      <div className="rectangle-chart-container" ref={containerRef}>
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
