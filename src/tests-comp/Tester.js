import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import TobiGuide from "../components/TobiGuide";

const stateObj = [
  {
    icon: "account-check",
    text: "Earn 2 Weebo Points (WP) by clicking this icon to VERIFY this instance",
  },
  {
    icon: "trophy-outline",
    text: "Challenge instance with cool RELATED media content or identifying invalid information",
  },
  {
    icon: "advertisements",
    text: "App contains ads. But none will disrupt the flow of your experience",
  },
];

export default function Tester() {
  const [guide, setGuide] = useState({ vis: false, close: false });
  return (
    <View style={styles.container}>
      <TobiGuide data={guide} setData={setGuide} stateObj={stateObj} />
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
