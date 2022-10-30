import * as MediaPicker from "expo-image-picker";

export default async (type, aspect, options) => {
  let MediaType;

  switch (type) {
    case "image":
      MediaType = MediaPicker.MediaTypeOptions.Images;
      break;
    case "video":
      MediaType = MediaPicker.MediaTypeOptions.Videos;
      break;
    default:
      MediaType = MediaPicker.MediaTypeOptions.All;
      break;
  }

  const res = await MediaPicker.launchImageLibraryAsync({
    mediaTypes: MediaType,
    aspect: aspect ?? [],
    ...options,
  });

  if (!res.cancelled) {
    return res;
  }
};
