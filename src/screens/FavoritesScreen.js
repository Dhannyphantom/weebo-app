import React from "react";
import { View, StyleSheet, Text } from "react-native";

import Screen from "../components/Screen";

const FavoritesScreen = () => {
  return (
    <Screen>
      <View style={styles.container}>
        <Text>FavoritesScreen</Text>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {},
});
export default FavoritesScreen;
