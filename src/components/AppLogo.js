import React from "react";
import { StyleSheet, Image, Dimensions } from "react-native";

import header from "../../assets/otaku-name.png";
import icon from "../../assets/icon_dark.png";

const { width } = Dimensions.get("window");

const AppLogo = ({ style, type = "header" }) => {
  let logoDefaultStyle, logoSource;
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
  return <Image source={logoSource} style={[logoDefaultStyle, style]} />;
};
const styles = StyleSheet.create({
  logo: {
    width: width * 0.15,
    height: width * 0.11,
  },
});
export default AppLogo;
