import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getThumbnailAsync } from "expo-video-thumbnails";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "./AppText";
import colors from "../constants/colors";
import DisplayStatus from "./DisplayStatus";
import ActivityIndicator from "./ActivityIndicator";
import ThemeContext from "../config/ThemeContext";

const { height, width } = Dimensions.get("window");
const gradientColors = ["#4A10C7", "#17c8ff", "#00ffff"];

const StatusCardItem = ({ item, display, setDisplay, all }) => {
  const [imager, setImager] = useState({});
  const [loading, setLoading] = useState(true);
  const theme = useContext(ThemeContext);

  const handleCardPress = (item, all) => {
    // TRYING TO GET THE INITITALSCROLLINDEX
    const pressed = item.posts[0]._id;
    const initialScrollIndex = display.data.posts.findIndex(
      (obj) => obj._id == pressed
    );

    const initialScrollIndexHeader = all.findIndex(
      (obj) => obj._id == item._id
    );

    setDisplay({
      vis: true,
      data: {
        ...display.data,
        initialScrollIndex,
        initialScrollIndexHeader,
        posts: [...display.data.posts],
      },
    });
  };

  const fetchThumb = async () => {
    const lastPost = item.posts[item.posts.length - 1];
    if (lastPost.type == "video" && !lastPost.thumb) {
      try {
        const res = await getThumbnailAsync(lastPost.uri, {
          time: 5000,
          quality: 0.1,
        });
        setImager(res);
        setLoading(false);
      } catch (err) {
        setLoading(true);
      }
    } else {
      setImager(lastPost);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThumb();
  }, []);

  return (
    <View style={styles.cardsContainer}>
      <>
        <TouchableOpacity
          onPress={() => handleCardPress(item, all)}
          style={[styles.statusItem, { backgroundColor: theme.extralight }]}
          activeOpacity={1}
        >
          <View style={[styles.media, { backgroundColor: theme.extralight }]}>
            <Image
              source={{ uri: imager.thumb }}
              blurRadius={2.5}
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
            />
          </View>
          <ActivityIndicator
            type="spin"
            transparent
            style={styles.activity}
            size={0.25}
            visible={loading}
          />
        </TouchableOpacity>
      </>
      <View style={styles.profile}>
        <CircularGradient diameter={width * 0.16}>
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
const CircularGradient = ({ children, diameter }) => {
  return (
    <LinearGradient
      style={styles.circular}
      start={[1, 0.5]}
      end={[0, 0]}
      colors={gradientColors}
    >
      <View style={styles.circularInner}>{children}</View>
    </LinearGradient>
  );
};

const StatusRender = ({ data, show, setter }) => {
  const [display, setDisplay] = useState({ vis: false, data: null });

  const theme = useContext(ThemeContext);
  const safeInset = useSafeAreaInsets();

  if (!show) return null;

  const handleCloseModal = () => {
    setter && setter();
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
    return (
      <StatusCardItem
        item={item}
        all={data}
        display={display}
        setDisplay={setDisplay}
      />
    );
  };

  useEffect(() => {
    const statuses = [];
    data?.forEach((obj, idx) => {
      obj.posts.reverse().forEach((post, idxer) => {
        let counter = obj.posts.length - idxer;
        const lastItem =
          idx == data.length - 1 && idxer == obj.posts.length - 1;
        statuses.push({
          ...post,
          storyLength: obj.posts.length,
          storyNumber: idxer,
          lastItem,
          storyGroupNumber: idx + 1,
          counter,
        });
      });
    });
    setDisplay({ vis: false, data: { all: data, posts: statuses } });
  }, [data, show]);

  return (
    <Modal visible={show} statusBarTranslucent transparent>
      <View
        style={{
          ...styles.container,
          backgroundColor: theme.transparentBold,
          paddingTop: safeInset.top + 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleCloseModal}
          style={styles.header}
        >
          <Feather name="x-circle" size={20} color={colors.medium} />
          <AppText size="large" bold style={styles.headerText}>
            {" "}
            CLOSE{" "}
          </AppText>
        </TouchableOpacity>
        <FlatList
          showsHorizontalScrollIndicator={false}
          // ListFooterComponent={RenderFooter}
          data={data}
          numColumns={2}
          listKey="@statuses"
          ListEmptyComponent={ListEmptyComponent}
          keyExtractor={(item) => item._id}
          renderItem={renderStatuses}
        />
        <DisplayStatus modalObj={display} setVisible={setDisplay} />
      </View>
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
    alignSelf: "center",
    padding: 12,
    marginBottom: 5,
  },
  headerText: {
    marginLeft: 3,
    color: colors.primary,
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
