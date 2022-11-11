import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

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

const MyPostScreen = ({ navigation, route }) => {
  const {
    getUserData,
    state: { userInfo },
  } = useContext(AuthContext);
  const { getInstancePosts } = useContext(FeedContext);
  const theme = useContext(ThemeContext);

  const [media, setMedia] = useState([]);
  const [taggedMedia, setTaggedMedia] = useState([]);
  const [isPostEmpty, setIsPostEmpty] = useState(true);
  const [screenTitle, setScreenTitle] = useState(null);
  const [tab, setTab] = useState({ posts: true, tagged: false });
  const [count, setCount] = useState({ posts: 0, tagged: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  const params = route.params;
  const fromScreen = params?.screen;
  const isInstance = ["character", "group", "show"].includes(fromScreen);
  const isMine = params?.info?.isMine;

  const addNewPost = async () => {
    // LIMIT INSTANCE POSTS

    const data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!data.cancelled) {
      navigation.navigate("Post", {
        uri: data,
        type: fromScreen,
        id: params?.info?.id,
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
        setIsLoading(true);
        getInstancePosts(
          { id: params?.info?.id, instance: fromScreen, type: "tagged" },
          (resData) => {
            setTaggedMedia(resData);
            setCount({ ...count, tagged: resData.length });
            resData[0] && setIsPostEmpty(false);
            setIsLoading(false);
          },
          (errData) => {
            setErrMsg(errData.data ?? errData.msg);
            setIsLoading(false);
          }
        );
      }
    }
  };

  const fetchInstancePosts = (type, cb) => {
    setScreenTitle(`${params?.info?.name}'s Collection`);
    getInstancePosts(
      { id: params?.info?.id, instance: fromScreen, type },
      (resData) => {
        setMedia(resData);
        setCount({ ...count, posts: resData.length });
        resData[0] && setIsPostEmpty(false);
        setIsLoading(false);
        cb && cb();
      },
      (errData) => {
        setErrMsg(errData.data ?? errData.msg);
        cb && cb();
        setIsLoading(false);
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
        resData[0] && setIsPostEmpty(false);
        setIsLoading(false);
        cb && cb();
      },
      (errData) => {
        console.log(errData);
        setIsLoading(false);
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
        text={isLoading ? "Fetching feeds..." : "No media found!"}
      />
      <ActivityIndicator
        visible={isLoading}
        type="spin"
        wTransparent
        style={styles.activity}
      />
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
