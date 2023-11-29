import React from "react";
import { View, StyleSheet } from "react-native";
import ShowGroup from "../components/ShowGroup";

const ShowsScreen = ({ route: { params } }) => {
  const headerTitle = params?.recommendations
    ? "Anime/Manga Bucket Lists"
    : "Shows";

  return (
    <View style={styles.container}>
      <ShowGroup screen="show" headerTitle={headerTitle} params={params} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ShowsScreen;
