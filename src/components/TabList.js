import React, { useContext } from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import Cards from "./Cards";
import ThemeContext from "../config/ThemeContext";
import { FontAwesome5 } from "@expo/vector-icons";
import AppText from "./AppText";
import colors from "../constants/colors";

const { width } = Dimensions.get("screen");

export default function TabList({ items = [], state, onPress }) {
  const theme = useContext(ThemeContext);

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
          <>
            {/* obj = {tab: string, } */}
            <TouchableOpacity
              activeOpacity={0.7}
              key={idx + obj.tab}
              onPress={() => onPress(obj.tab)}
              style={{ ...styles.box, backgroundColor: sBg }}
            >
              <FontAwesome5 name="dot-circle" size={14} color={sColor} />
              <AppText style={styles.boxText}>{obj.name}</AppText>
            </TouchableOpacity>
            {/* <View style={styles.line}></View> */}
          </>
        );
      })}
    </Cards>
  );
}

const styles = StyleSheet.create({
  boxCont: {
    flexDirection: "row",
    width: width * 0.8,
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
});
