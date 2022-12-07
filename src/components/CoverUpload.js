import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFormikContext } from "formik";

import colors from "../constants/colors";
import AppText from "./AppText";
import ThemeContext from "../config/ThemeContext";
import { launchGallery } from "../constants/helpers";

const { width, height } = Dimensions.get("window");

const PICW = width * 0.96;
const PIC_CHAR_H = height * 0.65;
const PIC_SHOW_H = width * 0.5;

export const RenderCoverUpload = ({
  show,
  visible = true,
  type,
  disabled = false,
  onPress,
  coverImage,
}) => {
  if (!visible) return null;
  const theme = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          ...styles.coverZone,
          backgroundColor: theme.extralight,
          width: PICW,
          height: show ? PIC_SHOW_H : PIC_CHAR_H,
        }}
        disabled={disabled}
        activeOpacity={0.9}
        onPress={onPress} //handleCoverImage
      >
        {!coverImage && (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="camera"
              size={35}
              color={theme.medium}
            />
            <AppText>Upload {type} media</AppText>
          </View>
        )}
        {coverImage && (
          <Image source={{ uri: coverImage }} style={styles.image} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const CoverUpload = ({ show, type = "character", name }) => {
  const { setFieldValue, setFieldError, values, errors } = useFormikContext();
  const [coverImage, setCoverImage] = useState(null);
  const [disableCover, setDisableCover] = useState(false);

  let aspectR;
  if (show) {
    aspectR = [5, 3];
  } else {
    aspectR = [6, 7];
  }

  const handleCoverImage = async () => {
    setDisableCover(true);
    const { results } = await launchGallery("image", true, false, aspectR);

    if (results) {
      setCoverImage(results[0].uri);
      setFieldValue(name, {
        width: results[0].width,
        height: results[0].height,
        uri: results[0].uri,
      });
    }
    setDisableCover(false);
  };

  useEffect(() => {
    if (!values.cover_photo.uri) {
      setFieldError(name, "Please provide a cover");
    }
  }, [coverImage]);

  return (
    <>
      <RenderCoverUpload
        coverImage={coverImage}
        onPress={handleCoverImage}
        show={show}
        disabled={disableCover}
        type={type}
      />
      {errors[name] && (
        <AppText style={styles.errorText}> {errors[name]} </AppText>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 7,
    justifyContent: "center",
  },
  coverZone: {
    borderRadius: 16,
    // overflow: "hidden",
  },
  errorText: {
    color: colors.heart,
    textAlign: "center",
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    // borderRadius: 16,
  },
  reloadBtn: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    borderRadius: 25,
  },
});
export default CoverUpload;
