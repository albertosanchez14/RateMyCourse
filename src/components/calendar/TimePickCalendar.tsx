import { useState } from "react";
import "./Calendar.css"; // Reuse existing styles

type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
const weekDays: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const hours = [9, 11, 13, 15, 17, 19];

type SelectedSlots = { [key in WeekDay]?: number[] };

function TimeSlotSelector({
  selected,
  onChange,
}: {
  selected: SelectedSlots;
  onChange: (slots: SelectedSlots) => void;
}) {
  const handleCellClick = (day: WeekDay, hour: number) => {
    const daySlots = selected[day] || [];
    const exists = daySlots.includes(hour);
    const newDaySlots = exists
      ? daySlots.filter((h) => h !== hour)
      : [...daySlots, hour];
    const newSelected = { ...selected, [day]: newDaySlots };
    onChange(newSelected);
  };

  return (
    <div className="calendar_body">
      <div className="calendar_day" id="hours_label_column">
        <div className="calendar_day_header_placeholder"></div>
        {hours.map((hour, i) => (
          <div key={i} className="calendar_hours_label_container">
            <span className="label_hour_top">{hour}:00</span>
          </div>
        ))}
        <span>21:00</span>
      </div>
      {weekDays.map((day) => (
        <div className="calendar_day" key={day}>
          <div className="calendar_day_header">
            <h4 className="calendar_day_header_title">{day}</h4>
          </div>
          {hours.map((hour) => (
            <div
              key={hour}
              className={`calendar_hour timepick-cell ${
                selected[day]?.includes(hour) ? "selected" : ""
              }`}
              style={{ cursor: "pointer", position: "relative" }}
              onClick={() => handleCellClick(day, hour)}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function TimePickCalendar({
  value,
  onChange,
}: {
  value?: SelectedSlots;
  onChange?: (slots: SelectedSlots) => void;
}) {
  const [selected, setSelected] = useState<SelectedSlots>(value || {});

  const handleChange = (slots: SelectedSlots) => {
    setSelected(slots);
    onChange?.(slots);
  };

  return (
    <div className="weekly-calendar">
      <TimeSlotSelector selected={selected} onChange={handleChange} />
    </div>
  );
}
