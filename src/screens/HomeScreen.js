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
import { Viewport } from "@skele/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";

import { Context as FeedContext } from "../config/FeedContext";
import { Context as AuthContext } from "../config/AuthContext";

import ActivityIndicator from "../components/ActivityIndicator";
import HomeHeader from "../components/HomeHeader";
import Shows from "../components/Shows";
import { actionDatas } from "../constants/data_store";
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

// import NativeAds from "../components/NativeAds";
// import * as FacebookAds from "expo-ads-facebook";

const { width, height } = Dimensions.get("window");
const boolsObj = {
  loadMore: true,
  lodadedOnce: false,
  showSlide: false,
  reloadLoader: false,
  loader: false,
  showStatus: false,
};

const HomeScreen = ({ navigation, route }) => {
  const {
    getHomeFeeds,
    state: { posts },
  } = useContext(FeedContext);

  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const [feeds, setFeeds] = useState(null);
  const [stories, setStories] = useState([]);
  const [errMsg, setErrMsg] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [bools, setBools] = useState(boolsObj);
  const { loadMore, lodadedOnce, showSlide, showStatus } = bools;

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
        !guidesData.home && setBools({ ...bools, showSlide: true });
      } else {
        setBools({ ...bools, showSlide: true });
      }
    } else if (type === "set") {
      const setGuides = {
        home: true,
      };
      await AsyncStorage.setItem("guides", JSON.stringify(setGuides));
      setBools({ ...bools, showSlide: false });
    }
  };

  const fetchHomeData = (cb, loader) => {
    loader && setBools({ ...bools, loader: true });
    getHomeFeeds(
      null,
      async (resData) => {
        // SETTERS
        setStories(resData.stories);
        setFeeds(resData.feeds);
        setBools({ ...bools, lodadedOnce: true });
        handleHomeScreenGuide("get");
        loader && setBools({ ...bools, loader: false });
        await AsyncStorage.setItem("home_feeds", JSON.stringify(resData));
        cb && cb();
      },
      (err) => {
        setErrMsg("Error fetching feeds");
        loader && setBools({ ...bools, loader: false });
        cb && cb();
      }
    );
  };

  const readyHomeScreen = async (cb) => {
    const feedsStr = await AsyncStorage.getItem("home_feeds");
    if (feedsStr) {
      const feedsObj = JSON.parse(feedsStr);
      setStories(feedsObj.stories);
      setFeeds(feedsObj.feeds);
      setBools({ ...bools, loader: false, lodadedOnce: true });
    }
    await NavigationBar.setButtonStyleAsync(theme.bar);
    await NavigationBar.setBackgroundColorAsync(theme.background);
    // tryLocalSignin();
    fetchHomeData(cb);
  };

  const renderHome = ({ item }) => {
    // if (!feeds) return null;

    if (item.instanceType === "show") {
      return <Shows data={item} show />;
    } else if (item.instanceType === "post") {
      return <FeedRender item={item} user={userInfo._id} />;
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
    if (feeds.hasOwnProperty("next")) {
      getHomeFeeds(
        { limit: 15, page: feeds.next.page },
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
      if (bools.loadMore) {
        setBools({ ...bools, loadMore: false });
      }
    }
  };

  const RenderLoadMore = () => {
    if (loadMore) {
      return (
        <View>
          <ActivityIndicator
            visible={loadMore}
            type="spin"
            size={0.2}
            transparent
          />
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
          setter={() => setBools({ ...bools, showStatus: false })}
        />

        <ActivityIndicator
          visible={bools.reloadLoader}
          size={0.2}
          style={{ width, height: 25 }}
          transparent
        />
        {showStatus && <Separator h={1} />}
      </View>
    );
  };

  useEffect(() => {
    async function prepare() {
      await readyHomeScreen();
    }

    prepare();
  }, []);

  useEffect(() => {
    if (lodadedOnce) {
      fetchHomeData(null, true);
    }
  }, [posts]);

  // For auto post reload
  useEffect(() => {
    if (bools.lodadedOnce && route?.params?.reloadPosts) {
      setBools({ ...bools, reloadLoader: true });
      fetchHomeData(() => {
        setBools({ ...bools, reloadLoader: false });
      }, false);
    }
  }, [navigation, route]);

  return (
    <>
      <StatusBar style={theme.bar} />
      <Screen
        style={{
          ...styles.container,
          backgroundColor: theme.backgroundExtralight,
        }}
      >
        <HomeHeader characters={userInfo.charactersOwned} />
        {!feeds?.results[0] ? (
          <RenderPageHeader />
        ) : (
          <>
            <Viewport.Tracker>
              <FlatList
                data={feeds?.results}
                extraData={feeds}
                ListHeaderComponent={RenderPageHeader}
                keyboardShouldPersistTaps="handled"
                ListFooterComponent={RenderLoadMore}
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
        text="No feeds yet, please follow a Weebo Instance"
        transparent
      />
      <ActivityIndicator
        visible={bools.loader}
        style={styles.activity}
        wTransparent
      />
    </>
  );
};

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
