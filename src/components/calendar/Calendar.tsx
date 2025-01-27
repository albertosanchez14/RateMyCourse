import { useState } from "react";

import "./Calendar.css";

import { EventType } from "../../types/course_type";

import Event from "./Event";

type CalendarProps = { events: Array<EventType> };
type WeekType = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export default function Calendar({ events }: CalendarProps) {
  const [rows, setRows] = useState(6);
  const [currentWeekNum, setCurrentWeekNum] = useState(5);

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
          <Event
            key={j}
            title={class_event.title}
            groups={class_event.groups}
            classroom={class_event.classroom}
            date={class_event.start_time}
          />
        );
      }
    }
    return rowElements;
  };

  return (
    <div className="weekly-calendar">
      <div className="calendar_header">
        <button>Previous</button>
        <h2>Week {currentWeekNum}</h2>
        <button>Next</button>
      </div>
      <div className="calendar_body">
        <div className="calendar_day">
          <h2 className="calendar_day_header">Monday</h2>
          {renderRows("Mon")}
        </div>
        <div className="calendar_day">
          <h2 className="calendar_day_header">Tuesday</h2>
          {renderRows("Tue")}
        </div>
        <div className="calendar_day">
          <h2 className="calendar_day_header">Wednesday</h2>
          {renderRows("Wed")}
        </div>
        <div className="calendar_day">
          <h2 className="calendar_day_header">Thursday</h2>
          {renderRows("Thu")}
        </div>
        <div className="calendar_day">
          <h2 className="calendar_day_header">Friday</h2>
          {renderRows("Fri")}
        </div>
      </div>
    </div>
  );
}
