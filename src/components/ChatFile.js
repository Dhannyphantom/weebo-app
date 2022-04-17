import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import colors from "../constants/colors";
import ProfilePic from "./ProfilePic";
import AppText from "./AppText";

const { width } = Dimensions.get("window");

const ChatFile = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(item)}
      style={styles.container}
    >
      <View style={styles.box1}>
        <ProfilePic source={item.avatar} size={45} userID={item.recipientId} />
        <View style={styles.box2}>
          <View style={styles.box3}>
            <AppText style={styles.username} bold>
              {" "}
              @{item.username}
            </AppText>
            <AppText style={styles.msg}> {item.time} </AppText>
          </View>
          <AppText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ ...styles.msg, flex: 1, maxWidth: "80%", marginLeft: 7 }}
          >
            {item.msg}
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
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 8,
    elevation: 3,
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
