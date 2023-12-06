import React, { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { Context as AuthContext } from "../config/AuthContext";

import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import FriendBox from "../components/FriendBox";
import ActivityIndicator from "../components/ActivityIndicator";

const FOLLOWERS_LIMIT = 30;

const FollowersScreen = ({ navigation, route }) => {
  const {
    state: { userInfo },
    getUserData,
  } = useContext(AuthContext);

  const [myFollowers, setMyFollowers] = useState({ results: [] });
  const [errMsg, setErrMsg] = useState(null);
  const [bools, setBools] = useState({ isLoading: true, loadMore: false });

  const params = route.params;

  const fetchFollowers = (
    page = 1,
    limit = FOLLOWERS_LIMIT,
    shouldLoadMore
  ) => {
    if (shouldLoadMore) setBools({ ...bools, loadMore: true });
    getUserData(
      {
        id: params.id ?? userInfo._id,
        type: "get_followers",
        pagination: { page, limit },
      },
      (resData) => {
        if (shouldLoadMore) {
          setMyFollowers({
            ...resData.followers,
            results: myFollowers?.results?.concat(resData?.followers?.results),
          });
        } else {
          setMyFollowers(resData.followers);
        }
        setBools({ ...bools, isLoading: false, loadMore: false });
      },
      (err) => {
        setErrMsg(err.data);
        setBools({ ...bools, isLoading: false, loadMore: false });
      }
    );
  };

  useEffect(() => {
    switch (params.type) {
      case "isMine":
      case "otherFollowers":
        fetchFollowers();
        break;
      default:
        // setMyFollowers(userInfo.followers);
        break;
    }
  }, [navigation]);

  return (
    <Screen style={styles.container}>
      {/* PUT A SEARCH IN THE APPHEADER */}
      <AppHeader title="Followers" />
      <FriendBox
        data={myFollowers}
        scrollLoad={{
          loadMore: bools.loadMore,
          isLoading: bools.isLoading,
          onLoadMore: () => {
            if (myFollowers?.hasOwnProperty("next")) {
              fetchFollowers(myFollowers?.next?.page, FOLLOWERS_LIMIT, true);
            } else {
              setBools({ ...bools, loadMore: false });
            }
          },
        }}
      />
      <ActivityIndicator visible={bools.isLoading} absolute transparent />
      <ActivityIndicator
        visible={Boolean(errMsg)}
        type="isEmpty"
        text={errMsg}
        absolute
        transparent
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {},
});
export default FollowersScreen;
