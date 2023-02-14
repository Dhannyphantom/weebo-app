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
  // modalObject = {vis: bool, item: obj}
  const isVisible = modalObject.vis;
  const item = modalObject.item;
  // item = {uri, width, height, type, pos,  postId}
  if (!isVisible || !item) return null;

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
        // if (assetType === "video") {
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

  const assetType = item?.type;

  const handleViewPost = () => {
    setPost({ ...post, viewed: true, views: post.views + 1 });
    viewPostVideo(item.postId, (err) => {
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
        transparent={assetType === "video" ? false : true}
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
          {assetType === "image" ? (
            <Animated.View
              {...mediaMoverResponder.panHandlers}
              style={{
                transform: [{ translateY: mediaTranslator }],
              }}
            >
              <FeedImage
                showMediaFunc={modalActions?.showMediaFunc}
                image={item}
                style={{ width }}
                disableTouch
                handleLike={modalActions?.handleLike}
                full
                liked={modalActions?.liked}
              />
            </Animated.View>
          ) : assetType === "video" ? (
            <Animated.View
              panHandlers={{ ...mediaMoverResponder.panHandlers }}
              style={{
                ...styles.vidCont,
                transform: [{ translateY: mediaTranslator }],
              }}
            >
              <PostVideo
                source={item}
                style={styles.vidComp}
                autoPlay
                onFinishedPlaying={handleViewPost}
                loop
              />
            </Animated.View>
          ) : assetType === "text" ? (
            <Animated.View
              {...mediaMoverResponder.panHandlers}
              style={{
                ...styles.textCont,
                backgroundColor: item.bg,
                transform: [{ translateY: mediaTranslator }],
              }}
            >
              <AppText
                style={{ ...styles.textItem, color: item.tColor }}
                size="xlarge"
                bold
              >
                {item.text}
              </AppText>
            </Animated.View>
          ) : assetType === "info" ? (
            <InfoChallenge
              data={item.infoData}
              color={item.color}
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
    textAlign: "center",
    maxWidth: "92%",
  },
  vidCont: {
    flex: 1,
  },
  vidComp: {
    width,
    height,
  },
});
export default MediaModal;
