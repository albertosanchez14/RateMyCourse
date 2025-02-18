import { useEffect, useState } from "react";

import "./Calendar.css";

import { useWeekSchedule } from "../../hooks/useWeek";
import { FREventType } from "../../types/course_type";

import Event from "./Event";

type CalendarProps = {
  faculty: string;
  events: Array<FREventType>;
  semester: number;
};
type WeekType = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export default function Calendar({
  faculty,
  events,
  semester,
}: CalendarProps) {
  const weekDays: WeekType[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const [rows] = useState(6);
  const [initialWeekNum, setInitialWeekNum] = useState(1);
  const [finalWeekNum, setFinalWeekNum] = useState(24);
  const [currentWeekNum, setCurrentWeekNum] = useState(initialWeekNum);
  const [currentMonth, setCurrentMonth] = useState("");
  const [daysinWeek, setDaysinWeek] = useState({
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
  });
  const semesterString = semester === 1 ? "first_semester" : "second_semester";
  const { data: weekSchedule, isLoading, error } = useWeekSchedule();

  // Set the days and month in the weekly calendar
  useEffect(() => {
    if (!weekSchedule) return;
    const week: { [key: string]: any } = weekSchedule[semesterString];
    const key = "w" + currentWeekNum;

    // Create a map to store dates for each weekday
    const weekDates: { [key in WeekType]: Date } = {
      Mon: new Date(),
      Tue: new Date(),
      Wed: new Date(),
      Thu: new Date(),
      Fri: new Date(),
    };

    // Parse the Monday date (week[key] format is "day/month")
    const [day, month] = week[key].split("/").map(Number);
    const mondayDate = new Date(2024, month - 1, day); // month is 0-based in Date constructor

    // Set dates for each weekday
    weekDays.forEach((weekday, index) => {
      const date = new Date(mondayDate);
      date.setDate(mondayDate.getDate() + index);
      weekDates[weekday] = date;
    });

    // Update the daysinWeek state
    setDaysinWeek({
      Mon: weekDates.Mon.getDate(),
      Tue: weekDates.Tue.getDate(),
      Wed: weekDates.Wed.getDate(),
      Thu: weekDates.Thu.getDate(),
      Fri: weekDates.Fri.getDate(),
    });
    setCurrentMonth(weekDates.Mon.toLocaleString("en-US", { month: "long" }));
  }, [weekSchedule, semesterString, currentWeekNum]);
  // Set the starting week of the semester which is first day of september
  useEffect(() => {
    if (!weekSchedule) return;
    // Set the initial week number based on the semester
    let initalMonth;
    let finalMonth;
    if (semester === 1) {
      initalMonth = "09";
      finalMonth = "01";
    } else {
      initalMonth = "02";
      finalMonth = "07";
    }
    const week: { [key: string]: any } = weekSchedule[semesterString];
    // Find the first week of the semester
    const key = Object.keys(week).filter(
      (key) => week[key].split("/")[1] === initalMonth
    )[0];
    if (!key) return;
    const [day] = week[key].split("/").map(Number);
    // TODO: Fix the week number calculation, change to first class in the week
    const weekNumInit =
      day < 3 ? Number(key.slice(1)) + 1 : Number(key.slice(1));
    setInitialWeekNum(weekNumInit);
    setCurrentWeekNum(weekNumInit);
    // Find the last week of the semester
    const finalWeekKey = Object.keys(week).filter(
      (key) => week[key].split("/")[1] === finalMonth
    )[0];
    if (!finalWeekKey) return;
    const finalWeekNum = Number(finalWeekKey.slice(1));
    // TODO: Fix the week number calculation, change to last class in the week
    setFinalWeekNum(finalWeekNum);
  }, [weekSchedule, semesterString]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!weekSchedule) return <div>No data</div>;

  const renderRows = (week: WeekType) => {
    const rowElements = [];
    for (let j = 0; j < rows; j++) {
      const hour = j * 2 + 9;
      // Find the class events that matches the current row
      const class_events: Array<FREventType> = [];
      events.forEach((event) => {
        const startTime = Number(event.start_time.split(":")[0]);
        const weekCurrent = event.date.split(",")[0];
        if (
          // Same week number
          event.week === currentWeekNum &&
          // Same start hour
          startTime === hour &&
          // Same day of the week
          week === weekCurrent
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
    if (currentWeekNum === initialWeekNum) {
      return;
    }
    setCurrentWeekNum(currentWeekNum - 1);
  };
  const handleNextWeek = () => {
    if (currentWeekNum === finalWeekNum) {
      return;
    }
    setCurrentWeekNum(currentWeekNum + 1);
  };

  return (
    <div className="weekly-calendar">
      <div className="calendar_header">
        <button onClick={handlePrevWeek}>Previous</button>
        <h3>
          {faculty} - {currentMonth} - Week {currentWeekNum}
        </h3>
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
            <h4 className="calendar_day_header_title">
              {daysinWeek[weekDays[0]]} - {weekDays[0]}
            </h4>
          </div>
          {renderRows("Mon")}
        </div>
        <div className="calendar_day">
          <div className="calendar_day_header">
            <h4 className="calendar_day_header_title">
              {daysinWeek[weekDays[1]]} - {weekDays[1]}
            </h4>
          </div>
          {renderRows("Tue")}
        </div>
        <div className="calendar_day">
          <div className="calendar_day_header">
            <h4 className="calendar_day_header_title">
              {daysinWeek[weekDays[2]]} - {weekDays[2]}
            </h4>
          </div>
          {renderRows("Wed")}
        </div>
        <div className="calendar_day">
          <div className="calendar_day_header">
            <h4 className="calendar_day_header_title">
              {daysinWeek[weekDays[3]]} - {weekDays[3]}
            </h4>
          </div>
          {renderRows("Thu")}
        </div>
        <div className="calendar_day">
          <div className="calendar_day_header" id="friday_container">
            <h4 className="calendar_day_header_title">
              {daysinWeek[weekDays[4]]} - {weekDays[4]}
            </h4>
          </div>
          {renderRows("Fri")}
        </div>
      </div>
    </div>
  );
}
