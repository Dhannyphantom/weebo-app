import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";

import AppText from "./AppText";
import heartPop from "../../assets/animations/heartPop.json";

import LottieView from "lottie-react-native";

const screen = Dimensions.get("window");
const CONT_WIDTH = screen.width * 0.92;
const LOTTIE_SIZE = screen.width * 0.8;

const FeedText = ({
  title,
  handleLike,
  showMediaFunc,
  feed,
  liked,
  info,
  type,
}) => {
  const lotRef = useRef(null);
  const opaciter = useRef(new Animated.Value(0)).current;

  let touchTime = 0,
    timed;
  const handlePress = () => {
    const now = new Date().getTime();
    const diff = now - touchTime;
    let dPress = null;
    clearTimeout(timed);

    if (diff < 400 && diff > 0) {
      // double
      dPress = true;
      handleLike();
      Animated.timing(opaciter, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        liked ? lotRef?.current?.play(45, 90) : lotRef?.current?.play(0, 40);
      }, 120);
    } else {
      // single
      timed = setTimeout(() => {
        if (!dPress) {
          // navigation.navigate("Display", { item: title, data: feed });
          showMediaFunc({ item: title, feed });
        }
      }, 250);
    }

    touchTime = new Date().getTime();
  };

  const handleAnimFinish = () => {
    Animated.timing(opaciter, {
      toValue: 0,
      useNativeDriver: true,
      duration: 400,
    }).start();
  };

  return (
    <View style={styles.container}>
      {type !== "text" ? (
        <AppText style={styles.text} bold>
          {title}
        </AppText>
      ) : (
        <TouchableOpacity
          activeOpacity={1}
          onPress={handlePress}
          style={{ ...styles.bgCont, backgroundColor: info?.bg }}
        >
          <AppText
            size="xlarge"
            style={{ ...styles.coolText, color: info?.tColor }}
          >
            {title}
          </AppText>
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
              ref={lotRef}
              loop={false}
              style={styles.heartIcon}
            />
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 6,
  },
  coolText: {
    fontSize: 22,
    textAlign: "center",
  },
  bgCont: {
    width: CONT_WIDTH,
    alignSelf: "center",
    height: CONT_WIDTH - CONT_WIDTH * 0.25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    elevation: 2,
    marginVertical: 12,
  },
  text: {
    textAlign: "center",
    marginBottom: 8,
    textDecorationLine: "underline",
  },
  heartPop: {
    position: "absolute",
  },
  heartIcon: {
    width: LOTTIE_SIZE,
    height: LOTTIE_SIZE,
  },
});
export default FeedText;
