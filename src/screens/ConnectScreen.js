import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import AppText from "../components/AppText";
import { Context as AuthContext } from "../config/AuthContext";

import useLocation from "../hooks/useLocation";
import ThemeContext from "../config/ThemeContext";
import searchAnim from "../../assets/animations/searching_animation.json";
import colors from "../constants/colors";
import Screen from "../components/Screen";

const { width, height } = Dimensions.get("screen");
const searchFilters = [
  { keypath: "Shape Layer 1", color: "#fff3e0" },
  { keypath: "Shape Layer 2", color: "#ff9100" },
  { keypath: "Shape Layer 3", color: "#ffb74d" },
  { keypath: "Shape Layer 4", color: "#fff3e0" },
  { keypath: "Shape Layer 5", color: "#fff3e0" },
  { keypath: "Shape Layer 6", color: "#ff9100" },
  { keypath: "Shape Layer 7", color: "#ffb74d" },
  { keypath: "Shape Layer 8", color: "#ff9100" },
  { keypath: "Shape Layer 9", color: "#fff3e0" },
  { keypath: "Shape Layer 10", color: "#ff9100" },
];

const ConnectScreen = ({ navigation }) => {
  const [location, loc_data] = useLocation();
  const theme = useContext(ThemeContext);
  const {
    state: { userInfo },
    updateUserData,
    fetchNearbyWeebs,
  } = useContext(AuthContext);

  const topper = useSafeAreaInsets().top;
  const lottieRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    lottieRef?.current?.resume();

    fetchNearbyWeebs(
      (res_data) => {
        console.log(res_data);
        setIsLoading(false);
        lottieRef?.current?.pause();
      },
      (err_data) => {
        console.log(err_data);
        setIsLoading(false);
        lottieRef?.current?.pause();
      }
    );
  };

  useEffect(() => {
    if (location) {
      console.log(location);
      // save the user location;
      const api_data = {
        instanceID: userInfo._id,
        action: "setter",
        actionData: {
          key: "location",
          value: {
            lat: location.coords.latitude,
            long: location.coords.longitude,
            active: true,
          },
        },
      };

      updateUserData(
        api_data,
        (res_data) => {
          console.log(res_data);
        },
        (err_data) => {
          console.log(err_data);
        }
      );
    }
  }, [location]);

  // console.log(location, errLocation);

  return (
    <Screen style={styles.container}>
      <LinearGradient
        style={styles.background}
        colors={["#ff9100", "#ffb74d", "#fff3e0"]}
      >
        <View style={styles.activity}>
          <LottieView
            source={searchAnim}
            colorFilters={searchFilters}
            ref={lottieRef}
            autoPlay={false}
            speed={1}
            style={{ width: width * 0.9, height: width * 0.9 }}
            loop
          />
        </View>
        <TouchableOpacity
          onPress={handleSearch}
          activeOpacity={0.9}
          style={styles.search}
        >
          <Feather name="search" size={40} color={colors.white} />
        </TouchableOpacity>
      </LinearGradient>
      <View style={[styles.header, { top: topper }]}>
        <View>
          <AppText style={styles.headerText} bold size="xxlarge">
            Search Weebs
          </AppText>
          <AppText bold style={styles.headerSubtitle}>
            Connect with your fellow weeb whose nearby
          </AppText>
        </View>
        <TouchableOpacity
          style={styles.cancel}
          activeOpacity={1}
          onPress={() => navigation.goBack()}
        >
          <Feather name="x" size={35} color={colors.white} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  activity: {
    position: "absolute",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cancel: {
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#ff9100",
  },
  header: {
    position: "absolute",
    width,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    marginTop: 10,
    marginBottom: 15,
    color: colors.white,
  },
  headerSubtitle: {
    color: colors.light,
  },
  search: {
    width: width * 0.3,
    height: width * 0.3,
    backgroundColor: colors.accent,
    justifyContent: "center",
    borderRadius: (width * 0.3) / 2,
    elevation: 3,
    alignItems: "center",
  },
});
export default ConnectScreen;
