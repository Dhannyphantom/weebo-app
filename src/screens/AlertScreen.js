import React, { memo, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { Context as AuthContext } from "../config/AuthContext";
import AlertBox from "../components/AlertBox";
import getTimeStamp from "../constants/getTimestamp";
import ActivityIndicator from "../components/ActivityIndicator";
import Screen from "../components/Screen";
// import StatusRender from "../components/StatusRender";
import AppHeader from "../components/AppHeader";
import Spacer from "../components/Spacer";
import colors from "../constants/colors";
import AlertModal from "../components/AlertModal";
import { useNavigation } from "@react-navigation/native";
import TobiGuide from "../components/TobiGuide";
import { alertGuide } from "../constants/data_store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadMoreContent } from "../components/Comments";

const { height } = Dimensions.get("window");

const PROMPT_DELETE_ALL = {
  visible: true,
  title: "Delete all",
  message: "Are you sure you want to wipe all notifications?",
  btn: "Delete",
  type: "delete_all",
};
const NOTIFICATION_LENGTH = 20;

const RenderAlerts = ({
  item,
  alertApi,
  setAlertApi,
  readNotification,
  shouldScroll,
  setShouldScroll,
}) => {
  const navigation = useNavigation();
  const itemDate = getTimeStamp(item._id, "raw");

  const {
    state: { userInfo },
    updateMe,
  } = useContext(AuthContext);

  const handleReadNotification = (itemId, type) => {
    const notifyData = { notifyId: item._id, action: null };
    // read the notification;
    const copyNoti = { ...alertApi };
    const findIndex = alertApi.results.findIndex((obj) => obj._id == itemId);
    if (type == "read") {
      notifyData.action = type;
      if (!copyNoti.results[findIndex].read) {
        copyNoti.results[findIndex] = {
          ...copyNoti.results[findIndex],
          read: true,
        };
        setAlertApi(copyNoti);
      }
    } else if (type === "delete") {
      notifyData.action = "delete";
      const alertResults = copyNoti.results;
      const deleted = alertResults.filter((obj) => obj._id != itemId);
      setAlertApi({ ...copyNoti, results: deleted });
      if (!copyNoti.results[findIndex].read) {
      }
    }

    readNotification(notifyData, null, (_err) => {});
  };

  const handleNavAlerts = () => {
    if (!item.isSystem) {
      if (["challenge", "lost", "accept"].includes(item.type)) {
        item.show &&
          navigation.navigate("Show", {
            show: { _id: item.show, cover_photo: null },
          });
        item.character &&
          navigation.navigate("Character", {
            item: item.character?._id ?? item.character,
          });
      } else if (item.type === "request") {
        navigation.navigate("Friends", { friends: userInfo.friends });
      } else if (item.type === "navigate") {
        // THIS SHOULD ACCOUNT FOR ALL NAVIGATION
        if (item.hasOwnProperty("group")) {
          // Navigate to Group Screen,
          navigation.navigate("Room", {
            data: {
              instance: "group",
              instanceID: item.group,
            },
          });
        } else if (item.hasOwnProperty("character")) {
          navigation.navigate("Character", {
            item: item.character?._id ?? item.character,
          });
        } else if (item.hasOwnProperty("show")) {
          navigation.navigate("Show", {
            show: { _id: item.show, cover_photo: null },
          });
        }
      }
    }
    setTimeout(() => {
      handleIconPress("read");
    }, 100);
  };

  const handleIconPress = (type) => {
    handleReadNotification(item._id, type);
  };

  return (
    <AlertBox
      user={item.user}
      character={item?.character?.name}
      date={itemDate.toLocaleString()}
      isLoading={null}
      isSystem={item.isSystem}
      shouldScroll={shouldScroll}
      setShouldScroll={setShouldScroll}
      active={!item.read}
      handlePressIcon={handleIconPress}
      message={item.message}
      alertID={item._id}
      onPress={handleNavAlerts}
    />
  );
};

const MemoizedAlerts = memo(RenderAlerts);

const AlertScreen = ({ navigation }) => {
  const {
    readNotification,
    getUserData,
    wipeNotifications,
    updateMe,
    state: { userInfo },
  } = useContext(AuthContext);
  const [alertApi, setAlertApi] = useState({ results: [] });
  const [refreshing, setRefreshing] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [prompt, setPrompt] = useState({ visible: false });
  const [bools, setBools] = useState({
    shouldScroll: true,
    loadMore: true,
    loadedOnce: false,
    badgeToggle: false,
  });
  const [guide, setGuide] = useState({ vis: false, close: false });

  const handleReadAll = () => {
    const notifyData = { notifyId: null, action: "read_all" };
    const copyNoti = { ...alertApi };
    copyNoti.results.forEach((obj) => {
      obj.read = true;
    });

    readNotification(notifyData, null, (_err) => {});

    setAlertApi(copyNoti);
  };

  const hasReadAll = alertApi?.results?.every((obj) => obj && obj.read);

  const handleDeleteAll = () => {
    // setTimeout(() => {
    //   updateMe({ data: 0, prop: "notifications" });
    // }, 8000);
    setAlertApi({ results: [] });
    wipeNotifications(null, (_errData) => {});
  };

  const handlePrompt = () => {
    handleDeleteAll();
  };

  const fetchSyncedData = async () => {
    try {
      const syncedNoti = await AsyncStorage.getItem("notifications");
      if (syncedNoti) {
        setAlertApi({ results: JSON.parse(syncedNoti) });
        setBools({ ...bools, loadedOnce: true });
      }
    } catch (_err) {}
  };

  const fetchScreenData = (type = "refresh") => {
    type === "refresh" && setRefreshing(true);
    type === "loadMore" && setBools({ ...bools, loadMore: true });

    const sendObj = {
      id: userInfo._id,
      type: "get_notifications",
      pagination: {
        page: type === "loadMore" ? alertApi?.next?.page : 1,
        limit:
          type === "loadMore" ? alertApi?.next?.limit : NOTIFICATION_LENGTH,
      },
    };

    getUserData(
      sendObj,
      async (resData) => {
        let newNoti = [];
        if (type === "loadMore") {
          newNoti = alertApi.results.concat(resData.results);
          setAlertApi({
            ...resData,
            results: newNoti,
          });
        } else {
          setAlertApi(resData);
          newNoti = resData.results;
        }
        setBools({ ...bools, loadMore: false, loadedOnce: true });
        // if (resData.counter) {
        //   setTimeout(() => {
        //     updateMe({ prop: "notifications", data: resData.counter });
        //   }, 8000);
        // }
        type === "refresh" && setRefreshing(false);
        await AsyncStorage.setItem("notifications", JSON.stringify(newNoti));
      },
      (err) => {
        type === "refresh" && setRefreshing(false);
        setErrMsg(err.msg);
        setBools({ ...bools, loadedOnce: true });
      }
    );
  };

  const handleScreenGuide = async () => {
    const tobiGuidesArr = JSON.parse(await AsyncStorage.getItem("tobi_guides"));
    if (!tobiGuidesArr.includes("alert_guide")) {
      setGuide({ ...guide, vis: true });

      tobiGuidesArr.push("alert_guide");
      await AsyncStorage.setItem("tobi_guides", JSON.stringify(tobiGuidesArr));
    }
  };

  useEffect(() => {
    fetchSyncedData();
    handleScreenGuide();
    fetchScreenData("load");
  }, []);

  useEffect(() => {
    if (hasReadAll && !bools.badgeToggle) {
      updateMe({ prop: "notifications", data: 0 });
    }
  }, [hasReadAll]);

  return (
    <Screen style={styles.container}>
      <AppHeader
        title="Notifications"
        icon={false}
        RightComponent={() => (
          <View style={styles.btnContainer}>
            {!hasReadAll && (
              <TouchableOpacity
                onPress={handleReadAll}
                activeOpacity={0.6}
                style={styles.btn}
              >
                <Feather name="check" color={colors.primary} size={20} />
              </TouchableOpacity>
            )}
            {alertApi?.results?.length > 0 && (
              <TouchableOpacity
                onPress={() => setPrompt(PROMPT_DELETE_ALL)}
                activeOpacity={0.6}
                style={styles.btn}
              >
                <Feather name="trash-2" color={colors.primary} size={20} />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {alertApi?.results?.length > 0 ? (
        <Spacer style={{ flex: 1, top: 10 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={alertApi.results}
            scrollEnabled={bools.shouldScroll}
            keyExtractor={(item) => item._id}
            refreshing={refreshing}
            ListFooterComponent={() => {
              if (Boolean(alertApi?.next?.page)) {
                return (
                  <LoadMoreContent
                    type="notifications"
                    loading={bools.loadMore}
                    onPress={() => fetchScreenData("loadMore")}
                  />
                );
              }
            }}
            onRefresh={fetchScreenData}
            renderItem={({ item }) => (
              <MemoizedAlerts
                item={item}
                alertApi={alertApi}
                setAlertApi={setAlertApi}
                shouldScroll={bools.shouldScroll}
                readNotification={readNotification}
                setShouldScroll={(bool) =>
                  setBools({ ...bool, shouldScroll: bool })
                }
              />
            )}
            contentContainerStyle={{ paddingBottom: height * 0.12 }}
            style={{ flex: 1 }}
          />
        </Spacer>
      ) : (
        <ActivityIndicator
          visible={true}
          type={
            bools.loadedOnce && alertApi?.results && !alertApi.results[0]
              ? "isEmpty"
              : "spin"
          }
          text="No new notifications"
        />
      )}
      <AlertModal obj={prompt} setVisible={setPrompt} onPress={handlePrompt} />
      <TobiGuide
        data={guide}
        setData={setGuide}
        title="Notifications"
        stateObj={alertGuide}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  btn: {
    // marginRight: 12,
    // backgroundColor: "red",
    padding: 10,
    marginLeft: 5,
  },
  btnContainer: {
    flexDirection: "row",
  },
});
export default AlertScreen;

// [
//   "challenge",
//   "losing",
//   "accept",
//   "lost",
//   "invite",
//   "complete_profile",
//   "daily_cp",
// ],
