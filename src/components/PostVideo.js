import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import LottieView from "lottie-react-native";
import colors from "../constants/colors";

// lottie animations
import pause_play from "../../assets/animations/play_pause_white.json";
import heartPop from "../../assets/animations/heartPop.json";

const { width, height } = Dimensions.get("screen");

const LOTTIE_SIZE = width * 0.35;

const RenderLottie = ({ vis, type = "play" }) => {
  // type = "like" || "play"
  const lottie = useRef(null);
  const opaciter = useRef(new Animated.Value(0)).current;

  let lottieAnimation, lottieTime;

  switch (type) {
    case "like":
      lottieAnimation = heartPop;
      lottieTime = { show: { x: 45, y: 90 }, hide: { x: 0, y: 40 } };
      break;

    default:
      lottieAnimation = pause_play;
      lottieTime = { show: { x: 170, y: 220 }, hide: { x: 60, y: 110 } };
      break;
  }

  useEffect(() => {
    if (vis) {
      // show animation
      Animated.sequence([
        Animated.timing(opaciter, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opaciter, {
          toValue: 0,
          delay: 1500,
          useNativeDriver: true,
        }),
      ]).start();
      lottie?.current?.play(lottieTime?.show?.x, lottieTime?.show?.y);
    } else {
      // hide animation
      opaciter.setValue(1);
      Animated.timing(opaciter, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start();
      lottie?.current?.play(lottieTime?.hide?.x, lottieTime?.hide?.y);
    }
  }, [vis]);

  return (
    <Animated.View style={{ ...styles.lottie, opacity: opaciter }}>
      <LottieView
        source={lottieAnimation}
        autoPlay={false}
        // onAnimationFinish={() => handleAnimFinish("play")}
        ref={lottie}
        loop={false}
        style={styles.lottieAnim}
      />
    </Animated.View>
  );
};

export default function PostVideo({
  source,
  onDoublePress,
  onFinishedPlaying,
  onLongPress,
  showHearts,
}) {
  const [status, setStatus] = useState({});

  const video = useRef(null);

  let touchTime = 0,
    timed;

  const onPlayVideo = () => {
    if (status.playableDurationMillis === status.positionMillis) {
      video?.current?.playFromPositionAsync(0);
    }
    status.isPlaying ? video.current.pauseAsync() : video.current.playAsync();
  };

  const handleVideoAction = () => {
    if (!onDoublePress) return onPlayVideo();
    const now = new Date().getTime();
    const diff = now - touchTime;
    let dPress = null;
    clearTimeout(timed);

    if (diff < 400 && diff > 0) {
      // double press
      if (!onDoublePress) return;
      dPress = true;
      if (onDoublePress) {
        onDoublePress();
        showHearts && setStatus({ ...status, like: !!status.like });
      }
    } else {
      // single press
      timed = setTimeout(() => {
        if (!dPress) {
          onPlayVideo();
        }
      }, 400);
    }
    touchTime = new Date().getTime();
  };

  const handleLongPress = () => {
    if (!onLongPress) return;
    video.current.pauseAsync();
    onLongPress();
  };

  useEffect(() => {
    if (status.playableDurationMillis - 500 <= status.positionMillis) {
      onFinishedPlaying && onFinishedPlaying();
    }
  }, [status]);

  return (
    <TouchableOpacity
      onPress={handleVideoAction}
      activeOpacity={1}
      onLongPress={handleLongPress}
      style={styles.container}
    >
      <Video
        ref={video}
        style={styles.video}
        source={source}
        resizeMode="contain"
        isLooping={false}
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      <RenderLottie
        vis={status.isPlaying || status.like}
        type={status.like ? "like" : "play"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark,
    width: "98%",
    alignSelf: "center",
    borderRadius: 15,
  },
  lottie: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  lottieAnim: {
    width: LOTTIE_SIZE,
    height: LOTTIE_SIZE,
    alignSelf: "center",
  },
  video: {
    width: "100%",
    height: height * 0.7,
    borderRadius: 16,
  },
});
