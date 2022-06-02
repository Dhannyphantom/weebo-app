import { StyleSheet, Image, View, Dimensions } from "react-native";
import React, { useRef, useEffect } from "react";
import ActivityIndicator from "./ActivityIndicator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import Screen from "./Screen";
import PostVideo from "./PostVideo";
import AppText from "./AppText";
import colors from "../constants/colors";

const { width, height } = Dimensions.get("window");
const CIRCLER = width * 0.1;
const SCROLL_INTERVAL = height + height * 0.06;

export default function RenderStoryList({
  item,
  listScrollRef,
  storyLength,
  activeItem,
  onEnd,
  handleCloseModal,
  idx,
}) {
  const safeInsets = useSafeAreaInsets();
  const timer =
    item?.durationMillis == 0 || !item.durationMillis
      ? 5000
      : item.durationMillis;
  const lottieRef = useRef(null);
  const isKey = activeItem == item._id;

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

  useEffect(() => {
    if (isKey) {
      lottieRef?.current?.play();
    }
  }, [activeItem]);

  return (
    <>
      <View
        style={{
          ...styles.itemContainer,
          marginBottom: idx == storyLength - 1 ? 0.1 : height * 0.05,
          top: safeInsets.top,
        }}
      >
        <View style={styles.mediaContainer}>
          <View
            style={{
              ...styles.mediaCont,
              aspectRatio: item?.width / item?.height,
            }}
          >
            {item?.type === "image" && (
              <>
                <Image
                  source={{ uri: item?.uri }}
                  // onLoadEnd={() => setMediaLoading(false)}
                  style={{
                    ...styles.image,
                    aspectRatio: item?.width / item?.height,
                  }}
                />
              </>
            )}
            {item?.type === "video" && (
              <View style={styles.vidContainer}>
                <PostVideo
                  source={item}
                  disableDoublePress
                  disableLongPress
                  viewable={false}
                  // onLoadEnd={() => setMediaLoading(false)}
                  showTimer={false}
                  full
                  style={styles.vidContainer}
                  contStyle={styles.vidCont}
                  autoPlayer={false}
                  playFunc={isKey}
                />
                {/* <ActivityIndicator
                  visible={mediaLoading}
                  size={0.3}
                  type="loader"
                  style={styles.loader}
                  transparent
                /> */}
              </View>
            )}
          </View>
        </View>
      </View>
      {isKey && (
        <View
          style={{
            position: "absolute",
            top: safeInsets.top + 20,
            marginLeft: 20,
          }}
        >
          <LottieView
            source={require("../../assets/animations/circe_countdown.json")}
            autoPlay={false}
            duration={timer}
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
  itemContainer: {
    alignSelf: "center",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    maxHeight: height * 0.95,
    // height: "100%",
  },
  mediaContainer: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
  },
  mediaCont: {
    maxHeight: height * 0.96,
  },
});
