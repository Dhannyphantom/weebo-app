import React, { useRef, useState } from "react";
import { StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import getFormatTime from "../constants/getFormatTime";
import ActivityIndicator from "./ActivityIndicator";
import colors from "../constants/colors";
import AppText from "./AppText";
import Avatar from "./Avatar";
import Cards from "./Cards";

//files
import appLogo from "../../assets/icon.png";

const screen = Dimensions.get("window");

const AlertBox = ({
  active,
  message,
  user,
  onPress,
  alertID,
  date,
  character,
  isLoading,
  isSystem,
  handlePressIcon,
  noAt = false,
}) => {
  const swipeRef = useRef(null);

  let username = user && user.username;
  let avatar = user && user.avatar;
  let _id = user && user._id;
  let border, owner, ownerImage, nameStyles, atSymbol;
  active ? (border = { borderColor: colors.primary, borderWidth: 0.8 }) : null;
  if (!character && !user) {
    owner = username = "OTAKU";
    atSymbol = noAt = true;
    ownerImage = avatar = appLogo;
    nameStyles = { ...styles.name, color: colors.heart };
  } else {
    nameStyles = styles.name;
  }

  const firstLetter = message && message[0].toUpperCase();
  const messageText = firstLetter + message?.substr(1);

  const handleIconPress = (type) => {
    swipeRef.current.close();
    if (type == "cancel") return;
    handlePressIcon(type, alertID);
  };

  const RenderRightActions = () => {
    return (
      <View style={styles.rightBgCont}>
        {!isLoading && (
          <View style={styles.rightBg}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.rightIconCont}
              onPress={() => handleIconPress("cancel")}
            >
              <MaterialCommunityIcons
                name="cancel"
                style={styles.rightIcons}
                size={24}
                color={colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.rightIconCont}
              onPress={() => handleIconPress("delete")}
            >
              <Feather
                name="trash-2"
                style={styles.rightIcons}
                size={24}
                color={colors.white}
              />
            </TouchableOpacity>
            {active && (
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.rightIconCont}
                onPress={() => handleIconPress("read")}
              >
                <Feather
                  name="check"
                  style={styles.rightIcons}
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        <ActivityIndicator
          type="spin"
          visible={isLoading}
          style={styles.activity}
        />
      </View>
    );
  };

  return (
    <Swipeable ref={swipeRef} renderRightActions={RenderRightActions}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Cards style={{ ...styles.container, ...border }}>
          <Avatar
            avatar={avatar}
            bold={isSystem}
            size={30}
            feederID={_id}
            name={username}
            nameStyle={nameStyles}
            noAt={atSymbol}
          />
          <AppText style={styles.challengeText}>{messageText}</AppText>
          <AppText style={styles.date}>
            {getFormatTime(date, null, "date")} {getFormatTime(date)}
          </AppText>
        </Cards>
      </TouchableOpacity>
    </Swipeable>
  );
};
const styles = StyleSheet.create({
  activity: {
    flex: 0,
    width: "20%",
    height: "100%",
  },
  container: {
    width: screen.width * 0.95,
    padding: 12,
    alignSelf: "center",
    minHeight: 70,
    borderRadius: 6,
    elevation: 2.3,
    marginBottom: 4,
  },
  character: {
    color: colors.primary,
    textTransform: "capitalize",
    fontSize: 11,
  },
  challengeText: {
    marginLeft: 30 + 10,
    bottom: 12,
  },
  date: {
    alignSelf: "flex-end",
    color: colors.medium,
    bottom: 5,
  },
  rightBg: {
    justifyContent: "flex-end",
    flexDirection: "row",
    backgroundColor: colors.primary,
    alignItems: "center",
    borderTopEndRadius: 8,
    borderBottomEndRadius: 8,
    minHeight: 80,
    paddingHorizontal: 10,
    marginRight: 15,
    marginLeft: -10,
  },
  rightIconCont: {
    height: "100%",
    justifyContent: "center",
  },
  rightBgCont: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    marginBottom: 4,
  },
  rightIcons: {
    marginHorizontal: 12,
  },
  name: {
    bottom: 8,
    left: 6,
  },
});
export default AlertBox;
