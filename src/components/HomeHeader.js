import React, { useEffect, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import colors from "../constants/colors";
import Search from "./Search";
import Separator from "./Separator";
import AppText from "./AppText";
import SelectItem from "./SelectItem";
import AppButton from "./AppButton";
import AppLogo from "./AppLogo";
import ActionMenu from "./ActionMenu";
import ActivityIndicator from "./ActivityIndicator";
import ThemeContext from "../config/ThemeContext";
import AppFadeIn from "./AppFadeIn";

import { gradients } from "../constants/colors";
import { launchGallery } from "../constants/helpers";

const screen = Dimensions.get("window");

const itemWrite = {
  title: "Write Post",
  bg: gradients[1].bg,
  bg1: gradients[1].bg1,
  icon: "pencil",
};
const itemPost = {
  title: "Post Media",
  bg: gradients[0].bg,
  bg1: gradients[0].bg1,
  icon: "camera",
};
const itemChallenge = {
  title: "Challenge",
  bg: "#06beb6",
  bg1: "#48b1bf",
  icon: "alpha-c-circle",
  iconPack: "MCI",
};

const HomeHeader = ({ characters }) => {
  const navigation = useNavigation();

  const [modalVis, setModalVis] = useState(false);
  const [myCharacters, setMyCharacters] = useState(characters);
  const [selectChar, setSelectChar] = useState([]);
  const [errMsg, setErrMsg] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [cMode, setCMode] = useState(false);

  const theme = useContext(ThemeContext);

  const handleNav = async (type) => {
    if (type === "post") {
      setModalVis(false);
      const { _error, results } = await launchGallery("all");
      if (_error) {
        setErrMsg(_error);
      } else if (results) {
        navigation.navigate("Post", {
          assets: results,
          toScreen: "Home",
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
        toScreenData: {},
        id: null,
      });
    }
  };

  const handlePlusBtn = () => {
    setErrMsg(null);
    setModalVis(true);
    setCMode(false);
    setSelectChar([]);
  };

  const handleShowSearch = () => {
    setShowSearch(!showSearch);
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

  const CreatePostActions = () => {
    return (
      <View style={[styles.modalBg, { backgroundColor: theme.background }]}>
        <View style={styles.links}>
          {!cMode && (
            <View style={{ flexDirection: "row" }}>
              <ActionMenu
                item={itemChallenge}
                onPress={() => handleNav("contest")}
                style={{
                  width: screen.width * 0.48,
                  height: screen.width * 0.4,
                  marginHorizontal: 2,
                  marginRight: 4,
                }}
              />
              <View style={{ justifyContent: "center" }}>
                <ActionMenu
                  item={itemWrite}
                  onPress={() => handleNav("write")}
                  style={{
                    width: screen.width * 0.4,
                    height: (screen.width * 0.38) / 2.1,
                    marginHorizontal: 2,
                    marginVertical: 1,
                  }}
                />
                <ActionMenu
                  item={itemPost}
                  onPress={() => handleNav("post")}
                  style={{
                    width: screen.width * 0.4,
                    height: (screen.width * 0.38) / 2.1,
                    marginVertical: 3,
                    marginHorizontal: 2,
                  }}
                />
              </View>
            </View>
          )}

          {cMode && (
            <View style={styles.newChallenge}>
              <View>
                <AppText style={styles.charListHead} bold>
                  Select characters
                </AppText>
                <Separator h={2} />
                <View>
                  <FlatList
                    data={myCharacters}
                    keyExtractor={(item) => item._id}
                    ListEmptyComponent={
                      <ActivityIndicator
                        visible={true}
                        type="isEmpty"
                        text="You don't have any characters"
                      />
                    }
                    renderItem={renderMyCharacters}
                  />
                </View>
              </View>

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
            </View>
          )}
        </View>
      </View>
    );
  };

  useEffect(() => {
    setMyCharacters(characters);
  }, [characters]);

  return (
    <View style={styles.container}>
      <View style={styles.topper}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            marginLeft: 7,
          }}
        >
          <AppLogo />
        </View>
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
            style={[styles.buttonContainer, { backgroundColor: theme.lighter }]}
            onPress={() => navigation.navigate("Chat")}
          >
            <Ionicons name="chatbubbles" size={18} color={colors.chat} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            style={[styles.buttonContainer, { backgroundColor: theme.lighter }]}
            onPress={handlePlusBtn}
          >
            <AntDesign name="plus" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {showSearch && (
          <Search
            placeholder="Search characters, shows, groups, users"
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            style={{ ...styles.searchBar, backgroundColor: theme.lighter }}
          />
        )}
      </View>
      <Separator h={1} m={0.5} />
      {errMsg && (
        <AppText bold style={styles.error}>
          {errMsg}
        </AppText>
      )}
      <AppFadeIn
        visible={modalVis}
        setVisible={setModalVis}
        RenderComponent={CreatePostActions}
      />
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
    alignItems: "center",
  },
  buttonMid: {
    borderRadius: screen.width * 0.01,
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
    borderRadius: 18,
    padding: 15,
  },
  modalBtn: {
    alignSelf: "center",
  },
  newChallenge: {
    width: "100%",
    maxHeight: screen.height * 0.86,
    minHeight: screen.height * 0.4,
    justifyContent: "space-between",
  },
  nextBtn: {
    alignSelf: "center",
    width: "60%",
  },
  links: {
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    width: "80%",
  },
  searchBar: {
    width: screen.width * 0.95,
    alignSelf: "center",
    marginBottom: 8,
  },
  topper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
export default HomeHeader;
