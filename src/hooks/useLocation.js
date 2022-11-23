import * as Location from "expo-location";
import { useEffect, useState } from "react";

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  const requestPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrMsg("Permission to access location was denied");
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync();
      setLocation(location);
      setLoading(false);
    } catch (err) {
      setErrMsg(err?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    async function initialze() {
      await requestPermission();
    }
    initialze();
  }, []);

  const data = { error: errMsg, loading };

  return [location, data];
}
