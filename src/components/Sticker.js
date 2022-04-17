import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../components/Screen";
import AppText from "./AppText";
import Separator from "./Separator";
import colors from "../constants/colors";

const screen = Dimensions.get("window");

const Sticker = ({ title, icon, pack = "a", textStyle }) => {
  // pack a === Feather
  // pack b === MaterialCOmm

  return (
    <Screen style={styles.body}>
      <View style={{ ...styles.headerBoxCont, marginLeft: 15 }}>
        {pack === "a" && (
          <Feather name={icon} size={19} color={colors.primary} />
        )}
        {pack === "b" && (
          <MaterialCommunityIcons
            name={icon}
            size={19}
            color={colors.primary}
          />
        )}
        <AppText size="large" style={{ ...styles.tvText, ...textStyle }} bold>
          {title} Feeds
        </AppText>
      </View>
      <Separator h={1} m={0.7} />
    </Screen>
  );
};
const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.white,
    position: "absolute",
    width: screen.width,
  },
  headerBoxCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  tvText: {
    color: colors.primary,
    marginVertical: 7,
    marginLeft: 5,
  },
});
export default Sticker;
