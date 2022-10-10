import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import ActivityIndicator from "../components/ActivityIndicator";
import ChallengeCard from "../components/ChallengeCard";
import SearchBar from "../components/SearchBar";
import { Context as AuthContext } from "../config/AuthContext";
import Show from "../components/Shows";
import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import colors from "../constants/colors";
import AppText from "../components/AppText";

const screen = Dimensions.get("window");

const CARD_WIDTH = screen.width * 0.47;

const CharactersList = ({ route, navigation }) => {
  const {
    getUserData,
    state: { userInfo },
  } = useContext(AuthContext);
  const [myCharacters, setMyCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  let selector;
  const type = route.params.type;
  const otherId = route.params.id;
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

  useEffect(() => {
    switch (type) {
      case "following":
        selector = "get_following+favorites";
        break;
      case "myCharacters":
      case "otherCharacters":
        selector = "get_characters";
        break;
    }
    getUserData(otherId, selector, (data) => {
      data.favorites && setFavorites(data.favorites);
      if (data.following) {
        const followingChar = data.following;
        const favoritesIds = data.favorites.map((obj) => obj._id);
        const filterFollowing = followingChar.filter(
          (obj) => !favoritesIds.includes(obj._id)
        );
        setMyCharacters(filterFollowing);
      }
      data.charactersOwned && setMyCharacters(data.charactersOwned);
      setIsLoading(false);
    });
  }, [selector, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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
      <FlatList
        data={["OTAKU"]}
        keyExtractor={(item) => item}
        renderItem={() => {
          return (
            <View>
              {showSearch && (
                <View style={styles.search}>
                  <SearchBar
                    searchBar={searchText}
                    ref={searchRef}
                    placeholder="Search characters..."
                    setSearchBar={setSearchText}
                    style={styles.searchComp}
                  />
                </View>
              )}
              <View style={styles.charList}>
                {favorites[0] && (
                  <Show data={favorites} searchResult title="My Favorites" />
                )}
                {myCharacters[0] && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name="ninja"
                      size={screen.width * 0.03}
                      color={colors.primary}
                    />
                    <AppText style={styles.charHeaderTitle} bold>
                      {" "}
                      Regulars{" "}
                    </AppText>
                  </View>
                )}
                <FlatList
                  showsVerticalScrollIndicator={false}
                  numColumns={2}
                  listKey="renderCharacters"
                  data={myCharacters}
                  keyExtractor={(item, index) => (item + index).toString()}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.charCont}>
                        <ChallengeCard
                          large
                          name={item.dpName}
                          id={item._id}
                          show={item?.show?.name_j ?? item?.show?.name_e}
                          followers={item.followers}
                          avatar={item.owner && item.owner.avatar}
                          owner={item.owner}
                          image={item.cover_photo}
                          onPress={() =>
                            navigation.navigate("Character", { item: item._id })
                          }
                        />
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          );
        }}
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  charCont: {
    marginBottom: 18,
    marginTop: 10,
    marginHorizontal: screen.width * 0.01,
  },
  charList: {
    flex: 1,
  },
  charHeaderTitle: {
    color: colors.primary,
  },
  cardCont: {
    width: CARD_WIDTH,
    height: screen.height * 0.28,
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
    width: screen.width * 0.8,
    marginTop: 8,
  },
  searchIconCont: {
    backgroundColor: colors.extraLight,
    width: screen.width * 0.09,
    height: screen.width * 0.08,
    marginHorizontal: screen.width * 0.003,
    marginBottom: 8,
    borderRadius: screen.width * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },
  subTitle: {
    top: 8,
  },
});
export default CharactersList;
