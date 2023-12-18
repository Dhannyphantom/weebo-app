import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { Context as AuthContext } from "../config/AuthContext";
import { Context as FeedContext } from "../config/FeedContext";

import ActivityIndicator from "../components/ActivityIndicator";
import MansonryList from "../components/MansonryList";
import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import Screen from "../components/Screen";
import ThemeContext from "../config/ThemeContext";
import { StatusBar } from "expo-status-bar";
import TabList from "../components/TabList";
import { launchGallery } from "../constants/helpers";
import { MediaUploadStatus } from "./HomeScreen";
import PopMessage from "../components/PopMessage";

const MyPostScreen = ({ navigation, route }) => {
  const {
    getUserData,
    state: { userInfo },
  } = useContext(AuthContext);
  const {
    getInstancePosts,
    state: { uploadStatus },
  } = useContext(FeedContext);
  const theme = useContext(ThemeContext);

  const [media, setMedia] = useState([]);
  const [taggedMedia, setTaggedMedia] = useState([]);
  const [screenTitle, setScreenTitle] = useState(null);
  const [tab, setTab] = useState({ posts: true, tagged: false });
  const [count, setCount] = useState({ posts: 0, tagged: 0 });
  const [errMsg, setErrMsg] = useState(null);
  const [popper, setPopper] = useState({ vis: false });
  const [bools, setBools] = useState({
    loadedOnce: false,
    isLoading: true,
    isPostEmpty: true,
  });

  const params = route.params;
  const fromScreen = params?.screen;
  const isInstance = ["character", "group", "show"].includes(fromScreen);
  const isMine = params?.info?.isMine;
  const screenAlias = `MyPost@${params?.info?.id}`;

  const { isLoading, isPostEmpty, loadedOnce } = bools;

  const addNewPost = async () => {
    // LIMIT INSTANCE POSTS
    const { results } = await launchGallery("all");
    if (results) {
      navigation.navigate("Post", {
        assets: results,
        type: fromScreen,
        id: params?.info?.id,
        screenAlias,
        fromScreen: "MyPost",
        name: params?.info.name,
      });
    }
  };

  const CharHeaderComp = () => {
    if (!isInstance) return null;
    return (
      <View style={styles.ballHead}>
        {isMine && params?.info?.verified && (
          <AppButton naked title="New Post" onPress={addNewPost} />
        )}
      </View>
    );
  };

  const onChangeTab = (type) => {
    if (type === "posts") {
      setTab({ posts: true, tagged: false });
    } else if (type === "tagged") {
      setTab({ posts: false, tagged: true });
      if (!taggedMedia[0]) {
        setBools({ ...bools, isLoading: true });
        getInstancePosts(
          { id: params?.info?.id, instance: fromScreen, type: "tagged" },
          (resData) => {
            setTaggedMedia(resData);
            setCount({ ...count, tagged: resData.length });

            setBools({
              ...bools,
              isLoading: false,
              isPostEmpty: resData[0] ? false : true,
            });
          },
          (errData) => {
            setErrMsg(errData.data ?? errData.msg);
            setBools({ ...bools, isLoading: false });
          }
        );
      }
    }
  };

  const fetchInstancePosts = (type, cb) => {
    setScreenTitle(`${params?.info?.name}'s Posts`);
    getInstancePosts(
      { id: params?.info?.id, instance: fromScreen, type },
      (resData) => {
        setMedia(resData);
        setCount({ ...count, posts: resData.length });
        setBools({
          ...bools,
          isPostEmpty: resData[0] ? false : true,
          isLoading: false,
          loadedOnce: true,
        });
        cb && cb();
      },
      (errData) => {
        setErrMsg(errData.data ?? errData.msg);
        setBools({ ...bools, isLoading: false, loadedOnce: true });
        cb && cb();
      }
    );
  };

  const fetchUserPosts = (userId, cb) => {
    getUserData(
      {
        id: userId,
        type: "get_posts",
        query: "",
      },
      (resData) => {
        setMedia(resData);
        setBools({
          ...bools,
          isPostEmpty: resData[0] ? false : true,
          isLoading: false,
          loadedOnce: true,
        });
        cb && cb();
      },
      (errData) => {
        setBools({ ...bools, isLoading: false, loadedOnce: true });
        cb && cb();
      }
    );
  };

  const fetchScreenData = (cb) => {
    switch (fromScreen) {
      case "account":
        setScreenTitle("My Posts");
        fetchUserPosts(userInfo._id, cb);
        break;
      case "accountBox":
        setScreenTitle(`${params?.info?.username} Collections`);
        fetchUserPosts(params?.info?.id, cb);
        break;
      case "show":
      case "group":
      case "character":
        fetchInstancePosts("specific", cb);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchScreenData();
  }, [navigation, params]);

  useEffect(() => {
    if (
      uploadStatus?.screen === screenAlias &&
      uploadStatus?.error &&
      uploadStatus?.hasStarted
    ) {
      setPopper({
        vis: true,
        type: "failed",
        msg: "Upload failed due to network error",
        timer: 10,
      });
    }
  }, [uploadStatus]);

  // // For auto post reload
  useEffect(() => {
    if (uploadStatus?.screen === screenAlias && loadedOnce) {
      uploadStatus?.hasFinished &&
        uploadStatus?.hasStarted &&
        !uploadStatus?.error &&
        fetchScreenData(() => {
          setPopper({
            vis: true,
            type: "success",
            msg: "Media Uploaded!",
            timer: 1.5,
          });
        });
    }
  }, [navigation, route, uploadStatus]);

  return (
    <Screen
      style={{
        ...styles.container,
        backgroundColor: theme.backgroundExtralight,
      }}
    >
      <StatusBar style="dark" />
      <AppHeader title={screenTitle} RightComponent={CharHeaderComp} />
      {isInstance && (
        <View>
          <TabList
            state={tab}
            items={[
              {
                name: `Posts ${count.posts > 0 ? `(${count.posts})` : ""}`,
                tab: "posts",
              },
              {
                name: `Tagged ${count.tagged > 0 ? `(${count.tagged})` : ""}`,
                tab: "tagged",
              },
            ]}
            onPress={onChangeTab}
          />
        </View>
      )}
      <MediaUploadStatus status={uploadStatus} screen={screenAlias} />
      {!isPostEmpty && (
        <MansonryList
          media={tab.posts ? media : tab.tagged ? taggedMedia : []}
          handleRefresh={fetchScreenData}
          data={{ isMine, type: "post" }}
        />
      )}
      <ActivityIndicator
        visible={isPostEmpty && !isLoading}
        type="isEmpty"
        transparent
        text={isLoading ? "Fetching feeds..." : "No media found!"}
      />
      <ActivityIndicator
        visible={isLoading}
        type="spin"
        wTransparent
        style={styles.activity}
      />
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
    </Screen>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  ballHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
export default MyPostScreen;
