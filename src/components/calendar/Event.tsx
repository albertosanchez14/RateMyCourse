import "./Event.css";

type EventProps = {
  title: string;
  groups: Array<number>;
  classroom: string;
  date: Date;
};

export default function Event({ title, groups, classroom, date }: EventProps) {
  const printableDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="calendar-event">
      <h3>{title}</h3>
      <span>{groups.join(", ")}</span>
      <span>{classroom}</span>
      <span>{printableDate}</span>
    </div>
  );
}
