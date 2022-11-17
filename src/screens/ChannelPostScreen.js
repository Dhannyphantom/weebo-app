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

import { Context as CharContext } from "../config/CharContext";
import { Context as AuthContext } from "../config/AuthContext";

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

const { width, height } = Dimensions.get("window");

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

const ChannelPostScreen = ({ route, navigation }) => {
  const [page, setPage] = useState({});
  const [imageLoading, setImageLoading] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [popper, setPopper] = useState({ vis: false });
  const [refreshing, setRefreshing] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [popModal, setPopModal] = useState({ topper: false, modal: false });
  const [showUpload, setShowUpload] = useState({ vis: false, data: null });
  const [posts, setPosts] = useState([]);

  const routeId = route.params.id;
  let isSubscribed, isMine, sColor;
  const { getAChannel, updateChannel, subscribeChannel } =
    useContext(CharContext);
  const {
    state: { userInfo },
    updateMe,
  } = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const scrollY = useRef(new Animated.Value(0)).current;

  if (page._id) {
    isSubscribed = page.subscribers.includes(userInfo._id);
    isMine = page.manager._id === userInfo._id;
    sColor = isSubscribed ? colors.heart : colors.medium;
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
      name: "Edit Channel",
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
      onPress: function () {
        console.log("Delete Channel");
      },
    },
  ];
  const headerObj = {
    _id: page._id,
    name: page.name,
    description: page.description,
    cover_photo: page.cover_photo,
    owner: page.manager,
    listItems,
    feedback: {
      instanceID: "1",
      instance: "channel",
      instanceName: "1",
      finder: "1",
      instanceShow: "1",
    },
    screenIcon: "tv",
    coverLoading: imageLoading,
    handleLeftPress: () => handleSub(),
    leftColor: sColor,
    verified: false,
    subscribers: page?.subscribers?.length,
  };
  const handleUploadBtn = async (type) => {
    if (type === "upload") {
      const { _error, results } = await launchGallery("all");

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
          id: page._id,
          name: page.name,
        });
      }
    } else if (type === "write") {
      navigation.navigate("Post", {
        name: page.name,
        type: "channel",
        write: true,
        id: page._id,
      });
    }
  };

  const handleCoverChange = async () => {
    const { results } = await launchGallery("image", true, false, [25, 16]);

    if (results) {
      setImageLoading(true);
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
          setImageLoading(false);
        },
        (err) => {
          setErrMsg(err);
          setPopModal({ topper: false, modal: false });
          setImageLoading(false);
        }
      );
    }
  };

  const handleSub = () => {
    setImageLoading(true);
    const subType = isSubscribed ? "unsub" : "sub";
    subscribeChannel(
      subType,
      page._id,
      (resData) => {
        setPage(resData);
        setImageLoading(false);
      },
      (err) => {
        console.log(err);
        setErrMsg(err);
        setImageLoading(false);
      }
    );
  };

  const handleDescUpdate = (text) => {
    setImageLoading(true);
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
        setImageLoading(false);
        setPopModal({ topper: false, modal: false });
      },
      (err) => {
        setErrMsg(err);
        setImageLoading(false);
      }
    );
  };
  const handleUploadStaus = async () => {
    const { results } = await launchGallery("all", false, false, null, 45);

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
    }
  };

  const handleGetChannel = (cb) => {
    getAChannel(
      routeId,
      (data) => {
        setPage(data.channelData);
        setPosts(data.posts);
        setLoadedOnce(true);
        // console.log(data.posts);
        cb && cb();
      },
      (err) => {
        console.log(err);
        setLoadedOnce(true);
      }
    );
  };

  const handleStatusVisibility = (bool) => {
    if (bool) {
      setPopper({ vis: true, type: "success", msg: "Story uploaded" });
    }
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
          visible={loadedOnce}
          text="No recent posts"
          transparent
        />
        <ActivityIndicator type="spin" visible={!loadedOnce} transparent />
      </View>
    );
  };

  const RenderInstanceMedia = () => {
    return (
      <View
        style={{
          width: width * 0.5,
          backgroundColor: theme.background,
          borderRadius: width * 0.03,
          justifyContent: "center",
          paddingVertical: width * 0.04,
        }}
      >
        <View>
          <TouchableOpacity
            onPress={() => handleCoverChange("cover")}
            activeOpacity={0.8}
            style={{ alignSelf: "center" }}
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
              marginVertical: width * 0.05,
            }}
          >
            <TouchableOpacity
              onPress={() => handleUploadBtn("write")}
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
            style={{ alignSelf: "center" }}
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

  useEffect(() => {
    handleGetChannel();
  }, []);

  const renderPageLikeSo = ({ item }) => {
    const isEvent = item.hasOwnProperty("challengersNum");

    if (isEvent) {
      return (
        <EventRender
          eventData={item}
          userID={userInfo._id}
          renderType="single"
          updateMe={updateMe}
        />
      );
    } else {
      return (
        <View style={{ bottom: 45 }}>
          <FeedRender item={item} user={userInfo._id} />
        </View>
      );
    }
  };

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
          {/* MAKE A HEADER SHOW ANIMATION IN  THIS SCREEN */}
          <Animated.FlatList
            ListHeaderComponent={
              <InstanceHeader scrollY={scrollY} instanceData={headerObj} />
            }
            data={posts}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            contentContainerStyle={{ paddingBottom: height * 0.04 }}
            overScrollMode="never"
            refreshControl={
              <RefreshControl
                progressBackgroundColor={theme.extralight}
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={handleScreenRefresh}
              />
            }
            keyExtractor={(item, index) => item._id + index}
            renderItem={renderPageLikeSo}
          />
          <StickyHeader scrollY={scrollY} title={page.name} />
        </>
      ) : (
        <ActivityIndicator type="spin" visible={true} />
      )}
      <ShowUpload visObj={showUpload} setVisible={handleStatusVisibility} />
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

      <AppFadeIn
        visible={openMedia}
        RenderComponent={RenderInstanceMedia}
        setVisible={setOpenMedia}
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
  newEventBtn: {},

  link: {
    width: "90%",
    alignSelf: "center",
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
