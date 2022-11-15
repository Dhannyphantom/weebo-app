import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";
import LottieView from "lottie-react-native";
import colors from "../constants/colors";

// lottie animations
import pause_play from "../../assets/animations/play_pause_white.json";
import heartPop from "../../assets/animations/heartPop.json";

const { width, height } = Dimensions.get("screen");

const LOTTIE_SIZE = width * 0.35;

const RenderLottie = ({ vis, type = "play" }) => {
  const lottie = useRef(null);
  const opaciter = useRef(new Animated.Value(0)).current;

  let lottieAnimation = pause_play;

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
      lottie?.current?.play(170, 220);
    } else {
      // hide animation
      opaciter.setValue(1);
      Animated.timing(opaciter, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start();
      lottie?.current?.play(60, 110);
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

export default function PostVideo({ source }) {
  const [status, setStatus] = useState({});

  const video = useRef(null);

  const handleVideoAction = () => {
    status.isPlaying ? video.current.pauseAsync() : video.current.playAsync();
  };

  return (
    <TouchableOpacity
      onPress={handleVideoAction}
      activeOpacity={1}
      style={styles.container}
    >
      <Video
        ref={video}
        style={styles.video}
        source={source}
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      <RenderLottie vis={status.isPlaying} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark,
    width,
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
    height: height * 0.75,
  },
});
