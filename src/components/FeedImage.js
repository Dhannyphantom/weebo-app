import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import LottieView from "lottie-react-native";

import LoaderImage from "./LoaderImage";

//files
import heartPop from "../../assets/animations/heartPop.json";

const screen = Dimensions.get("window");
const LOTTIE_SIZE = screen.width * 0.8;

const FeedImage = ({
  image,
  handleLike,
  lDisabled,
  feed,
  translator,
  showMediaFunc,
  disableTouch = false,
  dbDisabled,
  full,
  liked,
  style = {
    width: screen.width * 0.9,
    padding: 5,
    maxHeight: screen.height * 0.75,
  },
}) => {
  const lotRef = useRef(null);
  const opaciter = useRef(new Animated.Value(0)).current;

  let touchTime = 0,
    timed;
  const handleImagePress = () => {
    const now = new Date().getTime();
    const diff = now - touchTime;
    let dPress = null;
    clearTimeout(timed);

    if (diff < 400 && diff > 0) {
      if (dbDisabled) return;
      // double
      Animated.timing(opaciter, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
      dPress = true;
      setTimeout(() => {
        liked ? lotRef?.current?.play(45, 90) : lotRef?.current?.play(0, 40);
      }, 120);
      handleLike();
    } else {
      // single
      timed = setTimeout(() => {
        if (!dPress) {
          if (!lDisabled) {
            const modalData = {
              item: image,
              feed,
            };
            showMediaFunc && showMediaFunc(modalData);
          }
        }
      }, 250);
    }

    touchTime = new Date().getTime();
  };

  const handleAnimFinish = () => {
    Animated.timing(opaciter, {
      toValue: 0,
      useNativeDriver: true,
      duration: 500,
    }).start();
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleImagePress}
        style={[style, { aspectRatio: image.width / image.height }]}
        disabled={disableTouch}
      >
        <LoaderImage image={image} full={full} />
        <Animated.View
          style={{
            ...styles.heartPop,
            opacity: opaciter,
          }}
        >
          <LottieView
            source={heartPop}
            speed={1.25}
            autoPlay={false}
            onAnimationFinish={handleAnimFinish}
            ref={lotRef}
            loop={false}
            style={styles.heartIcon}
          />
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  heartPop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  heartIcon: {
    width: LOTTIE_SIZE,
    height: LOTTIE_SIZE,
  },

  imageContainer: {
    width: screen.width * 0.92,
  },

  image: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
});
export default FeedImage;
