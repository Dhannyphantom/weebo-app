import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "./AppText";
import colors from "../constants/colors";
import Comments from "./Comments";

import { Context as FeedContext } from "../config/FeedContext";
import { Context as AuthContext } from "../config/AuthContext";
import AppModal from "./AppModal";
import AlertModal from "./AlertModal";

const { width, height } = Dimensions.get("window");

const FeedFooter = ({
  activeSlide,
  post,
  setPost,
  postUser,
  handleLike,
  errMsg,
  postUris,
  type,
  setErrMsg,
  myComments,
  setMyComments,
  title,
  id,
  user,
}) => {
  const {
    commentPost,
    replyComments,
    getComments,
    getPosts,
    editPostCaption,
    deletePosts,
  } = useContext(FeedContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const [modalVis, setModalVis] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [alert, setAlert] = useState({ visible: false });
  // const [reply, setReply] = useState({});
  const [action, setAction] = useState(false);
  const [boxState, setBoxState] = useState({
    caption: false,
    save: false,
    saveAll: false,
    index: null,
  });

  const isMine = postUser._id === userInfo._id;
  const isVideo = type === "video";
  const isText = type === "text";
  const hIcon = post.liked ? "heart-multiple" : "heart-multiple-outline";

  const handleDone = (data) => {
    setMyComments(data);
    setLoaded(true);
  };

  const handleComment = () => {
    //comment icon press logic
    setModalVis(true);
    getComments(id, "post", handleDone, (dErr) => {
      console.log(dErr.err?.message);
    });
  };

  const handleOption = () => {
    setBoxState({ caption: false, save: false, index: null });
    setAction(true);
    setErrMsg(null);
  };

  const handleActionPress = (type) => {
    if (type === "delete") {
      setAlert({
        visible: true,
        title: "Delete Post?",
        message: "Do you really want to delete this post?",
        btn: "YES",
        type: "delete",
      });
    } else if (type === "edit") {
      setBoxState({ caption: !boxState.caption, save: false, index: null });
    } else if (type === "save") {
      // save all
      setBoxState({
        save: false,
        saveAll: !boxState.saveAll,
        caption: false,
        index: null,
      });
    } else if (type === "save_one") {
      setBoxState({
        save: !boxState.save,
        saveAll: false,
        caption: false,
        index: activeSlide,
      });
    }
  };

  const onOkAlert = () => {
    if (alert.type === "delete") {
      setPost({ ...post, loading: true });
      deletePosts(
        id,
        () => {
          getPosts();
          // setPost(false);
        },
        (err) => {
          setErrMsg(err);
          setPost(false);
        }
      );
    }
    setAction(false);
  };

  useEffect(() => {
    // COUNT COMMENTS AND REPLIES
    let itemCommentCount = 0;
    for (let i = 0; i < myComments.length; i++) {
      const e = myComments[i];
      for (let j = 0; j < e.replies.length; j++) {
        itemCommentCount++;
      }
    }
    itemCommentCount += myComments.length;
    setPost({ ...post, comments: itemCommentCount });
  }, [myComments]);

  return (
    <>
      <View style={styles.footer}>
        <View style={styles.left}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleLike()}
            style={styles.iconCont}
          >
            <MaterialCommunityIcons
              name={hIcon}
              size={width * 0.03}
              color={post.liked ? colors.heart : colors.primary}
            />
            <AppText style={styles.counters}>
              {post.likes < 0 ? "0" : post.likes}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleComment}
            style={styles.iconCont}
          >
            <MaterialCommunityIcons
              name="comment-multiple-outline"
              size={width * 0.03}
              color={colors.primary}
            />
            <AppText style={styles.counters}>{post.comments}</AppText>
          </TouchableOpacity>
          {isVideo && (
            <View style={styles.iconCont}>
              <MaterialCommunityIcons
                name="eye-outline"
                size={width * 0.03}
                color={colors.primary}
              />
              <AppText style={styles.counters}>{post.views}</AppText>
            </View>
          )}
        </View>
        <View style={styles.right}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleOption}
            style={{ ...styles.iconCont, borderRadius: 100 }}
          >
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={width * 0.05}
              color={colors.medium}
            />
          </TouchableOpacity>
        </View>
      </View>
      {errMsg && <AppText style={styles.errText}> {errMsg} </AppText>}
      <View style={styles.modalCont}>
        <Comments
          modalVis={modalVis}
          setModal={(v) => setModalVis(v)}
          error={errMsg && errMsg}
          setErrMsg={setErrMsg}
          loaded={loaded}
          avatar={userInfo.avatar}
          commentData={{ instanceType: "four", instanceID: id }}
          data={myComments}
          setLoaded={setLoaded}
          setPost={setPost}
          post={post}
          myComments={myComments}
          setMyComments={setMyComments}
        />
        {/* REFACTOR APPMODAL AND POPDOWNMODAL COMPONENT TO A SINGE REUSEABLE COMPONENT. */}
        <AppModal
          action={action}
          setAction={setAction}
          placeholder={title}
          setError={setErrMsg}
          isMine={isMine}
          postUris={postUris}
          isVideo={isVideo}
          isText={isText}
          getPosts={getPosts}
          editPostCaption={editPostCaption}
          pId={id}
          boxState={boxState}
          setBoxState={setBoxState}
          onPress={handleActionPress}
        />
        <AlertModal obj={alert} setVisible={setAlert} onPress={onOkAlert} />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  counters: {
    fontSize: 9,
    marginLeft: 4,
  },
  errText: {
    textAlign: "center",
    color: colors.white,
    borderRadius: 12,
    paddingHorizontal: 9,
    padding: 5,
    backgroundColor: colors.heart,
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingHorizontal: width * 0.02,
    marginTop: width * 0.01,
  },
  left: {
    flexDirection: "row",
  },
  right: {
    flexDirection: "row",
  },
  iconCont: {
    marginHorizontal: 2,
    // backgroundColor: colors.extraLight,
    borderRadius: 9,
    flexDirection: "row",
    padding: width * 0.01,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default FeedFooter;
