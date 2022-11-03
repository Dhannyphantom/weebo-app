import React, { useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import ProfilePic from "./ProfilePic";
import AppText from "./AppText";
import colors from "../constants/colors";
import ProfilePicMultiple from "./ProfilePicMultiple";

const { width, height } = Dimensions.get("window");

const c_types = ["c_single_character", "c_many_characters"];

const Awarder = ({ item }) => {
  const isShow = item.tag === "show";
  const isCharacter = item.tag === "character";
  const isGroup = item.tag === "group";
  // const [showStat, setShowStat] = useState(false);
  let winner, winnerScore, loserScore, winnerCharacter, awardTitle, imageObj;

  if (isCharacter) {
    imageObj = {
      width: width * 0.4,
      height: width * 0.7,
    };
  } else if (isShow || isGroup) {
    imageObj = {
      width: width * 0.68,
      height: width * 0.45,
    };
  } else if (item.tag === "channel") {
    imageObj = {
      width: width * 0.55,
      height: width * 0.49,
    };
  }

  if (item.c_type === "c_single_character") {
    winner = item?.winUsers[0]?.user;
    winnerScore = item?.winUsers[0]?.score;
    loserScore = item?.loseUsers[0]?.score;
    winnerCharacter = item?.winCharacters[0]?.character ?? item?.tagGroup;
    if (isShow) {
      winnerCharacter = item?.winShows[0]?.show;
    }
  } else if (item.c_type === "c_many_characters") {
    winner = item?.winCharacters[0]?.character?.owner;
    winnerScore = item?.winCharacters[0]?.score;
    winnerCharacter = item?.winCharacters[0]?.character;
  } else if (item.c_type == "c_media") {
    winner = item?.winUsers[0]?.user;
    winnerScore = item?.winUsers[0]?.score;
  }

  awardTitle = item.title;

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: winnerCharacter?.cover_photo?.uri ?? winner?.avatar?.uri,
        }}
        style={{ ...styles.image, ...imageObj }}
      />
      <View style={styles.overlay}>
        {c_types.includes(item.c_type) ? (
          <View style={styles.headerA}>
            <ProfilePic
              userID={winner._id}
              border={1}
              borderColor={colors.white}
              source={winner.avatar?.uri}
              size={50}
            />
            <View style={{ marginLeft: 5 }}>
              <AppText style={{ color: colors.white }}>
                @{winner.username}
              </AppText>
              <AppText size="large" style={{ color: colors.heart }} bold>
                WINS
              </AppText>
            </View>
          </View>
        ) : (
          <View style={styles.headerB}>
            {/* <ProfilePicMultiple /> */}
            <ProfilePic
              userID={winner._id}
              border={1}
              borderColor={colors.white}
              source={winner.avatar?.uri}
              size={50}
            />
            <AppText style={{ color: colors.white }}>
              @{winner.username}
            </AppText>
            <AppText size="large" style={styles.winText} bold>
              WINS
            </AppText>
          </View>
        )}
        <View style={styles.body}>
          <View style={styles.headerA}>
            <AntDesign name="Trophy" color={colors.white} size={width * 0.03} />
            <AppText numberOfLines={3} style={styles.title} bold>
              {awardTitle}
            </AppText>
          </View>
          <AppText style={{ color: colors.light, marginTop: 8 }} bold>
            {winnerScore} {loserScore ? `- ${loserScore}` : "votes"}
          </AppText>
        </View>
        <View style={styles.instanceHeader}>
          {item.tag === "channel" ? (
            <AppText style={styles.instanceTitle} bold>
              {item?.tagChannel?.name}
            </AppText>
          ) : (
            <AppText style={styles.instanceTitle} bold>
              {winnerCharacter?.name ?? "@" + winner.username}
            </AppText>
          )}

          <AppText style={{ color: colors.white, textTransform: "capitalize" }}>
            {item.tag}
          </AppText>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  body: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: {
    margin: 5,
  },
  image: {
    borderRadius: width * 0.02,
  },
  headerA: { flexDirection: "row", alignItems: "center", margin: 5 },
  headerB: { alignSelf: "center", marginTop: 5, alignItems: "center" },
  instanceTitle: {
    color: colors.white,
    textTransform: "capitalize",
    marginBottom: 3,
  },
  instanceHeader: { alignItems: "center", marginBottom: width * 0.03 },
  overlay: {
    position: "absolute",
    borderRadius: width * 0.021,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  title: {
    color: colors.white,
    width: width * 0.3,
    textTransform: "capitalize",
    textAlign: "center",
    marginLeft: 3,
  },
  winText: { color: colors.heart, textAlign: "center", marginTop: 3 },
});
export default Awarder;

/*
  // const loser = item?.loseUsers[0]?.user;
  // const loserCharacter = item?.loseCharacters[0]?.character;
  // const loserCharacterScore = item?.loseCharacters[0]?.score;
  // const winnerCharacterScore = item?.winCharacters[0]?.score;

*/
