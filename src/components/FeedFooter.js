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
import { getFeedNumber } from "../constants/helpers";

const { width } = Dimensions.get("window");
export const COMMENT_COUNT = 20;

const FeedFooter = ({
  activeSlide,
  post,
  setPost,
  postUser,
  handleLike,
  tags,
  errMsg,
  postUris,
  type,
  setErrMsg,
  myComments,
  setMyComments,
  title,
  id,
}) => {
  const { getComments, updatePosts, editPostCaption, deletePosts } =
    useContext(FeedContext);
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
    getComments(
      {
        type: "post",
        instanceID: id,
        page: 1,
        limit: COMMENT_COUNT,
      },
      handleDone,
      (dErr) => {
        console.log(dErr.err?.message);
      }
    );
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
          updatePosts();
          setPost({ ...post, loading: false });
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
              size={20}
              color={post.liked ? colors.heart : colors.primary}
            />
            <AppText style={styles.counters}>
              {getFeedNumber(post.likes)}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleComment}
            style={styles.iconCont}
          >
            <MaterialCommunityIcons
              name="comment-multiple-outline"
              size={20}
              color={colors.primary}
            />
            <AppText style={styles.counters}>
              {getFeedNumber(post.comments)}
            </AppText>
          </TouchableOpacity>
          {isVideo && (
            <View style={styles.iconCont}>
              <MaterialCommunityIcons
                name="eye-outline"
                size={20}
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
            style={{ ...styles.iconCont, margin: 0 }}
          >
            <MaterialCommunityIcons
              name="dots-hexagon"
              size={28}
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
          tags={tags}
          isVideo={isVideo}
          isText={isText}
          updatePosts={updatePosts}
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 3,
    padding: 10,
  },
});
export default FeedFooter;
