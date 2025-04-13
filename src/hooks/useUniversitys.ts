import supabase from "../utils/supabaseClient";

export const getUniversityId = async (universityName: string) => {
  const { data, error } = await supabase
    .from("universitys")
    .select("id")
    .eq("name", universityName)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data?.id;
};
