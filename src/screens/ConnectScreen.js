import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  FlatList,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
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
import ProfilePic from "../components/ProfilePic";

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
const PROFILE_WIDTH = 150;
const NUM_COLUMNS = Math.floor(width / 150);

const Weebs = ({ item, index }) => {
  const opaciter = useRef(new Animated.Value(0)).current;
  const scaler = opaciter.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const posOrNeg = Math.round(Math.random()) ? 1 : -1;
  const rand = posOrNeg * Math.ceil(Math.random() * 100 + 25);
  let trans = 1;

  if (index === 0) {
    trans = Math.max(-1, rand);
  } else if (index + 1 <= NUM_COLUMNS) {
    trans = Math.min(-1, rand);
  } else {
    trans = rand;
  }

  useEffect(() => {
    Animated.timing(opaciter, {
      toValue: 1,
      duration: 1500,
      delay: index * 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        width: PROFILE_WIDTH,
        top: trans,
        left: trans,
        opacity: opaciter,
        transform: [{ scale: scaler }],
        margin: 5,
        alignItems: "center",
      }}
    >
      <ProfilePic
        border={3}
        userID={item._id}
        borderColor={colors.white}
        size={90}
        borderRad={45}
        source={item.avatar}
      />
      <AppText
        bold
        style={{ color: colors.white, marginTop: 10, marginBottom: 5 }}
      >
        {"@"}
        {item.username}
      </AppText>
      <AppText style={{ textTransform: "capitalize", color: colors.light }}>
        {item.city}
      </AppText>
    </Animated.View>
  );
};

const ConnectScreen = ({ navigation }) => {
  const [location, loc_data] = useLocation();
  const [weebos, setWeebos] = useState([]);
  const [modal, setModal] = useState(false);
  const theme = useContext(ThemeContext);
  const {
    state: { userInfo },
    updateUserData,
    fetchNearbyWeebs,
  } = useContext(AuthContext);

  const topper = useSafeAreaInsets().top;
  const lottieRef = useRef();
  const opaciter = useRef(new Animated.Value(0)).current;

  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    lottieRef?.current?.resume();

    fetchNearbyWeebs(
      (res_data) => {
        setWeebos(res_data);
        setModal(true);
        setIsLoading(false);
        lottieRef?.current?.pause();
      },
      (err_data) => {
        console.log(err_data);
        setModal(true);
        setIsLoading(false);
        lottieRef?.current?.pause();
      }
    );
  };

  const handleCloseModal = () => {
    Animated.timing(opaciter, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      setModal(false);
    });
  };

  useEffect(() => {
    if (location) {
      // console.log(location);
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

      // updateUserData(
      //   api_data,
      //   (res_data) => {
      //     console.log(res_data);
      //   },
      //   (err_data) => {
      //     console.log(err_data);
      //   }
      // );
    }
  }, [location]);

  useEffect(() => {
    if (modal) {
      Animated.timing(opaciter, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [modal]);

  return (
    <View style={styles.container}>
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
      <View style={[styles.page, { top: topper }]}>
        <View style={styles.header}>
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
            <Feather name="x" size={30} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={modal} transparent statusBarTranslucent>
        <Animated.View style={{ ...styles.modal, opacity: opaciter }}>
          <View style={styles.content}>
            <FlatList
              data={weebos}
              numColumns={NUM_COLUMNS}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ flex: 1 }}
              style={{ flex: 1 }}
              renderItem={({ item, index }) => (
                <Weebs item={item} index={index} />
              )}
            />
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={styles.cancel}
                activeOpacity={1}
                onPress={handleCloseModal}
              >
                <Feather name="x" size={70} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </View>
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
  content: {
    flex: 1,
    padding: 20,
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#ff9100",
  },
  header: {
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
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  page: {
    position: "absolute",
    width,
    height,
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
