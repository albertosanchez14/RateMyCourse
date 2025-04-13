import { useEffect, useState, useRef } from "react";

import "./RectangleChart.css";

interface RectangleChartProps {
  rating: number;
}

export default function RectangleChart({ rating }: RectangleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [targetWidth, setTargetWidth] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container_width = containerRef.current.clientWidth;
    const width_ratio = rating / 5;
    setTargetWidth(container_width * width_ratio);
    
    // Increment the key to force animation to restart
    setAnimationKey(prev => prev + 1);
    
    // Handle window resize events
    const handleResize = () => {
      if (containerRef.current) {
        setTargetWidth(containerRef.current.clientWidth * width_ratio);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rating]);

  return (
    <div className="rectangle-chart">
      <div className="rectangle-chart-container" ref={containerRef}>
        <div
          key={animationKey}
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
