import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

/// PACK A = MaterialCommunityIcons
/// PACK B = MaterialIcons

import AppText from "./AppText";
import colors from "../constants/colors";
import ThemeContext from "../config/ThemeContext";

const Link = ({
  name,
  onPress,
  clickable = true,
  pack = "a",
  iconName,
  style,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity
      activeOpacity={clickable ? 0.6 : 1}
      onPress={clickable ? onPress : null}
      style={[
        {
          ...styles.container,
          backgroundColor: clickable ? theme.extralight : colors.unChange,
        },
        style,
      ]}
    >
      <View style={styles.title}>
        {pack === "a" && (
          <MaterialCommunityIcons
            name={iconName}
            size={12}
            color={colors.primary}
          />
        )}
        {pack === "b" && (
          <MaterialIcons name={iconName} size={12} color={colors.primary} />
        )}
        <AppText bold style={styles.link}>
          {name}
        </AppText>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // minHeight: 42,
    overlayColor: "red",
    borderRadius: 12,
    justifyContent: "space-between",
    paddingHorizontal: 13,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },
  link: {
    color: colors.primary,
    marginLeft: 5,
  },
  title: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Link;
