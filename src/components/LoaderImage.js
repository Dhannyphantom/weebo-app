import React, { useContext, useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import ThemeContext from "../config/ThemeContext";

import ActivityIndicator from "./ActivityIndicator";
import { RenderMediaIcon } from "./PostVideo";

const { height, width } = Dimensions.get("screen");

const LoaderImage = ({
  image,
  style,
  imageStyle,
  isVideoImage,
  full,
  containerStyle,
  borderRadius,
  loading = false,
  setAspectRatio = true,
  ...otherProps
}) => {
  const [isLoading, setIsLoading] = useState(isVideoImage ? false : true);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const theme = useContext(ThemeContext);

  const handleLoadEnd = () => {
    setIsLoading(false);
    setLoadedOnce(true);
  };

  const contStyle = {
    ...styles.container,
    backgroundColor: theme.extralight,
    borderRadius: full ? 1 : 12,
    ...style,
  };

  if (setAspectRatio && !isVideoImage) {
    contStyle.aspectRatio = image?.width / image?.height;
    delete contStyle.height;
    delete contStyle.width;
  }

  return (
    <View style={contStyle}>
      <Image
        source={{ uri: image?.thumb }}
        {...otherProps}
        style={{
          ...styles.image,
          borderRadius: full ? 1 : 12,
          ...imageStyle,
          height: isVideoImage ? Math.min(image?.height, height * 0.65) : null,
        }}
        blurRadius={isVideoImage ? 5 : 12}
        resizeMode="cover"
      />

      {isVideoImage && <RenderMediaIcon duration={image.durationMillis} />}

      {!isVideoImage && (
        <Image
          source={{ uri: image.uri }}
          {...otherProps}
          style={{
            ...styles.image,
            ...styles.imageOverlay,
            borderRadius: full ? 1 : 12,
            ...imageStyle,
          }}
          onLoadEnd={handleLoadEnd}
          resizeMode="cover"
          resizeMethod="resize"
        />
      )}

      <ActivityIndicator
        visible={isLoading}
        size={0.26}
        type="loader"
        style={{
          ...styles.activity,
          borderRadius: full ? 1 : 12,
        }}
        transparent
      />
      <ActivityIndicator
        visible={loading}
        type="spin"
        style={{
          ...styles.activity,
          borderRadius: full ? 1 : 12,
        }}
        wTransparent
      />
    </View>
  );
};

const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    width: "100%",
    height: "100%",
    borderRadius: 13,
  },

  image: {
    height: "100%",
    width: "100%",
  },
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
});
export default LoaderImage;
