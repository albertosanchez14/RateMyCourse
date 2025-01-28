import { useEffect, useState } from "react";

import "./Calendar.css";

import { EventType } from "../../types/course_type";

import Event from "./Event";

type CalendarProps = { events: Array<EventType> };
type WeekType = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export default function Calendar({ events }: CalendarProps) {
  const [rows] = useState(6);
  const [currentWeekNum, setCurrentWeekNum] = useState(5);
  const [currentDate, setCurrentDate] = useState(new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date().getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderRows = (week: WeekType) => {
    const rowElements = [];
    for (let j = 0; j < rows; j++) {
      const hour = j * 2 + 9;
      // Find the class events that matches the current row
      const class_events: Array<EventType> = [];
      events.forEach((event) => {
        if (
          // Same week number
          event.week === currentWeekNum &&
          // Same start hour
          new Date(event.start_time).getHours() === hour &&
          // Same day of the week
          week ===
            new Date(event.start_time).toLocaleDateString("en-US", {
              weekday: "short",
            })
        ) {
          class_events.push(event);
        }
      });
      if (class_events.length === 0) {
        rowElements.push(<div key={j} className="calendar_hour"></div>);
      } else {
        rowElements.push(
          <div key={j} className="calendar_hour">
            {class_events.map((event, index) => (
              <Event
                key={index}
                title={event.title}
                type={event.type}
                groups={event.groups}
                classroom={event.classroom}
                date={event.start_time}
              />
            ))}
          </div>
        );
      }
    }
    return rowElements;
  };
  const handlePrevWeek = () => {
    if (currentWeekNum === 1) {
      return;
    }
    setCurrentWeekNum(currentWeekNum - 1);
  };
  const handleNextWeek = () => {
    if (currentWeekNum === 24) {
      return;
    }
    setCurrentWeekNum(currentWeekNum + 1);
  };

  return (
    <div className="weekly-calendar">
      <div className="calendar_header">
        <button onClick={handlePrevWeek}>Previous</button>
        <h3>Week {currentWeekNum}</h3>
        <button onClick={handleNextWeek}>Next</button>
      </div>
      <div className="calendar_body">
        <div className="calendar_day" id="hours_label_column">
          <div className="calendar_day_header_placeholder"></div>
          <div className="calendar_hours_label_container">
            <span className="label_hour_top">9:00</span>
          </div>
          <div className="calendar_hours_label_container">
            <span className="label_hour_top">11:00</span>
          </div>
          <div className="calendar_hours_label_container">
            <span className="label_hour_top">13:00</span>
          </div>
          <div className="calendar_hours_label_container">
            <span className="label_hour_top">15:00</span>
          </div>
          <div className="calendar_hours_label_container">
            <span className="label_hour_top">17:00</span>
          </div>
          <div className="calendar_hours_label_container">
            <span className="label_hour_top">19:00</span>
            <span>21:00</span>
          </div>
        </div>
        <div className="calendar_day">
          <div className="calendar_day_header" id="monday_container">
            <h3 className="calendar_day_header_title">Monday</h3>
          </div>
          {renderRows("Mon")}
        </div>
        <div className="calendar_day">
          <div className="calendar_day_header">
            <h3 className="calendar_day_header_title">Tuesday</h3>
          </div>
          {renderRows("Tue")}
        </div>
        <div className="calendar_day">
          <div className="calendar_day_header">
            <h3 className="calendar_day_header_title">Wednesday</h3>
          </div>
          {renderRows("Wed")}
        </div>
        <div className="calendar_day">
          <div className="calendar_day_header">
            <h3 className="calendar_day_header_title">Thurday</h3>
          </div>
          {renderRows("Thu")}
        </div>
        <div className="calendar_day">
          <div className="calendar_day_header" id="friday_container">
            <h3 className="calendar_day_header_title">Friday</h3>
          </div>
          {renderRows("Fri")}
        </div>
      </div>
    </div>
  );
}
