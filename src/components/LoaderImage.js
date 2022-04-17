import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import colors from "../constants/colors";

import ActivityIndicator from "./ActivityIndicator";

const { width, height } = Dimensions.get("window");

const LoaderImage = ({
  image,
  imageStyle,
  borderRadius,
  containerStyle,
  loading = false,
  noAspect,
  ...otherProps
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  // const [progress, setProgress] = useState(0);
  // image = {width, height, uri, thumb}
  const BORDER_RADIUS = image ? image.width * 0.02 : 5;

  // const handleLoadStart = () => {
  //   setIsLoading(true);
  // };

  const handleLoadEnd = () => {
    setIsLoading(false);
    setLoadedOnce(true);
  };

  const handleProgress = (prog) => {
    console.log(prog);
  };

  useEffect(() => {
    // loadedOnce && setIsLoading(true);
    setIsLoading(true);
  }, []);

  return (
    <>
      {image ? (
        <View
          style={{
            ...styles.container,
            borderRadius: borderRadius ? borderRadius : BORDER_RADIUS + 2,
            aspectRatio: noAspect ? null : image.width / image.height,
          }}
        >
          <Image
            source={{ uri: image.thumb }}
            {...otherProps}
            style={{
              ...styles.image,
              borderRadius: borderRadius ? borderRadius : BORDER_RADIUS,
            }}
            blurRadius={12}
            resizeMode="cover"
          />
          <Image
            source={{ uri: image.uri }}
            {...otherProps}
            style={{
              ...styles.image,
              ...styles.imageOverlay,
              borderRadius: borderRadius ? borderRadius : BORDER_RADIUS,
            }}
            onLoadEnd={handleLoadEnd}
            resizeMode="cover"
            resizeMethod="resize"
          />
          <ActivityIndicator
            visible={isLoading}
            size={0.26}
            type="loader"
            style={{
              ...styles.activity,
              borderRadius: borderRadius ? borderRadius : BORDER_RADIUS,
            }}
            transparent
          />
          <ActivityIndicator
            visible={loading}
            type="spin"
            style={{
              ...styles.activity,
              borderRadius: borderRadius ? borderRadius : BORDER_RADIUS,
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
            borderRadius: borderRadius ? borderRadius : BORDER_RADIUS,
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
