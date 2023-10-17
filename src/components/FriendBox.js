import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";

import { Context as AuthContext } from "../config/AuthContext";

import Avatar from "./Avatar";
import colors from "../constants/colors";
import AppText from "./AppText";
import AppButton from "./AppButton";
import ActivityIndicator from "./ActivityIndicator";
import ThemeContext from "../config/ThemeContext";
import AlertModal from "./AlertModal";
import RenderLoadMore from "./RenderLoadMore";

const { width } = Dimensions.get("window");
const transferPrompt = (user, itemId) => ({
  visible: true,
  message: `Are you sure you want to transfer instance to ${user ?? ""}`,
  btn: "PROCEED",
  title: "Transfer Instance",
  type: "transfer",
  data: itemId,
});

const RenderMyFriends = ({
  item,
  isMine,
  type,
  onPress,
  callback,
  setPrompt,
  length,
  isFriends,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState(isFriends);
  const [status, setStatus] = useState(item.status);
  const [errMsg, setErrMsg] = useState(null);

  const { addWeeb, requestWeeb } = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const handleUnweebing = (userID, _isFriends) => {
    setIsLoading(true);
    setErrMsg(null);
    if (_isFriends) {
      //unWeeb
      addWeeb(
        {
          id: userID,
          type: "remove",
        },
        (_resData) => {
          //resData = [] of friends
          // updateMe({ data: resData, prop: "friends" });
          setAdded(false);
          setStatus("request");
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
      // add or accept weeb
      addWeeb(
        {
          id: userID,
          type: "add",
        },
        (_resData) => {
          // updateMe({ data: resData, prop: "friends" });
          setAdded(true);
          setIsLoading(false);
          setStatus("un-weeb");
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

  const weebActions = () => {
    setIsLoading(true);
    switch (status) {
      case "request":
        requestWeeb(
          { id: item._id, type: "add" },
          (_data) => {
            setStatus("un-request");
            setIsLoading(false);
          },
          (err) => setErrMsg(err)
        );
        break;
      case "un-request":
        requestWeeb(
          { id: item._id, type: "remove" },
          (_data) => {
            setStatus("request");
            setIsLoading(false);
          },
          (err) => setErrMsg(err)
        );
        break;
      case "un-weeb":
        handleUnweebing(item._id, true);
        break;
      default:
        break;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.9 : 1}
      disabled={["requests", "pending"].includes(type)}
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
          gender={item.gender}
        />
        <View style={styles.rightCont}>
          {item.followers && (
            <>
              <MaterialCommunityIcons
                name="account-group"
                size={15}
                color={colors.medium}
              />
              <AppText> {item.followers.length} </AppText>
            </>
          )}
          {!isLoading ? (
            <>
              {type === "weeb" && (
                <>
                  {status ? (
                    <AppButton
                      title={status}
                      onPress={weebActions}
                      naked
                      style={styles.btn}
                    />
                  ) : (
                    <AppButton
                      title={isMine ? null : added ? "Unweeb" : "Request"}
                      onPress={() => handleUnweebing(item._id, added)}
                      naked
                      style={styles.btn}
                    />
                  )}
                </>
              )}
              {type === "request" && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      onPress
                        ? onPress(item._id, "accept")
                        : handleUnweebing(item._id, false)
                    }
                    style={styles.requestBtn}
                  >
                    <AntDesign name="check" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      onPress
                        ? onPress(item._id, "decline")
                        : handleUnweebing(item._id, true)
                    }
                    style={styles.requestBtn}
                  >
                    <MaterialCommunityIcons
                      name="cancel"
                      size={18}
                      color={colors.heartDark}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {type === "transfer" && (
                <AppButton
                  title="Transfer"
                  onPress={() =>
                    setPrompt(transferPrompt(item.username, item._id))
                  }
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
              {type === "pending" && (
                <View style={styles.rightCont}>
                  <TouchableOpacity
                    onPress={() =>
                      setPrompt({
                        visible: true,
                        title: "Cancel Request",
                        message:
                          "Are sure you want to cancel this weeb request?",
                        btn: "YES",
                        type: "cancel_weeb_requests",
                        data: item._id,
                      })
                    }
                    style={{
                      padding: 10,
                      paddingHorizontal: 18,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="cancel"
                      color={colors.heartLight}
                      size={30}
                    />
                  </TouchableOpacity>
                  <AppText style={styles.pending} bold size="small">
                    pending...
                  </AppText>
                </View>
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

const FriendBox = ({
  data,
  onPress,
  type = "weeb",
  typeObj,
  callback,
  friended,
  scrollLoad,
  updateThisInstance,
  instanceLogic,
  length = 0.95,
}) => {
  const [prompt, setPrompt] = useState({ visible: false });
  const [bools, setBools] = useState({ loading: false });
  const [refreshing, setRefreshing] = useState(false);

  const theme = useContext(ThemeContext);
  const {
    addWeeb,
    instanceTransfer,
    updateMe,
    state: { userInfo },
  } = useContext(AuthContext);

  const handleInstanceTransfer = (itemId) => {
    setBools({ ...bools, loading: true });
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
        setBools({ ...bools, loading: true });
      },
      (err) => {
        setBools({ ...bools, loading: true });
        instanceLogic.setErrMsg(err);
      }
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
      <RenderMyFriends
        item={item}
        callback={callback}
        setPrompt={setPrompt}
        length={length}
        onPress={onPress}
        type={type}
        isMine={isMine}
        isFriends={isFriends}
      />
    );
  };

  const handlePrompts = () => {
    switch (prompt.type) {
      case "transfer":
        handleInstanceTransfer(prompt.data);
        break;
      case "cancel_weeb_requests":
        if (!prompt.data) return;
        addWeeb(
          {
            id: prompt?.data,
            type: "remove_pending",
          },
          (_resData) => {
            callback && callback();
          },
          (_err) => {
            callback && callback();
          }
        );

        break;
    }
  };

  const onEndReached = () => {
    if (!Boolean(scrollLoad)) return;

    scrollLoad?.onLoadMore();
  };

  const onRefresh = () => {
    setRefreshing(true);
    callback && callback(null, () => setRefreshing(false));
  };

  return (
    <>
      <FlatList
        data={Boolean(scrollLoad) ? data?.results : data}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={renderFriends}
        onEndReached={onEndReached}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={theme.extralight}
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListFooterComponent={() => {
          if (!scrollLoad?.isLoading)
            return (
              <RenderLoadMore
                loader={scrollLoad?.loadMore}
                hasNext={data?.hasOwnProperty("next")}
                text="weebs"
              />
            );
        }}
      />
      <ActivityIndicator
        type="spin"
        visible={bools.loading}
        absolute
        transparent
      />
      <AlertModal obj={prompt} setVisible={setPrompt} onPress={handlePrompts} />
    </>
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
    borderWidth: 1.8,
    borderColor: "#ddd",
    padding: 10,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },
  pending: {
    color: colors.medium,
    marginRight: 20,
  },
  rightCont: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  requestBtn: {
    height: "100%",
    padding: 15,
    marginHorizontal: 3,
  },
});
export default FriendBox;
