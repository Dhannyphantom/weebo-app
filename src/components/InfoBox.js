import React, { useContext } from "react";
import { StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import ThemeContext from "../config/ThemeContext";
import colors from "../constants/colors";
import { getDateObject } from "../constants/getFormatTime";
import AppText from "./AppText";

const { width } = Dimensions.get("window");

const InfoBox = ({ item, onPress, isMine }) => {
  const theme = useContext(ThemeContext);
  const isDate = ["release date", "endDate"].includes(item.prop);
  let infoValue;
  if (Array.isArray(item.value)) {
    if (item.value?.length === 0) {
      // infoValue = "none";
      return null;
    } else {
      infoValue = item.value.join(" | ");
    }
  } else if (isDate) {
    const timestamp = getDateObject(item.value);
    infoValue = timestamp.isFuture
      ? "Currently airing"
      : `${timestamp.month} ${timestamp.year}`;
  } else if (item.value === false) {
    infoValue = "No";
  } else if (item.value === true) {
    infoValue = "Yes";
  } else {
    infoValue = item.value;
  }
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={isDate && !isMine}
      style={[styles.container, { backgroundColor: theme.extralight }]}
    >
      <AppText style={styles.title} bold>
        {item.prop}
      </AppText>
      <AppText size="large" style={styles.info} bold>
        {infoValue}
      </AppText>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    maxWidth: width * 0.35,
    backgroundColor: colors.extraLight,
    elevation: 1.5,
    shadowRadius: 4,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    padding: width * 0.03,
    margin: width * 0.005,
    borderRadius: width * 0.012,
  },
  title: {
    color: colors.medium,
    textTransform: "capitalize",
  },
  info: {
    marginTop: 5,
    textTransform: "capitalize",
    opacity: 0.75,
  },
});
export default InfoBox;
