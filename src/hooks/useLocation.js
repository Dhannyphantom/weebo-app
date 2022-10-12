import * as Location from "expo-location";
import { useEffect, useState } from "react";

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [errMsg, setErrMsg] = useState(null);

  const requestPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync();
    setLocation(location);
  };

  useEffect(async () => {
    await requestPermission();
  }, []);

  return [location, errMsg];
}
