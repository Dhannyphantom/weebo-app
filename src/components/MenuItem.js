import React from "react";
import { View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import colors from "../constants/colors";

const MenuItem = ({ iconName, isCurrent }) => {
  return (
    <View style={styles.container}>
      <AntDesign
        name={iconName}
        size={32}
        style={{ color: isCurrent ? colors.primary : colors.medium }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default MenuItem;
