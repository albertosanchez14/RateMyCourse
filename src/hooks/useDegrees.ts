import { useQuery } from "@tanstack/react-query";
import supabase from "../utils/supabaseClient";

import { getUniversityId } from "./useUniversitys";

const fetchDegrees = async (universityName: string) => {
  const { data, error } = await supabase
    .from("degrees")
    .select("name")
    .eq("university", await getUniversityId(universityName));

  if (error) {
    throw new Error(error.message);
  }

  const uniqueDegrees = data
    ? Array.from(new Set(data.map((degree) => degree.name)))
    : [];

  return uniqueDegrees;
};

const useDegrees = (universityName: string) => {
  return useQuery({
    queryKey: ["degrees", universityName],
    queryFn: () => fetchDegrees(universityName),
    enabled: !!universityName,
  });
};

export default useDegrees;
