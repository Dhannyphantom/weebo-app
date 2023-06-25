import React, { useCallback, useEffect, useState } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import Main from "./src/Main";
import { View } from "react-native";
import mobileAds from "react-native-google-mobile-ads";
import Tester from "./src/tests-comp/Tester";

SplashScreen.preventAutoHideAsync();

mobileAds()
  .initialize()
  .then((adapterStatus) => {
    // console.log("Mobile Ads Initialized", adapterStatus);
  });

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (dataLoaded) await SplashScreen.hideAsync();
  }, [dataLoaded]);

  const requestImageLibraryPermission = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const mediaResult = await MediaLibrary.requestPermissionsAsync();
    if (!result.granted && !mediaResult.granted) {
      console.log("Put an app modal here for no permission");
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          sen: require("./assets/fonts/sen/Sen-Regular.ttf"),
          "reglise-black": require("./assets/fonts/reglise/ReglisseBack-eZewm.otf"),
          reglise: require("./assets/fonts/reglise/Reglisse-0WOD9.otf"),
          fonter: require("./assets/fonts/SnackerComicPersonalUseOnly-g3Z5.ttf"),
          "sen-bold-b1": require("./assets/fonts/sen/Sen-Bold.ttf"),
          "sen-bold-b2": require("./assets/fonts/sen/Sen-ExtraBold.ttf"),
        });
        await requestImageLibraryPermission();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setDataLoaded(true);
      }
    }
    prepare();
  }, []);

  if (!dataLoaded) {
    return null;
  }

  return (
    <>
      <View onLayout={onLayoutRootView} />
      {/* <Main /> */}
      <Tester />
    </>
  );
}
