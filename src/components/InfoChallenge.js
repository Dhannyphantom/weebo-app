import React, { useContext, useState } from "react";
import { StyleSheet, Dimensions, TouchableOpacity, View } from "react-native";
import uuid from "react-native-uuid";

import AppText from "./AppText";
import ThemeContext from "../config/ThemeContext";
import MediaModal from "./MediaModal";
import colors from "../constants/colors";

const { width, height } = Dimensions.get("window");

export const RenderInfoDetails = ({ info }) => {
  const theme = useContext(ThemeContext);
  return (
    <View style={styles.info} key={uuid.v4()}>
      <AppText
        style={{
          ...styles.title,
          color: theme.mode === "light" ? colors.medium : colors.primary,
        }}
        bold
      >
        {info.title}
      </AppText>
      <AppText style={styles.value}>{info.value ?? ""}</AppText>
    </View>
  );
};

const InfoChallenge = ({ data, size = "small", color }) => {
  const theme = useContext(ThemeContext);
  const [display, setDisplay] = useState({ vis: false, item: null });

  const dataObj = {
    type: "info",
    infoData: data,
    color,
  };

  const handlePress = () => {
    if (size === "full") return;
    setDisplay({ vis: true, item: dataObj });
  };

  const contStyle = {
    backgroundColor: theme.extralight,
    width: size === "small" ? width * 0.48 : width * 0.98,
    maxHeight: size === "small" ? height * 0.5 : height * 0.9,
    minHeight: size === "small" ? height * 0.35 : height * 0.8,
  };

  const infoText = data.map((info) => {
    return <RenderInfoDetails key={uuid.v4()} info={info} />;
  });

  return (
    <TouchableOpacity
      activeOpacity={size === "small" ? 0.8 : 1}
      onPress={handlePress}
      style={{
        ...styles.container,
        ...contStyle,
      }}
    >
      {infoText}
      <MediaModal setVisible={setDisplay} modalObject={display} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    borderRadius: width * 0.022,
    elevation: 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    padding: 10,
  },
  info: { marginBottom: 15 },
  mainText: {
    textAlign: "center",
  },
  textCont: {
    marginBottom: 10,
  },
  title: {
    textTransform: "capitalize",
    textAlign: "center",
    alignSelf: "center",
    lineHeight: 32,
  },
  value: {
    textTransform: "capitalize",
    maxWidth: "80%",
    alignSelf: "center",
    textAlign: "center",
  },
});
export default InfoChallenge;
