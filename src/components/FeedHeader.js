import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import AppText from "./AppText";
import colors from "../constants/colors";
import Spacer from "./Spacer";
import Avatar from "./Avatar";

const FeedHeader = ({
  avatar,
  name,
  feederID,
  challenge,
  followers,
  tag,
  show,
  size = 40,
}) => {
  const navigation = useNavigation();
  let channel, normal, channelName, channelID, channelSubs;
  // console.log(tag);
  ///TODO WORK ON THIS TAG STUFF ....
  if (tag?.tags) {
    const tags = tag.tags;
    channelName = tags?.channel[0]?.name;
    channelID = tags?.channel[0]?._id;
    channel = tag?.tagArr.find(
      (obj) => obj.isSpecific && obj.name === "channel"
    );
    channelSubs = tags?.channel[0]?.subscribers?.length;
  }
  const handleNav = (route) => {
    if (route === "channel") {
      navigation.navigate("ChannelPost", { id: channelID });
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.left}>
        {name && !channel ? (
          <Avatar
            nameStyle={styles.avatarName}
            avatar={avatar}
            feederID={feederID}
            name={name}
            size={size}
          />
        ) : channel ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleNav("channel")}
            style={styles.left}
          >
            <Feather name="tv" size={20} color={colors.primary} />
            <AppText style={styles.headText} bold>
              {channelName}
            </AppText>
          </TouchableOpacity>
        ) : null}
        <Spacer ml={6}>
          {show && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Show", { show })}
              style={styles.left}
            >
              <MaterialCommunityIcons
                name="television-play"
                size={18}
                color={colors.primary}
              />
              <AppText
                style={{ ...styles.headText, textTransform: "capitalize" }}
                bold
              >
                {show.name_j || show.name_e}
              </AppText>
            </TouchableOpacity>
          )}
          {challenge && (
            <View style={styles.left}>
              <MaterialCommunityIcons
                name="ninja"
                size={20}
                color={colors.primary}
              />
              <AppText style={styles.challenge} bold>
                {challenge}
              </AppText>
            </View>
          )}
        </Spacer>
      </View>
      {show || name ? (
        <View style={styles.right}>
          <Spacer mr={4}>
            <MaterialCommunityIcons
              name="account-group"
              color={colors.light}
              size={12}
            />
          </Spacer>
          <AppText style={styles.text}>
            {channel ? channelSubs : followers}
          </AppText>
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  avatarName: {
    fontSize: 9,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingHorizontal: 8,
    width: "100%",
  },

  headText: {
    marginLeft: 7,
    fontSize: 15,
    color: colors.primary,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: colors.medium,
  },
  show: {
    textTransform: "capitalize",
  },
  challenge: {
    textTransform: "capitalize",
    marginLeft: 4,
    color: colors.primary,
  },
});
export default FeedHeader;
