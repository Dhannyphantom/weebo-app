import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
// import * as FacebookAds from "expo-ads-facebook";

import { AntDesign } from "@expo/vector-icons";

import { Context as ChallContext } from "../config/ChallContext";
import { Context as AuthContext } from "../config/AuthContext";
import AppButton from "../components/AppButton";
import Challenge from "../components/Challenge";
import Screen from "../components/Screen";
import Separator from "../components/Separator";
import VoteLogic from "../components/VoteLogic";
import ActivityIndicator from "../components/ActivityIndicator";
import AppHeader from "../components/AppHeader";
import Awarder from "../components/Awarder";
import AppText from "../components/AppText";
import colors from "../constants/colors";
import ThemeContext from "../config/ThemeContext";
// import NativeAds, { fb_adsManager } from "../components/NativeAds";

const { width, height } = Dimensions.get("window");

const ChallengeScreen = ({ navigation }) => {
  const { getChallenges, getMyChallenges, getAwards } =
    useContext(ChallContext);

  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const [challengeInfo, setChallengeInfo] = useState([]);
  const [awardData, setAwardData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingEmpty, setRefreshingEmpty] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [fetchMine, setFetchMine] = useState(false);

  const theme = useContext(ThemeContext);

  const renderChallenges = ({ item }) => {
    if (item.challengersNum) {
      const suffixTitle = ` ~~ ${
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

      let coverImage, name, title, id, followers, nav, fullName;
      if (isCharacter) {
        name = item?.character?.dpName;
        coverImage = item?.character?.cover_photo;
        nav = "Character";
        title = item?.character?.show?.name_j || item.character?.show?.name_e;
        id = item?.character?._id;
        fullName = item?.character?.name;
        followers = item?.character?.followers;
      } else if (isShow) {
        name = item?.show?.name_j ?? item?.show?.name_e;
        fullName = item?.show?.name_j ?? item?.show?.name_e;
        nav = "Show";
        id = item?.show?._id;
        coverImage = item?.show?.cover_photo;
        title = item.show.creators?.join(", ");
        followers = item?.show?.followers;
      } else if (isGroup) {
        name = item?.group?.name;
        fullName = item?.group?.name;
        nav = "Room";
        id = item?.group?._id;
        coverImage = item?.group?.cover_photo;
        title = item?.group?.show?.name_j || item.group?.show?.name_e;
        followers = item?.group?.followers;
        // probably a group
      }

      return (
        // JUST SEND THE ITEM OBJECT TO THE COMPONENT
        <View style={[styles.challengeItem, { backgroundColor: theme.white }]}>
          <Challenge
            image1={item?.challengerMedia}
            image2={item?.ownerMedia}
            cardProps={{
              id,
              image: coverImage,
              owner: item.manager,
              show: title,
              fullName,
              name,
              followers,
              avatar: item?.manager?.avatar,
            }}
            score1={item.challengerScore}
            nav={nav}
            score2={item.ownerScore}
            countdown={item.expiresAt}
            instance={{
              show: isShow,
              character: isCharacter,
              group: isGroup,
              type: isCharacter ? "character" : isShow ? "show" : "group",
            }}
            name1={item?.challenger?.username}
            name1ID={item?.challenger?._id}
            name2={item?.manager?.username}
            name2ID={item?.manager?._id}
            avatar1={item.challenger.avatar}
            avatar2={item.manager.avatar}
            challengeID={item._id}
            challengeType="two"
            ownerInfo={item.challengerInfo}
            challengerInfo={item.ownerInfo}
            type={item.type}
            clientID={userInfo._id}
          />
          {/* <Separator h={2} m={10} /> */}
        </View>
      );
    }
  };

  const renderAwards = ({ item }) => {
    return (
      <View>
        <Awarder item={item} />
      </View>
    );
  };

  const handleRefresh = (cb, type) => {
    type === "list" && setRefreshing(true);
    type === "empty" && setRefreshingEmpty(true);

    if (!fetchMine) {
      getChallenges(
        (resData) => {
          setChallengeInfo(resData);
        },
        (errData) => {
          setLoadedOnce(true);
        }
      );
      getAwards(
        (resData) => {
          setAwardData(resData);
          type === "list" && setRefreshing(false);
          type === "empty" && setRefreshingEmpty(false);
          setTimeout(() => {
            cb && cb();
          }, 500);
        },
        (errData) => {
          setLoadedOnce(true);
        }
      );
    } else {
      getMyChallenges(
        (resData) => {
          setChallengeInfo(resData.myChallenges);
          setLoadedOnce(true);
          type === "list" && setRefreshing(false);
          type === "empty" && setRefreshingEmpty(false);
        },
        (err) => {
          setLoadedOnce(true);
          type === "list" && setRefreshing(false);
          type === "empty" && setRefreshingEmpty(false);
        }
      );
    }
  };

  useEffect(() => {
    handleRefresh(() => {
      setLoadedOnce(true);
    }, "list");
  }, [fetchMine]);

  return (
    <Screen style={{ backgroundColor: theme.backgroundExtralight }}>
      <AppHeader
        title="Versus"
        icon={false}
        RightComponent={() => (
          <AppButton
            title={`${!fetchMine ? "My" : "All"} Challenges`}
            // RIcon="chevron-right"
            naked
            onPress={() => setFetchMine(!fetchMine)}
          />
        )}
      />

      {!challengeInfo[0] && !awardData[0] && loadedOnce && (
        <FlatList
          data={["OTAKU"]}
          keyExtractor={(item) => item}
          refreshControl={
            <RefreshControl
              progressBackgroundColor={theme.extralight}
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshingEmpty}
              onRefresh={() => handleRefresh(null, "empty")}
            />
          }
          renderItem={() => <View style={styles.emptyFlat} />}
        />
      )}
      <View style={{ flex: 1 }}>
        <FlatList
          data={challengeInfo}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={
            <>
              {awardData && awardData[0] && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                >
                  <AntDesign
                    name="Trophy"
                    size={width * 0.035}
                    color={colors.primary}
                  />
                  <AppText style={{ marginLeft: 3 }} bold>
                    WINBOARD
                  </AppText>
                </View>
              )}

              <FlatList
                data={awardData}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                renderItem={renderAwards}
              />
              {awardData && awardData[0] && <Separator h={1} />}
            </>
          }
          style={{ marginTop: 10 }}
          refreshControl={
            (challengeInfo[0] || awardData[0]) && (
              <RefreshControl
                progressBackgroundColor={theme.extralight}
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => handleRefresh(null, "list")}
              />
            )
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: height * 0.1 }}
          overScrollMode="never"
          renderItem={renderChallenges}
        />
      </View>
      {!challengeInfo[0] && !awardData[0] && (
        <ActivityIndicator
          visible={true}
          style={styles.activity}
          transparent
          type={loadedOnce ? "isEmpty" : "spin"}
          text="No new challenges"
        />
      )}
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
  challengeItem: {
    marginBottom: 30,
    borderRadius: 30,
    paddingVertical: 20,
    elevation: 5,
  },
  btnContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 15,
    marginBottom: 5,
  },
  emptyFlat: {
    flex: 1,
    backgroundColor: "tomato",
  },
});
export default ChallengeScreen;
