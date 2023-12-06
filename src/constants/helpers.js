import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";
import vidMaxChecker from "./vidMaxChecker";
import { INSTANCE_FREE_PERIOD } from "./data_store";
import getFormatTime from "./getFormatTime";

// downloadMedia function
const assetsArr = [];
const imageFileExts = ["jpg", "png", "gif", "webp", "bmp", "heic"];
const isiOS = Platform.OS === "ios";

export const capFirstLetter = (str, all) => {
  if (all) {
    let cappedStr = "";
    const skippers = [];
    for (let i = 0; i < str.length; i++) {
      const letter = str[i];
      if (i === 0) {
        cappedStr += letter.toUpperCase();
      } else if (letter === " ") {
        cappedStr += " " + str[i + 1].toUpperCase();
        skippers.push(i + 1);
      } else {
        if (skippers.includes(i)) {
          continue;
        }
        cappedStr += letter;
      }
    }
    return cappedStr;
  } else {
    if (typeof str === "string" && str.length > 0) {
      return str[0].toUpperCase() + str.slice(1);
    } else {
      return "";
    }
  }
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
    quality: 1,
  });

  if (result.canceled) {
    return {
      _error: "Operation cancelled",
      results: null,
    };
  } else {
    // Operation not cancelled
    if (result.assets[0].type === "video") {
      const { bool, vidErr } = vidMaxChecker(
        result.assets[0].duration,
        vidDuration
      );

      if (bool) {
        return {
          _error: vidErr,
          results: null,
        };
      }
    }

    return {
      results: result.assets,
      _error: null,
    };
  }
};

export const downloadMedia = async (media) => {
  if (Array.isArray(media)) {
    let downloadedFile;
    const assetPromises = media.map(async (obj) => {
      const filename = obj.uri.slice(-30);
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      downloadedFile = await FileSystem.downloadAsync(obj.uri, fileUri);
      try {
        // check if media has already been downloaded
        if (downloadedFile.status !== 200) {
          return { error: "Download failed", result: null };
        }
        // for non image downloads with iOS
        if (
          isiOS &&
          imageFileExts.every((ext) => !downloadedFile.uri.endsWith(ext))
        ) {
          // that is it's probably a video or other files,
          const UTI = "public.item";
          await Sharing.shareAsync(downloadedFile.uri, { UTI });
        }

        const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);
        assetsArr.push(asset);
      } catch (err) {
        return { error: "Downloading media failed", result: null };
      }
    });
    await Promise.all([...assetPromises]);
    if (
      isiOS &&
      imageFileExts.every((ext) => !downloadedFile.uri.endsWith(ext))
    )
      return;
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

    if (downloadedFile.status !== 200) {
      return { error: "Download failed", result: null };
    }

    // for non image downloads with iOS
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

export const getFeedNumber = (info) => {
  let formattedNumber;

  let number = 0;
  if (Array.isArray(info)) {
    // Getting the array length if it's an array
    number = info.length;
  } else {
    number = Number(info) || 0;
  }

  if (number >= 100000000000) {
    formattedNumber = `${number.toString().substring(0, 3)}B`;
  } else if (number >= 10000000000) {
    formattedNumber = `${number.toString().substring(0, 2)}B`;
  } else if (number >= 1000000000) {
    formattedNumber = `${number.toString().substring(0, 1)}B`;
  } else if (number >= 100000000) {
    formattedNumber = `${number.toString().substring(0, 3)}M`;
  } else if (number >= 10000000) {
    formattedNumber = `${number.toString().substring(0, 2)}M`;
  } else if (number >= 1000000) {
    formattedNumber = `${number.toString().substring(0, 1)}M`;
  } else if (number >= 100000) {
    formattedNumber = `${number.toString().substring(0, 3)}K`;
  } else if (number >= 10000) {
    formattedNumber = `${number.toString().substring(0, 2)}K`;
  } else if (number >= 1000) {
    formattedNumber = `${number.toString().substring(0, 1)}K`;
  } else {
    formattedNumber = number;
  }
  return formattedNumber;
};

export const canChallengeInstance = (challenge_stat) => {
  const lastTime = new Date(challenge_stat.lastChallengeDate).getTime();

  const dormantTime = lastTime + INSTANCE_FREE_PERIOD;
  const checker = getFormatTime(dormantTime - Date.now(), null, "format_raw");

  if (checker.expired) {
    return { isExpired: true, data: checker.full, msg: checker.full };
  } else {
    return {
      isExpired: false,
      msg: checker.full,
      data: {
        vis: true,
        type: "failed",
        msg: `Instance is not accepting challenge now, check back in ${checker.full}`,
        timer: 4,
      },
    };
  }
};
