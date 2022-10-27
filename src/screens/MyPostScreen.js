import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Context as AuthContext } from "../config/AuthContext";
import { Context as FeedContext } from "../config/FeedContext";

import ActivityIndicator from "../components/ActivityIndicator";
import MansonryList from "../components/MansonryList";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
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
  const { getShowPosts } = useContext(FeedContext);
  const theme = useContext(ThemeContext);

  const [postsArr, setPostArr] = useState([]);
  const [media, setMedia] = useState([]);
  const [taggedMedia, setTaggedMedia] = useState([]);
  const [isPostEmpty, setIsPostEmpty] = useState(true);
  const [screenTitle, setScreenTitle] = useState(null);
  const [tab, setTab] = useState({ posts: true, tagged: false });
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  const params = route.params;
  const fromScreen = params?.screen;
  let counter = 0;
  let allUris = [];

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
    if (!["character", "show"].includes(fromScreen)) return null;
    return (
      <View style={styles.ballHead}>
        {params?.info?.isMine && params?.info?.verified && (
          <AppButton naked title="Add New Post" onPress={addNewPost} />
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
        getShowPosts(
          { id: params?.info?.id, type: "tagged" },
          (resData) => {
            console.log(resData);
            setTaggedMedia(resData);
            setCount(resData.length);
            // resData[0] && setIsPostEmpty(false);
            setIsLoading(false);
          },
          (errData) => {
            setErrMsg(errData.data ?? errData.msg);
            setIsLoading(false);
            console.log(errData);
          }
        );
      }
    }
  };

  useEffect(() => {
    switch (fromScreen) {
      case "account":
        setScreenTitle("My Posts");
        getUserData(userInfo._id, "get_posts", (resData) => {
          setPostArr(resData.posts);
          resData[0] && !resData.posts[0] && setIsPostEmpty(false);
          setIsLoading(false);
        });
        setIsLoading(false);
        break;
      case "character":
        params.data[0] && setIsPostEmpty(false);
        setPostArr(params?.data);
        setScreenTitle(`${params?.info?.name}'s Collection`);
        setIsLoading(false);
        break;
      case "accountBox":
        // getUserData = [id, type,sc,cb ]+
        setScreenTitle(`${params?.info?.username} Collections`);
        getUserData(params?.info?.id, "get_posts", (resData) => {
          setPostArr(resData.posts);
          resData[0] && setIsPostEmpty(false);
          setIsLoading(false);
        });
        break;
      case "show":
        setScreenTitle(`${params?.info?.name}'s Collection`);
        getShowPosts(
          { id: params?.info?.id, type: "specific" },
          (resData) => {
            setMedia(resData);
            setCount(resData.length);
            resData[0] && setIsPostEmpty(false);
            setIsLoading(false);
          },
          (errData) => {
            setErrMsg(errData.data ?? errData.msg);
            setIsLoading(false);
          }
        );
        break;
      default:
        setPostArr([]);
        break;
    }
  }, [navigation, params]);

  useEffect(() => {
    for (let i = 0; i < postsArr.length; i++) {
      const e = postsArr[i];
      allUris = allUris.concat(e.uris);
      for (let j = 0; j < e?.uris.length; j++) {
        counter++;
      }
    }
    setCount(counter);
    setMedia(allUris);
    counter > 0 && setIsPostEmpty(false);
  }, [postsArr]);

  return (
    <Screen
      style={{
        ...styles.container,
        backgroundColor: theme.backgroundExtralight,
      }}
    >
      <StatusBar style="dark" />
      <AppHeader title={screenTitle} RightComponent={CharHeaderComp} />
      {["character", "show"].includes(fromScreen) && (
        <View>
          {/* <AppText style={styles.postStat} bold>
            {params?.info?.name} has {count} posts
          </AppText> */}
          <TabList
            state={tab}
            items={[
              {
                name: `Posts (${count})`,
                tab: "posts",
              },
              {
                name: "Tagged",
                tab: "tagged",
              },
            ]}
            onPress={onChangeTab}
          />
        </View>
      )}
      {!isPostEmpty && <MansonryList data={postsArr} media={media.reverse()} />}
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
    marginTop: 10,
    marginHorizontal: 12,
    marginBottom: 5,
    alignItems: "center",
  },

  postCollection: {
    marginTop: 15,
    flex: 1,
  },
  postStat: {
    textTransform: "capitalize",
    textAlign: "center",
    marginBottom: 9,
    marginTop: 5,
  },
});
export default MyPostScreen;
