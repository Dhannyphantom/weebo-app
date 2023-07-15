import React, { memo, useContext, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import getFormatTime from "../constants/getFormatTime";
import ActivityIndicator from "./ActivityIndicator";
import colors from "../constants/colors";
import AppText from "./AppText";
import Avatar from "./Avatar";
import Cards from "./Cards";

//files
import appLogo from "../../assets/favicon.png";
import ThemeContext from "../config/ThemeContext";

const { width, height } = Dimensions.get("window");

const AlertBox = ({
  active,
  message,
  user,
  onPress,
  alertID,
  date,
  setShouldScroll,
  character,
  isLoading,
  isSystem,
  handlePressIcon,
  noAt = false,
}) => {
  const swipeRef = useRef(null);
  const theme = useContext(ThemeContext);

  let username = user && user.username;
  let avatar = user && user.avatar;
  let _id = user && user._id;
  let border, owner, ownerImage, nameStyles, atSymbol;
  active
    ? (border = { borderColor: colors.primary, borderWidth: 2 })
    : (border = { borderColor: "#ddd", borderWidth: 2 });
  if (!character && !user) {
    owner = username = "WEEBO";
    atSymbol = noAt = true;
    ownerImage = avatar = appLogo;
    nameStyles = { ...styles.name, color: colors.primary };
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

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, -50, -1, 0],
      outputRange: [-15, -25, 0, -5],
    });
    return (
      <Animated.View
        style={{ ...styles.rightBgCont, transform: [{ translateX: trans }] }}
      >
        {!isLoading && (
          <View style={[styles.rightBg, { backgroundColor: theme.extralight }]}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.rightIconCont}
              onPress={() => handleIconPress("cancel")}
            >
              <MaterialCommunityIcons
                name="cancel"
                style={styles.rightIcons}
                size={24}
                color={colors.primary}
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
                color={colors.primary}
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
                  color={colors.primary}
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
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeRef}
        // onBegan={() => setShouldScroll(false)}
        // onSwipeableClose={() => setShouldScroll(true)}
        // onSwipeableOpen={onSwipeableOpen}
        renderRightActions={renderRightActions}
      >
        <TouchableOpacity onPress={onPress} activeOpacity={0.65}>
          <Cards style={{ ...styles.container, ...border }}>
            <Avatar
              avatar={avatar}
              // bold={isSystem}
              size={30}
              bold
              feederID={_id}
              name={username}
              nameStyle={nameStyles}
              noAt={atSymbol}
            />
            <AppText style={styles.challengeText}>{messageText}</AppText>
            <AppText style={styles.date}>
              {getFormatTime(date, null, "date")} {getFormatTime(date).time}
            </AppText>
          </Cards>
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 0,
    width: "20%",
    height: "100%",
  },
  container: {
    width: width * 0.95,
    padding: 12,
    alignSelf: "center",
    minHeight: 70,
    borderRadius: 6,
    elevation: 2.3,
    marginBottom: 6,
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
    backgroundColor: "#ddd",
    alignItems: "center",
    borderTopEndRadius: 8,
    borderBottomEndRadius: 8,
    height: "85%",
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
    height: "95%",
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
export default memo(AlertBox);
