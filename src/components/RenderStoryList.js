import { StyleSheet, Image, View, Dimensions } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import ActivityIndicator from "./ActivityIndicator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import Screen from "./Screen";
import PostVideo from "./PostVideo";
import AppText from "./AppText";
import colors from "../constants/colors";

const { width, height } = Dimensions.get("window");
const CIRCLER = width * 0.1;
const SCROLL_SEPARATOR = height * 0.08;
const SCROLL_INTERVAL = height + SCROLL_SEPARATOR;
const PRGORESS_BAR_DURATION = 15000;

export default function RenderStoryList({
  item,
  listScrollRef,
  activeItem,
  onEnd,
  handleCloseModal,
  idx,
}) {
  const [progress, setProgress] = useState(3);
  const safeInsets = useSafeAreaInsets();

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
      const speed =
        !item.durationMillis || item.disableDoublePress == 0
          ? 3
          : PRGORESS_BAR_DURATION / item.durationMillis;
      setProgress(speed);
      lottieRef?.current?.play();
    }
  }, [activeItem]);

  return (
    <>
      <View
        style={{
          ...styles.itemContainer,
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
    backgroundColor: colors.dark,
  },
});
