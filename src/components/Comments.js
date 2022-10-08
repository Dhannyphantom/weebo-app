import React, { useState, useRef, useContext } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableOpacity,
} from "react-native";
import colors from "../constants/colors";
import ActivityIndicator from "./ActivityIndicator";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Context as FeedContext } from "../config/FeedContext";
import { Context as AuthContext } from "../config/AuthContext";

import AppText from "./AppText";
import CommentBar from "./CommentBar";
import Separator from "./Separator";
import CommentDetails from "./CommentDetails";
import PopUpModal from "./PopUpModal";
import ThemeContext from "../config/ThemeContext";

const { width, height } = Dimensions.get("window");

const Comments = ({
  modalVis,
  data: comments,
  avatar,
  error,
  setLoaded,
  commentData, // {instanceType, instanceID}
  setErrMsg,
  loaded,
  setPost,
  post,
  setMyComments,
  setModal,
}) => {
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const { commentPost, replyComments } = useContext(FeedContext);
  const [reply, setReply] = useState({});

  const theme = useContext(ThemeContext);
  const textInputRef = useRef(null);
  const flatRef = useRef(null);

  const handleSetReply = () => {
    textInputRef?.current?.focus();
  };

  const handleShowMore = (item) => {
    console.log(item);
  };

  const handleSentComment = (type, data, cb) => {
    if (type === "comment") {
      // check if there is a dummy
      const copier = [...comments];
      const finder = copier.findIndex(
        (obj) => obj.pending == true && obj.comment == data.comment
      );
      if (finder >= 0) {
        // there is a dummy, therefore replace
        copier[finder] = data;
        setMyComments(copier);
      } else {
        setMyComments([...comments, data]);
      }
    } else if (type === "reply") {
      const copier = [...comments];
      const finder = copier.find((obj) => obj._id == data.replyId);
      const finderIndex = finder.replies.findIndex(
        (obj) => obj.pending == true && obj.reply == data.reply
      );
      if (finderIndex >= 0) {
        finder.replies[finderIndex] = data;
      } else {
        copier[finder].replies.push(data);
      }
      setMyComments(copier);
    } else if (type === "dummyComment") {
      setMyComments([...comments, data]);
    } else if (type === "dummyReply") {
      const copier = [...comments];
      const finder = copier.findIndex((obj) => obj._id == data.replyId);
      copier[finder].replies.push(data);
      setMyComments(copier);
    }
    setPost && setPost({ ...post, comments: post.comments + 1 });
    cb && cb();
  };

  const handleSend = (text, cb) => {
    if (text == "" || text === null || !text) return;

    if (reply._id) {
      handleSentComment(
        "dummyReply",
        {
          _id: Math.floor(Math.random() * Math.pow(10, 6)).toString(),
          user: {
            _id: Math.floor(Math.random() * Math.pow(10, 6)).toString(),
            username: userInfo.username,
            avatar: userInfo.avatar,
          },
          pending: true,
          replyId: reply._id,
          reply: text,
        },
        cb
      );
      replyComments(
        commentData.instanceID,
        commentData.instanceType,
        reply._id,
        text,
        (resData) => {
          handleSentComment("reply", { ...resData, replyId: reply._id });
          cb && cb();
        },
        (err) => {
          setErrMsg(err.msg);
          console.log(err.err?.response?.data);
        }
      );
      setReply({});
    } else {
      handleSentComment(
        "dummyComment",
        {
          _id: Math.floor(Math.random() * Math.pow(10, 6)).toString(),
          user: {
            _id: Math.floor(Math.random() * Math.pow(10, 6)).toString(),
            username: userInfo.username,
            avatar: userInfo.avatar,
          },
          pending: true,
          comment: text,
          replies: [],
        },
        cb
      );
      commentPost(
        commentData.instanceID,
        commentData.instanceType,
        text,
        (resData) => handleSentComment("comment", resData),
        (err) => setErrMsg(err)
      );
    }
  };

  const handleCloseComments = () => {
    setLoaded && setLoaded(false);
    setErrMsg(null);
    setModal(false);
  };

  const renderComments = ({ item }) => {
    return (
      <CommentDetails
        item={item}
        setReply={setReply}
        handleShowMore={handleShowMore}
        callFocus={handleSetReply}
      />
    );
  };

  const RenderEmptyComments = () => {
    return (
      <View style={{ width, height: height * 0.8, backgroundColor: "blue" }}>
        <ActivityIndicator
          visible
          type="emptyComment"
          text="No comments, Send one right now"
        />
      </View>
    );
  };

  const CommentComponent = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={82}
        style={{ width, height: height * 0.936 }}
      >
        {loaded ? (
          <View style={{ flex: 1 }}>
            <AppText
              bold
              size="large"
              style={{ alignSelf: "center", marginTop: 10 }}
            >
              COMMENTS
            </AppText>
            <Separator h={1} />
            <FlatList
              data={comments}
              ref={flatRef}
              keyExtractor={(item) => item._id}
              overScrollMode="never"
              onContentSizeChange={() => flatRef?.current?.scrollToEnd()}
              ListEmptyComponent={RenderEmptyComments}
              contentContainerStyle={{ paddingBottom: 10 }}
              keyboardShouldPersistTaps="handled"
              renderItem={renderComments}
            />
          </View>
        ) : (
          <View style={styles.loader}>
            <ActivityIndicator visible={true} size={2} type="comment" />
          </View>
        )}
        <DownComponent />
      </KeyboardAvoidingView>
    );
  };

  const DownComponent = () => {
    return (
      <View style={{ maxHeight: 150 }}>
        {reply._id && (
          <View
            style={{
              ...styles.commentReplyBox,
              backgroundColor: theme.extralight,
            }}
          >
            <AppText>Replying @{reply.user.username}</AppText>
            <TouchableOpacity
              style={styles.commentClose}
              onPress={() => setReply({})}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={15}
                color={colors.medium}
              />
            </TouchableOpacity>
          </View>
        )}
        {error && (
          <View
            style={{
              ...styles.commentReplyBox,
              backgroundColor: theme.extralight,
            }}
          >
            <AppText style={styles.errorText}> {error} </AppText>
          </View>
        )}

        <CommentBar
          onSend={handleSend}
          type={reply._id ? "reply" : "send"}
          loaded={loaded}
          ref={textInputRef}
          avatar={avatar}
        />
      </View>
    );
  };

  return (
    <PopUpModal
      visible={modalVis}
      setter={() => handleCloseComments()}
      full
      ContentComponent={CommentComponent}
    />
  );
};

const styles = StyleSheet.create({
  btn: {
    width: width * 0.55,
    alignSelf: "center",
    marginVertical: 10,
  },

  commentReplyBox: {
    flexDirection: "row",
    height: 30,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    color: colors.heart,
    textAlign: "center",
  },
  emptyComment: {
    width: "100%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  modalBg: {
    height: height * 0.92,
    backgroundColor: colors.white,
    borderTopEndRadius: width * 0.05,
    borderTopStartRadius: width * 0.05,
  },
  modalBgTwo: {
    flex: 1,
  },
  loader: {
    width: "100%",
    height: "100%",
  },
});
export default Comments;
