import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import AppText from "./AppText";
import Separator from "./Separator";
import colors from "../constants/colors";
import ThemeContext from "../config/ThemeContext";

const { width } = Dimensions.get("window");

const AppHeader = ({
  title,
  titleStyle,
  icon = true,
  style,
  dotPress,
  type = "background",
  RightComponent,
  iconColor = colors.black,
}) => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  return (
    <>
      {type == "background" && (
        <View style={[styles.container, style]}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => (icon ? navigation.pop() : null)}
            activeOpacity={icon ? 0.66 : 1}
          >
            {icon && (
              <Feather name="chevron-left" size={29} color={theme.medium} />
            )}
            <AppText
              size="xlarge"
              style={{
                ...styles.title,
                color: theme.color,
                ...titleStyle,
              }}
              bold
            >
              {title}
            </AppText>
          </TouchableOpacity>
          {RightComponent && <RightComponent />}
        </View>
      )}
      {type === "transparent" && (
        <View style={{ ...styles.bgContainer, ...style }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.bgIconCont}
          >
            <Feather
              name="chevron-left"
              size={width * 0.045}
              color={iconColor}
            />
          </TouchableOpacity>
          {dotPress && (
            <TouchableOpacity
              onPress={dotPress}
              activeOpacity={0.7}
              style={styles.bgIconCont}
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={width * 0.045}
                color={iconColor}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      <Separator h={1} m={0.1} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 8,
  },
  bgContainer: {
    flexDirection: "row",
    width,
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  bgIconCont: {
    backgroundColor: "rgba(0,0,0,0.09)",
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: width * 0.02,
  },
  title: {
    textTransform: "capitalize",
    marginLeft: 4,
  },
});
export default AppHeader;
