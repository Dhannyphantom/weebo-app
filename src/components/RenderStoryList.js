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
  const [shouldPlayVideo, setShouldPlayVideo] = useState(null);
  const [bools, setBools] = useState({
    liked: false,
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
          setShouldPlayVideo(true);
        }
        break;
      case "play":
        lottieRef?.current?.resume();
        if (isVideo) {
          setShouldPlayVideo(false);
        }
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
      lottieRef?.current?.play();
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
          <View
            style={{
              ...styles.mediaCont,
              aspectRatio: isVideo ? item?.width / item?.height : null,
            }}
          >
            {item?.type === "image" && (
              <>
                <Image
                  source={{ uri: item?.uri }}
                  resizeMode="cover"
                  style={{
                    ...styles.image,
                    aspectRatio: item?.width / item?.height,
                  }}
                />
              </>
            )}
            {isVideo && (
              <View style={styles.vidContainer}>
                <PostVideo
                  source={item}
                  autoPlay={isKey}
                  showPlayIcon={false}
                  disablePlayback
                  shouldPlay={shouldPlayVideo}
                />
              </View>
            )}
          </View>
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
          <View style={styles.viewersContainer}>
            <View style={styles.viewersHeader}>
              <AntDesign name="eyeo" size={35} color={colors.white} />
              <AppText bold size="large" style={styles.viewersCount}>
                1K
              </AppText>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onStoryReact("like")}
              style={styles.viewersHeader}
            >
              <AntDesign
                name={bools.liked ? "heart" : "hearto"}
                size={35}
                color={bools.liked ? colors.heart : colors.white}
              />
              <AppText bold size="large" style={styles.viewersCount}>
                300
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
  },
  mediaContainer: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
  },
  mediaCont: {
    maxHeight: height,
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
    flex: 1,
    backgroundColor: colors.dark,
  },
  viewersContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
  },
  viewersHeader: {
    // flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
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
