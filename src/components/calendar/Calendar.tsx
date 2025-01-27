import { useState } from "react";

import "./Calendar.css";

import { EventType } from "../../types/course_type";

import Event from "./Event";

type CalendarProps = { events: Array<EventType> };
type WeekType = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export default function Calendar({ events }: CalendarProps) {
  const [rows] = useState(6);
  const [currentWeekNum, setCurrentWeekNum] = useState(1);

  const renderRows = (week: WeekType) => {
    const rowElements = [];
    for (let j = 0; j < rows; j++) {
      const hour = j * 2 + 9;
      // Find the class event that matches the current row
      const class_event = events.find(
        (event) =>
          // Same week number
          event.week === currentWeekNum &&
          // Same start hour
          new Date(event.start_time).getHours() === hour &&
          // Same day of the week
          week ===
            new Date(event.start_time).toLocaleDateString("en-US", {
              weekday: "short",
            })
      );
      if (class_event === undefined) {
        rowElements.push(
          <div key={j} className="calendar_hour">
            Row {hour}
          </div>
        );
      } else {
        rowElements.push(
          <div key={j} className="calendar_hour">
            <Event
              key={j}
              title={class_event.title}
              type={class_event.type}
              groups={class_event.groups}
              classroom={class_event.classroom}
              date={class_event.start_time}
            />
          </div>
        );
      }
    }
    return rowElements;
  };
  return (
    <div className="weekly-calendar">
      <div className="calendar_header">
        <button onClick={() => setCurrentWeekNum(currentWeekNum - 1)}>Previous</button>
        <h2>Week {currentWeekNum}</h2>
        <button onClick={() => setCurrentWeekNum(currentWeekNum + 1)}>
          Next
        </button>
      </div>
      <div className="calendar_body">
        <div className="calendar_day">
          <div className="calendar_hour">
            <h2 className="calendar_day_header">Monday</h2>
          </div>
          {renderRows("Mon")}
        </div>
        <div className="calendar_day">
          <div className="calendar_hour">
            <h2 className="calendar_day_header">Tuesday</h2>
          </div>
          {renderRows("Tue")}
        </div>
        <div className="calendar_day">
          <div className="calendar_hour">
            <h2 className="calendar_day_header">Wednesday</h2>
          </div>
          {renderRows("Wed")}
        </div>
        <div className="calendar_day">
          <div className="calendar_hour">
            <h2 className="calendar_day_header">Thurday</h2>
          </div>
          {renderRows("Thu")}
        </div>
        <div className="calendar_day">
          <div className="calendar_hour">
            <h2 className="calendar_day_header">Friday</h2>
          </div>
          {renderRows("Fri")}
        </div>
      </div>
    </div>
  );
}
