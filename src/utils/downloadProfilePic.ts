export const downloadProfilePicture = async (
  url: string
): Promise<string | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");

    const blob = await response.blob();
    return await convertBlobToBase64(blob);
  } catch (error) {
    console.error("Error downloading profile picture:", error);
    return null;
  }
};

const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
