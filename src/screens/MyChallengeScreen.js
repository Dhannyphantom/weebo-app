import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";

import { Context as AuthContext } from "../config/AuthContext";
import { Context as ChallContext } from "../config/ChallContext";

import AppText from "../components/AppText";
import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import ActivityIndicator from "../components/ActivityIndicator";
import VoteLogic from "../components/VoteLogic";
import Challenge from "../components/Challenge";
import Separator from "../components/Separator";

const { width, height } = Dimensions.get("window");

const MyChallengeScreen = ({ navigation, route }) => {
  const { getMyChallenges } = useContext(ChallContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const [refreshing, setRefreshing] = useState(false);
  const [challengeData, setChallengeData] = useState([]);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const data = route.params.data;

  const filterChallenge = () => {
    // challenger and owner
    const filteredData = data.filter(
      (obj) =>
        obj?.challenger?._id == userInfo._id || obj?.owner?._id == userInfo._id
    );
    setChallengeData(filteredData);
  };

  const renderMyChallenges = ({ item }) => {
    // console.log(item);
    if (item.challengersNum) {
      const suffixTitle = ` -- ${
        item?.tagChannel?.name ??
        item?.tagCharacter?.name ??
        item?.tagShow?.name ??
        item.tagGroup?.name
      }`;
      return (
        <VoteLogic
          title={item.title + suffixTitle}
          timer={item.expiresAt}
          cards={item.challengers}
          comments={item.comments}
          type={{ type: "events", c_type: item.c_type }}
          user={item?.challengers[0].user}
          voteId={item._id}
        />
      );
    } else if (
      !item.challengerMedia &&
      !item.challengerScore &&
      !item.challengersNum
    ) {
      return (
        <VoteLogic
          title={item.title}
          timer={item.expiresAt}
          cards={item.data}
          comments={item.comments}
          type={{ type: "characters" }}
          user={item.user}
          voteId={item._id}
        />
      );
    } else {
      const isCharacter = item.character ? true : false;
      const isShow = item.show ? true : false;
      const isGroup = item.group ? true : false;

      let coverImage, name, title, id, followers, nav;
      if (isCharacter) {
        name = item?.character?.dpName;
        coverImage = item?.character?.cover_photo;
        nav = "Character";
        title = item?.character?.show?.name_j || item.character?.show?.name_e;
        id = item?.character?._id;
        followers = item?.character?.followers;
      } else if (isShow) {
        name = item?.show?.name_j ?? item?.show?.name_e;
        nav = "Show";
        id = item?.show?._id;
        coverImage = item?.show?.cover_photo;
        title = item.show.creator;
        followers = item?.show?.followers;
      }

      return (
        <View>
          <Challenge
            image1={item?.challengerMedia}
            image2={item?.ownerMedia}
            cardProps={{
              id,
              image: coverImage,
              owner: item.owner,
              show: title,
              name,
              followers,
              avatar: item?.owner?.avatar,
            }}
            score1={item.challengerScore}
            nav={nav}
            score2={item.ownerScore}
            countdown={item.expiresAt}
            instance={{ show: isShow, character: isCharacter, group: isGroup }}
            name1={item?.challenger?.username}
            name1ID={item?.challenger?._id}
            name2={item?.owner?.username}
            name2ID={item?.owner?._id}
            avatar1={item.challenger.avatar}
            avatar2={item.owner.avatar}
            challengeID={item._id}
            ownerInfo={item.challengerInfo}
            challengerInfo={item.ownerInfo}
            type={item.type}
            clientID={userInfo._id}
          />
          <Separator h={1} m={10} />
        </View>
      );
    }
  };

  const fetchScreenData = () => {
    getMyChallenges(
      (resData) => {
        setChallengeData(resData.myChallenges);
        setLoadedOnce(true);
      },
      (err) => {
        console.log(err);
        setLoadedOnce(true);
      }
    );
  };

  const handleRefresh = () => {
    fetchScreenData();
  };

  useEffect(() => {
    filterChallenge();
    fetchScreenData();
  }, []);

  return (
    <Screen style={styles.container}>
      <AppHeader title="My Challenges" />
      {!data[0] && (
        <FlatList
          data={["OTAKU"]}
          keyExtractor={(item) => item}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={() => <View style={styles.emptyFlat} />}
        />
      )}
      <View style={{ flex: 1 }}>
        <FlatList
          data={challengeData}
          keyExtractor={(item) => item._id}
          style={{ paddingTop: 12 }}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          overScrollMode="never"
          contentContainerStyle={{ paddingBottom: height * 0.1 }}
          renderItem={renderMyChallenges}
        />
      </View>
      <ActivityIndicator
        type={!loadedOnce ? "spin" : "isEmpty"}
        visible={challengeData[0] ? false : true}
        transparent
        style={styles.activity}
        text="You don't have any ongoing challenges"
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width,
    height: "40%",
    top: "30%",
  },
  container: {
    flex: 1,
  },
  emptyFlat: {
    width,
    flex: 1,
  },
});
export default MyChallengeScreen;
