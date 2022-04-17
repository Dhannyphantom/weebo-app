import React from "react";
import { View, StyleSheet } from "react-native";

import Screen from "../components/Screen";
import AppText from "../components/AppText";

const DisplayMediaScreen = () => {
  return (
    <Screen>
      <View style={styles.container}>
        <AppText> This will like display Feed Images and Video </AppText>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {},
});
export default DisplayMediaScreen;
