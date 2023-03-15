import React, { useState, useRef, useContext, useEffect } from "react";
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
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import { Context as FeedContext } from "../config/FeedContext";
import { Context as AuthContext } from "../config/AuthContext";

import AppText from "./AppText";
import CommentBar from "./CommentBar";
import Separator from "./Separator";
import CommentDetails from "./CommentDetails";
import PopUpModal from "./PopUpModal";
import ThemeContext from "../config/ThemeContext";

const { width, height } = Dimensions.get("window");

const MoreReplies = ({ data, avatar, error, reply, setReply }) => {
  const { getCommentReplies, replyComments } = useContext(FeedContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const [bools, setBools] = useState({ loading: true, loadMore: false });
  const [replyData, setReplyData] = useState({ comment: [], page: {} });
  const [errMsg, setErrMsg] = useState(null);

  const handleDummyUpdate = (text) => {
    const replyObj = {
      _id: Math.floor(Math.random() * Math.pow(10, 6)).toString(),
      user: {
        _id: Math.floor(Math.random() * Math.pow(10, 6)).toString(),
        username: userInfo.username,
        avatar: userInfo.avatar,
      },
      pending: true,
      replyId: data.commentId,
      reply: text,
    };

    const copier = [...replyData?.comment[0]?.replies];

    setReplyData({
      ...replyData,
      comment: [{ ...replyData?.comment[0], replies: [replyObj, ...copier] }],
    });
  };

  const handleSend = (text, cb) => {
    handleDummyUpdate(text);
    replyComments(
      data.instanceID,
      data.type,
      data.commentId,
      text,
      (resData) => {
        fetchReplies(() => cb && cb());
      },
      (err) => {
        setErrMsg(err.msg);
      }
    );
  };

  const fetchReplies = (cb, extraData) => {
    let sendObj = data;
    if (extraData) {
      sendObj = {
        ...data,
        ...extraData,
      };
      setBools({ ...bools, loadMore: true });
    }
    getCommentReplies(
      sendObj,
      (resData) => {
        if (extraData) {
          setReplyData({
            ...resData,
            comment: [
              {
                ...resData.comment[0],
                replies: replyData?.comment[0]?.replies?.concat(
                  resData.comment[0].replies
                ),
              },
            ],
          });
        } else {
          setReplyData(resData);
        }
        setBools({ ...bools, loading: false, loadMore: false });
        cb && cb();
      },
      (errData) => console.log(errData)
    );
  };

  useEffect(() => {
    fetchReplies();
  }, []);

  return (
    <CommentComponent
      handleShowMore={null}
      title="REPLIES"
      hasLoaded={!bools.loading}
      commentData={replyData.comment}
      moreContent={{
        vis: Boolean(replyData?.page?.next),
        type: "replies",
        loadMoreContent: () => fetchReplies(null, replyData?.page?.next),
        loading: bools.loadMore,
      }}
      downCompProps={{
        reply,
        setReply,
        error,
        avatar,
        loaded: !bools.loading,
        handleSend,
      }}
    />
  );
};

const DownComponent = ({
  reply,
  setReply,
  error,
  commentText,
  setCommentText,
  avatar,
  loaded,
  handleSend,
  flatRef,
}) => {
  const theme = useContext(ThemeContext);
  const textInputRef = useRef(null);

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
        onSend={(text) => {
          handleSend(text, { reply, setReply }, () => {
            flatRef?.current?.scrollToIndex({ index: 0, viewPosition: 0 });
          });
          flatRef?.current?.scrollToIndex({ index: 0, viewPosition: 0 });
        }}
        type={reply._id ? "reply" : "send"}
        loaded={loaded}
        ref={textInputRef}
        commentText={commentText}
        setCommentText={setCommentText}
        parentState
        avatar={avatar}
      />
    </View>
  );
};

const CommentComponent = ({
  title,
  hasLoaded,
  moreContent = {},
  commentData,
  handleShowMore,
  downCompProps = {},
}) => {
  const [commentText, setCommentText] = useState("");
  const [reply, setReply] = useState({});

  const textInputRef = useRef(null);
  const flatRef = useRef(null);

  const renderComments = ({ item }) => {
    return (
      <CommentDetails
        item={item}
        setReply={setReply}
        reply={reply}
        handleShowMore={handleShowMore}
        callFocus={() => textInputRef?.current?.focus()}
        comment={commentText}
        setComment={setCommentText}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={78}
      style={{ width: "100%", height: height - 60 }}
    >
      {hasLoaded ? (
        <View style={{ flex: 1 }}>
          <AppText bold size="large" style={styles.modalTitle}>
            {title}
          </AppText>
          <Separator h={1} />
          <FlatList
            data={commentData}
            ref={flatRef}
            keyExtractor={(item) => item._id}
            overScrollMode="never"
            ListEmptyComponent={RenderEmptyComments}
            ListFooterComponent={() => {
              if (moreContent.vis)
                return (
                  <LoadMoreContent
                    onPress={() => moreContent.loadMoreContent(flatRef)}
                    loading={moreContent.loading}
                    type={moreContent.type}
                  />
                );
            }}
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
      <DownComponent
        flatRef={flatRef}
        commentText={commentText}
        setCommentText={setCommentText}
        {...downCompProps}
        reply={reply}
        setReply={setReply}
      />
    </KeyboardAvoidingView>
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

const LoadMoreContent = ({ type = "replies", onPress, loading }) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={[styles.loadMore, { backgroundColor: theme.extralight }]}
      activeOpacity={0.54}
      onPress={onPress}
      disabled={loading}
    >
      {!loading ? (
        <>
          <AppText style={styles.loadMoreText}>more {type}</AppText>
          <Feather name="chevron-down" size={18} color={colors.medium} />
        </>
      ) : (
        <View style={styles.loadMore}>
          <ActivityIndicator visible transparent absolute size={0.25} />
        </View>
      )}
    </TouchableOpacity>
  );
};

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
  const { commentPost, getComments, replyComments } = useContext(FeedContext);
  // const [reply, setReply] = useState({});
  const [bools, setBools] = useState({
    replies: false,
    replyObj: { page: 1, limit: 15 },
    loadMore: false,
  });

  const handleShowMore = (item) => {
    setBools({
      ...bools,
      replies: true,
      replyObj: {
        ...bools.replyObj,
        commentId: item._id,
      },
    });
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
        setMyComments([data, ...comments]);
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
      setMyComments([data, ...comments]);
    } else if (type === "dummyReply") {
      const copier = [...comments];
      const finder = copier.findIndex((obj) => obj._id == data.replyId);
      copier[finder].replies.push(data);
      setMyComments(copier);
    }
    setPost && setPost({ ...post, comments: post.comments + 1 });
    cb && cb();
  };

  const handleSend = (text, replyObj, cb) => {
    if (!Boolean(text)) return console.log("No text input");

    const { reply, setReply } = replyObj;

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

      let commentId = reply._id;

      if (reply.mention) {
        const findComment = comments?.results.find((comment) =>
          comment.replies?.some((obj) => obj._id == reply._id)
        );
        commentId = findComment._id;
      }

      replyComments(
        commentData.instanceID,
        commentData.instanceType,
        commentId,
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

  const loadMoreContent = (ref) => {
    setBools({ ...bools, loadMore: true });
    getComments(
      {
        type: commentData.instanceType,
        instanceID: commentData.instanceID,
        page: comments?.next?.page,
        limit: comments?.current?.limit,
      },
      (resData) => {
        setMyComments({
          ...resData,
          results: comments?.results?.concat(resData?.results),
        });
        setBools({ ...bools, loadMore: false });
        ref && ref?.current?.scrollToEnd();
      },
      (errData) => {
        console.log(errData?.err?.response?.data);
        setBools({ ...bools, loadMore: false });
      }
    );
  };

  return (
    <>
      <PopUpModal
        visible={modalVis}
        setter={() => handleCloseComments()}
        full
        ContentComponent={() => (
          <CommentComponent
            handleShowMore={handleShowMore}
            title="COMMENTS"
            hasLoaded={loaded}
            commentData={comments?.results ?? comments}
            moreContent={{
              vis: Boolean(comments?.next),
              type: "comments",
              loadMoreContent,
              loading: bools.loadMore,
            }}
            downCompProps={{
              error,
              avatar,
              loaded,
              handleSend,
            }}
          />
        )}
      />

      <PopUpModal
        visible={bools.replies}
        setter={() => setBools({ ...bools, replies: false })}
        full
        ContentComponent={() => (
          <MoreReplies
            data={{
              ...bools.replyObj,
              instanceID: commentData.instanceID,
              type: commentData.instanceType,
            }}
            avatar={avatar}
            error={error}
            handleSend={handleSend}
          />
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: width * 0.55,
    alignSelf: "center",
    marginVertical: 10,
  },
  container: {
    width,
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
  modalTitle: { alignSelf: "center", marginTop: 10 },
  loader: {
    width: "100%",
    height: "100%",
  },
  loadMore: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  loadMoreText: {
    textAlign: "center",
    marginRight: 6,
    textTransform: "capitalize",
  },
});
export default Comments;
