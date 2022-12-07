import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

import colors from "../constants/colors";
import AppText from "./AppText";

const screen = Dimensions.get("window");

const AppPickerItem = ({ text, onPress, selected = false, desc, example }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.container, selected ? styles.selected : {}]}
      onPress={onPress}
    >
      <View>
        <AppText style={styles.headerText} bold>
          {text}
        </AppText>
        <AppText style={styles.descText}> {desc} </AppText>
        {example && <AppText style={styles.exmText}> Example : </AppText>}
        {example && <AppText style={styles.exmText}> {example} </AppText>}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screen.width * 0.3,
    margin: (screen.width * 0.03) / 3,
    padding: 10,
  },
  descText: {
    fontSize: 10,
    textAlign: "center",
    color: colors.medium,
  },
  exmText: {
    textAlign: "center",
    color: colors.medium,
    fontSize: 9,
  },
  headerText: {
    textAlign: "center",
    fontSize: 11,
  },
  selected: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: colors.primary,
  },
});
export default AppPickerItem;
