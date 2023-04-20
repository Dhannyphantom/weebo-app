import React, { useContext, useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import ThemeContext from "../config/ThemeContext";

import ActivityIndicator from "./ActivityIndicator";
import { RenderMediaIcon } from "./PostVideo";

const LoaderImage = ({
  image,
  style,
  imageStyle,
  isVideoImage,
  full,
  containerStyle,
  loading = false,
  noAspect,
  ...otherProps
}) => {
  const [isLoading, setIsLoading] = useState(isVideoImage ? false : true);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const theme = useContext(ThemeContext);

  const handleLoadEnd = () => {
    setIsLoading(false);
    setLoadedOnce(true);
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: theme.extralight,
        borderRadius: full ? 1 : 12,
        aspectRatio: noAspect ? null : image.width / image.height,
        ...style,
      }}
    >
      <Image
        source={{ uri: image.thumb }}
        {...otherProps}
        style={{
          ...styles.image,
          borderRadius: full ? 1 : 12,
          ...imageStyle,
        }}
        blurRadius={isVideoImage ? 5 : 12}
        resizeMode="cover"
      />

      {isVideoImage && <RenderMediaIcon />}

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
    backgroundColor: "#e1e4e8",
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
