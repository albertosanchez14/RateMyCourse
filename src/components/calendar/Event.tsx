import "./Event.css";

type EventProps = {
  title: string;
  type: "Magistral" | "Practice" | "Laboratory";
  groups: Array<number>;
  classroom: string;
  date: Date;
};

export default function Event({
  title,
  type,
  groups,
  classroom,
  date,
}: EventProps) {
  const printableDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  let backgroundColor = "white";
  if (type == "Magistral") {
    backgroundColor = "#ffcccc";
  } else if (type == "Practice") {
    backgroundColor = "lightblue";
  } else if (type == "Laboratory") {
    backgroundColor = "lightgreen";
  }

  return (
    <div className="calendar-event" style={{ backgroundColor }}>
      <h4>{title}</h4>
      <span id="calendar-event-type">{type}</span>
      <div>
        <span id="calendar-event-groups">{groups.join(", ")}</span>
        <span id="calendar-event-classroom">{classroom}</span>
      </div>
    </div>
  );
}
