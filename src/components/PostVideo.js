import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Video } from "expo-av";
import LottieView from "lottie-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Viewport } from "@skele/components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../constants/colors";

// lottie animations
import pause_play from "../../assets/animations/play_pause_white.json";
import heartPop from "../../assets/animations/heartPop.json";

const { width, height } = Dimensions.get("screen");
const ViewportAwareVideo = Viewport.Aware(TouchableOpacity);

const LOTTIE_SIZE = width * 0.35;

let touchTime = 0,
  timed;

const RenderLottie = ({ vis, type = "play", loaded }) => {
  // type = "like" || "play"
  const lottie = useRef(null);
  const opaciter = useRef(new Animated.Value(0)).current;

  let lottieAnimation, lottieTime, sizer;

  switch (type) {
    case "like":
      lottieAnimation = heartPop;
      lottieTime = { show: { x: 45, y: 90 }, hide: { x: 0, y: 40 } };
      sizer = 2;
      break;

    default:
      lottieAnimation = pause_play;
      lottieTime = { show: { x: 170, y: 220 }, hide: { x: 60, y: 110 } };
      sizer = 1;
      break;
  }

  const handleAnimations = () => {
    if (!loaded) return null;
    if (vis) {
      // show animation
      Animated.sequence([
        Animated.timing(opaciter, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opaciter, {
          toValue: 0,
          delay: 1000,
          useNativeDriver: true,
        }),
      ]).start();
      lottie?.current?.play(lottieTime?.show?.x, lottieTime?.show?.y);
    } else {
      // hide animation
      opaciter.setValue(1);
      Animated.timing(opaciter, {
        toValue: 0,
        duration: 2200,
        useNativeDriver: true,
      }).start();
      lottie?.current?.play(lottieTime?.hide?.x, lottieTime?.hide?.y);
    }
  };

  useEffect(() => {
    handleAnimations();
  }, [vis]);

  return (
    <Animated.View style={{ ...styles.lottie, opacity: opaciter }}>
      <LottieView
        source={lottieAnimation}
        autoPlay={false}
        // onAnimationFinish={() => handleAnimFinish("play")}
        ref={lottie}
        loop={false}
        style={{
          ...styles.lottieAnim,
          width: LOTTIE_SIZE * sizer,
          height: LOTTIE_SIZE * sizer,
        }}
      />
    </Animated.View>
  );
};

export default function PostVideo({
  source,
  onDoublePress,
  onFinishedPlaying,
  style,
  onLongPress,
  pos = 0,
  loop = false,
  showHearts,
}) {
  const [status, setStatus] = useState({});
  const [bools, setBools] = useState({
    showHearts: false,
    loaded: false,
    onFinishedCalled: false,
  });

  const video = useRef(null);

  // console.log(status.isBuffering, status);

  const onPlayVideo = () => {
    if (status.playableDurationMillis === status.positionMillis) {
      video?.current?.playFromPositionAsync(0);
    }
    status.isPlaying
      ? video?.current?.pauseAsync()
      : video?.current?.playAsync();
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
        showHearts && setBools({ ...bools, showHearts: !bools.showHearts });
        onDoublePress();
        return;
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
    onLongPress({ ...source, pos: status.positionMillis });
  };

  const handleViewport = async (type) => {
    if (type === "enter") {
      // if auto video play is on then play video
      const strSettings = await AsyncStorage.getItem("settings");
      if (!strSettings) return;
      const settings = JSON.parse(strSettings);
      const videoSettings = settings
        .find((obj) => obj.title === "General")
        .data.find((obj) => obj.key === "vid");
      videoSettings.default && video.current.playAsync();
    } else {
      video?.current?.pauseAsync();
    }
  };

  useEffect(() => {
    if (!bools.onFinishedCalled) {
      const percentageWatched =
        (status.positionMillis / status.playableDurationMillis) * 100;
      if (percentageWatched >= 50) {
        onFinishedPlaying && onFinishedPlaying();
        setBools({ ...bools, onFinishedCalled: true });
      }
    }
  }, [status]);

  useEffect(() => {
    if (loop) video.current.playAsync();
  }, []);

  return (
    <ViewportAwareVideo
      onPress={handleVideoAction}
      activeOpacity={1}
      onLongPress={handleLongPress}
      style={[styles.container, style]}
      onViewportEnter={() => handleViewport("enter")}
      onViewportLeave={() => handleViewport("leave")}
    >
      <Video
        ref={video}
        style={styles.video}
        source={source}
        resizeMode="contain"
        positionMillis={pos}
        posterSource={{ uri: source.thumb }}
        onLoad={() => setBools({ ...bools, loaded: true })}
        isLooping={loop}
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      {!status.isPlaying && (
        <View style={styles.playIcon}>
          <MaterialCommunityIcons
            name="motion-play"
            size={40}
            style={{ margin: 10 }}
            color={colors.white}
          />
        </View>
      )}
      <RenderLottie
        vis={status.isPlaying && !bools.showHearts}
        type="play"
        loaded={bools.loaded}
      />
      <RenderLottie
        vis={bools.showHearts && !status.isPlaying}
        type="like"
        loaded={bools.loaded}
      />
    </ViewportAwareVideo>
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
    height: height * 0.7,
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
  playIcon: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
});
