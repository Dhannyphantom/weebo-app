import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import Otaku from "./src/Otaku";
const loaderFunc = async () => {
  return await Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-b1": require("./assets/fonts/OpenSans-Bold.ttf"),
    "open-sans-b2": require("./assets/fonts/OpenSans-ExtraBold.ttf"),
    sen: require("./assets/fonts/sen/Sen-Regular.ttf"),
    "reglise-black": require("./assets/fonts/reglise/ReglisseBack-eZewm.otf"),
    reglise: require("./assets/fonts/reglise/Reglisse-0WOD9.otf"),
    fonter: require("./assets/fonts/SnackerComicPersonalUseOnly-g3Z5.ttf"),
    "sen-bold-b1": require("./assets/fonts/sen/Sen-Bold.ttf"),
    "sen-bold-b2": require("./assets/fonts/sen/Sen-ExtraBold.ttf"),
  });
};

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  const requestImageLibraryPermission = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const mediaResult = await MediaLibrary.requestPermissionsAsync();
    if (!result.granted && !mediaResult.granted) {
      console.log("Put an app modal here for no permission");
    }
  };

  useEffect(() => {
    //TODO: REQUEST ALL PERMISSION LATER
    requestImageLibraryPermission();
  }, []);

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={loaderFunc}
        onFinish={() => setDataLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  return <Otaku />;
}
