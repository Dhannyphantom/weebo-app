import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Context as AuthContext } from "../config/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SearchBar from "../components/SearchBar";

import colors from "../constants/colors";
import ChatFile from "../components/ChatFile";
import getTimeStamp from "../constants/getTimestamp";
import Separator from "../components/Separator";
import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";

const { width, height } = Dimensions.get("window");

const ChatScreen = ({ navigation }) => {
  const {
    joinRoom,
    getUserData,
    getSocket,
    state: { userInfo },
  } = useContext(AuthContext);

  const [searchInput, setSearchInput] = useState("");
  const [searchShow, setSearchShow] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);

  const searchRef = useRef(null);

  const renderChatPeople = ({ item }) => {
    return <ChatFile item={item} onPress={handleChatPress} />;
  };

  const handleChatPress = (item) => {
    navigation.navigate("ChatUser", {
      item: { _id: item.recipientId, username: item.username },
    });
    joinRoom(userInfo._id, item.recipientId);
  };

  const handlePlusPress = () => {
    navigation.navigate("Friends", { friends: userInfo.friends });
  };

  const handleSearchPress = () => {
    setSearchShow(!searchShow);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleTheSearch = () => {
    const regExp = new RegExp(searchInput, "gi");
    const filterArr = chatUsers.filter((obj) => obj.username.match(regExp));
    setSearchUsers(filterArr);
  };

  const handleFreshData = (chatDataArr) => {
    const chatData = chatDataArr.map((obj) => {
      const lIndex = obj.chats.length - 1;
      const lastMsg = lIndex > -1 ? obj.chats[lIndex].message : null;
      const recipient = obj.users.find((e) => e._id != userInfo._id);
      const time = lIndex > -1 ? getTimeStamp(obj.chats[lIndex]._id) : null;
      let chatObj = {};
      if (obj.chats[0]) {
        chatObj.avatar = recipient?.avatar;
        chatObj.username = recipient?.username;
        chatObj.recipientId = recipient?._id;
        chatObj.id = obj._id;
        chatObj.msg = lastMsg;
        chatObj.time = time;
        chatObj.timer = getTimeStamp(obj.chats[lIndex]._id, "raw");
      } else {
        return null;
      }
      return chatObj;
    });
    setChatUsers(
      chatData
        .filter((obj) => obj != null)
        .sort((a, b) => b.timer.getTime() - a.timer.getTime())
    );
  };

  const handleRefresh = async (type = "refresh") => {
    type === "refresh" && setRefreshing(true);
    if (type === "load") {
      const getChats = JSON.parse(await AsyncStorage.getItem("chatUsers"));
      if (getChats) {
        handleFreshData(getChats);
      }
    }
    getUserData(
      userInfo._id,
      "get_chats",
      async (resData) => {
        handleFreshData(resData.chats);
        setLoadedOnce(true);
        await AsyncStorage.setItem("chatUsers", JSON.stringify(resData.chats));
        type === "refresh" && setRefreshing(false);
      },
      (err) => {
        console.log(err);
        type === "refresh" && setRefreshing(false);
      }
    );
  };

  useEffect(() => {
    if (searchShow) {
      searchShow ? searchRef?.current?.focus() : null;
    }
  }, [searchShow]);

  useEffect(() => {
    const subOne = navigation.addListener("focus", () => {
      handleRefresh("load");
    });
    return () => {
      subOne;
    };
  }, [navigation]);

  return (
    <Screen style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.littleCont}>
        <View style={styles.chatHeader}>
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={handleBackPress}
            style={styles.chatTextHead}
          >
            <View>
              <Feather
                name="chevron-left"
                size={width * 0.045}
                color={colors.white}
              />
            </View>
            <AppText style={styles.chatText} size="xlarge" bold>
              Chats
            </AppText>
          </TouchableOpacity>
          <View style={styles.actionIcons}>
            <TouchableOpacity
              style={{ ...styles.topIcons, ...styles.searchIcon }}
              activeOpacity={0.88}
              onPress={handleSearchPress}
            >
              <Feather name="search" color={colors.primary} size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.topIcons, ...styles.plusIcon }}
              activeOpacity={0.88}
              onPress={handlePlusPress}
            >
              <MaterialCommunityIcons
                name="plus"
                color={colors.primary}
                size={18}
              />
            </TouchableOpacity>
          </View>
        </View>
        {searchShow && (
          <SearchBar
            ref={searchRef}
            searchBar={searchInput}
            style={styles.searchBar}
            pressCb={handleTheSearch}
            setSearchBar={setSearchInput}
            placeholder="Search my weebs..."
          />
        )}

        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            {chatUsers.length > 0 ? (
              <FlatList
                data={searchInput.length < 1 ? chatUsers : searchUsers}
                keyExtractor={(item) => item.id}
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                renderItem={renderChatPeople}
              />
            ) : (
              <ActivityIndicator
                visible={true}
                type="isEmpty"
                text={loadedOnce ? "No recent chats" : "Fetching chats..."}
                ComponentRenderer={() => {
                  return (
                    loadedOnce && (
                      <AppButton
                        title="New Chat"
                        naked
                        onPress={handlePlusPress}
                      />
                    )
                  );
                }}
                transparent
              />
            )}
          </View>
        </View>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  actionIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.chat,
  },
  chatText: {
    color: colors.white,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: width * 0.03,
  },
  chatTextHead: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: width * 0.02,
  },
  header: {
    marginTop: 15,
    backgroundColor: colors.extraLight,
    paddingTop: 15,
    borderTopStartRadius: width * 0.045,
    borderTopEndRadius: width * 0.045,
    flex: 1,
  },
  littleCont: {
    flex: 1,
  },
  searchBar: {
    marginTop: 8,
    width: "94%",
    borderRadius: 11,
    alignSelf: "center",
  },
  topIcons: {
    backgroundColor: colors.extraLight,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    borderTopStartRadius: width * 0.025,
    borderBottomStartRadius: width * 0.025,
    borderBottomEndRadius: width * 0.008,
    borderTopEndRadius: width * 0.008,
    marginRight: 3,
  },
  plusIcon: {
    borderTopStartRadius: width * 0.008,
    borderBottomStartRadius: width * 0.008,
    borderBottomEndRadius: width * 0.025,
    borderTopEndRadius: width * 0.025,
  },
});
export default ChatScreen;
