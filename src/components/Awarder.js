import React, { memo, useContext, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
// import { AntDesign } from "@expo/vector-icons";
import uuid from "react-native-uuid";

import ProfilePic from "./ProfilePic";
import AppText from "./AppText";
import colors from "../constants/colors";
import PopDropDown from "./PopDropDown";
import PopUpModal from "./PopUpModal";
import ThemeContext from "../config/ThemeContext";
import { ScrollView } from "react-native";
import Avatar from "./Avatar";
import getTimestamp from "../constants/getTimestamp";
// import ProfilePicMultiple from "./ProfilePicMultiple";

const { width } = Dimensions.get("window");

const c_types = ["c_single_character", "c_many_characters"];

const AwardDetails = ({ data, title, isAvatar }) => {
  const theme = useContext(ThemeContext);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        marginLeft: 25,
      }}
    >
      <AppText bold size="large">
        {title}
      </AppText>
      {Array.isArray(data) ? (
        data.map((obj) => (
          <View
            key={uuid.v4()}
            style={{
              ...styles.modalItem,
              backgroundColor: theme.extralight,
            }}
          >
            {isAvatar ? (
              <Avatar
                avatar={obj?.user?.avatar}
                name={obj?.user?.username}
                gender={obj?.user?.gender}
                feederID={obj?.user?._id}
              />
            ) : (
              <View>
                <AppText> {data} </AppText>
              </View>
            )}
            <AppText
              size="xlarge"
              bold
              style={{
                ...styles.modalScore,
                backgroundColor: theme.backgroundLight,
              }}
            >
              {" "}
              {obj.score}{" "}
            </AppText>
          </View>
        ))
      ) : (
        <View
          style={{
            ...styles.modalItem,
            backgroundColor: theme.white,
          }}
        >
          {isAvatar ? (
            <Avatar
              avatar={data?.user?.avatar}
              name={data?.user?.username}
              gender={data?.user?.gender}
              feederID={data?.user?._id}
            />
          ) : (
            <View>
              <AppText> {data} </AppText>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
const RenderAwardInfo = ({ data }) => {
  return (
    <View style={styles.modal}>
      <AppText bold size="large" style={styles.modalTitle}>
        {data.title}
      </AppText>

      <ScrollView style={styles.content}>
        <AwardDetails
          title="Time"
          data={`${getTimestamp(data._id, "format").full} ago`}
        />
        <AwardDetails
          title="Winner"
          data={data.instances.filter((obj) => obj.winner)}
          isAvatar
        />
        <AwardDetails
          title="Participants"
          data={data.instances.filter((obj) => !obj.winner)}
          isAvatar
        />
      </ScrollView>
    </View>
  );
};

const Awarder = ({ item }) => {
  const [modal, setModal] = useState(false);
  const isCharacter = item.tag.name === "character";

  const theme = useContext(ThemeContext);

  let imageObj;

  if (isCharacter) {
    imageObj = {
      width: width * 0.5,
      height: width * 0.7,
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
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setModal(true)}
        style={[
          styles.container,
          {
            ...imageObj,
            backgroundColor: theme.extralight,
          },
        ]}
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
                gender={instance_winner?.user?.gender}
                borderColor={colors.white}
                source={instance_winner?.user?.avatar}
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

            <AppText
              style={{ color: colors.white, textTransform: "capitalize" }}
            >
              {item.tag.name}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
      <PopDropDown
        visible={modal}
        setter={() => setModal(false)}
        RenderComponent={() => <RenderAwardInfo data={item} />}
      />
    </>
  );
};
const styles = StyleSheet.create({
  body: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: {
    margin: 5,
    marginTop: 15,
    marginRight: 20,
    borderRadius: 18,
  },
  image: {
    borderRadius: 18,
  },
  headerA: { flexDirection: "row", alignItems: "center", margin: 5 },
  headerB: { alignSelf: "center", marginTop: 5, alignItems: "center" },
  instanceTitle: {
    color: colors.white,
    textTransform: "capitalize",
    marginBottom: 3,
  },
  instanceHeader: { alignItems: "center", marginBottom: width * 0.03 },
  modal: {
    paddingBottom: 25,
  },
  modalTitle: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    textTransform: "capitalize",
  },
  modalItem: {
    padding: 20,
    marginLeft: 20,
    alignSelf: "stretch",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  modalScore: {
    padding: 10,
    marginLeft: 30,
    borderRadius: 8,
  },
  overlay: {
    position: "absolute",
    borderRadius: width * 0.021,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
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
export default memo(Awarder);

/*
  // const loser = item?.loseUsers[0]?.user;
  // const loserCharacter = item?.loseCharacters[0]?.character;
  // const loserCharacterScore = item?.loseCharacters[0]?.score;
  // const winnerCharacterScore = item?.winCharacters[0]?.score;

*/
