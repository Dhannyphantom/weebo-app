import React, { useContext, useEffect, useState } from "react";
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
import colors from "../constants/colors";
import ActivityIndicator from "./ActivityIndicator";

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
  BannerAdSize.MEDIUM_RECTANGLE,
  BannerAdSize.BANNER,
  BannerAdSize.MEDIUM_RECTANGLE,
  BannerAdSize.LARGE_BANNER,
  BannerAdSize.MEDIUM_RECTANGLE,
];

export default function BannerAds() {
  const theme = useContext(ThemeContext);
  const [actions, setActions] = useState({
    loadFail: false,
    bannerSize: BannerAdSize.BANNER,
    loadedOnce: false,
  });

  let bannerHeight = Math.max(200, height * 0.2);

  if (actions.bannerSize === BannerAdSize.MEDIUM_RECTANGLE) {
    bannerHeight = height * 0.35;
  }

  const onAdFailedToLoad = (error) => {
    if (!actions.loadFail) {
      setActions({ ...actions, loadFail: true, loadedOnce: true });
    }
  };

  useEffect(() => {
    if (!actions.loadedOnce) {
      setActions({
        ...actions,
        bannerSize: bannerTypes[Math.floor(Math.random() * bannerTypes.length)],
      });
    }
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.white,
          borderWidth: actions.loadFail ? 3 : 0,
          borderColor: "#ddd",
        },
      ]}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="advertisements" size={25} />
        <AppText> &bull; </AppText>
        <AppText bold>Content</AppText>
      </View>
      <View style={[styles.banner, { height: bannerHeight }]}>
        <ActivityIndicator
          type="network"
          text="Ad loading..."
          visible={actions.loadFail}
          size={0.25}
          absolute
          transparent
        />
        <BannerAd
          unitId={BANNER_ID}
          size={actions.bannerSize}
          requestOptions={{
            keywords: ["comics", "anime", "manga", "toon"],
          }}
          onAdFailedToLoad={onAdFailedToLoad}
          onAdOpened={() => setActions({ ...actions, loadFail: false })}
          onAdLoaded={() => setActions({ ...actions, loadFail: false })}
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
