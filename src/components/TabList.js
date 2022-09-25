import React, { useContext, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Cards from "./Cards";
import ThemeContext from "../config/ThemeContext";
import { FontAwesome5 } from "@expo/vector-icons";
import AppText from "./AppText";
import colors from "../constants/colors";

const { width } = Dimensions.get("screen");
const TAB_WIDTH = width * 0.85;

export default function TabList({ items = [], state, onPress }) {
  const theme = useContext(ThemeContext);
  const slider = useRef(new Animated.Value(0)).current;

  const handleTabAnimation = (tab, idx) => {
    Animated.timing(slider, {
      toValue: (TAB_WIDTH / items.length) * idx,
      useNativeDriver: true,
    }).start();
    onPress(tab);
  };

  return (
    <Cards style={{ ...styles.boxCont, backgroundColor: theme.background }}>
      {items.map((obj, idx) => {
        let sBg, sColor;
        if (state[obj.tab]) {
          sBg = theme.unchange;
          sColor = colors.primary;
        } else {
          sBg = theme.background;
          sColor = theme.medium;
        }
        return (
          <TouchableOpacity
            key={idx + obj.tab}
            activeOpacity={0.7}
            onPress={() => handleTabAnimation(obj.tab, idx)}
            style={styles.box}
          >
            <FontAwesome5 name="dot-circle" size={14} color={sColor} />
            <AppText style={styles.boxText}>{obj.name}</AppText>
          </TouchableOpacity>
        );
      })}
      <Animated.View
        style={[
          styles.slider,
          { width: "50%", transform: [{ translateX: slider }] },
        ]}
      />
    </Cards>
  );
}

const styles = StyleSheet.create({
  boxCont: {
    flexDirection: "row",
    width: TAB_WIDTH,
    alignSelf: "center",
    marginVertical: 10,
    overflow: "hidden",
    borderRadius: width * 0.02,
  },
  box: {
    paddingVertical: 30,
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: {
    marginLeft: 9,
  },
  slider: {
    position: "absolute",
    height: "100%",
    width: 50,
    zIndex: -1,
    backgroundColor: colors.unChange,
  },
});
