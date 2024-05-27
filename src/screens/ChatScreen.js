import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Context as AuthContext } from "../config/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import SearchBar from "../components/SearchBar";

import colors from "../constants/colors";
import ChatFile from "../components/ChatFile";
import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";
import ThemeContext from "../config/ThemeContext";
import DropDown from "../components/DropDown";

const { width } = Dimensions.get("window");

const ChatScreen = ({ navigation }) => {
  const {
    joinRoom,
    getUserData,
    state: { userInfo },
  } = useContext(AuthContext);

  const [searchInput, setSearchInput] = useState("");
  const [searchShow, setSearchShow] = useState(false);
  const [chatAction, setChatAction] = useState({ vis: false, data: null });
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bools, setBools] = useState({
    selection: false,
  });
  const [chatUsers, setChatUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);

  const searchRef = useRef(null);
  const theme = useContext(ThemeContext);
  const chatSelected = chatUsers.filter((item) => item.selected).length;

  const dropLists = [
    {
      id: uuid.v4(),
      name: "Select chat",
      onPress: () => handleChatAction("select"),
      show: !bools.selection,
      icon: "circle",
      iconPack: "F",
    },
    {
      id: uuid.v4(),
      name: `Clear ${bools.selection ? "selected" : ""} chat`,
      onPress: () => handleChatAction(),
      show: true,
      icon: "edit",
      iconPack: "F",
    },

    {
      id: uuid.v4(),
      name: `Delete ${bools.selection ? "selected" : ""} chat`,
      onPress: () => handleChatAction(),
      show: true,
      icon: "trash",
      iconPack: "F",
    },
  ];

  const handleChatAction = (type, data) => {
    switch (type) {
      case "select":
        setBools({ selection: true });
        setChatUsers((prev) =>
          prev.map((chat) => {
            if (chat?.user?._id == chatAction?.data?.user?._id) {
              return {
                ...chat,
                selected: true,
              };
            } else {
              return chat;
            }
          })
        );
        break;

      default:
        break;
    }
  };

  const renderChatPeople = ({ item }) => {
    return (
      <ChatFile
        item={item}
        onPress={handleChatPress}
        setChatAction={setChatAction}
      />
    );
  };

  const handleChatPress = (item) => {
    if (bools.selection) {
      setChatUsers((prev) =>
        prev.map((chat) => {
          if (chat?.user?._id == item?.user?._id) {
            return {
              ...chat,
              selected: !chat.selected,
            };
          } else {
            return chat;
          }
        })
      );
    } else {
      navigation.navigate("ChatUser", {
        item: {
          _id: item.user._id,
          username: item.user.username,
          avatar: item.user.avatar,
        },
      });
      joinRoom(userInfo._id, item.user._id);
    }
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
    const filterArr = chatUsers.filter((obj) => obj?.username?.match(regExp));
    setSearchUsers(filterArr);
  };

  const handleRefresh = async (type = "refresh") => {
    type === "refresh" && setRefreshing(true);
    if (type === "load") {
      const chatUsersStr = await AsyncStorage.getItem("chatUsers");
      const user_chats = JSON.parse(chatUsersStr);
      if (user_chats) {
        setChatUsers(user_chats);
      }
    }
    getUserData(
      {
        id: userInfo._id,
        type: "get_chats",
        query: "",
      },
      async (resData) => {
        const my_chats = resData.chats
          .filter((obj) => obj.hasOwnProperty("user"))
          .map((chat) => ({ ...chat, selected: false }));
        setChatUsers(my_chats);
        setLoadedOnce(true);
        await AsyncStorage.setItem("chatUsers", JSON.stringify(my_chats));
        type === "refresh" && setRefreshing(false);
      },
      (err) => {
        type === "refresh" && setRefreshing(false);
      }
    );
  };

  const stopSelection = () => {
    setChatUsers((prev) =>
      prev.map((chat) => ({
        ...chat,
        selected: false,
      }))
    );
    setBools({ ...bools, selection: false });
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
    <Screen style={{ ...styles.container, backgroundColor: colors.primary }}>
      <StatusBar style="light" />
      <View style={styles.littleCont}>
        <View style={styles.chatHeader}>
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={handleBackPress}
            style={styles.chatTextHead}
          >
            <View>
              <Feather name="chevron-left" size={19} color={colors.white} />
            </View>
            <AppText style={styles.chatText} size="large" bold>
              Chats
            </AppText>
          </TouchableOpacity>
          <View style={styles.actionIcons}>
            {bools.selection ? (
              <>
                <AppText style={{ color: colors.light }} bold>
                  {chatSelected}
                </AppText>
                <AppText style={{ color: colors.light }}>Selected</AppText>
                <TouchableOpacity
                  style={styles.topIcons}
                  activeOpacity={0.88}
                  onPress={stopSelection}
                >
                  <Feather name="x" color={colors.white} size={18} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.topIcons}
                  activeOpacity={0.88}
                  onPress={() => setChatAction({ ...chatAction, vis: true })}
                >
                  <Feather
                    name="more-vertical"
                    color={colors.white}
                    size={18}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.topIcons}
                  activeOpacity={0.88}
                  onPress={handleSearchPress}
                >
                  <Feather name="search" color={colors.white} size={18} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.topIcons}
                  activeOpacity={0.88}
                  onPress={handlePlusPress}
                >
                  <Feather name="plus" size={18} color={colors.white} />
                </TouchableOpacity>
              </>
            )}
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

        <View
          style={[
            styles.header,
            { backgroundColor: theme.backgroundExtralight },
          ]}
        >
          <View style={{ flex: 1 }}>
            {chatUsers.length > 0 ? (
              <FlatList
                data={searchInput.length < 1 ? chatUsers : searchUsers}
                keyExtractor={(item) =>
                  item?.last_message?._id ?? item?.user?._id
                }
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    progressBackgroundColor={theme.extralight}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
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
      <DropDown
        visible={chatAction.vis}
        setter={(vis) => setChatAction({ ...chatAction, vis })}
        lists={dropLists}
      />
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
    paddingTop: 15,
    elevation: 5,
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
    padding: 10,
    marginRight: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ChatScreen;
