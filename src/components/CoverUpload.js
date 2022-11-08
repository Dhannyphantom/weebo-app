import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFormikContext } from "formik";

import colors from "../constants/colors";
import AppText from "./AppText";
import ThemeContext from "../config/ThemeContext";

const { width, height } = Dimensions.get("window");

const PICW = width * 0.85;
const PICH = width * 0.65;

export const RenderCoverUpload = ({
  show,
  visible = true,
  type,
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
          width: show ? PICW : PICH,
          height: show ? PICH : PICW,
        }}
        activeOpacity={0.8}
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

  let aspectR;
  if (show) {
    aspectR = [5, 3];
  } else {
    aspectR = [6, 7];
  }

  const handleCoverImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: aspectR,
      quality: 1,
    });

    if (!result.cancelled) {
      setCoverImage(result.uri);
      setFieldValue(name, {
        width: result.width,
        height: result.height,
        uri: result.uri,
      });
    }
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
    borderRadius: 14,
    overflow: "hidden",
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
