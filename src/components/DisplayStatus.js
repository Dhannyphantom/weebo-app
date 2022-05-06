import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Viewport } from "@skele/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { Feather } from "@expo/vector-icons";
import { Context as AuthContext } from "../config/AuthContext";
import { Context as FeedContext } from "../config/FeedContext";
import AppText from "./AppText";
import colors from "../constants/colors";
import ProfilePic from "./ProfilePic";
import getTimestamp from "../constants/getTimestamp";
import ActivityIndicator from "./ActivityIndicator";
import Screen from "./Screen";
import PostVideo from "./PostVideo";
const ViewportView = Viewport.Aware(View);

const { width, height } = Dimensions.get("window");
const CIRCLER = width * 0.1;
const SCROLL_INTERVAL = height + height * 0.06;
const viewabilityConfig = {
  waitForInteraction: false,
  minimumViewTime: 30,
  viewAreaCoveragePercentThreshold: 50,
};

export default function DisplayStatus({ modalObj, setVisible }) {
  const [active, setActive] = useState({ key: null, duration: 5000 });

  const safeInsets = useSafeAreaInsets();
  const headerScroll = useRef(null);
  const listScrollRef = useRef(null);

  const modalData = modalObj?.data?.all;
  const statuses = modalObj?.data?.posts;

  const handleCloseModal = () => {
    setVisible({ vis: false, data: null });
  };

  const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    if (!viewableItems[0]) {
      // maybe the first screen
      setActive({ key: null, duration: 5000 });
    } else if (viewableItems[0]?.item?.type === "video") {
      // a video so play video
      setActive({
        key: viewableItems[0]?.key,
        duration: viewableItems[0]?.item?.durationMillis ?? 5000,
      });
    } else if (viewableItems[0]?.item?.type === "image") {
      // an image so pause video
      setActive({
        key: viewableItems[0]?.key,
        duration: viewableItems[0]?.item?.durationMillis ?? 5000,
      });
    }
  }).current;

  const renderModalList = ({ item, index }) => {
    return <RenderModalList item={item} idx={index} activeItem={active?.key} />;
  };

  const renderHeaderList = ({ item }) => {
    return <RenderHeaderList item={item} />;
  };

  const RenderModalList = ({ item, activeItem, idx }) => {
    const timer = item?.durationMillis == 0 ? 5000 : item.durationMillis;
    const lottieRef = useRef(null);
    const isKey = activeItem == item._id;

    const handleAnimFinish = () => {
      listScrollRef.current?.scrollToOffset({
        animated: true,
        offset: SCROLL_INTERVAL * (idx + 1),
      });
    };

    useEffect(() => {
      if (isKey) {
        lottieRef?.current?.play();
      }
    }, [activeItem]);

    return (
      <View>
        <View style={{ ...styles.itemContainer, top: safeInsets.top }}>
          <View style={styles.mediaContainer}>
            <View
              style={{
                ...styles.mediaCont,
                aspectRatio: item?.width / item?.height,
              }}
            >
              {item?.type === "image" && (
                <>
                  <Image
                    source={{ uri: item?.uri }}
                    // onLoadEnd={() => setMediaLoading(false)}
                    style={{
                      ...styles.image,
                      aspectRatio: item?.width / item?.height,
                    }}
                  />
                </>
              )}
              {item?.type === "video" && (
                <View style={styles.vidContainer}>
                  <PostVideo
                    vidUri={item?.uri}
                    disableDoublePress
                    disableLongPress
                    viewable={false}
                    // onLoadEnd={() => setMediaLoading(false)}
                    showTimer={false}
                    full
                    style={styles.vidContainer}
                    contStyle={styles.vidCont}
                    autoPlayer={false}
                    playFunc={isKey}
                  />
                  {/* <ActivityIndicator
                  visible={mediaLoading}
                  size={0.3}
                  type="loader"
                  style={styles.loader}
                  transparent
                /> */}
                </View>
              )}
            </View>
          </View>
        </View>
        {isKey && (
          <View
            style={{
              position: "absolute",
              top: safeInsets.top + 20,
              marginLeft: 20,
            }}
          >
            <LottieView
              source={require("../../assets/animations/circe_countdown.json")}
              autoPlay={false}
              duration={timer}
              style={{ width: CIRCLER, height: CIRCLER }}
              ref={lottieRef}
              loop={false}
              onAnimationFinish={handleAnimFinish}
            />
            <View style={styles.activityText}>
              <AppText style={{ color: colors.white }} bold size="large">
                {modalData.length.toString()}
              </AppText>
            </View>
          </View>
        )}
      </View>
    );
  };
  const RenderEmptyComponent = () => {
    return (
      <View>
        <AppText>EMPTYYYYYYYYYYYYYY</AppText>
      </View>
    );
  };

  const RenderHeaderList = ({ item }) => {
    const handleMenu = () => {
      console.log("menun pressed");
    };

    return (
      <View style={styles.headerList}>
        <View />
        <View style={styles.headerCont}>
          <View style={styles.headerTitles}>
            <AppText bold size="xlarge" style={styles.headerText}>
              {item[item.instance]?.dpName ??
                item[item.instance]?.name ??
                item[item.instance]?.name_j ??
                item[item.instance]?.name_e}
            </AppText>
            <AppText style={styles.headerInstance}>{item.instance}</AppText>
            {modalData && (
              <AppText style={styles.headerDate}>
                {getTimestamp(modalData[0]?._id, "status")}
              </AppText>
            )}
          </View>
          <ProfilePic
            source={item[item.instance]?.cover_photo?.uri}
            size={60}
            border={1.5}
            borderColor={colors.white}
            disabled
          />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={handleMenu}
            style={styles.menuIcon}
          >
            <Feather name="more-vertical" color={colors.white} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const RenderHeader = () => {
    return (
      <View style={{ ...styles.header, paddingTop: safeInsets.top + 5 }}>
        <FlatList
          data={modalData}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToAlignment="center"
          ref={headerScroll}
          snapToInterval={width}
          scrollEnabled={false}
          decelerationRate={0.2}
          keyExtractor={(item) => item._id}
          renderItem={renderHeaderList}
        />
      </View>
    );
  };

  return (
    <>
      <StatusBar style="light" />
      <Modal
        visible={modalObj.vis}
        onRequestClose={handleCloseModal}
        statusBarTranslucent
        style={{ flex: 1 }}
        transparent
      >
        <View style={styles.container}>
          {/* <Viewport.Tracker> */}
          <FlatList
            data={statuses}
            ref={listScrollRef}
            snapToAlignment="center"
            showsVerticalScrollIndicator={false}
            snapToInterval={SCROLL_INTERVAL}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            removeClippedSubviews
            maxToRenderPerBatch={3}
            initialNumToRender={4}
            overScrollMode="never"
            pagingEnabled
            decelerationRate={0.3}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: height * 0.05 }}
            ListEmptyComponent={RenderEmptyComponent}
            renderItem={renderModalList}
          />
          {/* </Viewport.Tracker> */}
          <RenderHeader />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  activityText: {
    position: "absolute",
    width: CIRCLER,
    height: CIRCLER,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    position: "absolute",
    width,
  },
  headerList: {
    width,
    flexDirection: "row",
    paddingLeft: 8,
    paddingRight: 5,
    justifyContent: "space-between",
  },
  headerCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: colors.white,
    textTransform: "capitalize",
    textAlign: "right",
  },
  headerTitles: {
    marginRight: 8,
  },
  headerContainer: {
    width,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  headerInstance: {
    textTransform: "capitalize",
    textAlign: "right",
    color: colors.primaryOld,
  },
  headerDate: {
    textAlign: "right",
    color: colors.extraLight,
  },
  itemContainer: {
    alignSelf: "center",
    borderRadius: 25,
    justifyContent: "center",
    marginBottom: height * 0.05,
    alignItems: "center",
  },
  image: {
    width: "100%",
    maxHeight: height * 0.95,
    // height: "100%",
  },
  mediaContainer: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    paddingHorizontal: 10,
  },
  loader: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  vidContainer: {
    flex: 1,
    justifyContent: "center",
    // height,
    // // backgroundColor: "cyan",
    // alignSelf: "center",
  },
  vidCont: {
    justifyContent: "center",
    // backgroundColor: "pink",
    paddingTop: height * 0.035,
    height,
  },
});
