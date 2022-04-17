import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";

import { Context as AuthContext } from "../config/AuthContext";
import { Context as FeedContext } from "../config/FeedContext";

import PostVideo from "../components/PostVideo";
import colors from "../constants/colors";
import AppText from "../components/AppText";
import InfoChallenge from "../components/InfoChallenge";
import Screen from "../components/Screen";
const screen = Dimensions.get("window");

const DisplayImageScreen = ({ route }) => {
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const { viewPostVideo } = useContext(FeedContext);

  const [errMsg, setErrMsg] = useState(null);
  const [post, setPost] = useState({
    views: 0,
    viewed: false,
  });

  const params = route.params.data;
  // data = {type,pos(isVid), }
  const item = route.params.item;
  // change above from str to obj = {uri, width, height}

  const handleImageChange = (direction) => {
    if (direction === "r") {
      if (imgIndex === params.posts.length - 1) {
        setImgIndex(0);
      } else {
        setImgIndex(imgIndex + 1);
      }
    } else if (direction === "l") {
      if (imgIndex === 0) {
        setImgIndex(params.posts.length - 1);
      } else {
        setImgIndex(imgIndex - 1);
      }
    }
  };

  const handleViewPost = () => {
    setPost({ ...post, viewed: true, views: post.views + 1 });
    viewPostVideo(params._id, (err) => {
      setErrMsg(err);
      //display error message
    });
  };

  return (
    <View style={styles.container}>
      {params.type === "image" ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.uri }}
            style={{
              ...styles.image,
              aspectRatio: item.width / item.height,
            }}
          />
        </View>
      ) : params.type === "video" ? (
        <Screen style={styles.vidCont}>
          <PostVideo
            vidUri={item.uri}
            contStyle={styles.vidComp}
            posProp={params.pos}
            handleViewPost={handleViewPost}
            post={post}
            full
            disableLongPress
          />
        </Screen>
      ) : params.type === "text" ? (
        <View
          style={{ ...styles.textCont, backgroundColor: params.textInfo.bg }}
        >
          <AppText
            style={{ ...styles.textItem, color: params.textInfo.tColor }}
            size="xxlarge"
            bold
          >
            {item}
          </AppText>
        </View>
      ) : params.type === "info" ? (
        <InfoChallenge
          data={params.infoData}
          color={params.color}
          size="full"
        />
      ) : null}
      {/* <Overlay visible={overlayVis} setVisible={setOverlayVis} /> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.black,
  },
  chevs: {
    position: "absolute",
  },
  chevCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: screen.width,
  },
  image: {
    width: "100%",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
  },
  textCont: {
    width: screen.width,
    alignSelf: "center",
    height: screen.height * 0.9,
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
export default DisplayImageScreen;
