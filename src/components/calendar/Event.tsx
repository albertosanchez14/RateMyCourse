import "./Event.css";

type EventProps = {
  type: "Magistral" | "Practice" | "Laboratory";
  groups: Array<number>;
  classroom: string;
};

export default function Event({
  type,
  groups,
  classroom,
}: EventProps) {
  let backgroundColor = "white";
  if (type == "Magistral") {
    backgroundColor = "#ffcccc";
  } else if (type == "Practice") {
    backgroundColor = "lightblue";
  } else if (type == "Laboratory") {
    backgroundColor = "lightgreen";
  }
  
  // Handle classroom display
  const defaultClassroom = "N/A";
  let displayAula = defaultClassroom;

  if (classroom) {
    if (classroom.includes("Aula")) {
      displayAula = classroom.split("Aula")[1]?.trim() || defaultClassroom;
    } else {
      displayAula = classroom;
    }
  }

  return (
    <div className="calendar-event" style={{ backgroundColor }}>
      <h4>{type}</h4>
      <div>
        <span id="calendar-event-groups">{groups.join(", ")}</span>
        <span id="calendar-event-classroom">{displayAula}</span>
      </div>
    </div>
  );
}
