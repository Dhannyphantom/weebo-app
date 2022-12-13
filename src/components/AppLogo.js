import React, { useContext } from "react";
import { StyleSheet, Image, Dimensions, Text, View } from "react-native";

import header from "../../assets/icon.png";
import icon from "../../assets/icon_dark.png";
import ThemeContext from "../config/ThemeContext";

const { width } = Dimensions.get("window");

const AppLogo = ({ style, type = "header" }) => {
  let logoDefaultStyle, logoSource;
  const theme = useContext(ThemeContext);
  if (type === "header") {
    logoDefaultStyle = {
      width: width * 0.25,
      height: width * 0.08,
    };
    logoSource = header;
  } else if (type === "icon") {
    logoDefaultStyle = {
      width: width * 0.22,
      height: width * 0.22,
    };
    logoSource = icon;
  }

  if (type === "header") {
    return (
      <View style={styles.logoContainer}>
        <Text style={{ ...styles.logoText, color: theme.color }}>WEEBO</Text>
      </View>
    );
  }

  return <Image source={logoSource} style={[logoDefaultStyle, style]} />;
};
const styles = StyleSheet.create({
  logo: {
    width: width * 0.15,
    height: width * 0.11,
  },
  logoText: {
    fontFamily: "fonter",
    fontSize: width * 0.07,
  },
  logoContainer: {
    paddingLeft: width * 0.03,
    width: width * 0.3,
  },
});
export default AppLogo;
