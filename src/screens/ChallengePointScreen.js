import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Context as AuthContext } from "../config/AuthContext";

import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import AlertModal from "../components/AlertModal";
import Screen from "../components/Screen";
import PopMessage from "../components/PopMessage";
import AppButton from "../components/AppButton";
import colors from "../constants/colors";
import Separator from "../components/Separator";
import ActivityIndicator from "../components/ActivityIndicator";
import { ads_keywords, calender } from "../constants/data_store";
import ThemeContext from "../config/ThemeContext";

const { width, height } = Dimensions.get("window");

const ADS_POINT = 5;

export const ADS_ID = Platform.select({
  ios: __DEV__ ? TestIds.REWARDED : "ca-app-pub-3603875446667492/8881804714",
  android: !__DEV__
    ? TestIds.REWARDED
    : "ca-app-pub-3603875446667492/3217430636",
});

const rewarded = RewardedAd.createForAdRequest(ADS_ID, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ads_keywords,
});

const CLEAR_ALERT = {
  visible: true,
  title: "Clear your WP log",
  message: `Do you wish to clear all your WP logs?`,
  btn: "YES",
  type: "clear",
};

const ScreenHeaderRight = ({ isLoaded, screenSetter, num }) => {
  const ADS_ALERT = {
    visible: false,
    title: "Earn more Weebo Points",
    message: `Watch an ad to earn 5WPs now, \n ${num} tries left`,
    btn: "YES",
    type: "earn",
  };

  const [alertData, setAlertData] = useState(ADS_ALERT);
  const [popData, setPopData] = useState({ vis: false });
  //
  const handleHeaderActions = async (type, alertCall = false) => {
    if (type === "earn") {
      // CHECK ADS LEFT BEFORE SHOWING
      if (num <= 0) {
        setPopData({
          vis: true,
          msg: "Ads exhausted. Try again tomorrow",
          type: "failed",
        });
        return;
      }
      try {
        rewarded.show();
      } catch (err) {
        // display err
        setPopData({
          vis: true,
          // msg: "Try again some other time",
          msg: err?.message ?? "Something went wrong",
          type: "failed",
        });
      }
    } else if (type === "clear") {
      //
      setAlertData(CLEAR_ALERT);
      if (alertCall) {
        const userData = {
          action: "pointsActivity",
          actionData: [],
          instance: "user",
          instanceID: screenSetter.uID,
        };
        screenSetter.setter([]);
        screenSetter.updateUserData(userData, null, (err) => {
          screenSetter.popper({
            vis: true,
            type: "failed",
            msg: "Something went wrong",
          });
        });
      }
    }
  };

  return (
    <>
      <View style={styles.headerRight}>
        {isLoaded.vis && isLoaded.firstLoad ? (
          <AppButton
            title="earn"
            onPress={() => setAlertData({ ...ADS_ALERT, visible: true })}
            naked
          />
        ) : !isLoaded.vis && isLoaded.firstLoad ? null : (
          <View style={{ marginRight: width * 0.02 }}>
            <ActivityIndicator
              style={{ width: width * 0.01 }}
              transparent
              visible={true}
              size={0.2}
            />
          </View>
        )}
        <AppButton
          title="clear"
          onPress={() => handleHeaderActions("clear")}
          style={{ marginLeft: 10 }}
          naked
        />
      </View>
      <AlertModal
        obj={alertData}
        setVisible={setAlertData}
        onPress={() => handleHeaderActions(alertData.type, true)}
      />
      <PopMessage
        popData={popData}
        timer={0.2}
        setter={() => setPopData({ vis: false })}
      />
    </>
  );
};

const ChallengePointScreen = ({ navigation }) => {
  const {
    updateUserData,
    updateMe,
    getUserData,
    state: { userInfo },
  } = useContext(AuthContext);
  const theme = useContext(ThemeContext);
  //
  const [adLoaded, setAdLoaded] = useState({ vis: false, firstLoad: false });
  const [adInfo, setAdInfo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [popData, setPopData] = useState({ vis: false });
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(userInfo.points);
  const [pointers, setPointers] = useState([]);

  const PointsCard = ({ data }) => {
    const { type, points, date, from } = data;
    let pointsColor, pointsSign, pointsWord;
    switch (type) {
      case "gain":
        pointsColor = colors.primary;
        pointsSign = "+";
        pointsWord = "gained";
        break;
      case "lost":
        pointsColor = colors.heart;
        pointsSign = "-";
        pointsWord = "lost";
        break;

      default:
        break;
    }
    return (
      <View style={styles.cardContainer}>
        <View style={{ ...styles.separator, backgroundColor: pointsColor }}>
          <MaterialCommunityIcons
            name="alpha-w-circle"
            size={width * 0.12}
            color={colors.white}
            style={{ opacity: 0.2 }}
          />
        </View>
        <View
          style={[styles.cardDetails, { backgroundColor: theme.extralight }]}
        >
          <AppText>You {pointsWord}</AppText>
          <Separator h={1} m={12} />
          <AppText size="large" style={{ color: pointsColor }} bold>
            {pointsSign}
            {points}WP
          </AppText>
          <Separator h={1} m={12} />
          <AppText>
            FROM:{" "}
            <AppText style={{ textTransform: "capitalize" }} bold>
              {from}
            </AppText>{" "}
          </AppText>
        </View>
      </View>
    );
  };

  const handleAdsStorage = async () => {
    // SETTING UP DAILY WATCH ADS
    const getAdsData = JSON.parse(await AsyncStorage.getItem("ads"));
    if (getAdsData) {
      // CHECK IF IT'S DUE A DAY TO VIEW ADS
      if (getAdsData.lastWatched === null) {
        // DO SOMETHING
        setAdInfo(getAdsData);
      } else {
        // DO SOMETHING ELSE
        const timer = (Date.now() - new Date(getAdsData.lastWatched)) / 1000;
        if (timer / 86400 >= 0) {
          // USER IS VALID FOR A NEW ADS
          const adsData = {
            lastWatched: null,
            videosLeft: 3,
          };
          await AsyncStorage.setItem("ads", JSON.stringify(adsData));
          setAdInfo(adsData);
        } else {
          setAdInfo(getAdsData);
        }
      }
    } else {
      const adsData = {
        lastWatched: null,
        videosLeft: 3,
      };
      await AsyncStorage.setItem("ads", JSON.stringify(adsData));
      setAdInfo(adsData);
    }
  };

  const renderPointsData = ({ item, index }) => {
    const currDate = new Date();
    const itemDate = new Date(item.date);
    const prevItemDate = index - 1 >= 0 && new Date(pointers[index - 1].date);
    const checker = (currDate - itemDate) / (86400 * 1000);
    const roundedChecker = Math.round(checker);
    const prevChecker =
      index - 1 >= 0
        ? Math.round((currDate - prevItemDate) / (86400 * 1000))
        : roundedChecker;
    let timer,
      renderTime = false;
    if (index === 0) {
      renderTime = true;
    } else if (
      roundedChecker != prevChecker &&
      itemDate.getDate() != prevItemDate.getDate()
    ) {
      renderTime = true;
    } else if (roundedChecker == prevChecker) {
      renderTime = false;
    }
    //  console.log(checker)
    if (checker < 1 && itemDate.getDate() == currDate.getDate()) {
      // today
      timer = "today";
    } else if (checker < 2) {
      // yesterday
      timer = "yesterday";
    } else {
      // days before
      const { months } = calender;
      const dater = new Date(item.date);
      timer = `${dater.getDate()}, ${
        months[dater.getMonth()].short
      } ${dater.getFullYear()}`;
    }
    return (
      <View>
        {renderTime && (
          <AppText style={styles.headerText} bold size="large">
            {timer}
          </AppText>
        )}
        <PointsCard data={item} />
      </View>
    );
  };

  const fetchScreenData = (type = "refresh") => {
    type === "refresh" && setRefreshing(true);
    getUserData(
      {
        id: userInfo._id,
        type: "get_points",
      },
      (resData) => {
        setPointers(resData.pointsActivity.reverse());
        setCurrentPoints(resData.points);
        type === "refresh" && setRefreshing(false);
        setLoadedOnce(true);
        userInfo.points != resData.points && updateMe(resData.points, "points");
      },
      (err) => {
        console.log("CHALLENGE POINT SCREEN", err);
        type === "refresh" && setRefreshing(false);
        setLoadedOnce(true);
      }
    );
  };

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setAdLoaded({ vis: true, firstLoad: true });
      }
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async (reward) => {
        const userData = {
          action: "ads_reward",
          actionData: ADS_POINT,
          instance: "user",
          instanceID: userInfo._id,
        };
        updateUserData(userData, async () => {
          try {
            const getter = await AsyncStorage.getItem("ads");
            const getAds = JSON.parse(getter);
            getAds.videosLeft = getAds.videosLeft - 1;
            getAds.lastWatched = new Date();
            // REMEMBER SETTER
            await AsyncStorage.setItem("ads", JSON.stringify(getAds));
            setAdInfo(getAds);
            setAdLoaded({ ...adLoaded, vis: false });
            rewarded.load();
          } catch (err) {
            //
            console.log("ASYNC STORAGE", err);
          }
        });
      }
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  useEffect(() => {
    fetchScreenData("load");
    handleAdsStorage();
  }, []);

  return (
    <Screen style={styles.container}>
      <AppHeader
        title="Activity"
        RightComponent={() => (
          <ScreenHeaderRight
            isLoaded={adLoaded}
            screenSetter={{
              setter: setPointers,
              updateUserData,
              uID: userInfo._id,
              popper: setPopData,
            }}
            num={adInfo?.videosLeft}
          />
        )}
      />

      <FlatList
        data={pointers}
        keyExtractor={(item) => item._id}
        renderItem={renderPointsData}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={[styles.stats, { backgroundColor: theme.background }]}>
            <AppText style={styles.statsText} bold>
              Your current WP
            </AppText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 100,
                  marginRight: 6,
                }}
              >
                <MaterialCommunityIcons
                  name="alpha-w-circle"
                  size={width * 0.06}
                  color={colors.white}
                  style={{ opacity: 0.2 }}
                />
              </View>
              <AppText
                style={{ ...styles.statsText, color: colors.primary }}
                size="xxxlarge"
                bold
              >
                {Math.min(currentPoints, 1000)}
              </AppText>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.activity}>
            {loadedOnce ? (
              <ActivityIndicator
                type="isEmpty"
                text="No recent WP activity"
                visible
              />
            ) : (
              <ActivityIndicator type="spin" visible />
            )}
          </View>
        }
        overScrollMode="never"
        refreshing={refreshing}
        onRefresh={fetchScreenData}
        contentContainerStyle={{ paddingBottom: height * 0.1 }}
      />
      <PopMessage
        popData={popData}
        timer={0.2}
        setter={() => setPopData({ vis: false })}
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  activity: {
    marginTop: height * 0.24,
  },
  container: {
    flex: 1,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: width * 0.03,
  },
  cardDetails: {
    // flex: 1,
    paddingVertical: 15,
    width: width * 0.7,
    minHeight: width * 0.27,
    alignSelf: "center",
    borderRadius: width * 0.03,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: width * 0.03,
  },
  pointsText: {
    color: colors.white,
    opacity: 0.15,
  },
  separator: {
    alignSelf: "center",
    borderRadius: width * 0.1,
  },
  stats: {
    alignSelf: "center",
    width: width * 0.4,
    height: width * 0.2,
    borderRadius: width * 0.03,
    elevation: 5,
    marginTop: 10,
    padding: 10,
    justifyContent: "space-around",
  },
  statsText: {
    textAlign: "center",
  },
});
export default ChallengePointScreen;

/*
  useEffect(() => {
    const userData = {
      action: "points",
      actionData: +4,
      instance: "user",
      instanceID: userInfo._id,
    };
    updateUserData(
      userData,
      (resData) => {
        console.log("SUCCESS", resData);
      },
      (err) => {
        console.log("ERROR", err);
      }
    );
  }, []);

*/
