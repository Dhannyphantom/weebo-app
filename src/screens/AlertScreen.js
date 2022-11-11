import React, { useContext, useEffect, useState } from "react";
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
import StatusRender from "../components/StatusRender";
import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import Spacer from "../components/Spacer";
import AppText from "../components/AppText";
import colors from "../constants/colors";
import AlertModal from "../components/AlertModal";

const { height } = Dimensions.get("window");

const PROMPT_DELETE_ALL = {
  visible: true,
  title: "Delete all",
  message: "Are you sure you want to wipe all notifications?",
  btn: "Delete",
  type: "delete_all",
};

const AlertScreen = ({ navigation }) => {
  const {
    readNotification,
    getUserData,
    state: { userInfo },
  } = useContext(AuthContext);
  const [alertApi, setAlertApi] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [prompt, setPrompt] = useState({ visible: false });
  const [loadedOnce, setLoadedOnce] = useState(false);

  const handleReadAll = () => {
    const notifyData = { notifyId: null, action: "read_all" };
    const copyNoti = [...alertApi];
    copyNoti.forEach((obj) => {
      obj.read = true;
    });
    readNotification(notifyData, null, (err) => console.log(err));

    setAlertApi(copyNoti);
  };

  const hasReadAll = alertApi.every((obj) => obj.read);

  const handleDeleteAll = () => {
    setAlertApi([]);
  };

  const handlePrompt = () => {
    handleDeleteAll();
  };

  const renderAlerts = ({ item }) => {
    const itemDate = getTimeStamp(item._id, "raw");

    const handleReadNotification = (itemId, type) => {
      const notifyData = { notifyId: item._id, action: null };
      // read the notification;
      const copyNoti = [...alertApi];
      if (type == "read") {
        notifyData.action = type;
        const findIndex = alertApi.findIndex((obj) => obj._id == itemId);
        copyNoti[findIndex] = { ...copyNoti[findIndex], read: true };
        setAlertApi(copyNoti);
      } else if (type === "delete") {
        notifyData.action = "delete";
        setAlertApi(copyNoti.filter((obj) => obj._id != itemId));
      }

      readNotification(notifyData, null, (err) => console.log(err));
    };

    const handleNavAlerts = () => {
      if (item.type === "challenge") {
        //character challenge
        navigation.navigate("Character", { item: item.character._id });
      } else {
        // navigation.navigate("AlertDetail", { item });
      }

      handleReadNotification(item._id, "read");
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
        active={!item.read}
        handlePressIcon={handleIconPress}
        message={item.message}
        alertID={item._id}
        onPress={handleNavAlerts}
      />
    );
  };

  const fetchScreenData = (type = "refresh") => {
    type === "refresh" && setRefreshing(true);
    getUserData(
      {
        id: userInfo._id,
        type: "get_notifications",
      },
      (resData) => {
        setAlertApi(resData.notifications.reverse());
        setLoadedOnce(true);
        type === "refresh" && setRefreshing(false);
      },
      (err) => {
        // console.log(err.err?.response?.data);
        type === "refresh" && setRefreshing(false);
        setErrMsg(err.msg);
        setLoadedOnce(true);
      }
    );
  };

  useEffect(() => {
    // FETCH
    fetchScreenData("load");
  }, []);

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
            {alertApi[0] && (
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
      <StatusRender />
      {alertApi[0] ? (
        <Spacer style={{ flex: 1, top: 10 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={alertApi}
            keyExtractor={(item) => item._id}
            refreshing={refreshing}
            onRefresh={fetchScreenData}
            renderItem={renderAlerts}
            contentContainerStyle={{ paddingBottom: height * 0.12 }}
            style={{ flex: 1 }}
          />
        </Spacer>
      ) : (
        <ActivityIndicator
          visible={true}
          type={loadedOnce ? "isEmpty" : "spin"}
          text="No new notifications"
        />
      )}
      <AlertModal obj={prompt} setVisible={setPrompt} onPress={handlePrompt} />
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
