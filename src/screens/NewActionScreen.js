import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "../components/AppText";
import Screen from "../components/Screen";

const NewActionScreen = () => {
  return (
    <Screen>
      <View style={styles.container}>
        <AppText>Ahm thinking i should make this post screen</AppText>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default NewActionScreen;
