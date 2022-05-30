import React from "react";
import { View, StyleSheet } from "react-native";
import ShowGroup from "../components/ShowGroup";

const GroupsScreen = () => {
  return (
    <View style={styles.container}>
      <ShowGroup screen="group" headerTitle="Groups & organizations" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default GroupsScreen;
