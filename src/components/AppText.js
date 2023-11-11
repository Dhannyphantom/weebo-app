import React, { useContext, useEffect, useState } from "react";
import { Text, Dimensions } from "react-native";
import ThemeContext from "../config/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      scaledSize = 14;
      break;
    case "small":
      scaledSize = 12;
      break;
    case "xsmall":
      scaledSize = 10;
      break;
    case "xxsmall":
      scaledSize = 8;
      break;
    case "xxxsmall":
      scaledSize = 6.5;
      break;
    case "large":
      scaledSize = 18;
      break;
    case "xlarge":
      scaledSize = 20;
      break;
    case "xxlarge":
      scaledSize = 24;
    case "xxxlarge":
      scaledSize = 28;
  }

  const prepare = async () => {
    let appSettings = await AsyncStorage.getItem("settings");
    if (appSettings) {
      appSettings = JSON.parse(appSettings);
      const fScaler = appSettings[1]?.data[1]?.default;
      switch (fScaler) {
        case "normal":
          setFScale(1);
          break;
        case "smaller":
          setFScale(0.15);
          break;
        case "small":
          setFScale(0.5);
          break;
        case "large":
          setFScale(1.5);
          break;
        case "larger":
          setFScale(2);
          break;
      }
    }
  };

  // useEffect(() => {
  //   // prepare();
  // }, []);

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
