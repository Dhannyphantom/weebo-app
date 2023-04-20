import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import colors from "../constants/colors";
import AppText from "./AppText";

const { width, height } = Dimensions.get("window");

const MOVE_Y = height * 0.1;

const PopMessage = ({ popData, timer = 1, setter }) => {
  // popData = { type : "success/failed", msg: "text", vis: bool, cb: func}
  if (!popData.vis) return null;
  const translator = useRef(new Animated.Value(0)).current;

  const circleStyles = {
    ...styles.circle,
    backgroundColor:
      popData.type === "success" ? colors.greenLight : colors.heart,

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
          delay: timer * 1000,
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
    padding: 10,
    paddingVertical: 15,
    elevation: 1.1,
    borderRadius: 10,
    bottom: 50,
  },
  text: {
    color: colors.black,
    textAlign: "center",
  },
});
export default PopMessage;
