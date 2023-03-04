import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import { Context as AuthContext } from "../config/AuthContext";

import AppText from "../components/AppText";
import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import FriendBox from "../components/FriendBox";
import ActivityIndicator from "../components/ActivityIndicator";

const FollowersScreen = ({ navigation, route }) => {
  const {
    state: { userInfo },
    getUserData,
  } = useContext(AuthContext);

  const [myFollowers, setMyFollowers] = useState([]);
  const [errMsg, setErrMsg] = useState(null);
  const [bools, setBools] = useState({ isLoading: true });

  const params = route.params;

  useEffect(() => {
    switch (params.type) {
      case "isMine":
        setMyFollowers(userInfo.followers);
        setBools({ ...bools, isLoading: false });
        break;
      case "otherFollowers":
        getUserData(
          { id: params.id, type: "get_followers" },
          (resData) => {
            setMyFollowers(resData.followers);
            setBools({ ...bools, isLoading: false });
          },
          (err) => {
            setErrMsg(err.data);
            setBools({ ...bools, isLoading: false });
          }
        );
        break;
      default:
        // setMyFollowers(userInfo.followers);
        console.log("Provide a params type");
        break;
    }
  }, [navigation]);

  return (
    <Screen style={styles.container}>
      {/* PUT A SEARCH IN THE APPHEADER */}
      <AppHeader title="Followers" />
      <FriendBox data={myFollowers} />
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
