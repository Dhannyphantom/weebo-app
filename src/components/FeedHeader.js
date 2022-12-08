import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import AppText from "./AppText";
import colors from "../constants/colors";
import Spacer from "./Spacer";
import Avatar from "./Avatar";

const { width } = Dimensions.get("screen");

const FeedHeader = ({
  avatar,
  name,
  feederID,
  challenge,
  followers,
  tags,
  show,
  size = 40,
}) => {
  const navigation = useNavigation();
  let channelName, channelID, channelSubs;
  // console.log(tag);
  ///TODO WORK ON THIS TAG STUFF ....
  const isChannel = tags?.find(
    (obj) => obj.name === "channel" && obj.isSpecific
  );
  if (isChannel) {
    channelName = isChannel?.channel?.name;
    channelID = isChannel?.channel?._id;
    channelSubs = isChannel?.channel?.subscribers?.length;
  }

  const handleNav = (route) => {
    if (route === "channel") {
      navigation.navigate("ChannelPost", { id: channelID });
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.left}>
        {name && !isChannel ? (
          <Avatar
            nameStyle={styles.avatarName}
            avatar={avatar}
            feederID={feederID}
            name={name}
            size={size}
          />
        ) : isChannel ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleNav("channel")}
            style={styles.left}
          >
            <Feather name="tv" size={20} color={colors.primary} />
            <AppText size="large" style={styles.headText} bold>
              {channelName}
            </AppText>
          </TouchableOpacity>
        ) : null}
        <Spacer ml={6}>
          {show && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Show", { show })}
              style={[styles.left, styles.showHeader]}
            >
              <Ionicons name="ios-tv" size={20} color={colors.primary} />
              <AppText
                style={{ ...styles.headText, textTransform: "capitalize" }}
                bold
                size="large"
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
            {isChannel ? channelSubs : followers}
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
    width: "100%",
  },
  headText: {
    marginLeft: 7,
    color: colors.primary,
    maxWidth: width * 0.6,
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
  showHeader: {
    paddingVertical: 20,
    paddingRight: 35,
  },
  challenge: {
    textTransform: "capitalize",
    marginLeft: 4,
    color: colors.primary,
    // maxWidth: "90%",
  },
});
export default FeedHeader;
