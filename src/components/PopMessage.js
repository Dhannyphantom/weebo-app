import React, { useContext, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import colors from "../constants/colors";
import AppText from "./AppText";
import ThemeContext from "../config/ThemeContext";
import ActivityIndicator from "./ActivityIndicator";

const { width, height } = Dimensions.get("window");

const MOVE_Y = height * 0.1;

const PopMessage = ({ popData, timer = 1, setter }) => {
  // popData = { type : "success/failed", msg: "text", vis: bool, cb: func, timer: secs}
  if (!popData.vis) return null;
  const translator = useRef(new Animated.Value(0)).current;
  const theme = useContext(ThemeContext);

  const circleStyles = {
    ...styles.circle,
    backgroundColor:
      popData.type === "success"
        ? colors.unChange
        : popData.type === "failed"
        ? colors.heart
        : colors.primary,

    transform: [{ translateY: translator }],
    opacity: translator.interpolate({
      inputRange: [0, MOVE_Y],
      outputRange: [0, 1],
    }),
  };

  useEffect(() => {
    if (popData.vis) {
      Animated.sequence([
        Animated.spring(translator, {
          toValue: MOVE_Y,
          useNativeDriver: true,
          bounciness: 15,
        }),
        Animated.timing(translator, {
          toValue: 0,
          duration: 180,
          delay: popData.timer ? popData.timer * 1000 : timer * 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        popData?.cb && popData.cb();
        setter && setter();
      });
    }
  }, [popData]);

  return (
    <View style={styles.container}>
      <Animated.View style={circleStyles}>
        <AppText
          style={{
            ...styles.text,
            color: popData.type === "success" ? colors.black : colors.white,
          }}
          bold
        >
          {popData.msg}
        </AppText>
        {popData.loader && (
          <ActivityIndicator
            visible
            size={0.18}
            transparent
            style={styles.loader}
          />
        )}
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    // bottom: 0,
    zIndex: 100,
  },
  circle: {
    width: width * 0.8,
    // height: width * 0.2,
    alignSelf: "center",
    padding: 15,
    paddingVertical: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1.1,
    borderRadius: 10,
    bottom: 50,
  },
  loader: {
    maxHeight: 18,
    alignSelf: "flex-end",
    maxWidth: 20,
    marginRight: 8,
  },
  text: {
    color: colors.black,
    textAlign: "center",
  },
});
export default PopMessage;
