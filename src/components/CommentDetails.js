import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Entypo } from "@expo/vector-icons";

import AppText from "./AppText";
import AppButton from "./AppButton";
import Avatar from "./Avatar";
import Separator from "./Separator";
import colors from "../constants/colors";
import getTimeStamp from "../constants/getTimestamp";
import getFormatTime from "../constants/getFormatTime";
import ThemeContext from "../config/ThemeContext";

const RenderReplies = ({ item }) => {
  const date = item.timer
    ? getFormatTime(item.timer, null, "format").short
    : getTimeStamp(item._id);

  const handleReplies = () => {
    console.log(item);
  };

  return (
    <View>
      <Separator h={0.8} />
      <Avatar
        feederID={item.user._id}
        name={item.user.username}
        avatar={item.user.avatar}
        bold
      />
      <View style={styles.commentTextCont}>
        <AppText style={styles.commentText}> {item.reply} </AppText>
        <View style={styles.commentDown}>
          <Entypo name="dot-single" size={12} color={colors.medium} />
          {item.pending ? (
            <View>
              <AppText>Sending...</AppText>
            </View>
          ) : (
            <AppText style={styles.commentDate}> {date} </AppText>
          )}
          {!item.pending && (
            <TouchableOpacity activeOpacity={0.7} onPress={handleReplies}>
              <AppText style={styles.commentReply}>Reply</AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const CommentDetails = ({ item, setReply, handleShowMore, callFocus }) => {
  const date = item.timer
    ? getFormatTime(item.timer, null, "format").short
    : getTimeStamp(item._id);

  const theme = useContext(ThemeContext);

  return (
    <View style={styles.commentBox}>
      <Avatar
        feederID={item.user._id}
        name={item.user.username}
        avatar={item.user.avatar}
        bold
      />
      <View style={styles.commentTextCont}>
        <AppText
          style={{ ...styles.commentText, backgroundColor: theme.extralight }}
        >
          {" "}
          {item.comment}{" "}
        </AppText>
        <View style={styles.commentDown}>
          <Entypo name="dot-single" size={12} color={colors.medium} />
          {item.pending ? (
            <View>
              <AppText>Sending...</AppText>
            </View>
          ) : (
            <AppText style={styles.commentDate}> {date} </AppText>
          )}
          {!item.pending && (
            <TouchableOpacity
              onPress={() => {
                callFocus();
                setReply(item);
              }}
            >
              <AppText style={styles.commentReply}>Reply</AppText>
            </TouchableOpacity>
          )}
        </View>
        <View>
          <FlatList
            data={item.replies}
            keyExtractor={(item) => item._id}
            listKey={({ i }) => i.toString()}
            renderItem={({ item }) => <RenderReplies item={item} />}
          />
          {item.moreReplies && (
            <View style={styles.showMore}>
              <AppButton
                title="more"
                LIcon="chevron-down"
                onPress={() => handleShowMore(item)}
                naked
              />
            </View>
          )}
        </View>
      </View>
      <Separator h={0.8} m={5} />
    </View>
  );
};

const styles = StyleSheet.create({
  commentBox: {
    padding: 8,
    paddingLeft: 16,
  },
  commentTextCont: {
    marginLeft: 46,
    bottom: 10,
  },

  commentDown: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  commentDate: {
    color: colors.medium,
    fontSize: 8,
    right: 2,
  },
  commentClose: {
    height: "100%",
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  commentReply: {
    color: colors.primary,
    marginHorizontal: 9,
  },
  commentText: {
    padding: 10,
    alignSelf: "flex-start",
    borderRadius: 12,
  },
  showMore: {
    marginLeft: 15,
  },
});
export default CommentDetails;
