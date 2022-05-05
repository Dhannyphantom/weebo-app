import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { Video } from "expo-av";
import Slider from "@react-native-community/slider";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Lottie from "lottie-react-native";
import { Viewport } from "@skele/components";
import LottieView from "lottie-react-native";
import * as VideoThumbnails from "expo-video-thumbnails";

import heartPop from "../../assets/animations/heartPop.json";
import colors from "../constants/colors";
import getVideoTime from "../constants/getVideoTime";
import AppText from "./AppText";

const { width, height } = Dimensions.get("window");
const VID_WIDTH = width * 0.95;
const VID_SMALL_WIDTH = width * 0.48;
const LOTTIE_SIZE = width * 0.32;
const LOTTIE_LIKE_SIZE = width * 0.8;
const VID_FULL_WIDTH = width;
const L_HEIGHT = height * 0.36;
const L_SMALL_HEIGHT = VID_SMALL_WIDTH;
const P_HEIGHT = height * 0.75;
const P_SMALL_HEIGHT = height * 0.4;
const P_FULL_HEIGHT = height * 0.935;
const BAR_WIDTH = width * 0.91;
const BAR_MARGIN = (width - BAR_WIDTH) / 2 - 20;
const ViewportAwareVideo = Viewport.Aware(Video);

const PostVideo = ({
  vidUri,
  feed,
  full,
  posProp,
  handleLike,
  allowVideoEditing,
  handleViewPost,
  playFunc,
  post,
  showTimer = true,
  disableLongPress,
  disableDoublePress,
  disableTouch = false,
  autoPlayer = true,
  disableThumb = false,
  onLoadEnd,
  onLoadStart,
  showMediaFunc,
  viewable = true,
  style,
  sliderWidth,
  contStyle,
  small,
}) => {
  const autoPos = posProp ? posProp : 0;
  const [playAction, setPlayAction] = useState(false);
  const [overlay, setOverlay] = useState(true);
  const [orient, setOrient] = useState(null);
  const [pos, setPos] = useState(autoPos);
  const [thumber, setThumber] = useState(null);
  const [vidObj, setVidObj] = useState({
    positionMillis: 0,
    durationMillis: 0,
  });

  const posBool = pos < 1;
  const lotRef = useRef(null);
  const lotRefLike = useRef(null);
  const opaciter = useRef(new Animated.Value(0)).current;
  const opaciterPlay = useRef(new Animated.Value(0)).current;

  let vidHeight = small ? L_SMALL_HEIGHT : L_HEIGHT,
    vidWidth = small ? VID_SMALL_WIDTH : VID_WIDTH;
  if (orient === "portrait" && !small && !full) {
    vidHeight = P_HEIGHT;
    vidWidth = VID_WIDTH;
  } else if (orient === "landscape" && !small && !full) {
    vidWidth = VID_WIDTH;
    vidHeight = L_HEIGHT;
  } else if (orient === "portrait" && small) {
    vidWidth = VID_SMALL_WIDTH;
    vidHeight = P_SMALL_HEIGHT;
  } else if (orient === "landscape" && small) {
    vidWidth = VID_SMALL_WIDTH;
    vidHeight = L_SMALL_HEIGHT;
  } else if (full) {
    vidWidth = VID_FULL_WIDTH;
    vidHeight = P_FULL_HEIGHT;
  }

  const handlePlayback = (AVstatus) => {
    setVidObj(AVstatus);
  };

  const handleAnimFinish = () => {
    Animated.parallel([
      Animated.timing(opaciter, {
        toValue: 0,
        useNativeDriver: true,
        duration: 400,
      }),
      Animated.timing(opaciterPlay, {
        toValue: 0,
        useNativeDriver: true,
        duration: 400,
      }),
    ]).start();
  };

  const handleSliderChange = (num) => {
    setPlayAction(false);
    setPos(num);
  };

  let touchTime = 0,
    timed;
  const handleContPress = () => {
    const now = new Date().getTime();
    const diff = now - touchTime;
    let dPress = null;
    clearTimeout(timed);

    if (diff < 400 && diff > 0) {
      if (disableDoublePress) return;
      // double
      dPress = true;
      Animated.timing(opaciter, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        viewable && handleLike();
      });
      setTimeout(() => {
        viewable && post.liked
          ? lotRefLike?.current?.play(45, 90)
          : lotRefLike?.current?.play(0, 40);
      }, 120);
    } else {
      // single
      timed = setTimeout(() => {
        if (!dPress) {
          if (!playAction) {
            // YOU WANT TO PLAY VIDEO
            setOverlay(false);
            Animated.timing(opaciterPlay, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }).start(() => {
              viewable && handleLike();
            });
            if (lotRef?.current?.play) lotRef?.current?.play(170, 220);
          } else {
            Animated.timing(opaciterPlay, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }).start(() => {
              viewable && handleLike();
            });
            if (lotRef?.current?.play) lotRef?.current?.play(60, 110);
            setOverlay(true);
          }
          if (pos >= vidObj.durationMillis) {
            setPos(0);
          } else {
            setPos(vidObj.positionMillis);
          }
          setPlayAction(!playAction);
        }
      }, 210);
    }

    touchTime = new Date().getTime();
  };

  const handleContLongPress = () => {
    if (disableLongPress) return;
    setPlayAction(false);
    // navigation.navigate("Display", {
    //   item: feed.posts[0],
    //   data: { ...feed, pos: vidObj.positionMillis },
    // });
    const modalData = {
      item: feed?.posts.find((obj) => obj.uri == vidUri),
      feed: { ...feed, pos: vidObj.positionMillis },
    };
    showMediaFunc(modalData);
  };

  const handleViewport = (type) => {
    if (type === "e") {
      // setOverlay(false);
      // setPlayAction(true);
    } else if (type === "l") {
      setOverlay(true);
      setPlayAction(false);
    }
    if (pos >= vidObj.durationMillis) {
      setPos(0);
    } else {
      setPos(vidObj.positionMillis);
    }
  };

  const handleLoadStart = () => {
    !disableThumb && handleThumbGenerator();
  };

  const onReadyForDisplay = ({ naturalSize }) => {
    const { orientation } = naturalSize;
    setOrient(orientation);
    if (full && autoPlayer) {
      setPlayAction(true);
    }
    onLoadEnd && onLoadEnd(vidObj.durationMillis);
  };

  const handleThumbGenerator = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(vidUri, {
        time: 4500,
      });
      !thumber && setThumber(uri);
    } catch (err) {
      console.log("THUMB", err);
    }
  };

  const VideoTrimmer = () => {
    const [redBar, setRedBar] = useState(230);
    const [blueBar, setBlueBar] = useState(1);
    const [scrubber, setScrubber] = useState(21);

    const moveBar = useRef(new Animated.ValueXY()).current;
    const moveBarSecond = useRef(new Animated.ValueXY()).current;

    const redWidth = Math.ceil(
      (Math.abs(redBar - BAR_MARGIN) / BAR_WIDTH) * 100
    );
    const blueWidth = Math.ceil(
      (Math.abs(blueBar - BAR_MARGIN) / BAR_WIDTH) * 100
    );

    const cropWidth = redWidth - blueWidth;

    const panResponderTwo = useRef(
      PanResponder.create({
        // Ask to be the responder:
        onMoveShouldSetPanResponder: () => true,

        onPanResponderGrant: (evt, gestureState) => {
          // The gesture has started. Show visual feedback so the user knows
          // what is happening!
          // gestureState.d{x,y} will be set to zero now
          moveBarSecond.setOffset({
            x: moveBarSecond.x._value,
            y: moveBarSecond.y._value,
          });

          moveBarSecond.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (evt, gestureState) => {
          // The most recent move distance is gestureState.move{X,Y}
          // The accumulated gesture distance since becoming responder is
          // gestureState.d{x,y}

          moveBarSecond.setValue({
            x: gestureState.dx,
            y: gestureState.dy,
          });
          setRedBar(gestureState.moveX);
        },
        onPanResponderRelease: (evt, gestureState) => {
          // The user has released all touches while this view is the
          // responder. This typically means a gesture has succeeded
          moveBarSecond.flattenOffset();
          setRedBar(gestureState.moveX);
        },
      })
    ).current;

    const panResponder = useRef(
      PanResponder.create({
        // Ask to be the responder:
        onMoveShouldSetPanResponder: () => true,

        onPanResponderGrant: (evt, gestureState) => {
          // The gesture has started. Show visual feedback so the user knows
          // what is happening!
          // gestureState.d{x,y} will be set to zero now
          moveBar.setOffset({
            x: moveBar.x._value,
            y: moveBar.y._value,
          });

          moveBar.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (evt, gestureState) => {
          // The most recent move distance is gestureState.move{X,Y}
          // The accumulated gesture distance since becoming responder is
          // gestureState.d{x,y}

          moveBar.setValue({
            x: gestureState.dx,
            y: gestureState.dy,
          });
          setBlueBar(gestureState.moveX);
        },
        onPanResponderRelease: (evt, gestureState) => {
          // The user has released all touches while this view is the
          // responder. This typically means a gesture has succeeded
          moveBar.flattenOffset();
          setBlueBar(gestureState.moveX);
        },
      })
    ).current;

    return (
      <View>
        <View style={styles.barBorder}>
          <View
            style={{
              width: `${cropWidth}%`,
              marginLeft: `${blueWidth}%`,
              flex: 1,
              backgroundColor: colors.primary,
              justifyContent: "space-between",
              flexDirection: "row",
              borderRadius: width * 0.022,
              opacity: 0.4,
            }}
          >
            <Animated.View
              {...panResponder.panHandlers}
              style={{
                width: 20,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.primary,
                borderTopStartRadius: width * 0.02,
                borderBottomStartRadius: width * 0.02,
              }}
            >
              <Feather name="chevron-left" size={19} color={colors.white} />
            </Animated.View>
            <Animated.View
              {...panResponderTwo.panHandlers}
              style={{
                width: 20,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.primary,
                borderTopEndRadius: width * 0.02,
                borderBottomEndRadius: width * 0.02,
              }}
            >
              <Feather name="chevron-right" size={19} color={colors.white} />
            </Animated.View>
            <View
              style={{
                position: "absolute",
                height: "100%",
                width: 2,
                marginLeft: scrubber,
                backgroundColor: colors.black,
              }}
            />
          </View>
        </View>
        <AppText>Pecent Crop: {cropWidth}</AppText>
      </View>
    );
  };

  useEffect(() => {
    if (vidObj.positionMillis / vidObj.durationMillis >= 1) {
      setPlayAction(false);
      setPos(0);
      setOverlay(true);
    }

    if (!viewable) return;
    // have watched video func
    // using percentage does not seem right
    // use actual watch time instead
    const mathRes = (vidObj.positionMillis / vidObj.durationMillis) * 100;

    if (mathRes > 30 && playAction && !post.viewed) {
      handleViewPost();
    }
  }, [pos, vidObj]);

  useEffect(() => {
    if (playFunc !== null) {
      setPlayAction(playFunc);
    }
  }, [playFunc, orient]);

  return (
    <View
      style={{
        ...styles.container,
        ...contStyle,
      }}
    >
      {allowVideoEditing && false && <VideoTrimmer />}
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.99}
          onPress={handleContPress}
          onLongPress={handleContLongPress}
          disabled={disableTouch}
          style={{
            ...styles.vidContainer,
            height: vidHeight,
            width: vidWidth,
            ...style,
          }}
        >
          <ViewportAwareVideo
            source={{ uri: vidUri }}
            shouldPlay={playAction}
            style={{
              ...styles.video,
              opacity: overlay ? 0.85 : 1,
            }}
            resizeMode="contain"
            onLoad={handlePlayback}
            onLoadStart={handleLoadStart}
            onPlaybackStatusUpdate={handlePlayback}
            onReadyForDisplay={(e) => onReadyForDisplay(e)}
            progressUpdateIntervalMillis={100}
            positionMillis={pos}
            onViewportEnter={() => handleViewport("e")}
            onViewportLeave={() => handleViewport("l")}
          />

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
              ref={lotRefLike}
              loop={false}
              style={styles.heartIcon}
            />
          </Animated.View>
          <Animated.View style={{ ...styles.vidIcons, opacity: opaciterPlay }}>
            <Lottie
              source={require("../../assets/animations/play_pause_white.json")}
              autoPlay={false}
              onAnimationFinish={() => handleAnimFinish("play")}
              ref={lotRef}
              loop={false}
              style={{
                width: LOTTIE_SIZE,
                height: LOTTIE_SIZE,
                alignSelf: "center",
              }}
            />
          </Animated.View>
          <View
            style={{
              ...styles.sliderCont,
              width: sliderWidth ? sliderWidth : vidWidth,
            }}
          >
            {showTimer && (playAction || !posBool) ? (
              <Slider
                style={styles.slider}
                minimumValue={0}
                animateTransitions
                animationType="timing"
                thumbTouchSize={{ width: 0.5, height: 0.5 }}
                maximumValue={vidObj.durationMillis}
                value={vidObj.positionMillis}
                onValueChange={handleSliderChange}
                minimumTrackTintColor={colors.white}
                maximumTrackTintColor={colors.white}
                thumbTintColor={null}
              />
            ) : (
              <View style={styles.slider}></View>
            )}
          </View>
          {showTimer && overlay && posBool && !playAction && (
            <View style={styles.playIconCont}>
              <Image
                source={{ uri: thumber }}
                style={styles.imageThumb}
                blurRadius={10}
              />
              <View style={styles.playIcons}>
                <MaterialCommunityIcons
                  name="play-circle"
                  size={width * 0.055}
                  color="white"
                />
                <AppText style={styles.vidTime} bold>
                  {getVideoTime(vidObj.durationMillis)}
                </AppText>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  barBorder: {
    width: BAR_WIDTH,
    height: width * 0.08,
    backgroundColor: colors.light,
    marginBottom: 12,
    alignSelf: "center",
    borderRadius: width * 0.02,
  },
  container: {
    flex: 1,
  },
  playIconCont: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  playIcons: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  imageThumb: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  heartPop: {
    position: "absolute",
    zIndex: 200,
  },
  heartIcon: {
    width: LOTTIE_LIKE_SIZE,
    height: LOTTIE_LIKE_SIZE,
  },
  slider: {
    height: width * 0.04,
  },
  sliderCont: {
    position: "absolute",
    top: 5,
    alignSelf: "center",
  },
  vidContainer: {
    backgroundColor: colors.black,
    alignSelf: "center",
    marginVertical: 10,
    justifyContent: "center",
    overflow: "hidden",
    alignItems: "center",
    borderRadius: width * 0.025,
  },
  vidIcons: {
    position: "absolute",
    padding: 10,
  },
  vidTime: {
    color: colors.white,
    marginLeft: 4,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
export default PostVideo;
