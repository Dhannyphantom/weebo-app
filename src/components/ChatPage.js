import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SearchBar from "../src/components/SearchBar";
import { StatusBar } from "expo-status-bar";

import colors from "../src/constants/colors";
import ChatFile from "./ChatFile";

const chatPeopleData = [
  {
    id: "1",
    avatar: require("../assets/cane10.jpg"),
    username: "Dhannyphantom",
    msg: "Hi there Steven kun",
    time: "2m ago",
  },
  {
    id: "2",
    avatar: require("../assets/female2.jpg"),
    username: "Kakaluv",
    msg:
      "Really Steven kun like i dont get whats wrong with you. U act like you dont care Honestyly Like its not fair or something",
    time: "2h ago",
  },
  {
    id: "3",
    avatar: require("../assets/male2.jpg"),
    username: "Hiroshima",
    msg: "Text me back Steven",
    time: "23m ago",
  },
  {
    id: "4",
    avatar: require("../assets/otaku3.png"),
    username: "Hanzo",
    msg: "Yoo Steve my man wassup",
    time: "2d ago",
  },
  {
    id: "5",
    avatar: require("../assets/otaku2.png"),
    username: "Dextrous_city",
    msg: "Baka na Steven kun. Masashi buritana Deska?",
    time: "just now",
  },
];

const ChatPage = () => {
  const [searchInput, setSearchInput] = useState("");

  const renderChatPeople = ({ item }) => {
    return <ChatFile item={item} onPress={handleChatPress} />;
  };

  const handleChatPress = (item) => {
    console.log(item.username);
  };

  const handlePlusPress = () => {
    console.log("Plus pressed");
  };
  const handleBackPress = () => {
    console.log("Back button pressed");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.littleCont}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.76}
          onPress={handleBackPress}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={29}
            color={colors.white}
          />
        </TouchableOpacity>
        <View style={styles.header}>
          <View style={styles.chatHeader}>
            <View style={styles.chatTextHead}>
              <Text style={styles.chatText}> Chats </Text>
              <View style={styles.notify}></View>
              <Text style={styles.notifyText}>34</Text>
            </View>
            <TouchableOpacity activeOpacity={0.55} onPress={handlePlusPress}>
              <MaterialCommunityIcons
                name="plus"
                color={colors.primary}
                size={28}
              />
            </TouchableOpacity>
          </View>
          <SearchBar
            searchBar={searchInput}
            style={styles.searchBar}
            setSearchBar={setSearchInput}
            placeholder="Search weebs..."
          />
          <View>
            <FlatList
              data={chatPeopleData}
              keyExtractor={(item) => item.id}
              renderItem={renderChatPeople}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  backBtn: {
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  chatText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    marginRight: 18,
  },
  chatTextHead: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    marginTop: 15,
    backgroundColor: colors.white,
    padding: 10,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
  },
  littleCont: {
    flex: 1,
    marginTop: 60,
  },
  notify: {
    backgroundColor: colors.primary,
    borderRadius: 1000,
    minWidth: 12,
    minHeight: 12,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  notifyText: {
    color: colors.heart,
    fontSize: 17,
    marginLeft: 3,
  },
  searchBar: {
    marginTop: 10,
    width: "97%",
    alignSelf: "center",
  },
});
export default ChatPage;
