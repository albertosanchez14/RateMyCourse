import { useEffect, useRef } from "react";

import "./SemiCircleChart.css";

interface SemiCircleChartProps {
  rating: number;
}

export default function SemiCircleChart({ rating }: SemiCircleChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate the rotation angle based on the rating (assuming rating is out of 5)
  const angle = (rating / 5) * 180;

  // Convert rating to percentage (0-100) for display
  const ratingPercentage = rating * 20;
  // Calculate needle rotation based on rating (0-100)
  const needleRotation = (ratingPercentage / 100) * 180 + 180;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.font = "14px Trebuchet MS";
    ctx.fillStyle = "#aaaaaa";
    ctx.fillText("300", 60, 218);

    ctx.font = "14px Trebuchet MS";
    ctx.fillStyle = "#aaaaaa";
    ctx.fillText("850", 280, 218);

    if (ctx) {
      // drawArcShadow   x    y   rad sAng eAng clockwise  line    fill
      drawArcShadow(180, 200, 100, 0, 180, true, "#eeeeee", "white");

      function drawArcShadow(
        xPos: number,
        yPos: number,
        radius: number,
        startAngle: number,
        endAngle: number,
        clockwise: boolean | undefined,
        lineColor: string | CanvasGradient | CanvasPattern,
        fillColor: string | CanvasGradient | CanvasPattern
      ) {
        const startAngle_l = startAngle * (Math.PI / 180);
        const endAngle_l = endAngle * (Math.PI / 180);

        const radius_l = radius;

        if (!ctx) return;
        ctx.strokeStyle = lineColor;
        ctx.fillStyle = fillColor;
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.arc(xPos, yPos, radius_l, startAngle_l, endAngle_l, clockwise);
        ctx.fill();
        ctx.stroke();
      }

      // drawArc   x    y   rad sAng eAng clockwise  line    fill
      drawArc(180, 200, 110, 0, 180, true, "#c1634a", "rgba(255, 255, 255, 0)");
      drawArc(180, 200, 110, 0, 263, true, "#ab5741", "rgba(255, 255, 255, 0)");
      drawArc(180, 200, 110, 0, 264, true, "#e59636", "rgba(255, 255, 255, 0)");
      drawArc(180, 200, 110, 0, 288, true, "#ce8631", "rgba(255, 255, 255, 0)");
      drawArc(180, 200, 110, 0, 289, true, "#e8d932", "rgba(255, 255, 255, 0)");
      drawArc(180, 200, 110, 0, 302, true, "#d0c52d", "rgba(255, 255, 255, 0)");
      drawArc(180, 200, 110, 0, 303, true, "#aecd9c", "rgba(255, 255, 255, 0)");
      drawArc(180, 200, 110, 0, 320, true, "#8db872", "rgba(255, 255, 255, 0)");

      function drawArc(
        xPos: number,
        yPos: number,
        radius: number,
        startAngle: number,
        endAngle: number,
        clockwise: boolean | undefined,
        lineColor: string | CanvasGradient | CanvasPattern,
        fillColor: string | CanvasGradient | CanvasPattern
      ) {
        const startAngle_l = startAngle * (Math.PI / 180);
        const endAngle_l = endAngle * (Math.PI / 180);

        const radius_l = radius;

        if (!ctx) return;
        ctx.strokeStyle = lineColor;
        ctx.fillStyle = fillColor;
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.arc(xPos, yPos, radius_l, startAngle_l, endAngle_l, clockwise);
        ctx.fill();
        ctx.stroke();
      }
    }
  }, [angle]);

  return (
    <div className="chart-container">
      <div className="multi-graph margin">
        <div
          className="graph"
          style={
            { "--percentage": 100, "--fill": "#0077b6" } as React.CSSProperties
          }
        ></div>
        <div
          className="graph"
          style={
            { "--percentage": 75, "--fill": "#00b4d8" } as React.CSSProperties
          }
        ></div>
        <div
          className="graph"
          style={
            { "--percentage": 50, "--fill": "#90e0ef" } as React.CSSProperties
          }
        ></div>
        <div
          className="graph"
          style={
            { "--percentage": 25, "--fill": "#caf0f8" } as React.CSSProperties
          }
        ></div>

        {/* Needle element pointing to the rating */}
        <div
          className="needle animate-needle"
          style={
            {
              "--needle-rotation": `${needleRotation}deg`,
            } as React.CSSProperties
          }
        ></div>
      </div>
      {/* Rating value container - moved to be rendered last (on top) */}
      <h4 className="rating-value">{ratingPercentage}%</h4>
    </div>
  );
}
