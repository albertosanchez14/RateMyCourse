const API_URL =
  import.meta.env.VITE_ENV === "production"
    ? import.meta.env.VITE_NODE_API_URL_PROD
    : import.meta.env.VITE_NODE_API_URL_DEV;

/**
 * Sends selected courses and time picks to the /schedule endpoint as JSON.
 * @param courses Array of objects: { id: string, groups: number[] }
 * @param timePicks Object representing the user's selected time slots
 * @returns Promise with the response data
 */
export async function getGenSchedules(
  selectedFaculty: string,
  courses: Array<{ id: string; groups: number[] }>,
  timePicks: Record<string, any>
) {
  const response = await fetch(`${API_URL}/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      selectedFaculty,
      courses,
      timePicks,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate schedule");
  }

  return response.json();
}
