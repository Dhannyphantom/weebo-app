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
import ActivityIndicator from "./ActivityIndicator";
// import { v4 as nanoid } from "uuid";
import uuid from "react-native-uuid";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import PostVideo from "./PostVideo";
import AppText from "./AppText";
import colors from "../constants/colors";
import Separator from "./Separator";

import { subGenres } from "../constants/data_store";

const { width, height } = Dimensions.get("window");
const CIRCLER = width * 0.1;
const SCROLL_SEPARATOR = height * 0.08;
const SCROLL_INTERVAL = height + SCROLL_SEPARATOR;
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
  idx,
}) {
  const [progress, setProgress] = useState(3);
  const [viewToggle, setViewToggle] = useState(false);
  const safeInsets = useSafeAreaInsets();

  const lottieRef = useRef(null);
  const viewTranslator = useRef(new Animated.Value(VIEWERS_HEIGHT)).current;
  const bgTranslator = viewTranslator.interpolate({
    inputRange: [VIEWERS_HEIGHT_SHOW, VIEWERS_HEIGHT],
    outputRange: [colors.medium, "transparent"],
  });
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

  const handleViewPress = () => {
    if (!viewToggle) {
      setScroller(false);
      lottieRef?.current?.pause();
      Animated.spring(viewTranslator, {
        toValue: VIEWERS_HEIGHT_SHOW,
        useNativeDriver: false,
      }).start(() => setViewToggle(true));
    } else {
      setScroller(true);
      lottieRef?.current?.play();
      Animated.timing(viewTranslator, {
        toValue: VIEWERS_HEIGHT,
        useNativeDriver: false,
      }).start(() => setViewToggle(false));
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
          <Animated.View
            style={{
              ...styles.viewersContainer,
              transform: [{ translateY: viewTranslator }],
              backgroundColor: bgTranslator,
            }}
          >
            <TouchableOpacity
              onPress={handleViewPress}
              style={styles.viewersBtn}
            >
              <View style={styles.viewersHeader}>
                <AntDesign name="eye" size={22} color={colors.white} />
                <AppText bold size="xlarge" style={styles.viewersCount}>
                  0
                </AppText>
              </View>
            </TouchableOpacity>
            {viewToggle && (
              <>
                <Separator h={2} />
                <View style={styles.viewersList}>
                  <FlatList
                    data={subGenres}
                    listKey={uuid.v4()}
                    keyExtractor={(item) => item.id}
                    renderItem={RenderViewContent}
                  />
                </View>
              </>
            )}
          </Animated.View>
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
