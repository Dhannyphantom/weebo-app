import React, { useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import * as MediaLibrary from "expo-media-library";
import ActivityIndicator from "./ActivityIndicator";

const ImageGallery = ({ route }) => {
  if (!route.params.myAssets) return <ActivityIndicator visible={true} />;
  return (
    <View style={styles.container}>
      <Text>Hi</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
});
export default ImageGallery;
