import React, { useContext } from "react";
import { StyleSheet, Text } from "react-native";
import ThemeContext from "../config/ThemeContext";

const AppText = ({ children, style, size = "normal", bold, ...otherProps }) => {
  const theme = useContext(ThemeContext);
  //size = ["normal", "small", "xsmall", "large", "xlarge", "xxlarge"]
  let scaledSize;
  switch (size) {
    case "normal":
      scaledSize = 16;
      break;
    case "small":
      scaledSize = 14;
      break;
    case "xsmall":
      scaledSize = 12;
      break;
    case "xxsmall":
      scaledSize = 9;
      break;
    case "large":
      scaledSize = 17;
      break;
    case "xlarge":
      scaledSize = 20;
      break;
    case "xxlarge":
      scaledSize = 24;
    case "xxxlarge":
      scaledSize = 28;
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
