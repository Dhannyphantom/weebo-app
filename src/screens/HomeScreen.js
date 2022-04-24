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
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Viewport } from "@skele/components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Context as FeedContext } from "../config/FeedContext";
import { Context as AuthContext } from "../config/AuthContext";

import ActivityIndicator from "../components/ActivityIndicator";
import HomeHeader from "../components/HomeHeader";
import Shows from "../components/Shows";
import actionDatas from "../constants/actionDatas";
import ActionMenu from "../components/ActionMenu";
import Screen from "../components/Screen";
import EventRender from "../components/EventRender";
import Cards from "../components/Cards";
import AppText from "../components/AppText";
import StatusRender from "../components/StatusRender";
import colors from "../constants/colors";
import Separator from "../components/Separator";
import AppSlider from "../components/AppSlider";
import FeedRender from "../components/FeedRender";

const { width, height } = Dimensions.get("window");
const boolsObj = {
  loadMore: true,
  lodadedOnce: false,
  showSlide: false,
  showStatus: false,
};

const HomeScreen = ({ navigation, route }) => {
  const { getHomeFeeds } = useContext(FeedContext);

  const {
    tryLocalSignin,
    notificationSender,
    updateMe,
    state: { userInfo },
  } = useContext(AuthContext);

  const [feeds, setFeeds] = useState(null);
  const [stories, setStories] = useState([]);
  const [errMsg, setErrMsg] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [screenBool, setScreenBool] = useState(boolsObj);
  const { loadMore, lodadedOnce, showSlide, showStatus } = screenBool;

  const actionFlatRef = useRef(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    readyHomeScreen(() => setRefreshing(false));
  }, []);

  const handleHomeScreenGuide = async (type) => {
    const getGuides = await AsyncStorage.getItem("guides");
    if (type === "get") {
      if (getGuides) {
        const guidesData = JSON.parse(getGuides);
        !guidesData.home && setScreenBool({ ...screenBool, showSlide: true });
      } else {
        setScreenBool({ ...screenBool, showSlide: true });
      }
    } else if (type === "set") {
      const setGuides = {
        home: true,
      };
      await AsyncStorage.setItem("guides", JSON.stringify(setGuides));
      setScreenBool({ ...screenBool, showSlide: false });
    }
  };

  const readyHomeScreen = (cb) => {
    tryLocalSignin();
    getHomeFeeds(
      null,
      (resData) => {
        // SETTERS
        setStories(resData.stories);
        setFeeds(resData.feeds);
        setScreenBool({ ...screenBool, lodadedOnce: true });
        handleHomeScreenGuide("get");
        cb && cb();
      },
      (err) => {
        console.log(err);
        setErrMsg("Error fetching feeds");
        cb && cb();
      }
    );
  };

  const renderHome = useCallback(({ item }) => {
    // if (!feeds) return null;

    if (item.instanceType === "show") {
      return <Shows data={item} show />;
    } else if (item.instanceType === "post") {
      return <FeedRender item={item} user={userInfo._id} />;
    } else if (item.instanceType === "challenge") {
      return (
        <EventRender
          updateMe={updateMe}
          userID={userInfo._id}
          renderType="single"
          eventData={item}
        />
      );
    }
  }, []);

  const handleEndReached = (cb) => {
    if (feeds.hasOwnProperty("next")) {
      getHomeFeeds(
        { limit: 5, page: feeds.next.page },
        (resData) => {
          setFeeds({
            ...resData,
            results: [...feeds?.results, ...resData.feeds.results],
          });
          // cb && cb();
        },
        (err) => {
          console.log(err);
          setErrMsg("Error fetching feeds");
          // cb && cb();
        }
      );
    } else {
      setScreenBool({ ...screenBool, loadMore: false });
    }
  };

  const RenderLoadMore = () => {
    if (loadMore) {
      return (
        <View>
          <ActivityIndicator visible={loadMore} type="spin" transparent />
        </View>
      );
    } else {
      return (
        <View style={styles.noContent}>
          <AppText bold size="larger" style={styles.noContentText}>
            No more feeds
          </AppText>
        </View>
      );
    }
  };

  const renderActions = ({ item, index }) => {
    const handleNav = () => {
      if (item.nav === "modal") {
        setScreenBool({ ...screenBool, showStatus: true });
      } else {
        navigation.navigate(item.nav);
      }
    };

    return <ActionMenu item={item} onPress={handleNav} />;
  };

  const keyExtractor = useCallback((item, index) => {
    return item + index;
  });

  const handleSendNotification = () => {
    const content = {
      to: userInfo.pushToken,
      title: "Otaku Request",
      body: "Dhannyphantom wants to be your fellow weeb",
      data: "Noti Data",
      sound: "default",
    };

    notificationSender(
      content,
      (data) => {
        // console.log("success", content);
        console.log(data);
      },
      (err) => {
        console.log(err);
        // console.log("error", content);
      }
    );
  };

  const RenderPageHeader = () => {
    return (
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
          data={stories}
          show={showStatus}
          setter={() => setScreenBool({ ...screenBool, showStatus: false })}
        />

        {showStatus && <Separator h={1} />}
      </View>
    );
  };

  useEffect(() => {
    readyHomeScreen();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Screen style={styles.container}>
        <HomeHeader characters={userInfo.charactersOwned} />

        {!feeds?.results[0] ? (
          <>
            <RenderPageHeader />
          </>
        ) : (
          <>
            <Viewport.Tracker>
              <FlatList
                data={feeds?.results}
                extraData={feeds}
                ListHeaderComponent={RenderPageHeader}
                refreshing={refreshing}
                keyboardShouldPersistTaps="handled"
                ListFooterComponent={RenderLoadMore}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: height * 0.1 }}
                onRefresh={onRefresh}
                // onScroll={(e) => handleFlatScroll(e)}
                // overScrollMode="never"
                onEndReached={handleEndReached}
                onEndReachedThreshold={0}
                keyExtractor={keyExtractor}
                renderItem={renderHome}
              />
            </Viewport.Tracker>
          </>
        )}
      </Screen>
      <AppSlider
        visible={showSlide}
        goCallBackFunc={() => handleHomeScreenGuide("set")}
      />
      <ActivityIndicator
        visible={((feeds && !feeds?.results[0]) || !feeds) && !showStatus}
        type={lodadedOnce ? "isEmpty" : "spin"}
        style={styles.pageActiviy}
        text="No feeds yet, please follow an Otaku Instance"
        transparent
      />
    </>
  );
};
const styles = StyleSheet.create({
  actionFooter: {
    marginLeft: 50,
  },
  container: {
    flex: 1,
    backgroundColor: colors.extraLight,
  },
  noContent: {
    width,
    height: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  noContentText: {
    color: colors.medium,
    textAlign: "center",
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
    position: "absolute",
    width: "100%",
    height: "50%",
    top: height * 0.32,
  },
});
export default HomeScreen;
