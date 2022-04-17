import React from "react";
import { View, StyleSheet } from "react-native";
import ShowGroup from "../components/ShowGroup";

const ShowsScreen = () => {
  return (
    <View style={styles.container}>
      <ShowGroup screen="show" headerTitle="Shows" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ShowsScreen;
