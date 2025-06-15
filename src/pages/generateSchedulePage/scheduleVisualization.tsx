import { useEffect, useState } from "react";
import Calendar from "../../components/calendar/Calendar";
import { FREventType } from "../../types/course";

interface ScheduleVisualizationProps {
  schedule: any[];
  courses: Array<{ id: string; title: string }>;
  coursesEventsMap: Record<string, any[]>;
}

export default function ScheduleVisualization({
  schedule,
  courses,
  coursesEventsMap,
}: ScheduleVisualizationProps) {
  const [calendarEvents, setCalendarEvents] = useState<FREventType[]>([]);
  
  // Transform schedule data into calendar events
  useEffect(() => {
    if (!schedule || !Array.isArray(schedule) || schedule.length === 0 || !coursesEventsMap) {
      setCalendarEvents([]);
      return;
    }

    // Collect all events for the selected courses and groups
    const allEvents: FREventType[] = [];
    
    schedule.forEach((item) => {
      const { courseId, groupId } = item;
      const mapKey = `${courseId}-${groupId}`;
      
      // Get events for this course and group from the map
      const courseEvents = coursesEventsMap[mapKey] || [];
      
      courseEvents.forEach((eventGroup) => {
        const { type, groups, start_time, end_time, sessions } = eventGroup;
        
        // Skip if this event isn't for the selected group
        if (!groups.includes(groupId)) return;
        
        // Process each session date
        sessions.forEach((session: any) => {
          // Check if date is an array or a single date
          const dateArray = Array.isArray(session.date) ? session.date : [session.date];
          
          dateArray.forEach((dateStr: string) => {
            // Find the course title
            const course = courses.find(c => c.id === courseId);
            const title = course ? course.title : courseId;
            
            allEvents.push({
              title,
              date: new Date(dateStr).toISOString(),
              week: 1, // Assuming week 1 for simplicity, adjust as needed
              start_time,
              end_time,
              type: type as "Magistral" | "Practice" | "Laboratory",
              groups: [groupId],
              classroom: session.classroom || "N/A",
            });
          });
        });
      });
    });
    
    setCalendarEvents(allEvents);
  }, [schedule, courses, coursesEventsMap]);

  return (
    <div className="schedule-visualization h-full overflow-auto">
    <div className="max-w-5xl mx-auto">
      <Calendar 
        events={calendarEvents} 
        showTitle={true}
        conflictDate={null}
      />
    </div>
  </div>
  );
}