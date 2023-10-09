import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
// import { v4 as nanoid } from "uuid";
import uuid from "react-native-uuid";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import PostVideo from "./PostVideo";
import AppText from "./AppText";
import colors from "../constants/colors";
import Separator from "./Separator";

const { width, height } = Dimensions.get("window");
const CIRCLER = width * 0.1;
const SCROLL_SEPARATOR = height * 0.08;
const SCROLL_INTERVAL = height + SCROLL_SEPARATOR;
const LOTTIE_SPEED = 2;
const PRGORESS_BAR_DURATION = 15000;
const VIEWERS_HEIGHT = height * 0.93;
const VIEWERS_HEIGHT_SHOW = height * 0.08;

const RenderViewContent = ({ item }) => {
  return (
    <TouchableOpacity>
      <AppText style={{ marginVertical: 20 }}> {item.title} </AppText>
      <Separator h={1} />
    </TouchableOpacity>
  );
};

export default function RenderStoryList({
  item,
  listScrollRef,
  scroller: { setScroller },
  activeItem,
  onEnd,
  handleCloseModal,
  animationStatus = null,
  idx,
}) {
  const [progress, setProgress] = useState(LOTTIE_SPEED);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(null);
  const safeInsets = useSafeAreaInsets();

  const lottieRef = useRef(null);
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

  // console.log(item.durationMillis);

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
          onPressIn={() => animationControl("pause")}
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
                // borderColor: editOptions.drag
                //   ? colors.unChange
                //   : editOptions.color == "inverted"
                //   ? colors.black
                //   : colors.white,
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
            <View style={styles.viewersBtn}>
              <View style={styles.viewersHeader}>
                <AntDesign name="eye" size={22} color={colors.white} />
                <AppText bold size="xlarge" style={styles.viewersCount}>
                  0
                </AppText>
              </View>
            </View>
          </View>
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
            source={require("../../assets/animations/circe_countdown.json")}
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
  vidContainer: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  viewersContainer: {
    position: "absolute",
    width,
    height,
    transform: [{ translateY: VIEWERS_HEIGHT }],
    alignItems: "center",
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
  },
  viewersBtn: {
    width,
    alignItems: "center",
    paddingVertical: 12,
  },
  viewersHeader: {
    flexDirection: "row",
    alignItems: "center",
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
