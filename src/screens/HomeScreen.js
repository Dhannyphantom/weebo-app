import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { setButtonStyleAsync } from "expo-navigation-bar";
import { Viewport } from "@skele/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import { NativeAdsManager } from "react-native-fbads";
// import NativeAds from "../components/NativeAds";
const Notifications = {
  removeNotificationSubscription: () => {},
  setNotificationHandler: () => {},
};

setButtonStyleAsync("dark");

import { Context as FeedContext } from "../config/FeedContext";
import { Context as AuthContext } from "../config/AuthContext";

import ActivityIndicator from "../components/ActivityIndicator";
import HomeHeader from "../components/HomeHeader";
import Shows from "../components/Shows";
import { actionDatas, ADS_INTERVAL, homeGuide } from "../constants/data_store";
import ActionMenu from "../components/ActionMenu";
import Screen from "../components/Screen";
import EventRender from "../components/EventRender";
import AppText from "../components/AppText";
import StatusRender from "../components/StatusRender";
import colors from "../constants/colors";
import Separator from "../components/Separator";
import AppSlider from "../components/AppSlider";
import FeedRender from "../components/FeedRender";
import ThemeContext from "../config/ThemeContext";
import appConfig from "../../app.config";
import BannerAds from "../components/BannerAds";
import TobiGuide from "../components/TobiGuide";
import RenderLoadMore from "../components/RenderLoadMore";
import PopMessage from "../components/PopMessage";

const projectId = appConfig?.expo?.extra?.eas?.projectId;
const fbAdsPlacementID = "406752991548934_406754288215471";
// const adsManager = new NativeAdsManager(fbAdsPlacementID, 15);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const { width, height } = Dimensions.get("window");
const boolsObj = {
  loadMore: true,
  loadedOnce: false,
  reloadLoader: true,
  loader: false,
  isMyPosts: false,
  showStatus: false,
};

const HomeScreen = ({ navigation, route }) => {
  const {
    getHomeFeeds,
    state: { posts, uploadStatus },
  } = useContext(FeedContext);

  const {
    setPushToken: updateUserPushToken,
    getSocket,
    tryLocalSignin,
    state: { userInfo },
  } = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const [feeds, setFeeds] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [bools, setBools] = useState(boolsObj);
  const [slider, setSlider] = useState(false);
  const [guide, setGuide] = useState({ vis: false, close: false });
  const [popper, setPopper] = useState({ vis: false });
  const { loadMore, loadedOnce, showStatus } = bools;

  const actionFlatRef = useRef(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  const showSpinner = ((feeds && !feeds?.results[0]) || !feeds) && !showStatus;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchHomeData(() => {
      setBools({ ...bools, loadedOnce: true, reloadLoader: false });
      setRefreshing(false);
    });
  }, []);

  const handleHomeScreenGuide = async (type) => {
    const getGuides = await AsyncStorage.getItem("guides");
    const tobiGuides = await AsyncStorage.getItem("tobi_guides");

    if (type === "get") {
      if (getGuides) {
        const guidesData = JSON.parse(getGuides);
        !guidesData.home && setSlider(true);
      } else {
        setSlider(true);
      }

      // for TOBI guide;
      if (getGuides && JSON.parse(getGuides).home) {
        if (tobiGuides) {
          // tobiGUides = ["home_guide"]
          const tobiGuidesArr = JSON.parse(tobiGuides);
          const finder = tobiGuidesArr.includes("home_guide");

          if (!finder) {
            setGuide({ ...guide, vis: true });
          }
        } else {
          // no tobi guide data at all
          const homeGuideArr = ["home_guide"];
          await AsyncStorage.setItem(
            "tobi_guides",
            JSON.stringify(homeGuideArr)
          );
          setGuide({ ...guide, vis: true });
        }
      }
    } else if (type === "set") {
      const setGuides = {
        home: true,
      };
      await AsyncStorage.setItem("guides", JSON.stringify(setGuides));
      setSlider(false);
      handleHomeScreenGuide("get");
    }
  };

  const fetchHomeData = (cb, loader, type = "feed") => {
    // type = "feed" || "my_post"
    setErrMsg(null);
    loader &&
      setBools({
        ...bools,
        loader: true,
        isMyPosts: type === "my_post",
      });
    getHomeFeeds(
      { page: 1, limit: 15, type },
      async (resData) => {
        // SETTERS
        setFeeds(resData.feeds);
        // !bools.loadedOnce && handleHomeScreenGuide("get");
        loader &&
          setBools({ ...bools, loader: false, isMyPosts: type === "my_post" });
        if (type === "feed") {
          await AsyncStorage.setItem("home_feeds", JSON.stringify(resData));
        }
        cb && cb();
      },
      (err) => {
        bools.loadedOnce && setErrMsg("Error fetching feeds");
        loader &&
          setBools({ ...bools, loader: false, isMyPosts: type === "my_post" });
        cb && cb();
      }
    );
  };

  const readyHomeScreen = async (cb) => {
    !bools.loadedOnce && handleHomeScreenGuide("get");
    const feedsStr = await AsyncStorage.getItem("home_feeds");
    if (feedsStr) {
      const feedsObj = JSON.parse(feedsStr);
      setFeeds(feedsObj.feeds);
      setBools({ ...bools, loader: false, loadedOnce: true });
    }
    !bools.loadedOnce && tryLocalSignin(null, null, "user");
    fetchHomeData(cb);
  };

  const renderHome = ({ item, index }) => {
    // if (!feeds) return null;

    if (item.instanceType === "show") {
      return <Shows data={item} show />;
    } else if (item.instanceType === "post") {
      if (index !== 0 && index % ADS_INTERVAL === 0) {
        return (
          <>
            <BannerAds />
            {/* <NativeAds adsManager={adsManager} /> */}
            <FeedRender item={item} user={userInfo._id} />
          </>
        );
      } else {
        return <FeedRender item={item} user={userInfo._id} />;
      }
    } else if (item.instanceType === "challenge") {
      return (
        <EventRender
          userID={userInfo._id}
          renderType="single"
          isFollowing
          eventData={item}
        />
      );
    }
  };

  const handleEndReached = (cb) => {
    setErrMsg(null);
    if (feeds.hasOwnProperty("next")) {
      getHomeFeeds(
        {
          limit: 15,
          page: feeds.next.page,
          type: bools.isMyPosts ? "my_post" : "feed",
        },
        (resData) => {
          setFeeds({
            ...resData,
            results: [...feeds?.results, ...resData.feeds.results],
          });
          // cb && cb();
        },
        (err) => {
          setErrMsg("Error fetching feeds");
          // cb && cb();
        }
      );
    } else {
      if (bools.loadMore) {
        setBools({ ...bools, loadMore: false });
      }
    }
  };

  const notificationHandler = async () => {
    // MIGHT WANT TO CALL THIS FUNCTION A LOT
    try {
      if (userInfo?.pushToken?.token?.length < 10) {
        const token = await registerForPushNotificationsAsync();
        updateUserPushToken({ token, state: "registered" });
      }
    } catch (err) {}

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("recieved", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "response recieved now",
          response.notification.request.content
        );
        const notification = response.notification.request.content;
        navigation.navigate(notification.data.screen);
      });
  };

  const renderActions = ({ item, index }) => {
    const handleNav = () => {
      if (item.nav === "modal") {
        setBools({ ...bools, showStatus: true });
      } else {
        navigation.navigate(item.nav);
      }
    };

    return <ActionMenu item={item} onPress={handleNav} />;
  };

  const keyExtractor = useCallback((item, index) => {
    return item + index;
  });

  const RenderPageHeader = () => {
    return (
      <>
        <View>
          <FlatList
            data={actionDatas}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderActions}
            overScrollMode="never"
            ref={actionFlatRef}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
          <StatusRender
            show={showStatus}
            setter={() => setBools({ ...bools, showStatus: false })}
          />

          <ActivityIndicator
            visible={
              uploadStatus.hasStarted &&
              !uploadStatus.error &&
              !uploadStatus.hasFinished
            }
            type="loader"
            size={0.2}
            style={{ width, height: 25, margin: 10 }}
            transparent
          />
          <ActivityIndicator
            visible={bools.loader && !showSpinner}
            size={0.2}
            style={{ width, height: 25 }}
            transparent
          />
          {showStatus && <Separator h={1} />}
        </View>
        <ActivityIndicator
          visible={showSpinner}
          type={loadedOnce ? "isEmpty" : "spin"}
          style={styles.pageActiviy}
          text="You have no feeds"
          transparent
        />
      </>
    );
  };

  useEffect(() => {
    async function prepare() {
      await readyHomeScreen(() => {
        setBools({ ...bools, loadedOnce: true, reloadLoader: false });
      });
      // await notificationHandler();
      getSocket().emit("login", { userId: userInfo._id });
    }

    prepare();
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      getSocket().off();
    };
  }, []);

  useEffect(() => {
    if (loadedOnce) {
      fetchHomeData(null, true);
    }
  }, [posts]);

  useEffect(() => {
    if (loadedOnce && uploadStatus?.error && uploadStatus?.hasStarted) {
      setPopper({
        vis: true,
        type: "failed",
        msg: "Upload failed due to network error",
        timer: 10,
      });
    }
  }, [uploadStatus]);

  // // For auto post reload
  useEffect(() => {
    if (bools.loadedOnce && route?.params?.reloadPosts) {
      setBools({ ...bools, reloadLoader: true });
      uploadStatus?.hasFinished &&
        uploadStatus?.hasStarted &&
        !uploadStatus?.error &&
        fetchHomeData(() => {
          setBools({ ...bools, reloadLoader: false });
        }, false);
    }
  }, [navigation, route, uploadStatus]);

  return (
    <>
      <StatusBar style={theme.bar} />
      <Screen
        style={{
          ...styles.container,
          backgroundColor: theme.backgroundExtralight,
        }}
      >
        <HomeHeader fetcher={fetchHomeData} isMyPosts={bools.isMyPosts} />
        {errMsg && (
          <AppText bold size="large" style={styles.error}>
            {errMsg}
          </AppText>
        )}
        {!feeds?.results[0] ? (
          <RenderPageHeader />
        ) : (
          <>
            <Viewport.Tracker>
              <FlatList
                data={feeds?.results}
                ListHeaderComponent={RenderPageHeader}
                keyboardShouldPersistTaps="handled"
                renderToHardwareTextureAndroid
                ListFooterComponent={() => (
                  <RenderLoadMore
                    loader={loadMore}
                    hasNext={feeds.hasOwnProperty("next")}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: height * 0.1 }}
                refreshControl={
                  <RefreshControl
                    progressBackgroundColor={theme.extralight}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                onEndReached={handleEndReached}
                onEndReachedThreshold={20}
                keyExtractor={keyExtractor}
                renderItem={renderHome}
              />
            </Viewport.Tracker>
          </>
        )}
      </Screen>
      <AppSlider
        visible={slider}
        goCallBackFunc={() => handleHomeScreenGuide("set")}
      />

      <ActivityIndicator
        visible={bools.loader}
        style={styles.activity}
        wTransparent
      />
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />

      <TobiGuide
        data={guide}
        title="Post Actions"
        stateObj={homeGuide}
        setData={setGuide}
      />
    </>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  const settings = JSON.parse(await AsyncStorage.getItem("settings"));
  if (settings) {
    const shouldNotifyUser = settings.find((obj) => obj.title === "General")
      .data[2].default;
    if (!shouldNotifyUser) return;
  }
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      // DISPLAY AN ALERT OR SOMETHING
      return;
    }
    try {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
    } catch (err) {
      // YOU'RE PROBABLY OFFLINE OR PROJECT NOT BUILT WITH FCM KEYS.
    }
  } else {
    // setErrMsg("Please use a physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}

const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width,
    height,
  },
  actionFooter: {
    marginLeft: 50,
  },
  container: {
    flex: 1,
  },
  error: {
    textAlign: "center",
    width: width * 0.7,
    marginTop: 12,
    color: colors.heartDark,
    marginBottom: 25,
  },

  statusHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusHeaderCard: {
    width: 80,
    height: 80,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 2,
    marginRight: 20,
  },
  pageActiviy: {
    // position: "absolute",
    width,
  },
});
export default HomeScreen;
