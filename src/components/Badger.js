import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../constants/colors";
import AppText from "./AppText";

const BADGE_SIZE = 25;

export default function Badger({ number }) {
  if (!number || number < 1) return null;
  const formatNumber = number > 99 ? "99+" : number;
  return (
    <View style={styles.badge}>
      <View style={styles.badgeView}>
        <AppText
          bold
          size={number > 99 ? "xxsmall" : "xsmall"}
          style={styles.badgeText}
        >
          {formatNumber}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -BADGE_SIZE / 2.5,
    left: -BADGE_SIZE / 2.5,
  },
  badgeText: {
    color: colors.white,
    padding: 0,
    margin: 0,
  },
  badgeView: {
    backgroundColor: colors.heartLight,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
