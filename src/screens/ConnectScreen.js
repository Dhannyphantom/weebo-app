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
import Separator from "../components/Separator";
import PopMessage from "../components/PopMessage";
import { capFirstLetter } from "../constants/helpers";
import AppButton from "../components/AppButton";
import ActivityIndicator from "../components/ActivityIndicator";

const { width, height } = Dimensions.get("screen");
const SEARCH_FILTERS = [
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
const SEARCH_FILTERS_DARK = [
  { keypath: "Shape Layer 1", color: "#131e2a" },
  { keypath: "Shape Layer 2", color: "#263950" },
  { keypath: "Shape Layer 3", color: "#2f4765" },
  { keypath: "Shape Layer 4", color: "#131e2a" },
  { keypath: "Shape Layer 5", color: "#263950" },
  { keypath: "Shape Layer 6", color: "#2f4765" },
  { keypath: "Shape Layer 7", color: "#263950" },
  { keypath: "Shape Layer 8", color: "#131e2a" },
  { keypath: "Shape Layer 9", color: "#2f4765" },
  { keypath: "Shape Layer 10", color: "#131e2a" },
];
const PROFILE_WIDTH = 150;
const NUM_COLUMNS = Math.floor(width / 150);
const LIGHT_COLORS = ["#ff9100", "#ffb74d", "#fff3e0"];

const Weebs = ({ item, handleCloseModal, index }) => {
  const opaciter = useRef(new Animated.Value(0)).current;
  const scaler = opaciter.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const posOrNeg = useRef(Math.round(Math.random()) ? 1 : -1).current;
  const rand = useRef(posOrNeg * Math.ceil(Math.random() * 25)).current;
  const randLeft = useRef(posOrNeg * Math.ceil(Math.random() * 15)).current;
  let trans = 1;

  if (index <= NUM_COLUMNS) {
    trans = Math.max(0, rand);
  } else {
    trans = rand;
  }

  useEffect(() => {
    Animated.timing(opaciter, {
      toValue: 1,
      duration: 1500,
      delay: index < 10 ? index * 1000 : 0,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        width: PROFILE_WIDTH,
        top: trans,
        left: randLeft,
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
        gender={item.gender}
        size={width * 0.22}
        callback={handleCloseModal}
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
        {capFirstLetter(item.gender)} &bull; {item.city}
      </AppText>
    </Animated.View>
  );
};

const RenderEmptyWeebs = ({
  errMsg,
  setErrMsg,
  handleSearch,
  handleCloseModal,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    state: { userInfo },
    updateUserData,
  } = useContext(AuthContext);

  const message =
    "Turns out there are no nearby weebs YET!!!. You can always check back later";

  const weeboLocatorSwitch = () => {
    setIsLoading(true);

    updateUserData(
      {
        action: "location",
        actionData: true,
        instanceID: userInfo._id,
      },
      (_resData) => {
        setIsLoading(false);
        handleCloseModal();
        handleSearch(1, 10);
      },
      (errData) => {
        setErrMsg(errData.data ?? errData.msg);
        setIsLoading(false);
      }
    );
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: width * 0.7,
          padding: 20,
          backgroundColor: colors.white,
          borderRadius: 10,
        }}
      >
        <AppText
          style={{
            textAlign: "center",
          }}
          size="large"
          bold
        >
          No Weebs Found
        </AppText>
        <Separator h={2} />
        <AppText
          style={{
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {errMsg ? errMsg : message}
        </AppText>
        {errMsg && errMsg?.includes("weebo locator") && (
          <AppButton
            title="Turn On Now"
            style={{ marginTop: 20 }}
            onPress={weeboLocatorSwitch}
          />
        )}
        <ActivityIndicator
          visible={isLoading}
          wTransparent
          absolute
          style={{
            borderRadius: 12,
          }}
        />
      </View>
    </View>
  );
};

const ConnectScreen = ({ navigation }) => {
  const [location] = useLocation();
  const [weebos, setWeebos] = useState({ results: [] });
  const [modal, setModal] = useState(false);
  const [popper, setPopper] = useState({ vis: false });
  const [errMsg, setErrMsg] = useState(null);
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

  const gradients =
    theme.mode === "light"
      ? LIGHT_COLORS
      : [theme.transparentBolder, theme.transparentBold, theme.transparent];

  const parentColor = theme.mode === "light" ? "#ff9100" : theme.background;

  const handleSearch = (pageNum = 1, limit = 10, cb) => {
    // check if user has updated his profile;
    if (!userInfo?.country && !userInfo?.city) {
      setPopper({
        vis: true,
        msg: "Please complete and verify your profile",
        type: "failed",
      });
      return;
    }

    setIsLoading(true);
    lottieRef?.current?.resume();

    fetchNearbyWeebs(
      { page: pageNum, limit },
      (res_data) => {
        setWeebos(res_data);
        setIsLoading(false);
        lottieRef?.current?.pause();
        cb && cb();
        setModal(true);
      },
      (err_data) => {
        setModal(true);
        setIsLoading(false);
        setErrMsg(err_data.data ?? err_data.msg);
        lottieRef?.current?.pause();
        cb && cb();
      }
    );
  };

  const handleNextSearches = () => {
    // TRY TO ANIMATE OUT THE FLATLIST;
    Animated.timing(opaciter, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    handleSearch(weebos.next.page, weebos.next.limit, () => {
      Animated.timing(opaciter, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });
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
    const checkLocTimestamp =
      Date.now() - userInfo?.location?.timestamp > 60 * 60 * 24 * 1000;
    if (
      (location && !userInfo?.location?.timestamp) ||
      (location && checkLocTimestamp)
    ) {
      // save the user location;
      const api_data = {
        instanceID: userInfo._id,
        action: "setter",
        actionData: {
          key: "location",
          value: {
            lat: location.coords.latitude,
            long: location.coords.longitude,
            active: userInfo?.location?.active ? true : false,
          },
        },
      };
      updateUserData(api_data);
    }
  }, [location]);

  useEffect(() => {
    if (modal) {
      Animated.timing(opaciter, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [modal, weebos]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: parentColor,
        },
      ]}
    >
      <LinearGradient style={styles.background} colors={gradients}>
        <View style={styles.activity}>
          <LottieView
            source={searchAnim}
            colorFilters={
              theme.mode === "light" ? SEARCH_FILTERS : SEARCH_FILTERS_DARK
            }
            ref={lottieRef}
            autoPlay={false}
            speed={1}
            style={{ width: width, height: width }}
            loop
          />
        </View>
        <TouchableOpacity
          onPress={() => handleSearch(1, 10)}
          activeOpacity={0.9}
          disabled={isLoading}
          style={[styles.search, { backgroundColor: parentColor }]}
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
              data={weebos.results}
              numColumns={NUM_COLUMNS}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={() => (
                <RenderEmptyWeebs
                  errMsg={errMsg}
                  setErrMsg={setErrMsg}
                  handleSearch={handleSearch}
                  handleCloseModal={handleCloseModal}
                />
              )}
              contentContainerStyle={{
                flex: 1,
                paddingTop: 20,
              }}
              style={{ flex: 1 }}
              renderItem={({ item, index }) => (
                <Weebs
                  item={item}
                  handleCloseModal={handleCloseModal}
                  index={index}
                />
              )}
            />
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={styles.cancel}
                activeOpacity={1}
                onPress={handleCloseModal}
              >
                <Feather name="x" size={50} color={colors.heartLight} />
              </TouchableOpacity>
              {weebos.next && (
                <TouchableOpacity
                  style={styles.next}
                  activeOpacity={1}
                  onPress={handleNextSearches}
                >
                  <Feather
                    name="chevron-right"
                    size={50}
                    color={colors.greenLight}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </Modal>
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
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
    paddingTop: 15,
    paddingRight: 15,
  },
  content: {
    flex: 1,
    padding: 20,
    elevation: 5,
  },
  container: {
    flex: 1,
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
    maxWidth: "90%",
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  next: {
    paddingTop: 15,
    paddingRight: 15,
    marginLeft: 35,
  },
  page: {
    position: "absolute",
    width,
    height,
  },
  search: {
    width: width * 0.3,
    height: width * 0.3,
    justifyContent: "center",
    borderRadius: (width * 0.3) / 2,
    elevation: 3,
    marginLeft: 4,
    marginBottom: 2,
    alignItems: "center",
  },
});
export default ConnectScreen;
