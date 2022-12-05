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

import Screen from "../components/Screen";
import FeedBox from "../components/FeedBox";
import AppHeader from "../components/AppHeader";
import ActivityIndicator from "../components/ActivityIndicator";
import SearchBar from "../components/SearchBar";
import colors from "../constants/colors";
import AppText from "../components/AppText";
import ThemeContext from "../config/ThemeContext";
import AppFadeIn from "./AppFadeIn";
import { filters } from "../constants/data_store";
import AppButton from "./AppButton";
import PopDropDown from "./PopDropDown";
import AppPickerItem from "./AppPickerItem";

const { width, height } = Dimensions.get("window");

const boolsObj = {
  isLoading: false,
  showSearch: false,
  firstLoad: false,
  filter: false,
};

const FilterItem = ({ item, setModal }) => {
  const theme = useContext(ThemeContext);

  const onOpenModal = () => {
    setModal({
      vis: true,
      close: false,
      type: item.type,
      data: item.data,
      title: item.title,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onOpenModal}
      style={[styles.filterItem, { backgroundColor: theme.extralight }]}
    >
      <AppText bold size="large">
        {item.name}
      </AppText>
    </TouchableOpacity>
  );
};

const RenderGenre = ({ data, handleSelect, type, setter }) => {
  return (
    <View style={styles.modalContainer}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 15 }}
        renderItem={({ item }) => (
          <AppPickerItem
            text={item.title}
            desc={item.discription}
            example={item.example}
            onPress={() => {
              setter();
              handleSelect({ type, val: item.title });
            }}
          />
        )}
        numColumns={3}
        listKey="dropDown"
      />
    </View>
  );
};

const RenderInstanceFilter = ({ setter }) => {
  const theme = useContext(ThemeContext);
  const [modal, setModal] = useState({ vis: false, close: false });

  const onfilterOptions = (item) => {
    console.log(item);
  };

  const RenderModalComponents = () => {
    if (modal.type === "genre" || modal.type === "sub_genre") {
      return (
        <RenderGenre
          data={modal.data}
          type={modal.type}
          setter={() => setModal({ vis: false, close: true })}
          handleSelect={onfilterOptions}
        />
      );
    }
  };

  return (
    <View
      style={[
        styles.filterContainer,
        { backgroundColor: theme.transparentBold },
      ]}
    >
      <FlatList
        data={filters}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FilterItem item={item} setModal={setModal} />
        )}
      />

      <View style={styles.filterBtns}>
        <AppButton title="Apply" LIcon="check" bare />
        <AppButton
          title="Cancel"
          onPress={setter}
          LIcon="cancel"
          bare
          bareRed
        />
      </View>
      <PopDropDown
        setter={() => setModal({ vis: false })}
        visible={modal.vis}
        close={modal.close}
        headerTitle={modal.title}
        RenderComponent={() => <RenderModalComponents />}
      />
    </View>
  );
};

const ShowGroup = ({ screen, headerTitle }) => {
  const navigation = useNavigation();
  const { getShows, getGroups } = useContext(FeedContext);
  const { searchStuffs } = useContext(AcctContext);
  const theme = useContext(ThemeContext);

  const [screenData, setScreenData] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [bools, setBools] = useState(boolsObj);

  const { showSearch, firstLoad, filter } = bools;

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
          setBools({ ...bools, isLoading: false, firstLoad: true });
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
          setBools({ ...bools, firstLoad: true });
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
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setBools({ ...bools, showSearch: !showSearch })}
          style={styles.search}
        >
          <Feather name="search" color={colors.primary} size={18} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setBools({ ...bools, filter: !filter })}
          style={styles.search}
        >
          <Feather name="filter" color={colors.primary} size={18} />
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    searchRef?.current?.focus();
  }, [showSearch]);

  useEffect(() => {
    fetchScreenData();
  }, []);

  return (
    <Screen
      style={{
        ...styles.container,
        backgroundColor: theme.backgroundExtralight,
      }}
    >
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
              contentContainerStyle={{ paddingBottom: height * 0.08 }}
              renderItem={renderScreenData}
            />
          </View>
        </>
      )}

      <FlatList
        data={screenData}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 15, paddingBottom: height * 0.08 }}
        refreshing={refreshing}
        onRefresh={() => fetchScreenData(true)}
        ListEmptyComponent={
          <ActivityIndicator
            visible={true}
            type="isEmpty"
            wTransparent
            text={
              firstLoad
                ? `No ${screen} data`
                : `Fetching anime ${screen} data...`
            }
            style={styles.activity}
          />
        }
        renderItem={renderScreenData}
      />
      <AppFadeIn
        visible={filter}
        RenderComponent={() => (
          <RenderInstanceFilter
            setter={() => setBools({ ...bools, filter: false })}
          />
        )}
        setter={() => setBools({ ...bools, filter: false })}
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
    height: height * 0.8,
  },
  filterContainer: {
    width,
    height: height * 0.97,
    borderRadius: 20,
  },
  filterBtns: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    width,
  },
  filterItem: {
    width: width * 0.3,
    height: width * 0.3,
    margin: width * 0.015,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    maxHeight: height * 0.75,
  },

  row: {
    flexDirection: "row",
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
