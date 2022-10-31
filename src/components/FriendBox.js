import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Context as AuthContext } from "../config/AuthContext";

import Avatar from "./Avatar";
import colors from "../constants/colors";
import AppText from "./AppText";
import AppButton from "./AppButton";
import ActivityIndicator from "./ActivityIndicator";
import ThemeContext from "../config/ThemeContext";

const { width } = Dimensions.get("window");

const FriendBox = ({
  data,
  onPress,
  type = "weeb",
  typeObj,
  callback,
  friended,
  updateThisInstance,
  instanceLogic,
  length = 0.95,
}) => {
  const [errMsg, setErrMsg] = useState(null);
  const {
    addWeeb,
    instanceTransfer,
    updateMe,
    state: { userInfo },
  } = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const RenderMyFriends = ({ item, isMine, isFriends }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [added, setAdded] = useState(isFriends);

    const handleUnweebing = (userID, isFriends) => {
      setIsLoading(true);
      if (isFriends) {
        //unWeeb
        addWeeb(
          {
            id: userID,
            type: "remove",
          },
          (resData) => {
            //resData = [] of friends
            // updateMe({ data: resData, prop: "friends" });
            setAdded(false);
            setErrMsg(null);
            setIsLoading(false);
            callback && callback();
          },
          (err) => {
            setIsLoading(false);
            setErrMsg(err);
            callback && callback();
          }
        );
      } else {
        // add weeb
        addWeeb(
          {
            id: userID,
            type: "add",
          },
          (resData) => {
            // updateMe({ data: resData, prop: "friends" });
            setAdded(true);
            setErrMsg(null);
            setIsLoading(false);
            callback && callback();
          },
          (err) => {
            setIsLoading(false);
            setErrMsg(err);
            callback && callback();
          }
        );
      }
    };

    const handleInstanceTransfer = (itemId) => {
      setIsLoading(true);
      const actionObj = {
        to: itemId,
        ...typeObj,
      };
      instanceTransfer(
        actionObj,
        (resData) => {
          updateThisInstance("manager", resData.curr_manager);
          typeObj.instance === "character" &&
            updateMe(resData.prev_manager, "charactersOwned");
          instanceLogic.setVisible && instanceLogic.setVisible(false);
          instanceLogic.setter && instanceLogic.setter();
          setIsLoading(false);
        },
        (err) => {
          setIsLoading(false);
          instanceLogic.setErrMsg(err);
        }
      );
    };

    return (
      <TouchableOpacity
        activeOpacity={onPress ? 0.9 : 1}
        onPress={onPress ? () => onPress(item) : null}
        style={{ ...styles.container, width: width * length }}
      >
        <View style={[styles.friend, { backgroundColor: theme.background }]}>
          <Avatar
            size={45}
            avatar={item.avatar}
            borderRad={100}
            name={item.username}
            feederID={item._id}
          />
          <View style={styles.rightCont}>
            <MaterialCommunityIcons
              name="account-group"
              size={15}
              color={colors.medium}
            />
            {item.followers && <AppText> {item.followers.length} </AppText>}
            {!isLoading ? (
              <>
                {type === "weeb" && (
                  <AppButton
                    title={isMine ? null : added ? "Unweeb" : "Add Weeb"}
                    onPress={() => handleUnweebing(item._id, added)}
                    naked
                    style={styles.btn}
                  />
                )}
                {type === "transfer" && (
                  <AppButton
                    title="Transfer"
                    onPress={() => handleInstanceTransfer(item._id)}
                    naked
                    style={styles.btn}
                  />
                )}
                {type === "share" && (
                  <AppButton
                    title="Share"
                    onPress={() => callback(item)}
                    naked
                    style={styles.btn}
                  />
                )}
              </>
            ) : (
              <View style={{ height: 20 }}>
                <ActivityIndicator type="spin" size={0.2} visible={isLoading} />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFriends = ({ item }) => {
    let isFriends = friended;

    const finder = userInfo?.friends?.find((obj) => obj._id == item._id);
    let isMine = item._id == userInfo._id;

    if (finder && friended) {
      isFriends = true;
    }
    return (
      <RenderMyFriends item={item} isMine={isMine} isFriends={isFriends} />
    );
  };
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      renderItem={renderFriends}
    />
  );
};
const styles = StyleSheet.create({
  btn: {
    marginLeft: 20,
  },
  container: {
    margin: 4,
    alignSelf: "center",
  },
  friend: {
    elevation: 3,
    shadowRadius: 6,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 1.8,
    },
    borderRadius: 100,
    padding: 10,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },
  rightCont: {
    flexDirection: "row",
    alignItems: "center",
  },
});
export default FriendBox;
