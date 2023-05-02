import React, { useContext, useState } from "react";
import { StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import uuid from "react-native-uuid";

import AppText from "./AppText";
import ThemeContext from "../config/ThemeContext";
import MediaModal from "./MediaModal";

const { width, height } = Dimensions.get("window");

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
    backgroundColor: theme.lighter,
    width: size === "small" ? width * 0.48 : width * 0.98,
    maxHeight: size === "small" ? height * 0.5 : height * 0.9,
    minHeight: size === "small" ? height * 0.35 : height * 0.8,
  };

  const infoText = data.map((info, idx) => {
    return (
      <AppText key={uuid.v4() + idx}>
        <AppText style={{ ...styles.title, color: theme.medium }} bold>
          {info.title}
        </AppText>{" "}
        {"\n"}
        <AppText style={styles.value}>{info.value ?? ""}</AppText>
        {"\n\n"}
      </AppText>
    );
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
      <AppText
        numberOfLines={size === "small" ? 12 : null}
        ellipsizeMode="tail"
        style={styles.mainText}
      >
        {infoText}
      </AppText>
      <MediaModal setVisible={setDisplay} modalObject={display} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    borderRadius: width * 0.022,
    elevation: 2,
    // overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  mainText: {
    textAlign: "center",
  },
  textCont: {
    marginBottom: 10,
  },
  title: {
    textTransform: "capitalize",
  },
  value: {
    textTransform: "capitalize",
    width: "90%",
    alignSelf: "center",
  },
});
export default InfoChallenge;
