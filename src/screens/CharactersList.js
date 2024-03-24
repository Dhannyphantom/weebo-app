import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import ActivityIndicator from "../components/ActivityIndicator";
import ChallengeCard from "../components/ChallengeCard";
import SearchBar from "../components/SearchBar";
import { Context as AuthContext } from "../config/AuthContext";
import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import colors from "../constants/colors";
import TabList from "../components/TabList";
import Shows from "../components/Shows";
import GroupCard from "../components/GroupCard";
import { getFeedNumber } from "../constants/helpers";

const { width, height } = Dimensions.get("window");

const CARD_WIDTH = width * 0.47;

const EmptyList = ({ tab = "characters" }) => {
  return (
    <View style={{ width, height: height * 0.9 }}>
      <ActivityIndicator
        visible
        type="isEmpty"
        text={`No ${tab} found`}
        style={styles.activity}
        transparent
      />
    </View>
  );
};

const CharactersList = ({ route, navigation }) => {
  const { getUserData } = useContext(AuthContext);
  const [instances, setInstances] = useState({
    characters: [],
    shows: [],
    groups: [],
  });
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [tab, setTab] = useState({
    characters: true,
    shows: false,
    groups: false,
  });

  let selector;
  const type = route.params.type;
  const otherId = route.params.id;
  const activeTab = Object.entries(tab).find(([key, val]) => val === true)[0];
  const HEADER_TITLE =
    type == "following"
      ? "Following"
      : type === "otherCharacters"
      ? "Characters"
      : "Characters";
  const searchRef = useRef(null);

  const RightComp = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.66}
        onPress={() => setShowSearch(!showSearch)}
        style={styles.searchIconCont}
      >
        <Feather name="search" size={20} color={colors.primary} />
      </TouchableOpacity>
    );
  };

  const tabItems = [
    {
      tab: "characters",
      name: `characters ${getFeedNumber(instances?.characters?.length)}`,
    },
    {
      tab: "shows",
      name: `shows ${getFeedNumber(instances?.shows?.length)}`,
    },
    {
      tab: "groups",
      name: `groups ${getFeedNumber(instances?.groups?.length)}`,
    },
  ];

  useEffect(() => {
    switch (type) {
      case "following":
        selector = "get_following+favorites";
        break;
      case "instances":
      case "otherCharacters":
        selector = "get_instances";
        break;
    }

    getUserData({ id: otherId, type: selector }, (data) => {
      setInstances(data);
      setIsLoading(false);
    });
  }, [selector, navigation]);

  useEffect(() => {
    if (showSearch) {
      searchRef?.current?.focus();
    }
  }, [showSearch]);

  return isLoading ? (
    <ActivityIndicator visible="true" type="spin" />
  ) : (
    <Screen style={styles.container}>
      <AppHeader title={HEADER_TITLE} RightComponent={RightComp} />
      <TabList state={tab} setState={setTab} items={tabItems} />
      <FlatList
        data={["WEEBO"]}
        contentContainerStyle={{ paddingBottom: height * 0.12 }}
        keyExtractor={(item) => item}
        renderItem={() => {
          return (
            <View>
              {showSearch && (
                <View style={styles.search}>
                  <SearchBar
                    searchBar={searchText}
                    ref={searchRef}
                    placeholder={`Search ${activeTab}...`}
                    setSearchBar={setSearchText}
                    style={styles.searchComp}
                  />
                </View>
              )}
              <View style={styles.charList}>
                {activeTab === "shows" ? (
                  <Shows data={instances.shows} searchResult series />
                ) : (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    listKey="renderCharacters"
                    ListEmptyComponent={() => <EmptyList tab={activeTab} />}
                    data={instances[activeTab]}
                    keyExtractor={(item, index) => (item + index).toString()}
                    renderItem={({ item }) => {
                      return (
                        <View style={styles.charCont}>
                          {activeTab === "characters" ? (
                            <ChallengeCard
                              large
                              name={item.dpName}
                              id={item._id}
                              show={item?.show?.name_j ?? item?.show?.name_e}
                              followers={item.followers}
                              isFollowing={item.isFollowing}
                              avatar={item.manager && item.manager.avatar}
                              owner={item.manager}
                              image={item.cover_photo}
                              onPress={() =>
                                navigation.navigate("Character", {
                                  item: item._id,
                                })
                              }
                            />
                          ) : activeTab === "groups" ? (
                            <GroupCard
                              item={item}
                              showName
                              onPress={() =>
                                navigation.navigate("Group", { item })
                              }
                            />
                          ) : null}
                        </View>
                      );
                    }}
                  />
                )}
              </View>
            </View>
          );
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  activity: { width, height: "100%", position: "absolute" },
  container: {
    flex: 1,
  },
  charCont: {
    marginBottom: 18,
    marginTop: 10,
    marginHorizontal: width * 0.01,
  },
  charList: {
    flex: 1,
  },
  charHeaderTitle: {
    color: colors.medium,
    textAlign: "center",
    marginTop: 10,
  },
  cardCont: {
    width: CARD_WIDTH,
    height: height * 0.28,
  },
  btmStyle: {
    width: CARD_WIDTH,
    height: CARD_WIDTH / 2.9,
  },
  info: {
    bottom: 45,
  },
  search: {
    marginBottom: 10,
    alignItems: "flex-end",
    marginHorizontal: 10,
  },
  searchComp: {
    width: width * 0.94,
    marginTop: 8,
    alignSelf: "center",
  },
  searchIconCont: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  subTitle: {
    top: 8,
  },
});
export default CharactersList;
