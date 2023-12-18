import React, { useEffect, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Context as AuthContext } from "../config/AuthContext";

import colors from "../constants/colors";
import Search from "./Search";
import Separator from "./Separator";
import AppText from "./AppText";
import SelectItem from "./SelectItem";
import AppButton from "./AppButton";
import AppLogo from "./AppLogo";
import ActivityIndicator from "./ActivityIndicator";
import ThemeContext from "../config/ThemeContext";
import AppFadeIn from "./AppFadeIn";

import { launchGallery } from "../constants/helpers";
import Badger from "./Badger";
import PopMessage from "./PopMessage";

const { width, height, scale } = Dimensions.get("window");

const CIRCLE_SIZE = width * 0.88 + 2.5 ** scale;

const ListItem = ({ icon, text, onPress, pos = "center" }) => {
  const theme = useContext(ThemeContext);
  let viewStyle = {};

  switch (pos) {
    case "center":
      viewStyle = {
        backgroundColor: theme.background,
        borderRadius: 200,
      };
      break;
    case "top":
      viewStyle = {
        position: "absolute",
        bottom: CIRCLE_SIZE / 2 + width * 0.15,
        // bottom: CIRCLE_SIZE / 1.6 + 30,
      };
      break;
    case "left":
      viewStyle = {
        position: "absolute",
        right: CIRCLE_SIZE / 2 + width * 0.15,
      };
      break;
    case "right":
      viewStyle = {
        position: "absolute",
        left: CIRCLE_SIZE / 2 + width * 0.15,
      };
      break;
    case "bottom":
      viewStyle = {
        position: "absolute",
        top: CIRCLE_SIZE / 2 + width * 0.15,
      };
      break;
  }

  return (
    <View style={viewStyle}>
      <TouchableOpacity
        style={styles.listItem}
        activeOpacity={0.75}
        onPress={onPress}
      >
        <Feather name={icon} size={25} color={colors.primary} />
        <AppText size="large" style={styles.listItemText} textStyle="black">
          {text}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const CreatePostActions = ({ setModalVis, setPopper, fetcher, isMyPosts }) => {
  const [selectChar, setSelectChar] = useState([]);
  const [cMode, setCMode] = useState(false);

  const theme = useContext(ThemeContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleNav = async (type) => {
    if (type === "post") {
      setModalVis(false);
      const { _error, results } = await launchGallery("all", true);
      if (_error) {
        setPopper({ vis: true, type: "failed", msg: _error });
      } else if (results) {
        navigation.navigate("Post", {
          assets: results,
          toScreen: "Home",
          screenAlias: ["Home"],
          toScreenData: {},
        });
      }
    } else if (type === "contest") {
      setCMode(true);
    } else if (type === "write") {
      setModalVis(false);
      setCMode(false);
      navigation.navigate("Post", {
        write: true,
        toScreen: "Home",
        screenAlias: ["Home"],
        toScreenData: {},
        id: null,
      });
    } else if (type === "my_post") {
      const fetchType = isMyPosts ? "feed" : "my_post";
      setModalVis(false);
      fetcher(null, true, fetchType);
    } else if (type === "recommendation") {
      setModalVis(false);
      navigation.navigate("Shows", { recommendations: true });
    }
  };

  const handlePick = (item) => {
    const index = selectChar.findIndex((obj) => obj.name == item.name);
    if (index < 0) {
      setSelectChar([...selectChar, item]);
    } else {
      setSelectChar(selectChar.filter((obj) => obj.name !== item.name));
    }
  };

  const renderMyCharacters = ({ item }) => {
    return (
      <View style={styles.itemCont}>
        <SelectItem item={item} check={selectChar} pickItem={handlePick} />
      </View>
    );
  };

  return (
    <View style={[styles.modalBg, { backgroundColor: theme.background }]}>
      <View style={[styles.links, { backgroundColor: theme.light }]}>
        {cMode ? (
          <View
            style={[styles.newChallenge, { backgroundColor: theme.background }]}
          >
            <View>
              <AppText size="large" style={styles.charListHead} bold>
                Select Characters
              </AppText>
              <Separator h={2} />
              <View>
                <FlatList
                  data={userInfo?.instances?.characters}
                  keyExtractor={(item) => item._id}
                  ListEmptyComponent={
                    <ActivityIndicator
                      visible={true}
                      type="isEmpty"
                      text="You're not managing any characters. Challenge one or Create new Character Instances now"
                    />
                  }
                  renderItem={renderMyCharacters}
                />
              </View>
            </View>

            <View style={styles.row}>
              {selectChar.length > 0 && (
                <AppButton
                  title="NEXT"
                  style={styles.nextBtn}
                  bare
                  onPress={() => {
                    setModalVis(false);
                    navigation.navigate("Contest", {
                      characters: selectChar,
                    });
                  }}
                />
              )}
              <AppButton
                title="Cancel"
                style={styles.nextBtn}
                bare
                bareRed
                onPress={() => setCMode(false)}
              />
            </View>
          </View>
        ) : (
          <>
            <ListItem
              icon="aperture"
              text="Post"
              pos="center"
              onPress={() => handleNav("post")}
            />
            <ListItem
              icon="award"
              text="Challenge"
              pos="top"
              onPress={() => handleNav("contest")}
            />
            <ListItem
              icon="edit-2"
              text="Write"
              pos="left"
              onPress={() => handleNav("write")}
            />
            <ListItem
              icon="monitor"
              text="Buckets"
              pos="bottom"
              onPress={() => handleNav("recommendation")}
            />
            <ListItem
              icon="filter"
              text={`${isMyPosts ? "All" : "My"}\nPosts`}
              pos="right"
              onPress={() => handleNav("my_post")}
            />
          </>
        )}
      </View>
    </View>
  );
};

const HomeHeader = ({ fetcher, scroller, isMyPosts }) => {
  const navigation = useNavigation();

  const [modalVis, setModalVis] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [popper, setPopper] = useState({ vis: false });

  const theme = useContext(ThemeContext);
  const {
    state: { userInfo },
    getUserData,
    updateMe,
  } = useContext(AuthContext);

  const handlePlusBtn = () => {
    setModalVis(true);
  };

  const handleShowSearch = () => {
    setShowSearch(!showSearch);
  };

  const fetchData = () => {
    if (!userInfo.instances) {
      getUserData(
        { id: userInfo._id, type: "get_instances" },
        (resData) => {
          updateMe({ data: resData, prop: "instances" });
        },
        (err) => {}
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topper}>
        <TouchableOpacity activeOpacity={1}>
          <AppLogo />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={[styles.buttonContainer, { backgroundColor: theme.lighter }]}
            onPress={handleShowSearch}
          >
            <Feather name="search" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.buttonContainer}
            onPress={() => navigation.navigate("Chat")}
          >
            <Ionicons name="chatbubbles" size={18} color={colors.white} />
            <Badger offset={-4} number={userInfo.chat_count} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            style={[styles.buttonContainer, { backgroundColor: theme.lighter }]}
            onPress={handlePlusBtn}
          >
            <Feather name="disc" size={19} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {showSearch && (
          <Search
            placeholder="Search or Create characters, shows, groups, @users"
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            style={{ ...styles.searchBar, backgroundColor: theme.lighter }}
          />
        )}
      </View>
      <AppFadeIn
        visible={modalVis}
        setVisible={setModalVis}
        RenderComponent={() => (
          <CreatePostActions
            fetcher={fetcher}
            setPopper={setPopper}
            isMyPosts={isMyPosts}
            setModalVis={setModalVis}
          />
        )}
      />
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 5,
  },
  charListHead: {
    textAlign: "center",
  },
  button: {
    color: colors.primary,
  },
  buttonContainer: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    marginLeft: 10,
    justifyContent: "center",
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  buttonMid: {
    borderRadius: width * 0.01,
  },
  error: {
    textAlign: "center",
    marginVertical: 8,
    color: colors.heart,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  itemCont: {
    marginBottom: 6,
    alignItems: "center",
  },
  modalBox: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBg: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtn: {
    alignSelf: "center",
  },
  newChallenge: {
    width: width * 0.95,
    maxHeight: height * 0.86,
    minHeight: height * 0.5,
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 20,
  },
  nextBtn: {
    alignSelf: "center",
  },
  listItem: {
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  listItemText: {
    maxWidth: 100,
    textAlign: "center",
  },
  links: {
    width: "94%",
    height: "94%",
    borderRadius: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    width: "80%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  searchBar: {
    width: width * 0.95,
    alignSelf: "center",
    marginBottom: 8,
  },
  topper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
export default HomeHeader;
