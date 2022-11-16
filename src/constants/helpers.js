import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";
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

const assetsArr = [];
export const downloadMedia = async (media) => {
  if (Array.isArray(media)) {
    const assetPromises = media.map(async (obj) => {
      const filename = obj.uri.slice(-30);
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      try {
        const downloadedFile = await FileSystem.downloadAsync(obj.uri, fileUri);
        // check if media has already been downloaded
        const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);
        assetsArr.push(asset);
      } catch (err) {
        return { error: "Downloading media failed", result: null };
      }
    });
    await Promise.all([...assetPromises]);
    try {
      const album = await MediaLibrary.getAlbumAsync("Weebo");
      if (album == null) {
        await MediaLibrary.createAlbumAsync("Weebo", assetsArr[0], false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync(
          assetsArr.slice(1),
          album,
          false
        );
      }
      return { error: null, result: "success" };
    } catch (err) {
      return { error: "Saving media failed", result: null };
    }
  } else {
    // donwloading a single media file
    const filename = media.uri.slice(-30);
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    const downloadedFile = await FileSystem.downloadAsync(media.uri, fileUri);
    const isiOS = Platform.OS === "ios";

    if (downloadedFile.status !== 200) {
      return { error: "Download failed", result: null };
    }

    // for non image downloads with iOS
    const imageFileExts = ["jpg", "png", "gif", "webp", "bmp", "heic"];

    if (
      isiOS &&
      imageFileExts.every((ext) => !downloadedFile.uri.endsWith(ext))
    ) {
      // that is it's probably a video or other files,
      const UTI = "public.item";
      await Sharing.shareAsync(downloadedFile.uri, { UTI });
      return { error: null, result: "success" };
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);
      const album = await MediaLibrary.getAlbumAsync("Weebo");
      if (album == null) {
        await MediaLibrary.createAlbumAsync("Weebo", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      return { error: null, result: "success" };
    } catch (err) {
      return { error: "Saving media failed", result: null };
    }
  }
};
