import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../constants/colors";
import AppText from "./AppText";

const BADGE_OFFSET = -2;

export default function Badger({ number, noNumber = true, offset = 0 }) {
  if (!number || number < 1) return null;
  const formatNumber = number > 99 ? "99+" : number;
  return (
    <View
      style={[
        styles.badge,
        { top: BADGE_OFFSET + offset, left: BADGE_OFFSET + offset },
      ]}
    >
      <View style={[styles.badgeView, noNumber && styles.noNumber]}>
        {!noNumber && (
          <AppText
            bold
            size={number > 9 ? "xxsmall" : "xsmall"}
            style={styles.badgeText}
          >
            {formatNumber}
          </AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
  },
  badgeText: {
    color: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 3,
    margin: 0,
  },
  badgeView: {
    backgroundColor: colors.heartLight,
    // width: BADGE_SIZE,
    // height: BADGE_SIZE,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  noNumber: {
    width: 15,
    borderRadius: 100,
    height: 15,
    backgroundColor: colors.heartLight,
  },
});
