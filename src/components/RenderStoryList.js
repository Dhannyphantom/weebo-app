import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { Context as FeedContext } from "../config/FeedContext";
// import { v4 as nanoid } from "uuid";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import PostVideo from "./PostVideo";
import AppText from "./AppText";
import colors from "../constants/colors";
import { useContext } from "react";

const { width, height } = Dimensions.get("window");
const CIRCLER = width * 0.1;
const HEART_SIZE = width * 0.5;
const SCROLL_SEPARATOR = height * 0.08;
const SCROLL_INTERVAL = height + SCROLL_SEPARATOR;
const LOTTIE_SPEED = 2;
const PRGORESS_BAR_DURATION = 15000;

// files
import heartLottie from "../../assets/animations/heartPop.json";
import circleLottie from "../../assets/animations/circe_countdown.json";
import { getFeedNumber } from "../constants/helpers";
import ActivityIndicator from "./ActivityIndicator";

export default function RenderStoryList({
  item,
  listScrollRef,
  // scroller: { setScroller },
  activeItem,
  onEnd,
  handleCloseModal,
  animationStatus = null,
  idx,
}) {
  const [progress, setProgress] = useState(LOTTIE_SPEED);
  const [bools, setBools] = useState({
    liked: item.isLiked,
    likes: item.likes,
    views: item.viewers,
    viewed: item.isViewed,
    mediaLoading: true,
    shouldPlayVideo: null,
  });
  const safeInsets = useSafeAreaInsets();

  const { storyActions } = useContext(FeedContext);

  const lottieRef = useRef(null);
  const heartLottieRef = useRef(null);
  const heartOpaciter = useRef(new Animated.Value(0)).current;

  const isKey = activeItem == item._id;
  const isVideo = item?.type === "video";

  const handleAnimFinish = () => {
    if (onEnd.endList) {
      handleCloseModal();
    } else {
      listScrollRef.current?.scrollToOffset({
        animated: true,
        offset: SCROLL_INTERVAL * (idx + 1),
      });
    }
  };

  const onStoryReact = (type) => {
    // type of reactions  = 'view' || 'like' || 'unlike'
    const isHeart = type === "like" || type === "unlike";
    if (isHeart) {
      Animated.timing(heartOpaciter, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      bools.liked
        ? heartLottieRef?.current?.play(45, 90)
        : heartLottieRef?.current?.play(0, 40);
    }
    storyActions(
      {
        reaction: type,
        statusId: item.statusId,
        postId: item._id,
      },
      () => {
        if (isHeart) {
          setBools({
            ...bools,
            liked: type === "like" ? true : false,
            likes: type === "like" ? bools.likes + 1 : bools.likes - 1,
          });
        }
      }
    );
  };

  const animationControl = (type) => {
    switch (type) {
      case "pause":
        lottieRef?.current?.pause();
        if (isVideo) {
          isKey && setBools({ ...bools, shouldPlayVideo: true });
        }
        bools.mediaLoading && setBools({ ...bools, mediaLoading: false });
        break;
      case "play":
        lottieRef?.current?.resume();
        if (isVideo) {
          console.log("Video Loaded", { isKey, type });
          isKey &&
            setBools({ ...bools, shouldPlayVideo: true, mediaLoading: false });
        }
        bools.mediaLoading && setBools({ ...bools, mediaLoading: false });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isKey) {
      const speed =
        !item.durationMillis || item.disableDoublePress == 0
          ? LOTTIE_SPEED
          : PRGORESS_BAR_DURATION / item.durationMillis;
      setProgress(speed);
      setTimeout(() => {
        !bools.mediaLoading && lottieRef?.current?.play();
      }, 800);
      if (!bools.viewed) {
        onStoryReact("view");
        setBools({ ...bools, views: bools.views + 1, viewed: true });
      }
    }
  }, [activeItem]);

  useEffect(() => {
    if (animationStatus !== null) {
      animationControl(animationStatus);
    }
  }, [animationStatus]);

  return (
    <>
      <View
        style={{
          ...styles.itemContainer,
          top: safeInsets.top,
        }}
      >
        <TouchableOpacity
          onLongPress={() => animationControl("pause")}
          onPressOut={() => animationControl("play")}
          activeOpacity={1}
          style={styles.mediaContainer}
        >
          {/* IMAGE COMPONENT */}
          {item?.type === "image" && (
            <Image
              source={{ uri: item?.uri }}
              resizeMode="cover"
              onLoad={() => animationControl("play")}
              style={{
                ...styles.image,
                aspectRatio: item?.width / item?.height,
              }}
            />
          )}
          {/* VIDEO COMPONENT */}
          {isVideo && (
            <View style={styles.vidContainer}>
              <PostVideo
                source={item}
                autoPlay={isKey}
                showPlayIcon={false}
                disablePlayback
                // onLoadEnd={() => console.log("Video loaded")}
                onLoadEnd={() => animationControl("play")}
                shouldPlay={bools.shouldPlayVideo}
              />
            </View>
          )}
          {/* TEXT COMPONENT */}
          {item.text[0] && (
            <View
              style={{
                ...styles.captionContainer,
                transform: [
                  { translateY: item.pos.y },
                  { translateX: item.pos.x },
                ],
              }}
            >
              {item.text.map((text, index) => {
                return (
                  <AppText
                    size="xlarge"
                    bold
                    key={index}
                    style={{
                      ...styles.caption,
                      backgroundColor:
                        item.tColor === "normal" ? colors.white : colors.black,
                      color:
                        item.tColor === "normal" ? colors.black : colors.white,
                      bottom: index !== 0 ? index * 5 : 0,
                    }}
                  >
                    {text}
                  </AppText>
                );
              })}
            </View>
          )}
          <ActivityIndicator
            visible={bools.mediaLoading}
            bTransparent
            absolute
            type="loader"
          />
          <View style={styles.viewersContainer}>
            <View style={styles.viewersHeader}>
              <AntDesign name="eyeo" size={20} color={colors.white} />
              <AppText bold size="large" style={styles.viewersCount}>
                {getFeedNumber(bools.views)}
              </AppText>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onStoryReact(bools.liked ? "unlike" : "like")}
              style={styles.viewersHeader}
            >
              <AntDesign
                name={bools.liked ? "heart" : "hearto"}
                size={20}
                color={bools.liked ? colors.heart : colors.white}
              />
              <AppText bold size="large" style={styles.viewersCount}>
                {getFeedNumber(bools.likes)}
              </AppText>
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.storyLike, { opacity: heartOpaciter }]}>
            <LottieView
              source={heartLottie}
              autoPlay={false}
              onAnimationFinish={() => {
                Animated.timing(heartOpaciter, {
                  toValue: 0,
                  useNativeDriver: true,
                }).start();
              }}
              style={{ width: HEART_SIZE * 2, height: HEART_SIZE * 2 }}
              ref={heartLottieRef}
              loop={false}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      {isKey && (
        <View
          style={{
            position: "absolute",
            top: safeInsets.top + 5,
            marginLeft: 10,
          }}
        >
          <LottieView
            source={circleLottie}
            autoPlay={false}
            speed={progress}
            style={{ width: CIRCLER, height: CIRCLER }}
            ref={lottieRef}
            loop={false}
            onAnimationFinish={handleAnimFinish}
          />
          <View style={styles.activityText}>
            <AppText style={{ color: colors.white }} bold size="large">
              {item.storyLength - item.storyNumber}
            </AppText>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  activityText: {
    position: "absolute",
    width: CIRCLER,
    height: CIRCLER,
    justifyContent: "center",
    alignItems: "center",
  },
  captionContainer: {
    position: "absolute",
    // zIndex: 4,
    alignSelf: "center",
    // borderWidth: 1.2,
    padding: 10,
    borderRadius: width * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },
  caption: {
    backgroundColor: colors.white,
    textAlign: "center",
    padding: 6,
    borderRadius: 7,
    color: colors.black,
  },
  itemContainer: {
    alignSelf: "center",
    backgroundColor: colors.dark,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    maxHeight: height,
    minWidth: width,
    alignSelf: "center",
  },
  mediaContainer: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
  },
  storyLike: {
    position: "absolute",
    width: HEART_SIZE,
    height: HEART_SIZE,
    top: height / 2 - HEART_SIZE / 2,
    left: width / 2 - HEART_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  vidContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.dark,
  },
  viewersContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    borderRadius: 100,
  },
  viewersHeader: {
    // flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  viewersList: {
    width,
    height: height * 0.9,
    padding: 15,
    // zIndex: 100,
  },
  viewersCount: {
    marginLeft: 6,
    color: colors.white,
  },
});
