import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import {
  Feather,
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../constants/colors";
import Cards from "./Cards";
import AppText from "./AppText";

const screen = Dimensions.get("window");
const wUse = screen.width * 0.62;

const ActionMenu = ({
  item: { title = "", bg, bg1, icon, iconPack, subTitle },
  onPress,
  style,
}) => {
  let iconSize;
  if (style) {
    iconSize = style.width / 2.3;
  } else {
    iconSize = wUse / 2.2;
  }
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
      <Cards style={{ ...styles.cardBox, ...style }}>
        <LinearGradient colors={[bg, bg1]} style={styles.background}>
          <View style={styles.upHeader}>
            <View style={{ ...styles.side }}>
              {iconPack == "AD" ? (
                <AntDesign
                  name={icon}
                  size={iconSize}
                  color={colors.white}
                  style={{ opacity: 0.3 }}
                />
              ) : iconPack === "F" ? (
                <Feather
                  name={icon}
                  size={iconSize}
                  color={colors.white}
                  style={{ opacity: 0.3 }}
                />
              ) : iconPack === "I" ? (
                <Ionicons
                  name={icon}
                  size={iconSize}
                  color={colors.white}
                  style={{ opacity: 0.3 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name={icon}
                  size={iconSize}
                  color={colors.white}
                  style={{ opacity: 0.3 }}
                />
              )}
            </View>
            <View style={styles.upText}>
              <AppText size="large" bold style={styles.title}>
                {title}
              </AppText>
              {subTitle && (
                <AppText size="small" style={styles.subTxt}>
                  {subTitle}
                </AppText>
              )}
            </View>
          </View>
        </LinearGradient>
      </Cards>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    borderRadius: screen.width * 0.021,
    justifyContent: "center",
  },
  cardBox: {
    marginVertical: 8,
    marginHorizontal: 17,
    borderRadius: screen.width * 0.021,
    width: wUse,
    height: wUse - wUse / 2.3,
    overflow: "hidden",
  },
  side: {
    marginLeft: -screen.width * 0.045,
    marginTop: 10,
  },
  subTxt: {
    color: colors.black,
    width: "80%",
    opacity: 0.5,
    marginTop: 5,
  },
  upHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  upText: {
    flex: 1,
    marginTop: 6,
    marginLeft: 6,
    marginRight: 5,
  },
  title: {
    width: "100%",
    color: colors.white,
    textTransform: "uppercase",
  },
});
export default ActionMenu;
