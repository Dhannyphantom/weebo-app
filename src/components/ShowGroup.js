import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { Context as FeedContext } from "../config/FeedContext";
import { Context as AcctContext } from "../config/AcctContext";

//// BASICALLY THE SAME SCREEN WITH GROUPSSCREEN;
//// REFACTOR

import Screen from "../components/Screen";
import FeedBox from "../components/FeedBox";
import AppHeader from "../components/AppHeader";
import ActivityIndicator from "../components/ActivityIndicator";
import SearchBar from "../components/SearchBar";
import colors from "../constants/colors";
import AppText from "../components/AppText";
import ThemeContext from "../config/ThemeContext";

const { width, height } = Dimensions.get("window");

const ShowGroup = ({ screen, headerTitle }) => {
  const navigation = useNavigation();
  const { getShows, getGroups } = useContext(FeedContext);
  const { searchStuffs } = useContext(AcctContext);
  const theme = useContext(ThemeContext);

  const [screenData, setScreenData] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef(null);

  const handleImagePress = (item) => {
    const viewRoomData = {
      instance: screen,
      instanceID: item._id,
    };
    if (screen === "show") {
      navigation.navigate("Show", { show: item });
    } else if (screen === "group") {
      navigation.navigate("Room", {
        roomID: item._id,
        data: viewRoomData,
        instance: item,
      });
    }
  };

  const fetchScreenData = (bool) => {
    if (bool) setRefreshing(true);
    if (screen === "group") {
      getGroups(
        (data) => {
          setScreenData(data);
          setIsLoading(false);
          setFirstLoad(true);
          if (bool) setRefreshing(false);
        },
        (err) => {
          setErrMsg(err);
          if (bool) setRefreshing(false);
        }
      );
    } else if (screen === "show") {
      getShows(
        "all shows",
        (resData) => {
          setFirstLoad(true);
          setScreenData(resData);
        },
        (err) => {
          setErrMsg(err);
        }
      );
    }
  };

  const handleShowSearch = () => {
    searchStuffs(
      { term: searchText, type: screen },
      (resData) => {
        setSearchData(resData);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const renderScreenData = ({ item }) => {
    if (screen === "show") {
      return (
        <FeedBox
          title={item.name_j || item.name_e}
          mediaType="image"
          icon="television"
          image={item?.cover_photo}
          onPress={() => handleImagePress(item)}
          statLeft={`${item.followers.length} followers`}
          statMid={item.creator}
          statRight={`${item.characters.length} character${
            item.characters.length > 1 ? "s" : ""
          }`}
        />
      );
    } else if (screen === "group") {
      return (
        <FeedBox
          title={item.name}
          image={item?.cover_photo}
          pack="a"
          mediaType="image"
          onPress={() => handleImagePress(item)}
          icon="team"
          statLeft={`${item.followers.length} followers`}
          statMid={item.leader}
          statRight={`${
            item.charactersNum ?? item.characters.length
          } character${item.characters.length > 1 ? "s" : ""}`}
        />
      );
    }
  };

  const RenderSearch = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowSearch(!showSearch)}
        style={styles.search}
      >
        <Feather name="search" color={colors.primary} size={width * 0.03} />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    searchRef?.current?.focus();
  }, [showSearch]);

  useEffect(() => {
    fetchScreenData();
  }, []);

  return (
    <Screen style={styles.container}>
      <AppHeader
        style={{ marginBottom: 8 }}
        title={headerTitle}
        RightComponent={RenderSearch}
      />
      {showSearch && (
        <>
          <SearchBar
            searchBar={searchText}
            setSearchBar={setSearchText}
            pressCb={handleShowSearch}
            ref={searchRef}
            placeholder={`Search ${headerTitle}`}
          />
          <View
            style={[
              styles.searchView,
              { backgroundColor: theme.backgroundExtralight },
            ]}
          >
            <AppText style={styles.searchTitle} bold>
              Search Result
            </AppText>
            <FlatList
              data={searchData}
              keyExtractor={(item) => item._id}
              style={{ paddingTop: 10 }}
              renderItem={renderScreenData}
            />
          </View>
        </>
      )}

      <FlatList
        data={screenData}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => fetchScreenData(true)}
        ListEmptyComponent={
          <ActivityIndicator
            visible={true}
            type="isEmpty"
            text={firstLoad ? `No ${screen} data` : `Getting ${screen} data...`}
            style={styles.activity}
          />
        }
        renderItem={renderScreenData}
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activity: {
    width,
    height,
  },
  search: {
    width: width * 0.075,
    height: width * 0.075,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchView: {
    width,
    height,
    alignSelf: "center",
    marginTop: 4,
    borderRadius: width * 0.02,
  },
  searchTitle: {
    textAlign: "center",
    marginTop: 8,
  },
});
export default ShowGroup;
