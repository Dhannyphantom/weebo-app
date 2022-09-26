import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

import colors from "../constants/colors";
import AppText from "./AppText";
import AppButton from "./AppButton";
import Shows from "./Shows";
import { Context as AuthContext } from "../config/AuthContext";
import { Context as AcctContext } from "../config/AcctContext";
import SearchBar from "./SearchBar";
import FriendBox from "./FriendBox";
import PopMessage from "./PopMessage";
import FeedHeader from "./FeedHeader";
import GroupCard from "./GroupCard";
import Spacer from "./Spacer";
import ThemeContext from "../config/ThemeContext";

const screen = Dimensions.get("window");
const searchProto = {
  users: [],
  characters: [],
  series: [],
  groups: [],
};

// AHM USING AACTcONTEXT CAUSE IT DOESNT CONTAIN MUCH

const Search = ({
  placeholder = "Search...",
  style,
  showSearch,
  setShowSearch,
}) => {
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const { searchStuffs } = useContext(AcctContext);
  const navigation = useNavigation();
  const [searchBar, setSearchBar] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [popper, setPopper] = useState({ vis: false });
  const [show, setShow] = useState(false);
  const [searchRes, setSearchRes] = useState(searchProto);
  const theme = useContext(ThemeContext);

  const { users, characters, series, groups } = searchRes;

  const searchRef = useRef(null);

  let isUsers = false;
  let shouldShow =
    series.length > 0 || characters.length > 0 || groups.length > 0
      ? true
      : series.length < 1 || characters.length < 1
      ? false
      : null;

  if (searchBar.startsWith("@")) {
    isUsers = true;
  } else {
    isUsers = false;
  }
  const handleSearchCb = () => {
    if (searchBar.length >= 3) {
      setSearchLoading(true);
      setShow(true);
      searchStuffs({ term: searchBar, type: "all" }, handleSearch, (err) => {
        setErrMsg(err);
        setSearchLoading(false);
      });
    } else {
      setShow(false);
    }
  };
  const handleSearch = (data) => {
    setSearchRes(data);
    setSearchLoading(false);
  };

  const closeArr = () => {
    setShow(false);
    setSearchRes(searchProto);
    setShowSearch(false);
  };

  const handleCreateBtn = () => {
    if (searchBar.length < 2) return;
    if (!userInfo.verified) {
      setPopper({
        vis: true,
        type: "failed",
        msg: "Please verify your account!",
      });
      return;
    }
    if (!userInfo.avatar) {
      return navigation.navigate("AccountStack", {
        screen: "Welcome",
        params: { msg: "Please complete your profle" },
      });
    }
    navigation.navigate("CreateCharacter", { name: searchBar });
  };

  const renderGroups = ({ item }) => {
    return (
      <GroupCard
        item={item}
        showName
        onPress={() => navigation.navigate("Group", { item })}
      />
    );
  };

  useEffect(() => {
    showSearch ? searchRef.current.focus() : null;
  }, [showSearch]);

  return (
    <>
      <SearchBar
        searchBar={searchBar}
        ref={searchRef}
        setSearchBar={setSearchBar}
        loading={searchLoading}
        style={style}
        pressCb={handleSearchCb}
        closeCb={closeArr}
        placeholder={placeholder}
      />
      {errMsg && <AppText style={styles.error}> {errMsg} </AppText>}
      {show && (
        <View
          style={[styles.searchResult, { backgroundColor: theme.extralight }]}
        >
          {characters.length > 0 && (
            <View style={styles.characters}>
              <Shows data={characters} searchResult />
            </View>
          )}
          {series.length > 0 && (
            <View style={styles.characters}>
              <Shows data={series} searchResult series />
            </View>
          )}
          {groups.length > 0 && (
            <View style={styles.characters}>
              <Spacer mv={12}>
                <FeedHeader challenge="Groups" />
              </Spacer>
              <FlatList
                data={groups}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                renderItem={renderGroups}
              />
            </View>
          )}
          {!shouldShow && !isUsers && !errMsg && (
            <View style={styles.notFoundContainer}>
              <AppText style={styles.notFoundText}>
                <AppText bold>{searchBar}</AppText> instance not found
              </AppText>
              {!searchLoading && (
                <AppButton
                  title="Create Instance"
                  bare
                  onPress={handleCreateBtn}
                />
              )}
            </View>
          )}
          {isUsers && (
            <View>
              <AppText bold style={styles.notFoundText}>
                Search Weebs
              </AppText>
              <FriendBox data={users} onPress={null} />
            </View>
          )}
        </View>
      )}
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
    </>
  );
};

const styles = StyleSheet.create({
  error: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    color: colors.heart,
  },
  notFoundContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  notFoundText: {
    marginBottom: 5,
    padding: 10,
  },
  searchResult: {
    borderRadius: 15,
    width: screen.width * 0.97,
    marginLeft: (screen.width * 0.03) / 2,
    // padding: 10,
  },
});
export default Search;
