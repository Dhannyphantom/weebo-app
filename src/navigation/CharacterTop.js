import React from "react";
import { Platform } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import colors from "../constants/colors";
import CharInfoScreen from "../screens/CharInfoScreen";
import CharPostScreen from "../screens/CharPostScreen";
import CharChallengerScreen from "../screens/CharChallengerScreen";

const Tab = createMaterialTopTabNavigator();

const CharacterTop = ({
  character,
  isMine,
  ownerID,
  userID,
  challenged,
  setChallengeType,
  handleChangeTab,
  setModalVis,
  setChallenger,
  handleContest,
  handleBallPress,
  liked,
  charImages,
  challengerArr,
}) => {
  const PropCharInfoScreen = ({ route }) => {
    return (
      <CharInfoScreen
        challenged={challenged}
        handleChangeTab={handleChangeTab}
        liked={liked}
        character={character}
        handleContest={handleContest}
        route={route}
      />
    );
  };
  const PropCharPostScreen = ({ route }) => {
    return (
      <CharPostScreen
        charImages={charImages}
        character={character}
        handleChangeTab={handleChangeTab}
        isMine={isMine}
        handleBallPress={handleBallPress}
        route={route}
      />
    );
  };
  const PropCharChallengerScreen = ({ route }) => {
    return (
      <CharChallengerScreen
        challengerArr={challengerArr}
        character={character}
        handleContest={handleContest}
        setChallengeType={setChallengeType}
        setModalVis={setModalVis}
        setChallenger={setChallenger}
        handleChangeTab={handleChangeTab}
        route={route}
      />
    );
  };
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.primary,
        pressOpacity: 0,
        inactiveTintColor: colors.medium,
        pressColor: colors.white,
      }}
      backBehavior="none"
      lazy
      removeClippedSubviews={Platform.OS === "android" ? true : false}
    >
      <Tab.Screen
        name="CharInfo"
        component={PropCharInfoScreen}
        initialParams={{
          isMine,
          ownerID,
          userID,
        }}
        options={{ title: "Info" }}
      />
      <Tab.Screen
        name="CharPost"
        component={PropCharPostScreen}
        options={{ title: "Posts" }}
      />

      <Tab.Screen
        name="CharChallenger"
        component={PropCharChallengerScreen}
        options={{ title: "Challengers" }}
        initialParams={{
          isMine,
        }}
      />
    </Tab.Navigator>
  );
};

export default CharacterTop;
