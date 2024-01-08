import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid";

import { Context as CharContext } from "../config/CharContext";
import { Context as AuthContext } from "../config/AuthContext";
import { Context as FeedContext } from "../config/FeedContext";

import colors from "../constants/colors";
import ActivityIndicator from "../components/ActivityIndicator";
import EventRender from "../components/EventRender";
import ShowUpload from "../components/ShowUpload";
import InstanceHeader from "../components/InstanceHeader";
import PopMessage from "../components/PopMessage";
import AppFadeIn from "../components/AppFadeIn";
import AppText from "../components/AppText";
import FeedRender from "../components/FeedRender";
import GrowInput from "../components/GrowInput";
import StickyHeader from "../components/StickyHeader";
import ThemeContext from "../config/ThemeContext";
import PopDropDown from "../components/PopDropDown";
import Link from "../components/Link";
import Separator from "../components/Separator";
import AppButton from "../components/AppButton";
import { launchGallery } from "../constants/helpers";
import AlertModal from "../components/AlertModal";
import { ADS_INTERVAL } from "../constants/data_store";
import BannerAds from "../components/BannerAds";
import RenderLoadMore from "../components/RenderLoadMore";
import FriendBox from "../components/FriendBox";

const { width, height } = Dimensions.get("window");

const boolsObj = {
  reloadLoader: false,
  imageLoading: false,
  loadedOnce: false,
  loadMore: true,
  subscribers: false,
  hash: uuid.v4(),
};

const deletePrompt = {
  visible: false,
  title: "Delete Channel",
  message:
    "You will lose all data and subscribers!. Type in channel name to delete?",
  btn: "DELETE",
  type: "delete_channel",
};

const UpdateDecription = ({ visible, description, handleDescUpdate }) => {
  const theme = useContext(ThemeContext);

  const [text, setText] = useState(description ?? "");

  if (!visible) return null;
  return (
    <View style={styles.updateContainer}>
      <View style={[styles.update, { backgroundColor: theme.background }]}>
        <AppText style={styles.updateHeader} size="large" bold>
          Update Channel Description
        </AppText>
        <Separator h={2} />
        <View>
          <GrowInput text={text} setText={setText} />
          <AppButton
            style={styles.updateBtn}
            title="Update"
            bare
            onPress={() => handleDescUpdate(text)}
          />
        </View>
      </View>
    </View>
  );
};

const RenderSubscribers = ({ fetcher, channelId }) => {
  const [subscribers, setSubscribers] = useState({ results: [] });
  const [bools, setBools] = useState({
    loading: true,
    loadMore: false,
    isLoading: false,
  });

  const fetchSubscribers = (type) => {
    fetcher(
      {
        channelId,
        page: type == "load" ? 1 : subscribers?.next?.page,
        limit: 50,
      },
      (resData) => {
        if (type == "more") {
          setSubscribers({
            ...resData,
            results: subscribers.results.concat(resData.results),
          });
        } else {
          setSubscribers(resData);
        }
        setBools({ ...bools, loading: false });
      }
    );
  };

  useEffect(() => {
    fetchSubscribers("load");
  }, []);

  return (
    <View style={styles.subContainer}>
      <FriendBox
        data={subscribers}
        scrollLoad={{
          loadMore: bools.loadMore,
          isLoading: bools.isLoading,
          onLoadMore: () => {
            if (subscribers?.hasOwnProperty("next")) {
              fetchSubscribers("more");
            } else {
              setBools({ ...bools, loadMore: false });
            }
          },
        }}
      />
      <ActivityIndicator visible={bools.loading} absolute transparent />
    </View>
  );
};

const ChannelPostScreen = ({ route, navigation }) => {
  const [page, setPage] = useState({});
  const [openMedia, setOpenMedia] = useState(false);
  const [bools, setBools] = useState(boolsObj);
  const [popper, setPopper] = useState({ vis: false });
  const [refreshing, setRefreshing] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [prompt, setPrompt] = useState(deletePrompt);
  const [popModal, setPopModal] = useState({ topper: false, modal: false });
  const [showUpload, setShowUpload] = useState({ vis: false, data: null });
  const [posts, setPosts] = useState({});

  const routeId = route.params.id;
  let isSubscribed, isMine;
  const {
    getAChannel,
    fetchChannelSubscribers,
    deleteChannel,
    updateChannel,
    subscribeChannel,
  } = useContext(CharContext);
  const {
    state: { uploadStatus },
  } = useContext(FeedContext);
  const {
    updateMe,
    state: { userInfo },
  } = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const scrollY = useRef(new Animated.Value(0)).current;

  if (page._id) {
    isSubscribed = page.subscribers.includes(userInfo._id);
    isMine = page.manager._id === userInfo._id;
  }

  const listItems = [
    {
      id: "5078",
      name: "upload media",
      onPress: () => setOpenMedia(!openMedia),
      icon: "upload",
      show: isMine,
      selected: true,
    },
    {
      id: "3",
      name: "New event",
      onPress: () =>
        navigation.navigate("Event", {
          instance: "channel",
          instanceID: page?._id,
          followers: page?.subscribers?.length,
        }),
      icon: "plus",
      selected: true,
      show: isMine,
    },
    {
      id: "35",
      name: isSubscribed ? "Unsubscribe" : "Subscribe",
      onPress: () => handleSub(),
      icon: "account-star",
      selected: isSubscribed,
      show: !isMine,
    },
    {
      id: "2",
      name: "Update Channel",
      onPress: () => setPopModal({ modal: true, topper: false }),
      selected: true,
      icon: "circle-edit-outline",
      show: isMine,
    },
  ];

  const popData = [
    {
      id: "1",
      title: "Edit Channel Cover",
      icon: "image",
      onPress: () => handleCoverChange(),
    },
    {
      id: "2",
      title: "Update description",
      icon: "pencil",
      toggle: true,
      onPress: () => setPopModal({ ...popModal, topper: true }),
    },
    {
      id: "3",
      title: "Delete channel",
      icon: "trash-can",
      onPress: () => {
        setPopModal({ ...popModal, modal: false });
        setPrompt({ ...deletePrompt, visible: true });
      },
    },
  ];

  const screenAlias = `channel@${page?._id}`;

  const headerObj = {
    _id: page._id,
    name: page.name,
    description: page.description,
    cover_photo: page.cover_photo,
    owner: page.manager,
    screenAlias,
    // screenAlias: ["ChannelPost", "channel"],
    listItems,
    feedback: {
      instanceID: "1",
      instance: "channel",
      instanceName: "1",
      finder: "1",
      instanceShow: "1",
    },
    screenIcon: "tv",
    coverLoading: bools.imageLoading,
    handleLeftPress: () => handleSub(),
    handleRightPress: () => setBools({ ...bools, subscribers: true }),
    leftColor: isSubscribed,
    verified: false,
    subscribers: page?.subscribers?.length,
  };

  const handleUploadBtn = async (type) => {
    if (type === "upload") {
      const { _error, results } = await launchGallery("all", true);

      if (_error) {
        return setPopper({
          type: "failed",
          msg: _error,
          vis: true,
        });
      } else if (results) {
        setOpenMedia(false);
        navigation.navigate("Post", {
          assets: results,
          type: "channel",
          toScreen: "ChannelPost",
          hash: bools.hash,
          screenAlias,
          toScreenData: { id: page?._id },
          id: page._id,
          name: page.name,
        });
      }
    } else if (type === "write") {
      navigation.navigate("Post", {
        name: page.name,
        type: "channel",
        toScreen: "ChannelPost",
        screenAlias,
        hash: bools.hash,
        toScreenData: { id: page?._id },
        write: true,
        id: page._id,
      });
    }
  };

  const handleCoverChange = async () => {
    const { results } = await launchGallery("image", true, false, [25, 16]);

    if (results) {
      setBools({ ...bools, imageLoading: true });
      const dataObj = {
        action: "cover",
        media: true,
        actionData: results[0],
        channel: page._id,
      };

      updateChannel(
        dataObj,
        (data) => {
          setPage(data);
          setPopModal({ topper: false, modal: false });
          setBools({ ...bools, imageLoading: false });
        },
        (err) => {
          setErrMsg(err);
          setPopModal({ topper: false, modal: false });
          setBools({ ...bools, imageLoading: false });
        }
      );
    }
  };

  const handleSub = () => {
    setBools({ ...bools, imageLoading: true });
    const subType = isSubscribed ? "unsub" : "sub";
    subscribeChannel(
      subType,
      page._id,
      (resData) => {
        setPage(resData);
        setBools({ ...bools, imageLoading: false });
      },
      (err) => {
        setErrMsg(err);
        setBools({ ...bools, imageLoading: false });
      }
    );
  };

  const handleDescUpdate = (text) => {
    setBools({ ...bools, imageLoading: true });
    const dataObj = {
      action: "description",
      media: false,
      actionData: text,
      channel: page._id,
    };
    updateChannel(
      dataObj,
      (data) => {
        setPage(data);
        setBools({ ...bools, imageLoading: false });
        setPopModal({ topper: false, modal: false });
      },
      (err) => {
        setErrMsg(err);
        setBools({ ...bools, imageLoading: false });
      }
    );
  };

  const handlePrompts = () => {
    switch (prompt.type) {
      case "delete_channel":
        setBools({ ...bools, imageLoading: true });
        deleteChannel(
          page._id,
          (resData) => {
            setBools({ ...bools, imageLoading: false });
            navigation.navigate("Channel", { reload: true });
          },
          (errData) => {
            setBools({ ...bools, imageLoading: false });
          }
        );

        break;

      default:
        break;
    }
  };

  const handleUploadStaus = async () => {
    const { results, _error } = await launchGallery(
      "all",
      false,
      false,
      null,
      45
    );

    if (results) {
      // setIsCoverLoading(true);
      const statusObj = {
        instance: "channel",
        instanceID: page._id,
        post: {
          ...results[0],
        },
      };

      setShowUpload({ vis: true, data: statusObj });
    } else if (_error) {
      setPopper({
        vis: true,
        type: "failed",
        msg: _error,
        timer: 3,
      });
    }
  };

  const handleGetChannel = (cb, page, shouldConcat) => {
    getAChannel(
      { id: routeId, page: page ?? 1, limit: 15 },
      (data) => {
        if (shouldConcat) {
          setPosts({
            ...data.posts,
            results: posts?.results?.concat(data.posts.results),
            event: data.event,
          });
        } else {
          setPosts({ ...data.posts, event: data.event });
        }
        setPage(data.channelData);
        !bools.loadedOnce && setBools({ ...bools, loadedOnce: true });
        cb && cb();
      },
      (err) => {
        !bools.loadedOnce && setBools({ ...bools, loadedOnce: true });
      }
    );
  };

  const handleEndReached = (cb) => {
    if (posts.hasOwnProperty("next")) {
      handleGetChannel(cb, posts.next.page, true);
    } else {
      if (bools.loadMore) {
        setBools({ ...bools, loadMore: false });
      }
    }
  };

  const handleStatusVisibility = (bool) => {
    if (bool) {
      setPopper({ vis: true, type: "success", msg: "Story uploaded" });
    }
    setOpenMedia(false);
    setShowUpload({ vis: false, data: null });
  };

  const handleScreenRefresh = () => {
    setRefreshing(true);
    handleGetChannel(() => setRefreshing(false));
  };

  const EditChannel = () => {
    return (
      <View style={{ paddingBottom: 40 }}>
        {popData.map((item, idx) => (
          <Link
            name={item.title}
            iconName={item.icon}
            key={item + idx}
            onPress={item.onPress}
            style={styles.link}
          />
        ))}
      </View>
    );
  };

  const ListEmpty = () => {
    return (
      <View style={{ flex: 1, height: height * 0.35 }}>
        <ActivityIndicator
          type="isEmpty"
          visible={bools.loadedOnce}
          text="No recent posts"
          transparent
        />
        <ActivityIndicator
          type="spin"
          visible={!bools.loadedOnce}
          transparent
        />
      </View>
    );
  };

  const RenderInstanceMedia = () => {
    return (
      <View style={{ ...styles.modal, backgroundColor: theme.background }}>
        <View>
          <TouchableOpacity
            onPress={() => handleCoverChange("cover")}
            activeOpacity={0.8}
            style={styles.modalItem}
          >
            <Feather name="user" size={width * 0.1} color={colors.primary} />
            <AppText style={{ textAlign: "center" }} bold>
              Cover
            </AppText>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              marginVertical: width * 0.065,
            }}
          >
            <TouchableOpacity
              onPress={() => handleUploadBtn("write")}
              style={styles.modalItem}
              activeOpacity={0.8}
            >
              <Ionicons
                name="text-outline"
                size={width * 0.1}
                color={colors.primary}
              />

              <AppText style={{ textAlign: "center" }} bold>
                Write Post
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleUploadBtn("upload")}
              activeOpacity={0.8}
              style={styles.modalItem}
            >
              <Ionicons
                name="camera-outline"
                size={width * 0.1}
                color={colors.primary}
              />

              <AppText style={{ textAlign: "center" }} bold>
                New Post
              </AppText>
            </TouchableOpacity>
          </View>
          {/*  */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.modalItem}
            onPress={handleUploadStaus}
          >
            <Ionicons
              name="ellipse-outline"
              size={width * 0.1}
              color={colors.primary}
            />

            <AppText style={{ textAlign: "center" }} bold>
              Story
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPageLikeSo = ({ item, index }) => {
    if (index === 0) {
      return (
        <>
          <View style={{ bottom: 45 }}>
            {posts.event && (
              <EventRender
                eventData={posts.event}
                isFollowing={isSubscribed}
                userID={userInfo._id}
                renderType="single"
                updateMe={updateMe}
              />
            )}
            <FeedRender item={item} user={userInfo._id} />
          </View>
        </>
      );
    } else if ((index + 1) % ADS_INTERVAL === 0) {
      return (
        <View style={{ bottom: 45 }}>
          <BannerAds />
          <FeedRender item={item} user={userInfo._id} />
        </View>
      );
    } else {
      return (
        <View style={{ bottom: 45 }}>
          <FeedRender item={item} user={userInfo._id} />
        </View>
      );
    }
  };

  useEffect(() => {
    handleGetChannel();
  }, []);

  useEffect(() => {
    if (bools.loadedOnce && uploadStatus?.error && uploadStatus?.hasStarted) {
      setPopper({
        vis: true,
        type: "failed",
        msg: "Upload failed due to network error",
        cb: () => setBools({ ...bools, hash: uuid.v4() }),
        timer: 10,
      });
    }
  }, [uploadStatus]);

  useEffect(() => {
    if (bools.loadedOnce && route?.params?.reloadPosts) {
      uploadStatus?.hasFinished &&
        uploadStatus?.hasStarted &&
        uploadStatus?.hash == bools.hash &&
        !uploadStatus?.error &&
        handleGetChannel(() => {
          setPopper({
            vis: true,
            type: "success",
            msg: "Media Uploaded!",
            timer: 3,
            cb: () => setBools({ ...bools, hash: uuid.v4() }),
          });
        });
    }
  }, [navigation, route, uploadStatus]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundExtralight },
      ]}
    >
      <StatusBar style={theme.bar} />

      {page._id ? (
        <>
          <Animated.FlatList
            ListHeaderComponent={
              <>
                <InstanceHeader
                  borderBottom
                  scrollY={scrollY}
                  instanceData={headerObj}
                />
              </>
            }
            data={posts.results}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            contentContainerStyle={{ paddingBottom: height * 0.1 }}
            ListFooterComponent={() => (
              <RenderLoadMore
                hasNext={posts.hasOwnProperty("next")}
                loader={bools.loadMore}
              />
            )}
            overScrollMode="never"
            onEndReached={handleEndReached}
            refreshControl={
              <RefreshControl
                progressBackgroundColor={theme.extralight}
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={handleScreenRefresh}
              />
            }
            ListEmptyComponent={ListEmpty}
            keyExtractor={(item, index) => item._id + index}
            renderItem={renderPageLikeSo}
          />
          <StickyHeader scrollY={scrollY} title={page.name} />
        </>
      ) : (
        <ActivityIndicator type="spin" visible={true} />
      )}
      <ShowUpload
        visObj={showUpload}
        setVisible={handleStatusVisibility}
        hash={{
          value: bools.hash,
          setter: () => setBools({ ...bools, hash: uuid.v4() }),
        }}
      />
      <PopDropDown
        visible={popModal.modal}
        setter={() => setPopModal({ topper: false, modal: false })}
        TopperComponent={() => (
          <UpdateDecription
            description={page?.description}
            visible={popModal.topper}
            handleDescUpdate={handleDescUpdate}
          />
        )}
        headerTitle="Channel Actions"
        RenderComponent={() => <EditChannel />}
      />

      <PopDropDown
        visible={bools.subscribers}
        setter={() => setBools({ ...bools, subscribers: false })}
        headerTitle="Subscribers"
        containerStyle={{ minHeight: height * 0.6 }}
        RenderComponent={() => (
          <RenderSubscribers
            fetcher={fetchChannelSubscribers}
            channelId={page?._id}
          />
        )}
      />

      <AppFadeIn
        visible={openMedia}
        RenderComponent={RenderInstanceMedia}
        setVisible={setOpenMedia}
      />
      <AlertModal
        obj={prompt}
        setVisible={setPrompt}
        verifyPrompt={page?.name}
        onPress={handlePrompts}
      />

      <PopMessage
        popData={popper}
        timer={0.1}
        setter={() => setPopper({ vis: false })}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  btnCont: {
    flex: 1,
    width: width,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container: {
    flex: 1,
  },
  error: {
    textAlign: "center",
    color: colors.heart,
    marginVertical: 5,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    bottom: 130 / 2,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  imageContaineer: {
    width: width,
    height: height * 0.4,
  },

  headerBoxCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  modal: {
    width: width * 0.68,
    borderRadius: width * 0.03,
    justifyContent: "center",
    paddingVertical: width * 0.04,
  },
  modalItem: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  newEventBtn: {},

  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  link: {
    width: "90%",
    alignSelf: "center",
  },
  subContainer: {
    flex: 1,
  },
  updateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  update: {
    width: width * 0.94,
    paddingTop: 15,
    paddingBottom: 40,
    borderRadius: 20,
  },
  updateHeader: {
    textAlign: "center",
  },
  updateBtn: {
    alignSelf: "center",
    marginTop: 20,
  },
  uploadBtn: {
    marginTop: 6,
  },
});
export default ChannelPostScreen;
