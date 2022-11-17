import React from "react";
import { StyleSheet, View } from "react-native";
import * as FacebookAds from "expo-ads-facebook";
import AppText from "./AppText";
const { AdIconView, AdMediaView, AdTriggerView } = FacebookAds;

export const FB_ADS_ID = Platform.select({
  ios: __DEV__
    ? "VID_HD_16_9_15S_APP_INSTALL#406752991548934_406755581548675"
    : "ca-app-pub-3603875446667492/8881804714",
  android: !__DEV__
    ? "VID_HD_16_9_15S_APP_INSTALL#406752991548934_406754288215471"
    : "ca-app-pub-3603875446667492/3217430636",
});

// export const adsManager = new FacebookAds.NativeAdsManager(FB_ADS_ID, 2);

const NativeAds = ({ nativeAd }) => {
  console.log(nativeAd);
  return (
    <View style={styles.container}>
      <AppText> {nativeAd.advertiserName} </AppText>
      <AppText bold> {nativeAd.headline} </AppText>
      <AppText bold> {nativeAd.bodyText} </AppText>

      {/* <AdMediaView />
      <AdIconView />
      <AdTriggerView>
        <AppText>{nativeAd.bodyText}</AppText>
      </AdTriggerView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 400,
    height: 500,
    backgroundColor: "red",
  },
});

export default FacebookAds.withNativeAd(NativeAds);
