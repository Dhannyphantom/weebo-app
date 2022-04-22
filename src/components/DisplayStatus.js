import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
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
import PostVideo from "./PostVideo";

const { width, height } = Dimensions.get("window");
const CIRCLER = width * 0.1;
const SCROLL_INTERVAL = height + height * 0.11;
const viewabilityConfig = {
  waitForInteraction: false,
  minimumViewTime: 30,
  viewAreaCoveragePercentThreshold: 50,
};

export default function DisplayStatus({ modalObj, setVisible }) {
  const [active, setActive] = useState({ key: null, duration: 5000 });
  const [player, setPlayer] = useState(false);

  const safeInsets = useSafeAreaInsets();
  const headerScroll = useRef(null);
  const scrollRef = useRef(null);
  const lottieRef = useRef(null);

  const modalData = modalObj?.data?.all;
  const statuses = modalData && modalData[0].posts;

  const handleCloseModal = () => {
    setVisible({ vis: false, data: null });
  };

  const handleScrollActions = (type) => {
    if (type === "begin") {
      lottieRef?.current?.pause();
      console.log("begins");
    } else if (type === "end") {
      lottieRef?.current?.resume();
      console.log("ends");
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    if (!viewableItems[0]) {
      // maybe the first screen
      setPlayer(false);
      setActive({ key: null, duration: 5000 });
    } else if (viewableItems[0]?.item?.type === "video") {
      // a video so play video
      setPlayer(true);
      setActive({
        key: viewableItems[0]?.key,
        duration: viewableItems[0]?.item?.durationMillis ?? 5000,
      });
    } else if (viewableItems[0]?.item?.type === "image") {
      // an image so pause video
      setPlayer(false);
      setActive({
        key: viewableItems[0]?.key,
        duration: viewableItems[0]?.item?.durationMillis ?? 5000,
      });
    }
  }, []);

  const renderModalList = ({ item, index }) => {
    return (
      <RenderModalList
        item={item}
        idx={index}
        scrollRefObj={scrollRef}
        activeItem={active}
        videoPlayer={player}
      />
    );
  };

  const renderHeaderList = ({ item }) => {
    return <RenderHeaderList item={item} />;
  };

  const RenderModalList = ({
    item,
    activeItem,
    videoPlayer,
    scrollRefObj,
    idx,
  }) => {
    const [mediaLoading, setMediaLoading] = useState(true);

    const handleAnimFinish = () => {
      scrollRefObj?.current?.scrollToOffset({
        offset: SCROLL_INTERVAL * (idx + 1),
        animated: true,
      });
    };

    useEffect(() => {
      if (activeItem?.key == item._id) {
        lottieRef?.current?.play();
      }
    }, [activeItem]);

    return (
      <View style={styles.itemContainer}>
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
                  style={styles.image}
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
                  autoPlayer={false}
                  playFunc={videoPlayer}
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
    );
  };
  const RenderEmptyComponent = () => {
    return (
      <View>
        <AppText>EMPTYYYYYYYYYYYYYY</AppText>
      </View>
    );
  };

  const RenderHeaderList = ({ item, progress }) => {
    return (
      <View style={styles.headerList}>
        <View>
          <LottieView
            source={require("../../assets/animations/circe_countdown.json")}
            autoPlay={false}
            duration={active?.duration}
            style={{ width: CIRCLER, height: CIRCLER }}
            ref={lottieRef}
            loop={false}
            // autoSize
            // onAnimationFinish={() => handleAnimFinish(1)}
          />
          <View style={styles.activityText}>
            <AppText style={{ color: colors.white }} bold size="xlarge">
              {modalData.length.toString()}
            </AppText>
          </View>
        </View>
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
            // onPress={handleMenuIcon}
            style={styles.menuIcon}
          >
            <Feather
              name="more-vertical"
              color={colors.white}
              size={width * 0.035}
            />
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
          <Viewport.Tracker style={{ flex: 1 }}>
            <>
              <FlatList
                data={statuses}
                snapToAlignment="center"
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={SCROLL_INTERVAL}
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
                overScrollMode="never"
                pagingEnabled
                decelerationRate={0.3}
                onScrollBeginDrag={() => handleScrollActions("begin")}
                onScrollEndDrag={() => handleScrollActions("end")}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={RenderEmptyComponent}
                renderItem={renderModalList}
              />
            </>
          </Viewport.Tracker>
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
    // backgroundColor: colors.primary,
    // marginTop: 15,
    alignSelf: "center",
    borderRadius: 25,
    justifyContent: "center",
    marginVertical: height * 0.05,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  mediaContainer: {
    width,
    height,
    justifyContent: "center",
  },
  loader: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  vidContainer: {
    flex: 1,
  },
});
