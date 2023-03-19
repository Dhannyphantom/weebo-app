import React, { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import TobiGuide from "../components/TobiGuide";

const { width, height } = Dimensions.get("screen");

export default function Tester() {
  const [guide, setGuide] = useState(false);
  return (
    <View style={styles.container}>
      <TobiGuide visible={guide} setVisible={setGuide} />
      <Button title="Toggle" onPress={() => setGuide(!guide)} />
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
