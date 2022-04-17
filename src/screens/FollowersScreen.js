import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import { Context as AuthContext } from "../config/AuthContext";

import AppText from "../components/AppText";
import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import FriendBox from "../components/FriendBox";

const FollowersScreen = ({ navigation, route }) => {
  const {
    state: { userInfo },
    getUserData,
  } = useContext(AuthContext);

  const [headerTitle, setHeaderTitle] = useState("Followers");
  const [myFollowers, setMyFollowers] = useState([]);

  const params = route.params;

  useEffect(() => {
    switch (params.type) {
      case "isMine":
        setMyFollowers(userInfo.followers);
        break;
      case "otherFollowers":
        getUserData(
          params.id,
          "get_followers",
          (resData) => {
            setMyFollowers(resData.followers);
          },
          (err) => {
            console.log(err);
          }
        );
        break;
      default:
        setMyFollowers(userInfo.followers);
        break;
    }
  }, [navigation]);

  return (
    <Screen style={styles.container}>
      {/* PUT A SEARCH IN THE APPHEADER */}
      <AppHeader title={headerTitle} />
      <FriendBox data={myFollowers} />
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {},
});
export default FollowersScreen;
