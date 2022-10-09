import React, { useEffect, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import colors from "../constants/colors";
import gradients from "../constants/gradients";
import Search from "./Search";
import Separator from "./Separator";
import AppText from "./AppText";
import SelectItem from "./SelectItem";
import AppButton from "./AppButton";
import AppLogo from "./AppLogo";
import ActionMenu from "./ActionMenu";
import ActivityIndicator from "./ActivityIndicator";
import vidMaxChecker from "../constants/vidMaxChecker";
import ThemeContext from "../config/ThemeContext";
import AppFadeIn from "./AppFadeIn";

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
  title: "New Challenge",
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
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.7,
      });
      // if (res.cancelled) ;
      if (!res.cancelled) {
        if (res.type === "video") {
          const { bool, vidErr } = vidMaxChecker(res.duration, 5);
          if (bool) return setErrMsg(vidErr);
        }
        navigation.navigate("Post", { uri: res });
      } else {
        return setModalVis(false);
      }
    } else if (type === "contest") {
      setCMode(true);
    } else if (type === "write") {
      setModalVis(false);
      setCMode(true);
      navigation.navigate("Post", { write: true, id: null });
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
    if (index == -1) {
      setSelectChar([...selectChar, item]);
    } else if (index > -1) {
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
                  width: screen.width * 0.41,
                  height: screen.width * 0.41,
                  marginHorizontal: 2,
                  marginRight: 4,
                }}
              />
              <View style={{ justifyContent: "center" }}>
                <ActionMenu
                  item={itemWrite}
                  onPress={() => handleNav("write")}
                  style={{
                    width: screen.width * 0.41,
                    height: (screen.width * 0.41) / 2.1,
                    marginHorizontal: 2,
                    marginVertical: 1,
                  }}
                />
                <ActionMenu
                  item={itemPost}
                  onPress={() => handleNav("post")}
                  style={{
                    width: screen.width * 0.41,
                    height: (screen.width * 0.41) / 2.1,
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
            activeOpacity={0.6}
            style={styles.buttonContainer}
            onPress={handleShowSearch}
          >
            <Feather name="search" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.buttonContainer}
            onPress={() => navigation.navigate("Chat")}
          >
            <Feather name="message-circle" size={18} color={colors.chat} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.buttonContainer}
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
            style={styles.searchBar}
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
      {/* <Modal
        visible={modalVis}
        animationType="fade"
        onRequestClose={() => setModalVis(false)}
        transparent
        statusBarTranslucent
      >
       
      </Modal> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // backgroundColor: "rgba(0,0,0,0.1)",
    zIndex: 59,
  },
  charListHead: {
    textAlign: "center",
  },
  button: {
    color: colors.primary,
  },
  buttonContainer: {
    width: screen.width * 0.09,
    height: screen.width * 0.09,
    paddingHorizontal: 9,
    marginBottom: 8,
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
