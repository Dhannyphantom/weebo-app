import React, { useContext, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import MasonryList from "@react-native-seoul/masonry-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ThemeContext from "../config/ThemeContext";

import LoaderImage from "./LoaderImage";
import MediaModal from "./MediaModal";
import AppText from "./AppText";
import colors from "../constants/colors";
import getVideoTime from "../constants/getVideoTime";
import DropDown from "./DropDown";

const { width, height } = Dimensions.get("window");

const MansonryItem = ({ item, openMenu, setDisplayMedia }) => {
  const isVideoImage = item.type != "image";
  const theme = useContext(ThemeContext);
  const handlePress = () => {
    setDisplayMedia({
      vis: true,
      data: {
        item,
        feed: {
          type: isVideoImage ? "video" : "image",
        },
      },
    });
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.itemContainer, { backgroundColor: theme.white }]}
        activeOpacity={1}
        onLongPress={() => openMenu(item)}
        onPress={handlePress}
      >
        <LoaderImage image={item} isVideoImage={isVideoImage} />
        {isVideoImage && (
          <View style={styles.videoImage}>
            <MaterialCommunityIcons
              name="play-circle"
              size={width * 0.055}
              color="white"
            />
            <AppText style={styles.vidTime} bold>
              {getVideoTime(64858)}
            </AppText>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
};

export default function MansonryList({ media }) {
  const [refreshing, setRefreshing] = useState(false);
  const [displayMedia, setDisplayMedia] = useState({ vis: false, data: null });
  const [menu, setMenu] = useState({ vis: false, item: null });

  const theme = useContext(ThemeContext);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const onEndReached = () => {
    // console.log("End Reached");
  };

  const openMenu = (item) => {
    setMenu({ vis: true, item });
  };

  const menuList = [
    {
      id: "1",
      name: "Add to Collection",
      show: true,
      onPress: () => console.log(menu.item),
      icon: "plus",
      iconPack: "F",
    },
    {
      id: "2",
      name: "Delete Post",
      show: true,
      onPress: () => console.log("Delete"),
      icon: "trash",
      iconPack: "F",
    },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundExtralight },
      ]}
    >
      <MasonryList
        data={media}
        keyExtractor={(item, index) => item._id}
        numColumns={2}
        style={{
          ...styles.mansonry,
          backgroundColor: theme.backgroundExtralight,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, i }) => (
          <MansonryItem
            item={item}
            setDisplayMedia={setDisplayMedia}
            openMenu={openMenu}
            mediaType={media[0].type}
          />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
      />
      <MediaModal modalObject={displayMedia} setVisible={setDisplayMedia} />
      <DropDown
        visible={menu.vis}
        set={setMenu}
        setter={(vis) => setMenu({ ...menu, vis })}
        listKey="@menu"
        lists={menuList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    marginLeft: width * 0.015,
    padding: 6,
    marginBottom: 10,
    borderRadius: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  mansonry: {
    paddingBottom: height * 0.11,
    paddingTop: 5,
    paddingRight: width * 0.015,
  },
  vidTime: {
    color: colors.white,
    marginLeft: 4,
  },
  videoImage: {
    position: "absolute",
    top: 15,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: "100%",
  },
});
