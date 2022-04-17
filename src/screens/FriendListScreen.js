import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import { Context as AuthContext } from "../config/AuthContext";

import AppText from "../components/AppText";
import AppHeader from "../components/AppHeader";
import ActivityIndicator from "../components/ActivityIndicator";
import Separator from "../components/Separator";
import colors from "../constants/colors";
import AppButton from "../components/AppButton";
import SearchBar from "../components/SearchBar";
import Screen from "../components/Screen";
import FriendBox from "../components/FriendBox";

const { width, height } = Dimensions.get("window");

const FriendListScreen = ({ route, navigation }) => {
  const {
    joinRoom,
    addWeeb,
    tryLocalSignin,
    state: { userInfo },
  } = useContext(AuthContext);

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const pple = route.params.friends;
  const searchRef = useRef(null);

  const onFriendPress = (item) => {
    navigation.navigate("ChatUser", { item });
  };

  useEffect(() => {
    searchRef?.current?.focus();
  }, [showSearch]);
  return (
    <Screen style={styles.container}>
      <AppHeader
        title="My Weebs"
        RightComponent={() => (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.searchBox}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Feather name="search" size={width * 0.03} color={colors.primary} />
          </TouchableOpacity>
        )}
      />

      {showSearch && (
        <SearchBar
          ref={searchRef}
          searchBar={searchText}
          setSearchBar={setSearchText}
          style={styles.searchBar}
          placeholder="Search your weebs..."
        />
      )}

      <View>
        <FriendBox data={pple} onPress={onFriendPress} />
      </View>
      <ActivityIndicator visible={!pple[0]} type="isEmpty" text="No weebo..." />
    </Screen>
  );
};
const styles = StyleSheet.create({
  btn: {
    marginLeft: 20,
  },
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 18,
    marginRight: 30,
  },
  rightCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    width: width * 0.97,
    alignSelf: "center",
    marginBottom: 10,
  },
  searchBox: {
    marginRight: 12,
    width: width * 0.07,
    height: width * 0.07,
    backgroundColor: colors.extraLight,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default FriendListScreen;
