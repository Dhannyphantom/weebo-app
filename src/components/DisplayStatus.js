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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Context as AuthContext } from "../config/AuthContext";
import { Context as FeedContext } from "../config/FeedContext";
import AppText from "./AppText";
import colors from "../constants/colors";
import ProfilePic from "./ProfilePic";
import getTimestamp from "../constants/getTimestamp";
import RenderStoryList from "./RenderStoryList";

const { width, height } = Dimensions.get("window");
const SCROLL_INTERVAL = height + height * 0.06;
const viewabilityConfig = {
  waitForInteraction: false,
  minimumViewTime: 30,
  viewAreaCoveragePercentThreshold: 50,
};

const RenderFloater = ({ handleCloseModal }) => {
  return (
    <View
      style={{
        position: "absolute",
        // backgroundColor: colors.accent,
        width,
        height,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "flex-end",
          marginRight: 20,
          opacity: 0.5,
        }}
      >
        <TouchableOpacity activeOpacity={1} onPress={handleCloseModal}>
          <Feather name="x-circle" size={width * 0.08} color={colors.medium} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function DisplayStatus({ modalObj, setVisible }) {
  const [active, setActive] = useState({
    key: null,
    type: null,
    duration: 5000,
  });
  const [endList, setEndList] = useState(false);
  const safeInsets = useSafeAreaInsets();
  const headerScroll = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const translator = useRef(new Animated.Value(0)).current;
  const listScrollRef = useRef(null);
  const opaciter = translator.interpolate({
    inputRange: [0, height / 1.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const modalData = modalObj?.data?.all;
  const statuses = modalObj?.data?.posts;

  const handleCloseModal = () => {
    Animated.timing(translator, {
      toValue: height,
      useNativeDriver: true,
    }).start(() => {
      setVisible({ ...modalObj, vis: false });
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    if (!viewableItems[0]) {
      // maybe the first screen
      setActive({ key: null, type: null, duration: 5000 });
    } else if (viewableItems[0]?.item?.type === "video") {
      // a video so play video
      setActive({
        key: viewableItems[0]?.key,
        type: "play",
        duration: viewableItems[0]?.item?.durationMillis ?? 5000,
      });
    } else if (viewableItems[0]?.item?.type === "image") {
      // an image so pause video
      setActive({
        key: viewableItems[0]?.key,
        type: "pause",
        duration: viewableItems[0]?.item?.durationMillis ?? 5000,
      });
    }
  }).current;

  const renderModalList = ({ item, index }) => {
    return (
      <RenderStoryList
        item={item}
        idx={index}
        handleCloseModal={handleCloseModal}
        listScrollRef={listScrollRef}
        headerScroll={headerScroll}
        onEnd={{ endList, setEndList }}
        activeItem={active?.key}
      />
    );
  };

  const handleEndReached = () => {
    setEndList(true);
  };

  const renderHeaderList = ({ item }) => {
    return <RenderHeaderList item={item} />;
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

  useEffect(() => {
    if (modalObj.vis) {
      Animated.timing(translator, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [modalObj]);

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
        <Animated.View
          style={{
            ...styles.container,
            opacity: opaciter,
            transform: [{ translateY: translator }],
          }}
        >
          <Animated.FlatList
            data={statuses}
            ref={listScrollRef}
            snapToAlignment="center"
            showsVerticalScrollIndicator={false}
            snapToInterval={SCROLL_INTERVAL}
            viewabilityConfig={viewabilityConfig}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            onViewableItemsChanged={onViewableItemsChanged}
            removeClippedSubviews
            maxToRenderPerBatch={3}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollY } } }],
              { useNativeDriver: true }
            )}
            initialNumToRender={4}
            overScrollMode="never"
            pagingEnabled
            decelerationRate={0.3}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: height * 0.05 }}
            ListEmptyComponent={RenderEmptyComponent}
            renderItem={renderModalList}
          />
          <RenderHeader />
          {/* <RenderFloater handleCloseModal={handleCloseModal} /> */}
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
