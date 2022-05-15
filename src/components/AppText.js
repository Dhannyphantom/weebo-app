import React, { useContext } from "react";
import { Dimensions, StyleSheet, Text } from "react-native";
import ThemeContext from "../config/themeContext";
const { width, fontScale } = Dimensions.get("window");

const AppText = ({ children, style, size = "normal", bold, ...otherProps }) => {
  const theme = useContext(ThemeContext);
  //size = ["normal", "small", "xsmall", "large", "xlarge", "xxlarge"]
  let scaledSize;
  switch (size) {
    case "normal":
      scaledSize = 14;
      // scaledSize = width * 0.025;
      break;
    case "small":
      scaledSize = 12;
      // scaledSize = width * 0.02;
      break;
    case "xsmall":
      scaledSize = 10;
      // scaledSize = width * 0.018;
      break;
    case "xxsmall":
      scaledSize = 9;
      // scaledSize = width * 0.015;
      break;
    case "large":
      scaledSize = 16;
      // scaledSize = width * 0.029;
      break;
    case "xlarge":
      scaledSize = 19;
      // scaledSize = width * 0.034;
      break;
    case "xxlarge":
      scaledSize = 22;
    // scaledSize = width * 0.044;
    case "xxxlarge":
      scaledSize = 26;
    // scaledSize = width * 0.054;
    default:
      break;
  }
  return (
    <>
      {!bold && (
        <Text
          {...otherProps}
          style={[
            styles.text,
            { color: theme.color },
            { ...style, fontSize: scaledSize },
          ]}
        >
          {children}
        </Text>
      )}
      {bold && (
        <Text
          {...otherProps}
          style={[
            styles.bold,
            { color: theme.color },
            { ...style, fontSize: scaledSize },
          ]}
        >
          {children}
        </Text>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  text: {
    // fontSize: fontScale * width * 0.023,
    fontFamily: "sen",
  },
  bold: {
    // fontSize: fontScale * width * 0.024,
    fontFamily: "sen-bold-b1",
  },
});
export default AppText;
