import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";

import { Context as CharContext } from "../config/CharContext";
import { Context as AuthContext } from "../config/AuthContext";

import Feed from "../components/Feed";
import colors from "../constants/colors";
import ActivityIndicator from "../components/ActivityIndicator";
import Events from "../components/Events";
import PopDownModal from "../components/PopDownModal";
import EventRender from "../components/EventRender";
import ShowUpload from "../components/ShowUpload";
import InstanceHeader from "../components/InstanceHeader";
import PopMessage from "../components/PopMessage";
import AppFadeIn from "../components/AppFadeIn";
import AppText from "../components/AppText";
import vidMaxChecker from "../constants/vidMaxChecker";
import FeedRender from "../components/FeedRender";
import Screen from "../components/Screen";
import StickyHeader from "../components/StickyHeader";
import ThemeContext from "../config/ThemeContext";

const { width, height } = Dimensions.get("window");

const ChannelPostScreen = ({ route, navigation }) => {
  const [page, setPage] = useState({});
  const [imageLoading, setImageLoading] = useState(false);
  const [showHead, setShowHead] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [popper, setPopper] = useState({ vis: false });
  const [refreshing, setRefreshing] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [popModal, setPopModal] = useState(false);
  const [showUpload, setShowUpload] = useState({ vis: false, data: null });
  const [posts, setPosts] = useState([]);

  const handleLeaveport = (type) => {
    type === "l" && setShowHead(true);
    type === "e" && setShowHead(false);
  };

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
    isMine = page.owner._id === userInfo._id;
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
      onPress: () => setPopModal(true),
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
      onPress: handleCoverChange,
    },
    {
      id: "2",
      title: "Update description",
      icon: "pencil",
      toggle: true,
      onPress: null,
    },
    {
      id: "3",
      title: "Delete channel",
      icon: "trash-can",
      onPress: function () {
        console.log("Edit Cover");
      },
    },
  ];
  const headerObj = {
    _id: page._id,
    name: page.name,
    description: page.description,
    cover_photo: page.cover_photo,
    owner: page.owner,
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
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
      });
      if (!res.cancelled) {
        const { bool, vidErr } = vidMaxChecker(res.duration, 5);
        if (bool) {
          return setPopper({
            type: "failed",
            msg: vidErr,
            vis: true,
          });
        }
        setOpenMedia(false);
        navigation.navigate("Post", {
          uri: res,
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
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [25, 16],
    });

    if (!res.cancelled) {
      setImageLoading(true);
      const dataObj = {
        action: "cover",
        media: true,
        actionData: res,
        channel: page._id,
      };

      updateChannel(
        dataObj,
        (data) => {
          setPage(data);
          setPopModal(false);
          setImageLoading(false);
        },
        (err) => {
          setErrMsg(err);
          setPopModal(false);
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
        setPopModal(false);
      },
      (err) => {
        setErrMsg(err);
      }
    );
  };
  const handleUploadStaus = async () => {
    // TODO:: UPDATE ONY THE COVER FIELD IN THE CHARACTER OBJ
    // MEANS YOU WANT TO GRAB THE IMAGE FROM GALLERY
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      videoMaxDuration: 30,
    });

    if (!res.cancelled) {
      // setIsCoverLoading(true);
      const statusObj = {
        instance: "channel",
        instanceID: page._id,
        post: {
          ...res,
        },
      };
      delete statusObj.post.cancelled;

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
      setPopper({ vis: true, type: "success", msg: "Status uploaded" });
    }
    setShowUpload({ vis: false, data: null });
  };

  const handleScreenRefresh = () => {
    setRefreshing(true);
    handleGetChannel(() => setRefreshing(false));
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
          backgroundColor: colors.white,
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
      <StatusBar style="dark" />
      {page._id ? (
        <>
          {/* MAKE A HEADER SHOW ANIMATION IN  THIS SCREEN */}
          <Animated.FlatList
            ListHeaderComponent={
              <InstanceHeader scrollY={scrollY} instanceData={headerObj} />
            }
            data={posts}
            refreshing={refreshing}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            contentContainerStyle={{ paddingBottom: height * 0.04 }}
            overScrollMode="never"
            onRefresh={handleScreenRefresh}
            keyExtractor={(item, index) => item._id + index}
            renderItem={renderPageLikeSo}
          />
          <StickyHeader scrollY={scrollY} title={page.name} />
        </>
      ) : (
        <ActivityIndicator type="spin" visible={true} />
      )}
      {/* {showHead && <Sticker title={page.name} icon="tv" />} */}
      <ShowUpload visObj={showUpload} setVisible={handleStatusVisibility} />
      <PopDownModal
        visible={popModal}
        setVisible={setPopModal}
        data={popData}
        handleDone={(data) => handleDescUpdate(data)}
        text={page.description}
        title="Channel Action"
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

  uploadBtn: {
    marginTop: 6,
  },
});
export default ChannelPostScreen;
