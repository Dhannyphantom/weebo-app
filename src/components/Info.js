import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import AppText from "./AppText";
import colors from "../constants/colors";
import { getFeedNumber } from "../constants/helpers";

const Info = ({ title, count, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <View style={styles.container}>
        <AppText style={styles.count} size="xlarge" bold>
          {getFeedNumber(count)}
        </AppText>
        <AppText style={styles.title} bold>
          {title}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    color: colors.medium,
  },
});
export default Info;
