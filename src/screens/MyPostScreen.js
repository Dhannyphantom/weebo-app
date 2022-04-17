import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Context as AuthContext } from "../config/AuthContext";
import ActivityIndicator from "../components/ActivityIndicator";
import MansonryList from "../components/MansonryList";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppHeader from "../components/AppHeader";
import Screen from "../components/Screen";
import getTimeStamp from "../constants/getTimestamp";

const MyPostScreen = ({ navigation, route }) => {
  const {
    getUserData,
    state: { userInfo },
  } = useContext(AuthContext);

  const [masonryUris, setMasonryUris] = useState([]);
  const [postsArr, setPostArr] = useState([]);
  const [isPostEmpty, setIsPostEmpty] = useState(true);
  const [screenTitle, setScreenTitle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const params = route.params;
  const fromScreen = params?.screen;
  const arrC = [];

  const addNewPost = async () => {
    // LIMIT INSTANCE POSTS

    const data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!data.cancelled) {
      navigation.navigate("Post", {
        uri: data,
        type: "character",
        id: params?.info?.id,
        name: params?.info.name,
      });
    }
  };

  const CharHeaderComp = () => {
    if (fromScreen !== "character") return null;
    return (
      <View style={styles.ballHead}>
        {params?.info?.isMine && (
          <AppButton title="Add New Post" onPress={addNewPost} bare />
        )}
      </View>
    );
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
      default:
        setPostArr([]);
        break;
    }
  }, [navigation, params]);

  useEffect(() => {
    for (let i = 0; i < postsArr.length; i++) {
      const e = postsArr[i];
      const time = getTimeStamp(e._id, "raw");
      for (let j = 0; j < e?.uris.length; j++) {
        const f = e?.uris[j];
        const findInd = arrC.findIndex((obj) => obj.uri === f.uri);
        if (findInd === -1) {
          arrC.push({ ...f, postId: e._id, time, index: i });
        }
      }
    }
    setMasonryUris(arrC);
    arrC[0] && setIsPostEmpty(false);
  }, [postsArr]);

  return (
    <Screen style={styles.container}>
      <AppHeader title={screenTitle} RightComponent={CharHeaderComp} />
      {fromScreen === "character" && (
        <View>
          <AppText style={styles.postStat} bold>
            {params?.info?.name} has {masonryUris.length} posts
          </AppText>
        </View>
      )}
      {!isPostEmpty && <MansonryList images={masonryUris} />}
      <ActivityIndicator
        visible={isPostEmpty && !isLoading}
        type="isEmpty"
        text="No media..."
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
