import React, { useContext, useRef, useState } from "react";
import {
  StyleSheet,
  Modal,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

import { Context as FeedContext } from "../config/FeedContext";

import PostVideo from "./PostVideo";
import AppText from "./AppText";
import InfoChallenge from "./InfoChallenge";
import FeedImage from "./FeedImage";

const barheight = Constants.statusBarHeight;

const useHeight = barheight > 25 ? barheight + height * 0.0005 : barheight + 1;
const { width, height } = Dimensions.get("window");

const MediaModal = ({ modalObject, setVisible, modalActions }) => {
  // modalObject = {vis: bool, data: {feed: {type: string, pos: number(isVideo)}, item: {uri, width, height}}}
  const isVisible = modalObject.vis;
  const modalData = modalObject.data;
  if (!isVisible || !modalData) return null;

  const { viewPostVideo } = useContext(FeedContext);

  const [errMsg, setErrMsg] = useState(null);
  const [post, setPost] = useState({
    views: 0,
    viewed: false,
  });

  const mediaTranslator = useRef(new Animated.Value(0)).current;

  const mediaMoverResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // DISABLE GESTURES FOR VIDEO DISPLAY
        // if (params.type === "video") {
        //   return false;
        // }
        return true;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 50) {
          mediaTranslator.setValue(gestureState.dy - 50);
        } else {
          // NOT A SWIPE GESTURE POSSIBLY
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > height * 0.35 || gestureState.vy > 0.8) {
          Animated.timing(mediaTranslator, {
            toValue: height * 0.7,
            useNativeDriver: true,
          }).start(() => handleCloseModal());
        } else {
          Animated.spring(mediaTranslator, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const params = modalData.feed;
  // data = {type,pos(isVid), }
  const item = modalData.item;
  // item = {uri, width, height}

  const handleViewPost = () => {
    setPost({ ...post, viewed: true, views: post.views + 1 });
    viewPostVideo(params._id, (err) => {
      setErrMsg(err);
      //display error message
    });
  };

  const handleCloseModal = () => {
    setVisible({ vis: false, data: null });
  };

  return (
    <>
      <StatusBar style="light" />
      <Modal
        visible={isVisible}
        onRequestClose={handleCloseModal}
        statusBarTranslucent
        transparent={params.type === "video" ? false : true}
        animationType="fade"
      >
        <Animated.View
          style={{
            ...styles.container,
            opacity: mediaTranslator.interpolate({
              inputRange: [0, height * 0.5],
              outputRange: [1, 0],
            }),
          }}
        >
          {params.type === "image" ? (
            <Animated.View
              {...mediaMoverResponder.panHandlers}
              style={{
                transform: [{ translateY: mediaTranslator }],
              }}
            >
              <FeedImage
                feed={params}
                showMediaFunc={modalActions?.showMediaFunc}
                image={item}
                style={{ width }}
                disableTouch
                handleLike={modalActions?.handleLike}
                full
                liked={modalActions?.liked}
              />
            </Animated.View>
          ) : params.type === "video" ? (
            <Animated.View
              panHandlers={{ ...mediaMoverResponder.panHandlers }}
              style={{
                ...styles.vidCont,
                transform: [{ translateY: mediaTranslator }],
              }}
            >
              <PostVideo
                source={item}
                contStyle={styles.vidComp}
                disableTouch
                posProp={params.pos}
                handleViewPost={handleViewPost}
                post={post}
                full
                disableLongPress
              />
            </Animated.View>
          ) : params.type === "text" ? (
            <Animated.View
              {...mediaMoverResponder.panHandlers}
              style={{
                ...styles.textCont,
                backgroundColor: params.textInfo.bg,
                transform: [{ translateY: mediaTranslator }],
              }}
            >
              <AppText
                style={{ ...styles.textItem, color: params.textInfo.tColor }}
                size="xxlarge"
                bold
              >
                {item}
              </AppText>
            </Animated.View>
          ) : params.type === "info" ? (
            <InfoChallenge
              data={params.infoData}
              color={params.color}
              size="full"
            />
          ) : null}
        </Animated.View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: useHeight || 1,
    backgroundColor: "#151515",
    // backgroundColor: "rgba(0,0,0,0.94)",
  },
  chevs: {
    position: "absolute",
  },
  chevCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width,
  },
  image: {
    width: "100%",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
  },
  textCont: {
    width: width,
    alignSelf: "center",
    height: height * 0.9,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 23,
    elevation: 2,
    marginVertical: 12,
  },
  textItem: {
    fontSize: 25,
    textAlign: "center",
  },
  vidCont: {
    flex: 1,
  },
  vidComp: {
    justifyContent: "center",
  },
});
export default MediaModal;
