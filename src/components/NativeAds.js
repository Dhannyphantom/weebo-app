import React from "react";
import { StyleSheet, View } from "react-native";
import {
  AdIconView,
  MediaView,
  AdChoicesView,
  TriggerableView,
  withNativeAds,
} from "react-native-fbads";

function NativeAds() {
  return (
    <View>
      <AdChoicesView style={{ position: "absolute", left: 0, top: 0 }} />
      <AdIconView style={{ width: 50, height: 50 }} />
      <MediaView style={{ width: 160, height: 90 }} />
      <TriggerableView>
        <Text>{this.props.nativeAd.description}</Text>
      </TriggerableView>
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

export default withNativeAds(NativeAds);
