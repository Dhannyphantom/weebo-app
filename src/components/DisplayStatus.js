import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
// import { Context as AuthContext } from "../config/AuthContext";
// import { Context as FeedContext } from "../config/FeedContext";
import AppText from "./AppText";
import colors from "../constants/colors";
import ProfilePic from "./ProfilePic";
import getTimestamp from "../constants/getTimestamp";
import RenderStoryList from "./RenderStoryList";
import ActivityIndicator from "./ActivityIndicator";

const { width, height } = Dimensions.get("window");
const SCROLL_SEPARATOR = height * 0.08;
const SCROLL_INTERVAL = height + SCROLL_SEPARATOR;
const ACTIVE_DEFAULT = {
  key: null,
  type: null,
  prevViewValue: null,
  duration: 5000,
};
const viewabilityConfig = {
  waitForInteraction: false,
  minimumViewTime: 10,
  viewAreaCoveragePercentThreshold: 50,
};

const RenderHeader = ({
  headerScroll,
  initialScrollIndexHeader,
  modalData,
  date,
}) => {
  const safeInsets = useSafeAreaInsets();
  const renderHeaderList = ({ item }) => {
    return <RenderHeaderList item={item} date={date} />;
  };

  const initialScrollIndexHeaderRef = useRef(initialScrollIndexHeader).current;

  const getItemLayout = (data, index) => {
    return {
      length: width,
      offset: width * index,
      index,
    };
  };

  return (
    <View style={{ ...styles.header, paddingTop: safeInsets.top + 5 }}>
      <FlatList
        data={modalData}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialScrollIndexHeaderRef}
        getItemLayout={getItemLayout}
        pagingEnabled
        snapToAlignment="center"
        ref={headerScroll}
        snapToInterval={width}
        scrollEnabled={false}
        decelerationRate={0.02}
        keyExtractor={(item) => item._id}
        renderItem={renderHeaderList}
      />
    </View>
  );
};

const StoryListSeperator = () => {
  return <View style={styles.separator} />;
};

const RenderHeaderList = ({ item, date }) => {
  const [dater, setDater] = useState(date);
  const handleMenu = () => {
    console.log("menun pressed");
  };

  useEffect(() => {
    setDater(date);
  }, [date]);

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
          <AppText style={styles.headerDate}>
            {dater ? getTimestamp(dater, "status") : " "}
          </AppText>
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

export default function DisplayStatus({ modalObj, setVisible }) {
  const [active, setActive] = useState(ACTIVE_DEFAULT);
  const [endList, setEndList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statuses, setStatuses] = useState({
    data: [],
    loading: true,
    initialScrollIndexHeader: 0,
    initialScrollIndex: 0,
  });
  const [scroller, setScroller] = useState(true);

  const headerScroll = useRef(null);
  // const scrollY = useRef(new Animated.Value(0)).current;
  const translator = useRef(new Animated.Value(0)).current;
  const listScrollRef = useRef(null);
  const opaciter = translator.interpolate({
    inputRange: [0, height / 1.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const handleCloseModal = () => {
    Animated.timing(translator, {
      toValue: height,
      useNativeDriver: true,
    }).start(() => {
      setEndList(false);
      setVisible({ ...modalObj, vis: false });
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    // CODE BELOW FOR CHECKING AND ANIMATING THE HEADER SCROLL

    setEndList(changed[0].item.lastItem);

    if (changed.length > 1) {
      const currViewValue = changed[0].item.storyGroupNumber;
      const prevViewValue = changed[1].item.storyGroupNumber;
      if (currViewValue > prevViewValue) {
        headerScroll.current?.scrollToOffset({
          animated: true,
          offset: width * prevViewValue,
        });
      } else if (currViewValue < prevViewValue) {
        headerScroll.current?.scrollToOffset({
          animated: true,
          offset: width * currViewValue - width,
        });
      }
      // TO RESET ENDLIST WHEN THE CURRENT ITEM IS NOT THE LAST ITEM
    } else if (changed.length == 1) {
      if (!viewableItems[0]) {
        setActive({ ...active, prevViewValue: changed });
      }
    }

    if (!viewableItems[0]) {
      // maybe the first screen
      setActive(ACTIVE_DEFAULT);
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

  const getItemLayout = (data, index) => {
    return {
      length: height,
      offset: (height + SCROLL_SEPARATOR) * index,
      index,
    };
  };

  const renderModalList = ({ item, index }) => {
    return (
      <RenderStoryList
        item={item}
        idx={index}
        scroller={{ scroller, setScroller }}
        storyLength={statuses.data.length}
        handleCloseModal={handleCloseModal}
        listScrollRef={listScrollRef}
        onEnd={{ endList, setEndList }}
        activeItem={active?.key}
      />
    );
  };

  const handleEndReached = () => {
    setEndList(true);
  };

  const RenderEmptyComponent = () => {
    return (
      <View>
        <AppText>EMPTYYYYYYYYYYYYYY</AppText>
      </View>
    );
  };

  useEffect(() => {
    if (modalObj.vis) {
      Animated.timing(translator, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      //   FORMAT STATUSES
      const posts = [];
      for (let i = 0; i < modalObj.stories.length; i++) {
        const e = modalObj.stories[i];
        const modifiedPosts = e.posts.map((post, idxer) => {
          let counter = e.posts.length - idxer;
          const lastItem =
            i == modalObj.stories.length - 1 && idxer == e.posts.length - 1;
          return {
            ...post,
            storyLength: e.posts.length,
            storyNumber: idxer,
            lastItem,
            storyGroupNumber: i + 1,
            counter,
          };
        });
        posts.push(...modifiedPosts);
      }

      // GET SCROLL INDEXES
      const initialScrollIndex = posts?.findIndex(
        (obj) => obj._id == modalObj.data
      );

      const initialScrollIndexHeader = modalObj.stories.findIndex(
        (obj) => obj._id == modalObj.itemId
      );

      setStatuses({
        ...statuses,
        loading: false,
        data: posts,
        initialScrollIndex,
        initialScrollIndexHeader,
      });
      setIsLoading(false);
    }
  }, [modalObj]);

  return (
    <>
      <StatusBar style="light" />
      <Modal
        visible={modalObj.vis}
        onRequestClose={handleCloseModal}
        statusBarTranslucent
        transparent
      >
        <Animated.View
          style={{
            ...styles.container,
            opacity: opaciter,
            transform: [{ translateY: translator }],
          }}
        >
          <FlatList
            data={statuses.data}
            ref={listScrollRef}
            snapToAlignment="center"
            initialScrollIndex={statuses.initialScrollIndex}
            showsVerticalScrollIndicator={false}
            snapToInterval={SCROLL_INTERVAL}
            viewabilityConfig={viewabilityConfig}
            onEndReached={handleEndReached}
            ItemSeparatorComponent={StoryListSeperator}
            getItemLayout={getItemLayout}
            onEndReachedThreshold={0.5}
            onViewableItemsChanged={onViewableItemsChanged}
            maxToRenderPerBatch={8}
            removeClippedSubviews
            // onScroll={Animated.event(
            //   [{ nativeEvent: { contentOffset: { x: scrollY } } }],
            //   { useNativeDriver: true }
            // )}
            initialNumToRender={5}
            overScrollMode="never"
            scrollEnabled={scroller}
            pagingEnabled
            decelerationRate={0.2}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: height * 0.05 }}
            ListEmptyComponent={RenderEmptyComponent}
            renderItem={renderModalList}
          />
          <RenderHeader
            modalData={modalObj?.stories}
            headerScroll={headerScroll}
            initialScrollIndexHeader={statuses.initialScrollIndexHeader}
            date={active.key}
          />
          {/* <RenderFloater handleCloseModal={handleCloseModal} /> */}
          <ActivityIndicator
            visible={isLoading}
            type="loader"
            absolute
            size={0.25}
            transparent
          />
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
  separator: {
    height: SCROLL_SEPARATOR,
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
