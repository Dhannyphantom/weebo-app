import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
// import { AntDesign } from "@expo/vector-icons";

import ProfilePic from "./ProfilePic";
import AppText from "./AppText";
import colors from "../constants/colors";
import PopUpModal from "./PopUpModal";
// import ProfilePicMultiple from "./ProfilePicMultiple";

const { width } = Dimensions.get("window");

const c_types = ["c_single_character", "c_many_characters"];

const RenderAwardInfo = ({ info }) => {
  // winners, losers
  if (!info) return null;
  const {} = info;
  console.log(info);
  return (
    <View>
      <AppText bold size="large" style={{ textAlign: "center", marginTop: 20 }}>
        {info.title}
      </AppText>
      <AppText>@kenidan</AppText>
    </View>
  );
};

const Awarder = ({ item }) => {
  const [toggle, setToggle] = useState(false);
  const isCharacter = item.tag.name === "character";

  let imageObj;

  if (isCharacter) {
    imageObj = {
      width: width * 0.5,
      height: width * 0.6,
    };
  } else {
    imageObj = {
      width: width * 0.8,
      height: width * 0.6,
    };
  }

  const instance_winner = item.instances.find((obj) => obj.winner);
  const instance_loser = item.instances.find((obj) => !obj.winner);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setToggle(!toggle)}
      style={[styles.container, imageObj]}
    >
      <Image
        source={
          item.tag[item?.tag?.name]?.cover_photo ??
          instance_winner?.user?.avatar
        }
        style={[styles.image, imageObj]}
      />
      <View style={styles.overlay}>
        {c_types.includes(item.c_type) ? (
          <View style={styles.headerA}>
            <ProfilePic
              userID={instance_winner?.user?._id}
              border={1}
              borderColor={colors.white}
              source={instance_winner?.user?.avatar?.uri}
              size={50}
            />
            <View style={{ marginLeft: 5 }}>
              <AppText style={{ color: colors.white }}>
                @{instance_winner?.user?.username}
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
              userID={instance_winner?.user?._id}
              border={1}
              borderColor={colors.white}
              source={instance_winner?.user?.avatar?.uri}
              size={50}
            />
            <AppText style={{ color: colors.white }}>
              @{instance_winner?.user?.username}
            </AppText>
            <AppText size="large" style={styles.winText} bold>
              WINS
            </AppText>
          </View>
        )}
        <View style={styles.body}>
          <AppText numberOfLines={3} style={styles.title} bold>
            {item.title}
          </AppText>
          <AppText style={{ color: colors.light, marginTop: 8 }} bold>
            {instance_winner.score} - {instance_loser.score}
          </AppText>
        </View>
        <View style={styles.instanceHeader}>
          {item.tag.name === "channel" ? (
            <AppText style={styles.instanceTitle} bold>
              {item.tag[item?.tag?.name]?.name}
            </AppText>
          ) : (
            <AppText style={styles.instanceTitle} bold>
              {(item.tag[item.tag?.name].name_j ||
                item.tag[item.tag?.name].name_e ||
                item.tag[item.tag?.name].name) ??
                "@" + instance_winner?.user?.username}
            </AppText>
          )}

          <AppText style={{ color: colors.white, textTransform: "capitalize" }}>
            {item.tag.name}
          </AppText>
        </View>
      </View>
      <PopUpModal
        visible={toggle}
        setVisible={setToggle}
        ContentComponent={() => <RenderAwardInfo info={item} />}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  body: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: {
    margin: 5,
    backgroundColor: colors.extraLight,
    marginTop: 15,
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
    width: "80%",
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
