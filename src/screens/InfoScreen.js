import React from "react";
import { View, StyleSheet, Text } from "react-native";

import Screen from "../components/Screen";

const InfoScreen = () => {
  return (
    <Screen>
      <View style={styles.container}>
        <Text>Post all info Screen</Text>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {},
});
export default InfoScreen;
