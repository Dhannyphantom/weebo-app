import React, { memo, useContext, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import FeedFooter from "./FeedFooter";
import FeedHeader from "./FeedHeader";
import FeedText from "./FeedText";
import MediaModal from "./MediaModal";
import AppCarousel from "./AppCarousel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Context as AuthContext } from "../config/AuthContext";

import { Context as FeedContext } from "../config/FeedContext";
import PostVideo from "./PostVideo";
import colors from "../constants/colors";
import ActivityIndicator from "./ActivityIndicator";
import AppText from "./AppText";
import ThemeContext from "../config/ThemeContext";
import LoaderImage from "./LoaderImage";
const { width } = Dimensions.get("window");

const FeedRender = ({ item, user }) => {
  const { likePost, viewPostVideo } = useContext(FeedContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const [myComments, setMyComments] = useState([]);
  const [displayMedia, setDisplayMedia] = useState({ vis: false, data: null });
  const [activeSlide, setActiveSlide] = useState(1);

  const [post, setPost] = useState({
    likes: item.likes.length,
    comments: item.commentCount ?? "000",
    views: item.views.length,
    viewed: false,
    liked: false,
    video: false,
    active: 1,
    loading: false,
  });

  const [errMsg, setErrMsg] = useState(null);
  const theme = useContext(ThemeContext);

  const isMultiple = item?.posts?.length > 1;

  const handleLike = () => {
    if (post.liked) {
      setPost({ ...post, likes: post.likes - 1, liked: false });
      likePost(item._id, "unlike", (err) => {
        setErrMsg(err);
        setPost({ ...post, likes: post.likes + 1, liked: false });
      });
    } else {
      setPost({ ...post, likes: post.likes + 1, liked: true });
      likePost(item._id, "like", (err) => {
        setErrMsg(err);
        setPost({ ...post, likes: post.likes - 1, liked: true });
      });
    }
  };

  const handleViewPost = () => {
    if (item.views.includes(userInfo._id) || post.viewed) return;
    setPost({ ...post, viewed: true, views: post.views + 1 });
    viewPostVideo(item._id, (err) => {
      setErrMsg(err);
    });
  };

  const handleShowMedia = (mediaObj) => {
    setDisplayMedia({ vis: true, item: { ...mediaObj, postId: item._id } });
  };

  useEffect(() => {
    if (item.views.includes(user)) {
      setPost({ ...post, viewed: true });
    }

    if (item.likes.includes(user)) {
      setPost({ ...post, liked: true });
    }
  }, [item]);

  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <FeedHeader
        avatar={item.user.avatar}
        feederID={item.user._id}
        tags={item.tags}
        name={item.user.username}
        feedId={item._id}
        // followers={item.user.followers.length}
      />
      <FeedText
        title={item.title}
        type={item.type}
        info={item.textInfo}
        showMediaFunc={handleShowMedia}
        handleLike={handleLike}
        liked={post.liked}
      />
      <View>
        {item.type === "image" ? (
          <AppCarousel
            data={item.posts}
            imager={{
              feed: item,
              showMediaFunc: handleShowMedia,
              handleLike,
              liked: post.liked,
            }}
            activeSetter={{ activeSlide, setActiveSlide }}
          />
        ) : item.type === "video" ? (
          <View style={{ flex: 1 }}>
            {post.video ? (
              <PostVideo
                source={item?.posts[0]}
                onDoublePress={handleLike}
                autoPlay
                showHearts
                style={{ width: width * 0.95 }}
                onFinishedPlaying={handleViewPost}
                onLongPress={handleShowMedia}
              />
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setPost({ ...post, video: true })}
              >
                <LoaderImage image={item?.posts[0]} isVideoImage />
              </TouchableOpacity>
            )}
          </View>
        ) : item.type === "text" ? null : null}
        {item.type !== "text" && isMultiple && (
          <View
            style={[
              styles.imageMultiple,
              { backgroundColor: theme.extralight },
            ]}
          >
            <MaterialCommunityIcons
              name="image-multiple"
              color={colors.primary}
              size={width * 0.02}
            />
            <AppText style={{ marginLeft: 4 }} bold>
              {activeSlide}/{item?.posts?.length}
            </AppText>
          </View>
        )}
      </View>
      <FeedFooter
        likes={item.likes}
        id={item._id}
        title={item.title}
        type={item.type}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
        handleLike={handleLike}
        myComments={myComments}
        setMyComments={setMyComments}
        user={user}
        postUser={item.user}
        activeSlide={activeSlide}
        postUris={item.posts}
        post={post}
        tags={item.tags}
        setPost={setPost}
      />
      <MediaModal
        modalObject={displayMedia}
        setVisible={setDisplayMedia}
        modalActions={{
          handleLike,
          liked: post.liked,
          showMediaFunc: handleShowMedia,
        }}
      />
      <ActivityIndicator
        visible={post.loading}
        style={styles.activity}
        wTransparent
      />
    </View>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    // width: "100%",
    width: width * 0.97,
    height: "105%",
  },
  container: {
    flex: 1,
    width: width * 0.97,
    borderRadius: width * 0.04,
    marginVertical: width * 0.01,
    elevation: 1.2,
    padding: width * 0.03,
    alignSelf: "center",
  },
  imageMultiple: {
    position: "absolute",
    padding: 10,
    top: "1.5%",
    right: 12,
    alignSelf: "flex-end",
    borderRadius: width * 0.02,
    flexDirection: "row",
    opacity: 0.8,
    alignItems: "center",
  },
});
export default memo(FeedRender);
