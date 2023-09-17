import { View, StyleSheet, Dimensions } from "react-native";
import ActivityIndicator from "./ActivityIndicator";
import AppText from "./AppText";
import colors from "../constants/colors";

const { width, height } = Dimensions.get("screen");

const RenderLoadMore = ({ hasNext, loader, text = "feeds" }) => {
  if (loader && hasNext) {
    return (
      <View>
        <ActivityIndicator
          visible={loader}
          type="spin"
          size={0.2}
          transparent
        />
      </View>
    );
  } else {
    return (
      <View style={styles.noContent}>
        <AppText bold size="larger" style={styles.noContentText}>
          No more {text}
        </AppText>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  noContent: {
    width,
    height: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  noContentText: {
    color: colors.medium,
    textAlign: "center",
  },
});

export default RenderLoadMore;
