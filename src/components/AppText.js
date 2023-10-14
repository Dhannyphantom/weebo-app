import React, { useContext } from "react";
import { Text, Dimensions } from "react-native";
import ThemeContext from "../config/ThemeContext";

const { fontScale, scale } = Dimensions.get("screen");

const AppText = ({
  children,
  style,
  size = "normal",
  textStyle = "regular",
  bold,
  ...otherProps
}) => {
  const theme = useContext(ThemeContext);
  //size = ["normal", "small", "xsmall", "large", "xlarge", "xxlarge"]
  let scaledSize;
  switch (size) {
    case "normal":
      scaledSize = (17 * fontScale) / scale;
      break;
    case "small":
      scaledSize = (14 * fontScale) / scale;
      break;
    case "xsmall":
      scaledSize = (10 * fontScale) / scale;
      break;
    case "xxsmall":
      scaledSize = (8 * fontScale) / scale;
      break;
    case "large":
      scaledSize = (18 * fontScale) / scale;
      break;
    case "xlarge":
      scaledSize = (20 * fontScale) / scale;
      break;
    case "xxlarge":
      scaledSize = (24 * fontScale) / scale;
    case "xxxlarge":
      scaledSize = (28 * fontScale) / scale;
  }

  return (
    <Text
      {...otherProps}
      style={[
        { color: theme.color },
        {
          ...style,
          fontSize: scaledSize,
          fontFamily: bold ? `sans-bold` : `sans-${textStyle}`,
        },
      ]}
    >
      {children}
    </Text>
  );
};

export default AppText;
