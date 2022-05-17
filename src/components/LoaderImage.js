import React, { useContext, useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import ThemeContext from "../config/ThemeContext";
import colors from "../constants/colors";

import ActivityIndicator from "./ActivityIndicator";

const { width, height } = Dimensions.get("window");

const LoaderImage = ({
  image,
  imageStyle,
  isVideoImage,
  full,
  containerStyle,
  loading = false,
  noAspect,
  ...otherProps
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const theme = useContext(ThemeContext);

  const handleLoadEnd = () => {
    setIsLoading(false);
    setLoadedOnce(true);
  };

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (isVideoImage) {
      setIsLoading(false);
    }
  }, [isVideoImage]);

  return (
    <>
      {image ? (
        <View
          style={{
            ...styles.container,
            backgroundColor: theme.extralight,
            borderRadius: full ? 1 : 12,
            aspectRatio: noAspect ? null : image.width / image.height,
          }}
        >
          <Image
            source={{ uri: image.thumb }}
            {...otherProps}
            style={{
              ...styles.image,
              borderRadius: full ? 1 : 12,
            }}
            blurRadius={isVideoImage ? 5 : 12}
            resizeMode="cover"
          />

          {!isVideoImage && (
            <Image
              source={{ uri: image.uri }}
              {...otherProps}
              style={{
                ...styles.image,
                ...styles.imageOverlay,
                borderRadius: full ? 1 : 12,
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
      ) : (
        <ActivityIndicator
          visible={isLoading}
          size={0.26}
          type="spin"
          style={{
            ...styles.activity,
            borderRadius: full ? 1 : 12,
          }}
          transparent
        />
      )}
    </>
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
    // backgroundColor: colors.light,
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
