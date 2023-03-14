import React, { useContext } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ThemeContext from "../config/ThemeContext";
import {
  MobileAds,
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

import AppText from "./AppText";

const { width, height } = Dimensions.get("screen");

export const BANNER_ID = Platform.select({
  ios: __DEV__ ? TestIds.REWARDED : "ca-app-pub-3603875446667492/8969273853",
  android: !__DEV__
    ? TestIds.REWARDED
    : "ca-app-pub-3603875446667492/8969273853",
});

const bannerTypes = [
  BannerAdSize.MEDIUM_RECTANGLE,
  BannerAdSize.FULL_BANNER,
  BannerAdSize.BANNER,
  BannerAdSize.LARGE_BANNER,
];

export default function BannerAds() {
  const theme = useContext(ThemeContext);

  const bannerSize =
    bannerTypes[Math.floor(Math.random() * bannerTypes.length)];

  let bannerHeight = Math.max(200, height * 0.2);

  if (bannerSize === BannerAdSize.MEDIUM_RECTANGLE) {
    bannerHeight = height * 0.35;
  }

  const onAdFailedToLoad = (error) => {
    console.log("ADS ERR:::", error);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="advertisements" size={25} />
        <AppText> &bull; </AppText>
        <AppText bold>Sponsored</AppText>
      </View>
      <View style={[styles.banner, { height: bannerHeight }]}>
        <BannerAd
          unitId={BANNER_ID}
          size={bannerSize}
          requestOptions={{
            keywords: ["comics", "anime", "manga", "toon"],
          }}
          onAdFailedToLoad={onAdFailedToLoad}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    width: width * 0.97,
    marginVertical: 8,
    elevation: 0.5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: "center",
    borderRadius: width * 0.04,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
});
