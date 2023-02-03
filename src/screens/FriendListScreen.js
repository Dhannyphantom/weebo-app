import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";

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
import TabList from "../components/TabList";

const { width, height } = Dimensions.get("window");

const FriendListScreen = ({ route, navigation }) => {
  const {
    state: { userInfo },
    getUserData,
  } = useContext(AuthContext);

  const [showSearch, setShowSearch] = useState(false);
  const [weebos, setWeebos] = useState({ weebs: [], requests: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [tab, setTab] = useState({ weebs: true, requests: false });

  const searchRef = useRef(null);

  const onFriendPress = (item) => {
    navigation.navigate("ChatUser", { item });
  };

  const fetchWeebs = (noLoader) => {
    !noLoader && setIsLoading(true);
    getUserData(
      {
        id: userInfo._id,
        type: "get_weebs",
        query: "",
      },
      (res_data) => {
        setWeebos({
          weebs: res_data.friends,
          requests: res_data.weeb_requests,
        });
        setIsLoading(false);
      },
      (err_data) => {
        console.log(err_data?.err?.response?.data);
        setIsLoading(false);
      }
    );
  };

  const handleTabChange = (type) => {
    switch (type) {
      case "requests":
        setTab({ requests: true, weebs: false });
        break;

      case "weebs":
        setTab({ requests: false, weebs: true });
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    fetchWeebs(true);
  }, []);

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

      {!isLoading && (
        <>
          <TabList
            state={tab}
            items={[
              { tab: "weebs", name: "Weebs" },
              { tab: "requests", name: ` ${weebos.requests.length} Requests` },
            ]}
            onPress={handleTabChange}
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

          {tab.weebs ? (
            <>
              <View>
                <FriendBox
                  data={weebos.weebs}
                  callback={fetchWeebs}
                  friended
                  onPress={onFriendPress}
                />
              </View>
              <ActivityIndicator
                visible={!weebos.weebs[0]}
                type="isEmpty"
                text="No weebo..."
              />
            </>
          ) : (
            <>
              {/* WEEB REQUEST TAB */}
              <View>
                <FriendBox
                  data={weebos.requests}
                  callback={fetchWeebs}
                  type="request"
                  // onPress={onFriendPress}
                />
              </View>
              <ActivityIndicator
                visible={!weebos.requests[0]}
                type="isEmpty"
                text="No weeb requests..."
              />
            </>
          )}
        </>
      )}

      <ActivityIndicator
        visible={isLoading}
        style={styles.activity}
        transparent
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width,
    height,
  },
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
    justifyContent: "center",
    alignItems: "center",
  },
});
export default FriendListScreen;
