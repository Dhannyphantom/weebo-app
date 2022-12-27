import React from "react";
import { StyleSheet, Text, View } from "react-native";
// import FaceBookAds from "react-native-fbads";

export default function NativeAds() {
  return (
    <View style={styles.container}>
      <Text>Hii</Text>
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
