import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import AppText from "../components/AppText";
// import { getColors } from "react-native-image-colors";

const imgUrl = require("../../assets/welcome.jpg");

export default function Tester() {
  const [colors, setColors] = useState([]);

  // useEffect(() => {
  //   getColors(imgUrl, {
  //     fallback: "#228B22",
  //     cache: true,
  //     key: url,
  //   }).then(setColors);
  // }, []);

  return (
    <View style={styles.container}>
      <AppText> Hello world</AppText>
      <Image source={imgUrl} style={{ width: 200, height: 450 }} />
      <AppText size="xlarge" bold>
        {" "}
        {JSON.stringify(colors, null, 5)}{" "}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
