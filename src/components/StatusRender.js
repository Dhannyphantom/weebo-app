import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  FlatList,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
  RefreshControl,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  setBackgroundColorAsync,
  setButtonStyleAsync,
} from "expo-navigation-bar";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppText from "./AppText";
import colors from "../constants/colors";
import DisplayStatus from "./DisplayStatus";
import ActivityIndicator from "./ActivityIndicator";
import ThemeContext from "../config/ThemeContext";

import { Context as FeedContext } from "../config/FeedContext";
import { useNavigation } from "@react-navigation/native";
import { actionDatas } from "../constants/data_store";
import { getFeedNumber, randomArrIndex } from "../constants/helpers";
import LoaderImage from "./LoaderImage";
import getTimestamp from "../constants/getTimestamp";

const { height, width } = Dimensions.get("window");
const gradientColors = ["#4A10C7", "#17c8ff", "#00ffff"];
const gradientGallery = actionDatas.map((action) => {
  return [action.bg, action.bg1];
});

// TODO:: CACHE RESULTS TO ASYNCSTORAGE
setBackgroundColorAsync("rgba(255,255,255,0.1)");
setButtonStyleAsync("light");

const StatusCardItem = ({ item, setDisplay, all }) => {
  const theme = useContext(ThemeContext);
  const navigation = useNavigation();

  const handleCardPress = () => {
    setDisplay({
      vis: true,
      data: item.posts[0]._id,
      itemId: item._id,
      stories: all,
    });
  };

  const handleNav = () => {
    switch (item.instance) {
      case "character":
        navigation.navigate("Character", {
          item: item[item.instance]._id,
        });
        break;
      case "show":
        navigation.navigate("Show", { show: item[item.instance] });
        break;
      case "channel":
        navigation.navigate("ChannelPost", { id: item[item.instance]._id });
        break;
    }
  };

  return (
    <View style={styles.cardsContainer}>
      <>
        <TouchableOpacity
          onPress={handleCardPress}
          style={[styles.statusItem, { backgroundColor: theme.extralight }]}
          activeOpacity={1}
        >
          <View style={[styles.media, { backgroundColor: theme.extralight }]}>
            <Image
              source={{ uri: item?.posts[0]?.thumb }}
              blurRadius={5}
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
            />
          </View>
        </TouchableOpacity>
      </>
      <View style={styles.profile}>
        <CircularGradient onPress={handleNav}>
          <Image
            source={{ uri: item[item.instance]?.cover_photo?.uri }}
            resizeMethod="scale"
            style={styles.image}
          />
        </CircularGradient>
        <AppText style={styles.mainTitle} bold>
          {item[item.instance]?.dpName ??
            item[item.instance]?.name ??
            item[item.instance]?.name_j ??
            item[item.instance]?.name_e}
        </AppText>
        <AppText style={styles.titleText} bold>
          {item.instance}
        </AppText>
      </View>
    </View>
  );
};
const CircularGradient = ({ children, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.96} onPress={onPress}>
      <LinearGradient
        style={styles.circular}
        start={[1, 0.5]}
        end={[0, 0]}
        colors={gradientColors}
      >
        <View style={styles.circularInner}>{children}</View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const ListEmptyComponent = ({ loadedOnce }) => {
  if (loadedOnce === false) return null;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppText style={styles.empty} bold>
        You don't have any recent stories
      </AppText>
    </View>
  );
};

const StatusRender = ({ show, setter }) => {
  const [display, setDisplay] = useState({
    vis: false,
    data: null,
    loading: true,
  });

  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { getStatuses } = useContext(FeedContext);

  const theme = useContext(ThemeContext);
  const safeInset = useSafeAreaInsets();
  const opaciter = useRef(new Animated.Value(0)).current;

  if (!show) return null;

  const handleCloseModal = () => {
    Animated.timing(opaciter, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setter && setter();
    });
  };

  const renderStatuses = ({ item }) => {
    return <StatusCardItem item={item} all={stories} setDisplay={setDisplay} />;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStories(() => setRefreshing(false));
  };

  const fetchStories = async (cb, type) => {
    if (type === "initial") {
      const saved_stories = await AsyncStorage.getItem("stories");
      if (saved_stories) {
        setStories(JSON.parse(saved_stories));
        setIsLoading(false);
      }
    }

    getStatuses(
      async (resData) => {
        setStories(resData);
        setIsLoading(false);
        cb && cb();
        await AsyncStorage.setItem("stories", JSON.stringify(resData));
      },
      (errData) => {
        cb && cb();
      }
    );
  };

  useEffect(() => {
    if (show) {
      Animated.timing(opaciter, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        fetchStories(null, "initial");
      });
    }
  }, [show]);

  return (
    <Modal visible={show} statusBarTranslucent transparent>
      <Animated.View
        style={{
          ...styles.container,
          backgroundColor: theme.transparentBold,
          paddingTop: safeInset.top,
          opacity: opaciter,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleCloseModal}
          style={styles.header}
        >
          <Feather name="chevron-left" size={19} color={colors.medium} />
          <AppText size="large" bold style={styles.headerText}>
            STORIES
          </AppText>
        </TouchableOpacity>
        <FlatList
          showsHorizontalScrollIndicator={false}
          // ListFooterComponent={RenderFooter}
          data={stories}
          numColumns={2}
          listKey="@statuses"
          refreshControl={
            <RefreshControl
              progressBackgroundColor={theme.extralight}
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={ListEmptyComponent}
          keyExtractor={(item) => item._id}
          renderItem={renderStatuses}
        />
        <DisplayStatus modalObj={display} setVisible={setDisplay} />
        <ActivityIndicator visible={isLoading} style={styles.activity} />
      </Animated.View>
    </Modal>
  );
};

export const RenderInstanceStories = ({ vis, data = {}, setter }) => {
  const theme = useContext(ThemeContext);
  const safeInset = useSafeAreaInsets();
  const opaciter = useRef(new Animated.Value(0)).current;
  const { fetchInstanceStory } = useContext(FeedContext);

  const [refreshing, setRefreshing] = useState(false);
  const [bools, setBools] = useState({ isLoading: true, loadedOnce: false });
  const [story, setStory] = useState({ posts: [] });
  const [display, setDisplay] = useState({
    vis: false,
    data: null,
    loading: true,
  });
  const { posts } = story;

  const onRefresh = () => {};

  const handleCloseModal = () => {
    Animated.timing(opaciter, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setter && setter();
    });
  };

  const fetchData = () => {
    fetchInstanceStory(
      data,
      (resData) => {
        setStory(resData);
        setBools({ ...bools, loadedOnce: true, isLoading: false });
      },
      (errData) => {
        console.log(errData);
        setBools({
          ...bools,
          loadedOnce: true,
          isLoading: false,
          err: errData,
        });
      }
    );
  };

  const renderStatuses = ({ item, index }) => {
    const hasMargin = index % 2 === 0;
    const randomIdx = randomArrIndex(0, actionDatas.length - 1);
    const randomColorArr = gradientGallery[randomIdx];
    const isVideo = item.type === "video";

    const handlePress = () => {
      setDisplay({
        vis: true,
        data: story, // for statusId
        itemId: item._id,
        stories: posts,
      });
    };

    return (
      <View
        style={[
          styles.postCardContainer,
          {
            marginRight: hasMargin ? width * 0.016 : 0,
            marginLeft: hasMargin ? width * 0.016 : 0,
          },
        ]}
      >
        <Pressable onPress={handlePress}>
          <LinearGradient
            colors={randomColorArr}
            style={[styles.postCard, { borderWidth: item.isViewed ? 0 : 2 }]}
          >
            <Image
              source={{ uri: item.thumb }}
              style={styles.postCardImage}
              blurRadius={1.5}
            />
            {isVideo && (
              <View style={styles.postCardIcon}>
                <Feather
                  name="play-circle"
                  size={50}
                  color={colors.extraLight}
                />
              </View>
            )}
          </LinearGradient>
        </Pressable>
        <View style={styles.row}>
          <View style={[styles.row, { marginLeft: 2 }]}>
            <Feather name="clock" size={12} color={colors.medium} />
            <AppText
              style={{ marginLeft: 3, color: colors.medium }}
              size="small"
            >
              {getTimestamp(item._id, "status")}
            </AppText>
          </View>
          <View style={[styles.row, { marginLeft: 5 }]}>
            <Feather name="eye" size={12} color={colors.medium} />
            <AppText
              style={{ marginLeft: 3, color: colors.medium }}
              size="small"
            >
              {getFeedNumber(item.viewers)}
            </AppText>
          </View>
          <View style={[styles.row, { marginLeft: 5 }]}>
            <Feather name="heart" size={12} color={colors.medium} />
            <AppText
              style={{ marginLeft: 3, color: colors.medium }}
              size="small"
            >
              {getFeedNumber(item.likes)}
            </AppText>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (vis) {
      Animated.timing(opaciter, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        // fetchStories(null, "initial");
        fetchData();
      });
    }
  }, [vis]);

  return (
    <Modal visible={vis} statusBarTranslucent transparent>
      <Animated.View
        style={{
          ...styles.container,
          backgroundColor: theme.transparentBold,
          paddingTop: safeInset.top,
          opacity: opaciter,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleCloseModal}
          style={styles.header}
        >
          <Feather name="chevron-left" size={19} color={colors.medium} />
          <AppText size="large" bold style={styles.headerText}>
            {data.name} STORIES
          </AppText>
        </TouchableOpacity>
        <FlatList
          showsHorizontalScrollIndicator={false}
          // ListFooterComponent={RenderFooter}
          data={posts}
          numColumns={2}
          listKey="@statuses"
          refreshControl={
            <RefreshControl
              progressBackgroundColor={theme.extralight}
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={() => (
            <ListEmptyComponent loadedOnce={bools.loadedOnce} />
          )}
          keyExtractor={(item) => item._id}
          // keyExtractor={(item) => item._id}
          renderItem={renderStatuses}
        />
        <ActivityIndicator
          visible={bools.isLoading}
          transparent
          style={styles.activity}
        />
      </Animated.View>
      <DisplayStatus modalObj={display} setVisible={setDisplay} isInstance />
    </Modal>
  );
};

const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  circularInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circular: {
    borderRadius: 900,
    width: width * 0.15,
    borderStyle: "dotted",
    height: width * 0.15,
    backgroundColor: "transparent",
    alignSelf: "center",
    padding: 3,
  },

  cardsContainer: {
    elevation: 2,
  },
  empty: {
    textAlign: "center",
    alignSelf: "center",
    color: colors.medium,
    marginLeft: 35,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    // padding: 12,
    marginBottom: 15,
  },
  headerText: {
    marginLeft: 5,
  },
  image: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: 900,
    borderWidth: 3,
    borderColor: colors.white,
  },
  media: {
    flex: 1,
    backgroundColor: colors.extraLight,
    borderRadius: 11,
  },
  postCardContainer: {
    marginBottom: 16,
  },
  postCardIcon: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  postCardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 9,
  },
  postCard: {
    width: width * 0.475,
    height: height * 0.4,
    borderRadius: 10,
    opacity: 0.8,
    marginBottom: 6,
    borderColor: colors.primary,
    borderStyle: "dotted",
  },

  profile: {
    alignSelf: "center",
    bottom: (width * 0.16) / 2,
    marginLeft: width * 0.03,
  },
  loader: {
    position: "absolute",
    borderRadius: 10,
    width: "100%",
    height: "100%",
  },
  mainTitle: {
    textAlign: "center",
    marginTop: 5,
    textTransform: "capitalize",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 2,
  },
  statusItem: {
    width: width * 0.45,
    height: height * 0.35,
    backgroundColor: colors.white,
    marginLeft: width * 0.03,
    // elevation: 2,
    borderRadius: 10,
  },
  titleText: {
    color: colors.primary,
    textTransform: "capitalize",
    textAlign: "center",
    marginTop: 4,
  },
});
export default StatusRender;
