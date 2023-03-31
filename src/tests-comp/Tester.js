import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import TobiGuide from "../components/TobiGuide";

// const { width, height } = Dimensions.get("screen");

export default function Tester() {
  const [guide, setGuide] = useState({ vis: false, close: false });
  return (
    <View style={styles.container}>
      <TobiGuide data={guide} setData={setGuide} />
      <AppButton
        title="Toggle"
        bare
        onPress={() => {
          setGuide({ ...guide, vis: true });
        }}
      />
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
