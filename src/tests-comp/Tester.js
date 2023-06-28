import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import AppText from "../components/AppText";

const imgUrl = require("../../assets/welcome.jpg");

export default function Tester() {
  const [colors, setColors] = useState([]);

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
