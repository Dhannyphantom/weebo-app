import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../constants/colors";
import AppText from "./AppText";

export default function Badger({ number }) {
  if (!number || number < 1) return null;
  return (
    <View style={styles.badge}>
      <View style={styles.badgeView}>
        <AppText bold style={styles.badgeText}>
          {number}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -8,
    left: -8,
  },
  badgeText: {
    color: colors.white,
  },
  badgeView: {
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 100,
    minWidth: 15,
    minHeight: 15,
    // borderRadius: 200,
    // paddingHorizontal: 10,
    // paddingVertical: 7,
  },
});
