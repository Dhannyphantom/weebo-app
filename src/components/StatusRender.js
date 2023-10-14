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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "./AppText";
import colors from "../constants/colors";
import DisplayStatus from "./DisplayStatus";
import ActivityIndicator from "./ActivityIndicator";
import ThemeContext from "../config/ThemeContext";

import { Context as FeedContext } from "../config/FeedContext";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");
const gradientColors = ["#4A10C7", "#17c8ff", "#00ffff"];

// TODO:: CACHE RESULTS TO ASYNCSTORAGE

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

  const ListEmptyComponent = () => {
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

  const renderStatuses = ({ item }) => {
    return <StatusCardItem item={item} all={stories} setDisplay={setDisplay} />;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStories(() => setRefreshing(false));
  };

  const fetchStories = (cb) => {
    getStatuses(
      (resData) => {
        setStories(resData);
        setIsLoading(false);
        cb && cb();
      },
      (errData) => {
        console.log(errData);
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
        fetchStories();
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
