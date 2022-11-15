import * as ImagePicker from "expo-image-picker";
import vidMaxChecker from "./vidMaxChecker";

export const capFirstLetter = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

export const launchGallery = async (
  type = "all",
  editing = false,
  multiple = false,
  aspect = null,
  vidDuration = 105
) => {
  let MediaType;
  switch (type) {
    case "image":
      MediaType = ImagePicker.MediaTypeOptions.Images;
      break;
    case "video":
      MediaType = ImagePicker.MediaTypeOptions.Videos;
      break;

    default:
      MediaType = ImagePicker.MediaTypeOptions.All;
      break;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: MediaType,
    allowsEditing: editing,
    allowsMultipleSelection: multiple,
    aspect,
  });

  if (result.canceled) {
    return {
      _error: "Operation cancelled",
      result: null,
    };
  } else {
    if (type === "video") {
      const { bool, vidErr } = vidMaxChecker(
        result.assets[0].duration,
        vidDuration
      );
      if (bool) {
        return {
          _error: vidErr,
          result: null,
        };
      }
    }

    return {
      result: result.assets,
      _error: null,
    };
  }
};
