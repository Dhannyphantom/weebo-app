import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";

import colors from "../constants/colors";
import AppText from "./AppText";
import ProfilePic from "./ProfilePic";
import getTimeFormat from "../constants/getFormatTime";
import Separator from "./Separator";

const screen = Dimensions.get("window");
const ChatRender = ({
  item: { message, sender, read, sent, time },
  user,
  upperChat,
  lowerChat,
}) => {
  let bool, upperRecipient, lowerSender, upperSender, lowerRecipient;
  if (sender.username === user) {
    bool = true;
  } else {
    bool = false;
  }

  let sendIconColor;
  sent && read
    ? (sendIconColor = colors.green)
    : sent && !read
    ? (sendIconColor = colors.primary)
    : !sent && !read
    ? (sendIconColor = colors.medium)
    : (sendIconColor = colors.medium);

  if (
    !upperChat ||
    upperChat === null ||
    upperChat?.sender?.username === user
  ) {
    upperRecipient = true;
    upperSender = false;
  } else {
    upperRecipient = false;
    upperSender = true;
  }

  if (lowerChat?.sender?.username === user) {
    lowerSender = false;
  } else {
    lowerSender = true;
  }

  const timer = getTimeFormat(time);
  const showDay = getTimeFormat(time, upperChat?.time);
  return (
    <View style={styles.container}>
      {!bool ? (
        <>
          {upperChat && showDay && (
            <View>
              <AppText style={styles.showDay} bold>
                {showDay}
              </AppText>
              <Separator h={1} />
            </View>
          )}
          <View style={styles.senderStyle}>
            {upperRecipient && (
              <ProfilePic
                source={sender.avatar}
                size={45}
                userID={sender._id}
              />
            )}
            <View
              style={{
                ...styles.box,
                backgroundColor: colors.extraLight,
                marginLeft: upperRecipient ? 6 : 51,
                marginBottom: upperRecipient ? 0 : 2,
              }}
            >
              <AppText
                size="large"
                style={{ ...styles.message, color: colors.chat }}
              >
                {message}
              </AppText>
            </View>
          </View>
          <View style={styles.timerContLeft}>
            <AppText style={styles.timer} bold>
              {timer}
            </AppText>
          </View>
        </>
      ) : (
        <>
          {upperChat && showDay && (
            <View>
              <AppText style={styles.showDay} bold>
                {showDay}
              </AppText>
              <Separator h={1} />
            </View>
          )}
          <View style={styles.reciStyle}>
            {lowerSender && (
              <View style={styles.checkIcon}>
                <Feather name="check-circle" size={16} color={sendIconColor} />
              </View>
            )}
            <View
              style={{
                ...styles.box,
                transform: [{ rotateY: "180deg" }],
                marginLeft: lowerSender ? 0 : 18,
                marginBottom: 2,
              }}
            >
              <AppText size="large" style={styles.message}>
                {message}
              </AppText>
            </View>
          </View>
          <View style={styles.timerCont}>
            <AppText style={styles.timer} bold>
              {timer}
            </AppText>
          </View>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  checkIcon: {
    transform: [{ rotateY: "180deg" }],
    marginHorizontal: 2,
  },
  box: {
    backgroundColor: colors.chat,
    padding: 7,
    paddingHorizontal: 16,
    alignSelf: "center",
    maxWidth: screen.width * 0.7,
    borderRadius: 20,
    marginLeft: 6,
  },
  message: {
    color: colors.white,
  },
  senderStyle: {
    alignSelf: "flex-start",
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  showDay: {
    textAlign: "center",
    textTransform: "uppercase",
  },
  timerCont: {
    alignSelf: "flex-end",
    marginHorizontal: 38,
  },
  timerContLeft: {
    marginHorizontal: 70,
  },
  timer: {
    color: colors.medium,
  },
  reciStyle: {
    transform: [{ rotateY: "180deg" }],
    alignSelf: "flex-end",
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
});
export default ChatRender;
