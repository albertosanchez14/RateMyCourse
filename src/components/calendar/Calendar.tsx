import { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import "./Calendar.css";

import { FREventType } from "../../types/course";

import Event from "./Event";

type CalendarProps = {
  events: Array<FREventType>;
};
type WeekType = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export default function Calendar({ events }: CalendarProps) {
  const weekDays: WeekType[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const [rows] = useState(6);
  const [currentMonth, setCurrentMonth] = useState("");
  const [daysinWeek, setDaysinWeek] = useState({
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
  });

  // Initialize with today's date
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [maxDate, setMaxDate] = useState<Date>(new Date());
  const [startingDate, setStartingDate] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  // Update startingDate when events are available
  useEffect(() => {
    if (events.length === 0) return;
  
    // Find earliest event date
    let minDate = new Date(events[0].date);
    let maxDate = new Date(events[0].date);
    events.forEach((event) => {
      const date = new Date(event.date);
      if (date < minDate) minDate = date;
      if (date > maxDate) maxDate = date;
    });
    setMinDate(minDate);
    setMaxDate(maxDate);
  
    // Adjust to Monday of that week
    const day = minDate.getDay();
    const diff = minDate.getDate() - day + (day === 0 ? -6 : 1);
    minDate.setDate(diff);
  
    setStartingDate(minDate);
  }, [events]); // Only run when events change

  // Set the days and month in the weekly calendar
  useEffect(() => {
    // Update the daysinWeek state
    setDaysinWeek({
      Mon: startingDate.getDate(),
      Tue: startingDate.getDate() + 1,
      Wed: startingDate.getDate() + 2,
      Thu: startingDate.getDate() + 3,
      Fri: startingDate.getDate() + 4,
    });
    setCurrentMonth(startingDate.toLocaleString("en-US", { month: "long" }));
  }, [startingDate]);

  const renderRows = (date: Date) => {
    const rowElements = [];
    for (let j = 0; j < rows; j++) {
      const hour = j * 2 + 9;
      // Find the class events that matches the current row
      const class_events: Array<FREventType> = [];
      events.forEach((event) => {
        const startTime = Number(event.start_time.split(":")[0]);
        const dateCurrent = new Date(event.date);
        if (
          // Same start hour
          startTime === hour &&
          // Same date
          dateCurrent.getDate() === date.getDate() &&
          dateCurrent.getMonth() === date.getMonth() &&
          dateCurrent.getFullYear() === date.getFullYear()
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
                type={event.type}
                groups={event.groups}
                classroom={event.classroom}
              />
            ))}
          </div>
        );
      }
    }
    return rowElements;
  };
  const handlePrevWeek = () => {
    if (startingDate.getTime() - 7 * 24 * 60 * 60 * 1000 < minDate.getTime())
      return;
    setStartingDate(new Date(startingDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  };
  const handleNextWeek = () => {
    if (startingDate.getTime() + 7 * 24 * 60 * 60 * 1000 > maxDate.getTime())
      return;
    setStartingDate(new Date(startingDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  return (
    <div className="weekly-calendar">
      <div className="calendar_header">
        <button
          onClick={handlePrevWeek}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Previous week"
        >
          <MdChevronLeft size={24} />
        </button>
        <h3 className="text-lg font-semibold">{currentMonth}</h3>
        <button
          onClick={handleNextWeek}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Next week"
        >
          <MdChevronRight size={24} />
        </button>
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
            <h4 className="calendar_day_header_title">
              {daysinWeek[weekDays[0]]} - {weekDays[0]}
            </h4>
          </div>
          {renderRows(startingDate)}
        </div>
        <div className="calendar_day">
          <div className="calendar_day_header">
            <h4 className="calendar_day_header_title">
              {daysinWeek[weekDays[1]]} - {weekDays[1]}
            </h4>
          </div>
          {renderRows(
            new Date(startingDate.getTime() + 1 * 24 * 60 * 60 * 1000)
          )}
        </div>
        <div className="calendar_day">
          <div className="calendar_day_header">
            <h4 className="calendar_day_header_title">
              {daysinWeek[weekDays[2]]} - {weekDays[2]}
            </h4>
          </div>
          {renderRows(
            new Date(startingDate.getTime() + 2 * 24 * 60 * 60 * 1000)
          )}
        </div>
        <div className="calendar_day">
          <div className="calendar_day_header">
            <h4 className="calendar_day_header_title">
              {daysinWeek[weekDays[3]]} - {weekDays[3]}
            </h4>
          </div>
          {renderRows(
            new Date(startingDate.getTime() + 3 * 24 * 60 * 60 * 1000)
          )}
        </div>
        <div className="calendar_day">
          <div className="calendar_day_header" id="friday_container">
            <h4 className="calendar_day_header_title">
              {daysinWeek[weekDays[4]]} - {weekDays[4]}
            </h4>
          </div>
          {renderRows(
            new Date(startingDate.getTime() + 4 * 24 * 60 * 60 * 1000)
          )}
        </div>
      </div>
    </div>
  );
}
