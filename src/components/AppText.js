import React, { useContext } from "react";
import { Text } from "react-native";
import ThemeContext from "../config/ThemeContext";

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
      scaledSize = 14;
      break;
    case "small":
      scaledSize = 12;
      break;
    case "xsmall":
      scaledSize = 11;
      break;
    case "xxsmall":
      scaledSize = 9;
      break;
    case "large":
      scaledSize = 16;
      break;
    case "xlarge":
      scaledSize = 19;
      break;
    case "xxlarge":
      scaledSize = 22;
    case "xxxlarge":
      scaledSize = 28;
    default:
      break;
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
