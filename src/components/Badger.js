import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../constants/colors";
import AppText from "./AppText";

export default function Badger({ number }) {
  if (!number || number < 1) return null;
  return (
    <View style={styles.badge}>
      <AppText bold style={styles.badgeText}>
        {number}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    backgroundColor: colors.heart,
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    top: -(25 / 2),
    left: -(25 / 2),
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: colors.white,
  },
});
