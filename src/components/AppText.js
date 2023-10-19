import React, { useContext } from "react";
import { Text, Dimensions } from "react-native";
import ThemeContext from "../config/ThemeContext";

const { fontScale } = Dimensions.get("screen");

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
      scaledSize = 14 / fontScale;
      break;
    case "small":
      scaledSize = 12 / fontScale;
      break;
    case "xsmall":
      scaledSize = 10 / fontScale;
      break;
    case "xxsmall":
      scaledSize = 8 / fontScale;
      break;
    case "xxxsmall":
      scaledSize = 6.5 / fontScale;
      break;
    case "large":
      scaledSize = 18 / fontScale;
      break;
    case "xlarge":
      scaledSize = 20 / fontScale;
      break;
    case "xxlarge":
      scaledSize = 24 / fontScale;
    case "xxxlarge":
      scaledSize = 28 / fontScale;
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
