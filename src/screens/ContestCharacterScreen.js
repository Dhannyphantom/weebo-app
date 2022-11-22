import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";

import { Context as CharContext } from "../config/CharContext";
import { Context as AuthContext } from "../config/AuthContext";
import { Context as ChallContext } from "../config/ChallContext";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import ChallengeCard from "../components/ChallengeCard";
import GrowInput from "../components/GrowInput";
import SearchBar from "../components/SearchBar";
import AppHeader from "../components/AppHeader";
import Screen from "../components/Screen";
import SelectItem from "../components/SelectItem";
import colors from "../constants/colors";
import ActivityIndicator from "../components/ActivityIndicator";

const { width, height } = Dimensions.get("window");
const CONTEST_CP = 50;

const ContestCharacterScreen = ({ route, navigation }) => {
  const { getCharacters } = useContext(CharContext);
  const { charChallenge } = useContext(ChallContext);
  const {
    updateMe,
    state: { userInfo },
  } = useContext(AuthContext);
  const myCharacter = route.params.characters;
  const [text, setText] = useState("");
  const [meCharacters, setMeCharacters] = useState(myCharacter);
  const [searchList, setSearchList] = useState([]);
  const [errMsg, setErrMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchBar, setSearchBar] = useState("");
  const [challengers, setChallengers] = useState([]);

  const searchRef = useRef(null);

  const renderMyCharacters = ({ item }) => {
    return (
      <ChallengeCard
        avatar={item.manager.avatar}
        id={item._id}
        image={item.cover_photo}
        name={item.dpName}
        show={item.show.name_j ?? item.show.name_e}
        followers={item.followers}
        onPress={() => navigation.navigate("Character", { item: item._id })}
      />
    );
  };

  const handlePick = (item) => {
    const indexB = meCharacters.findIndex((obj) => obj._id == item._id);
    const index = challengers.findIndex((obj) => obj.name == item.name);
    const indexA = userInfo.charactersOwned.findIndex(
      (obj) => obj._id == item._id
    );
    if (index == -1 && indexB == -1 && indexA == -1) {
      setChallengers([...challengers, item]);
    } else if (index > -1) {
      setChallengers(challengers.filter((obj) => obj.name !== item.name));
    } else if (indexA > -1 && indexB == -1) {
      setMeCharacters([...meCharacters, item]);
    } else if (indexB > -1) {
      setMeCharacters(meCharacters.filter((obj) => obj.name !== item.name));
    }
  };

  const renderSearch = ({ item }) => {
    return (
      <SelectItem
        item={item}
        check={challengers.concat(meCharacters)}
        pickItem={handlePick}
      />
    );
  };
  const handlePressCb = () => {
    setSearchLoading(true);
    searchBar.length > 1
      ? getCharacters(searchBar, (data) => {
          setSearchList(data);
          setSearchLoading(false);
        })
      : setSearchLoading(false);
  };

  const handleContest = () => {
    if (userInfo.points < CONTEST_CP)
      return setErrMsg(`Not enough CP: ${userInfo.points}CP left`);
    setIsLoading(true);
    setErrMsg(null);
    const idA = meCharacters.map((obj) => obj._id);
    const idB = challengers.map((obj) => obj._id);
    const all_characters = idA.concat(idB);
    if (text.length < 2) {
      setErrMsg("Please add a challenge title");
      setIsLoading(false);
      return;
    }
    if (all_characters.length < 2) {
      setErrMsg("Please invite other characters");
      setIsLoading(false);
      return;
    }
    const data = {
      characters: all_characters,
      title: text,
    };
    charChallenge(
      data,
      () => {
        updateMe(userInfo.points - CONTEST_CP, "points");
        navigation.navigate("ChallengeStack");
      },
      (err) => {
        setErrMsg(err);
        setIsLoading(false);
      }
    );
  };

  const renderScreen = () => {
    return (
      <>
        <AppHeader title="Character Contest" />
        <AppText style={styles.pointer} bold>
          Will require {CONTEST_CP}CP
        </AppText>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <AppText bold style={styles.inviteHeader}>
              Challenge title
            </AppText>
            <AppButton
              title="add invites"
              naked
              onPress={() => setShowSearch(!showSearch)}
            />
          </View>
          <GrowInput
            text={text}
            setText={setText}
            mLine={false}
            placeholder="Add Challenge Title"
          />
          {showSearch && (
            <View style={{ marginTop: 12 }}>
              <AppText bold style={styles.inviteHeader}>
                Invite other characters for Challenge
              </AppText>
              <SearchBar
                searchBar={searchBar}
                ref={searchRef}
                setSearchBar={setSearchBar}
                loading={searchLoading}
                pressCb={handlePressCb}
                closeCb={() => setSearchList([])}
                placeholder="Search characters..."
                style={styles.searchBar}
              />
            </View>
          )}
          {searchList.length > 0 && Array.isArray(searchList) && (
            <View style={styles.searchList}>
              <FlatList
                data={searchList}
                keyExtractor={(item) => item._id}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                renderItem={renderSearch}
              />
            </View>
          )}
          {typeof searchList == "string" && (
            <AppText style={styles.notFound}> {searchList} </AppText>
          )}
          <AppText bold style={styles.inviteHeader}>
            My Characters
          </AppText>
          <FlatList
            data={meCharacters}
            showsHorizontalScrollIndicator={false}
            horizontal
            keyExtractor={(item) => item._id}
            renderItem={renderMyCharacters}
          />
          {challengers[0] && (
            <AppText bold style={styles.inviteHeader}>
              My Invites
            </AppText>
          )}
          <View>
            <FlatList
              data={challengers}
              horizontal
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              renderItem={renderMyCharacters}
            />
          </View>
          {errMsg && <AppText style={styles.error}> {errMsg} </AppText>}
          <AppButton
            title="CONTEST"
            onPress={handleContest}
            style={styles.doneBtn}
            bare
          ></AppButton>
        </View>
        <ActivityIndicator
          visible={isLoading}
          type="spin"
          style={styles.activity}
          wTransparent
        />
      </>
    );
  };

  useEffect(() => {
    if (showSearch) searchRef?.current.focus() ?? null;
  }, [showSearch]);

  return (
    <Screen style={styles.container}>
      <FlatList
        data={["CONTEST"]}
        keyExtractor={(item) => item}
        renderItem={renderScreen}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height * 0.1 }}
        overScrollMode="never"
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
  container: {
    flex: 1,
    padding: 10,
  },
  doneBtn: {
    width: "65%",
    alignSelf: "center",
    marginTop: 15,
  },
  error: {
    color: colors.heart,
    textAlign: "center",
  },
  inviteHeader: {
    marginVertical: 10,
  },
  notFound: {
    alignSelf: "center",
    color: colors.heart,
  },
  pointer: {
    textAlign: "center",
    color: colors.medium,
    marginVertical: 12,
  },
  searchBar: {
    width: "80%",
    alignSelf: "center",
    marginBottom: 15,
  },
  searchList: {
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
});
export default ContestCharacterScreen;
