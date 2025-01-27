import "./Event.css";

type EventProps = {
  title: string;
  type: "Magistral" | "Practice" | "Laboratory";
  groups: Array<number>;
  classroom: string;
  date: Date;
};

export default function Event({ title, type, groups, classroom, date }: EventProps) {
  const printableDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="calendar-event">
      <h4>{title}</h4>
      <span>{type}</span>
      <span>{groups.join(", ")}</span>
      <span>{classroom}</span>
      <span>{printableDate}</span>
    </div>
  );
}
