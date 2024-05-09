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
import DateTimePicker from "@react-native-community/datetimepicker";

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
import { getDateObject } from "../constants/getFormatTime";
import { capFirstLetter } from "../constants/helpers";

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
      close: null,
      ...item,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.65}
      onPress={onOpenModal}
      style={[styles.filterItem, { backgroundColor: theme.extralight }]}
    >
      <AppText bold size="large">
        {item.name}
      </AppText>
    </TouchableOpacity>
  );
};

export const RenderGenres = ({
  data,
  handleSelect,
  selectedArr,
  type,
  name,
  returnArray = false,
  setter,
}) => {
  const [selected, setSelected] = useState(selectedArr ?? []);

  const onSelectGenre = (title) => {
    if (selected.includes(title)) {
      // remove
      setSelected((prev) => prev.filter((eachTitle) => eachTitle !== title));
    } else {
      if (selected.length > 7) return;
      // add
      const selectedSets = new Set([...selected, title]);
      setSelected([...selectedSets]);
    }
  };

  const saveSelectedGenre = () => {
    // handleSelect({ type, name, val: item.title });
    handleSelect({
      type,
      name,
      val: returnArray ? selected : selected.join(", "),
    });
    setter();
  };

  return (
    <View style={styles.modalContainer}>
      <AppButton
        title={`SELECT ${selected.length > 0 ? selected.length : ""}`}
        onPress={saveSelectedGenre}
        bare
        style={{ alignSelf: "center" }}
      />
      <FlatList
        data={data}
        // extraData={selected}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 15 }}
        renderItem={({ item }) => {
          const isSelected = selected?.includes(item?.title);
          return (
            <AppPickerItem
              text={item.title}
              desc={item.discription}
              selected={isSelected}
              example={item.example}
              onPress={() => {
                onSelectGenre(item.title);
              }}
            />
          );
        }}
        numColumns={3}
        listKey="dropDown"
      />
    </View>
  );
};

const RenderDatePicker = ({ handleSelect, type, name, setter }) => {
  const [date, setDate] = useState({ vis: false, timestamp: new Date() });

  const onDatePicked = (event, selectedDate) => {
    if (event.type !== "dismissed") {
      setDate({ vis: false, timestamp: selectedDate });
    }
  };

  const theme = useContext(ThemeContext);

  const dater = getDateObject(date.timestamp);
  const renderDates = Object.values(dater).map((time) => (
    <View
      key={time}
      style={[styles.filterDateItem, { backgroundColor: theme.extralight }]}
    >
      <AppText size="xxlarge" bold>
        {time}
      </AppText>
    </View>
  ));

  return (
    <View style={styles.filterDateContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setDate({ ...date, vis: true })}
        style={styles.filterDate}
      >
        {renderDates}
      </TouchableOpacity>
      <View style={styles.rowWide}>
        <AppButton
          title="Before date"
          onPress={() => {
            handleSelect({
              type,
              name,
              val: { date: date.timestamp, when: "before" },
            });
            setter();
          }}
          bare
        />
        <AppButton
          title="From date"
          onPress={() => {
            handleSelect({
              type,
              name,
              val: { date: date.timestamp, when: "from" },
            });
            setter();
          }}
          bare
        />
      </View>
      {date.vis && (
        <DateTimePicker
          value={date.timestamp}
          textColor={colors.primary}
          display="default"
          accentColor={colors.primary}
          maximumDate={new Date()}
          mode="date"
          onChange={onDatePicked}
        />
      )}
    </View>
  );
};

const RenderMinMax = ({ handleSelect, type, name, appliedFilter, setter }) => {
  const theme = useContext(ThemeContext);
  return (
    <View style={styles.filterCount}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          handleSelect({ type, name, val: "highest" });
          setter();
        }}
        style={[
          styles.filterCounter,
          { backgroundColor: theme.extralight },
          styles.filterMax,
        ]}
      >
        <AppText style={styles.filterMaxText} bold size="large">
          {appliedFilter && appliedFilter.val === "highest"
            ? "Remove"
            : "Highest"}
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          handleSelect({ type, name, val: "lowest" });
          setter();
        }}
        style={[
          styles.filterCounter,
          { backgroundColor: theme.extralight },
          styles.filterMin,
        ]}
      >
        <AppText style={styles.filterMinText} bold size="large">
          {appliedFilter && appliedFilter.val === "lowest"
            ? "Remove"
            : "Lowest"}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const RenderAppliedFilters = ({ filters = [] }) => {
  const theme = useContext(ThemeContext);
  return (
    <View style={styles.filterApplied}>
      <AppText size="large" bold>
        Applied Filters:
      </AppText>
      <View style={{ marginTop: 25 }}>
        {filters.map((filter) => {
          let contentValue = "";
          if (typeof filter.val !== "string") {
            // dates
            const date = getDateObject(filter.val.date);
            contentValue = `${filter.val.when}  ${date.month} ${date.year}`;
          } else {
            contentValue = filter.val;
          }

          return (
            <View style={styles.filterAppliedItem} key={filter.type}>
              <AppText
                bold
                style={{
                  ...styles.filterAppliedItemProp,
                  backgroundColor: theme.extralight,
                }}
              >
                {filter.name}
              </AppText>
              <AppText style={styles.filterAppliedItemValue}>
                {capFirstLetter(contentValue)}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const RenderInstanceFilter = ({ setter, updateScreenData }) => {
  const theme = useContext(ThemeContext);
  const [modal, setModal] = useState({ vis: false, close: null });
  const [appliedFilters, setAppliedFilters] = useState([]);

  const onfilterOptions = (item) => {
    // create, delete, update
    const checker = appliedFilters.find((filter) => filter.type === item.type);
    if (checker) {
      // update or delete
      setAppliedFilters((prev) =>
        prev
          .map((filter) => {
            if (
              filter.type == item.type &&
              (filter.val === item.val || !item.val)
            ) {
              return "null";
            } else if (filter.type == item.type) {
              return item;
            } else {
              return filter;
            }
          })
          .filter((filter) => filter != "null")
      );
    } else {
      // create
      setAppliedFilters([...appliedFilters, item]);
    }
  };

  const RenderModalComponents = () => {
    if (modal.type === "genres" || modal.type === "subGenres") {
      let selectedArr = [];
      const selected = appliedFilters.find(
        (filter) => filter.type == modal.type
      );
      if (selected) {
        selectedArr = selected?.val?.split(", ");
      }
      return (
        <RenderGenres
          data={modal.data}
          type={modal.type}
          selectedArr={selectedArr}
          name={modal.name}
          setter={() => setModal({ vis: true, close: "close" })}
          handleSelect={onfilterOptions}
        />
      );
    } else if (["releaseDate", "endDate"].includes(modal.type)) {
      return (
        <RenderDatePicker
          type={modal.type}
          setter={() => setModal({ vis: true, close: "close" })}
          name={modal.name}
          handleSelect={onfilterOptions}
        />
      );
    } else {
      return (
        <RenderMinMax
          type={modal.type}
          setter={() => setModal({ vis: true, close: "close" })}
          name={modal.name}
          handleSelect={onfilterOptions}
          appliedFilter={appliedFilters.find(
            (filter) => filter.type === modal.type
          )}
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
      <AppText size="large" bold style={styles.filterTitle}>
        Filters
      </AppText>
      <FlatList
        data={filters}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <FilterItem item={item} setModal={setModal} />
        )}
        ListFooterComponent={() => (
          <RenderAppliedFilters filters={appliedFilters} />
        )}
      />

      <View style={styles.filterBtns}>
        <AppButton
          title="Apply"
          onPress={() => updateScreenData(appliedFilters)}
          LIcon="check"
          bare
        />
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
        closer={() => modal.close}
        headerTitle={modal.title}
        RenderComponent={() => <RenderModalComponents />}
      />
    </View>
  );
};

const ShowGroup = ({ screen, headerTitle, params }) => {
  const navigation = useNavigation();
  const { getShows, filterInstances, getGroups } = useContext(FeedContext);
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
  const isRecommendation = params?.recommendations;

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
      const fetchType = isRecommendation ? "recommendations" : "all shows";
      getShows(
        fetchType,
        (resData) => {
          setBools({ ...bools, firstLoad: true });
          setScreenData(resData);
          if (bool) setRefreshing(false);
        },
        (err) => {
          setErrMsg(err);
          if (bool) setRefreshing(false);
        }
      );
    }
  };

  const updateScreenData = (filters) => {
    setBools({ ...bools, filter: false, isLoading: true });
    const sendData = {
      instance: screen,
      filters: filters.map((filter) => {
        const isString = typeof filter.val === "string";
        return {
          type: filter.type,
          filter: isString ? filter.val : filter?.val?.date,
          info: isString ? "null" : filter?.val?.when,
        };
      }),
    };
    filterInstances(
      sendData,
      (resData) => {
        setScreenData(resData);
        setBools({ ...bools, filter: false, isLoading: false });
      },
      (errData) => {
        setBools({ ...bools, filter: false, isLoading: false });
      }
    );
  };

  const handleShowSearch = () => {
    searchStuffs(
      { term: searchText, type: screen },
      (resData) => {
        setSearchData(resData);
      },
      (err) => {}
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
          statLeft={`${item.followers.length ?? item.followers} followers`}
          statMid={item?.creators?.join(", ")}
          statRight={`${item.characters.length ?? item.characters} character${
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

  const RenderHeaderComponents = () => {
    if (isRecommendation) return null;
    return (
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setBools({ ...bools, showSearch: !showSearch })}
          style={styles.search}
        >
          <Feather name="search" color={colors.primary} size={18} />
        </TouchableOpacity>
        {screen === "show" && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setBools({ ...bools, filter: !filter })}
            style={styles.search}
          >
            <Feather name="filter" color={colors.primary} size={18} />
          </TouchableOpacity>
        )}
        {screen === "show" && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.push("Shows", { recommendations: true })}
            style={styles.search}
          >
            <Feather name="monitor" color={colors.primary} size={18} />
          </TouchableOpacity>
        )}
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
        RightComponent={RenderHeaderComponents}
      />
      {isRecommendation && (
        <AppText style={styles.subTitleText}>
          Anime/Manga recommendations, Trending Instances personalized just for
          you
        </AppText>
      )}
      {errMsg && <AppText style={styles.error}> {errMsg} </AppText>}
      {showSearch && (
        <>
          <SearchBar
            searchBar={searchText}
            setSearchBar={setSearchText}
            pressCb={handleShowSearch}
            closeCb={(val) => setBools({ ...bools, showSearch: val })}
            style={{ ...styles.searchBar, backgroundColor: theme.background }}
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
            transparent
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
            updateScreenData={updateScreenData}
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
  error: {
    textAlign: "center",
    marginVertical: 10,
    color: colors.heartDark,
  },
  filterContainer: {
    width,
    height: height * 0.97,
    borderRadius: 20,
    marginTop: 25,
  },
  filterBtns: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    width,
  },
  filterCount: {
    margin: 20,
    alignItems: "center",
  },
  filterCounter: {
    width: width * 0.35,
    height: width * 0.35,
    justifyContent: "center",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  filterMax: {
    // backgroundColor: colors.greenLight,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
  },
  filterMaxText: {
    color: colors.greenDark,
  },
  filterMinText: {
    color: colors.heartDark,
  },
  filterMin: {
    // backgroundColor: colors.heartLight,
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
  },
  filterDateContainer: {
    paddingBottom: height * 0.1,
  },
  filterDate: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  filterDateItem: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  filterItem: {
    width: width * 0.3,
    height: width * 0.3,
    margin: width * 0.015,
    borderRadius: 8,
    justifyContent: "center",
    elevation: 1,
    alignItems: "center",
  },
  filterApplied: {
    margin: 15,
  },
  filterAppliedItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  filterAppliedItemProp: {
    padding: 10,
    borderRadius: 4,
  },
  filterAppliedItemValue: {
    marginLeft: 10,
  },
  filterTitle: {
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  modalContainer: {
    maxHeight: height * 0.75,
  },

  row: {
    flexDirection: "row",
  },
  rowWide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 50,
  },
  subTitleText: {
    textAlign: "center",
    maxWidth: "90%",
    alignSelf: "center",
    marginTop: 10,
  },
  search: {
    width: width * 0.075,
    height: width * 0.075,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    width: "94%",
    alignSelf: "center",
    marginTop: 6,
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
