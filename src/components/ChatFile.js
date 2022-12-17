import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import colors from "../constants/colors";
import ProfilePic from "./ProfilePic";
import AppText from "./AppText";
import ThemeContext from "../config/ThemeContext";
import getTimestamp from "../constants/getTimestamp";
import { capFirstLetter } from "../constants/helpers";

const { width } = Dimensions.get("window");

const ChatFile = ({ item, onPress }) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(item)}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.box1}>
        <ProfilePic
          source={item?.user?.avatar}
          size={45}
          userID={item?.user?._id}
        />
        <View style={styles.box2}>
          <View style={styles.box3}>
            <AppText style={styles.username} bold>
              @{item?.user?.username}
            </AppText>
            <AppText style={styles.msg}>
              {getTimestamp(item?.last_message?._id)}
            </AppText>
          </View>
          <AppText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ ...styles.msg, flex: 1, maxWidth: "80%", marginLeft: 7 }}
          >
            {item?.last_message?.message ??
              `Say hi to ${capFirstLetter(item?.user?.username)}`}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    marginHorizontal: 5,
    width: width * 0.96,
    alignSelf: "center",
    padding: 10,
    borderRadius: 8,
    elevation: 8,
    shadowRadius: 8,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 1.8,
    },
  },
  box1: {
    flex: 1,
    flexDirection: "row",
  },
  box2: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 9,
  },
  box3: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  username: {
    textTransform: "lowercase",
  },
  msg: {
    color: colors.medium,
  },
});
export default ChatFile;
