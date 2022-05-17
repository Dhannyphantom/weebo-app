import React, { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import MasonryList from "@react-native-seoul/masonry-list";
import AppText from "./AppText";
import LoaderImage from "./LoaderImage";
import MediaModal from "./MediaModal";

const { width, height } = Dimensions.get("window");

const MansonryItem = ({ item, mediaType, setDisplayMedia }) => {
  const handlePress = () => {
    setDisplayMedia({
      vis: true,
      data: {
        item,
        feed: {
          type: "image",
        },
      },
    });
  };

  const isVideoImage = item.type != "image";

  return (
    <>
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={1}
        onPress={handlePress}
      >
        <LoaderImage image={item} isVideoImage={isVideoImage} />
      </TouchableOpacity>
    </>
  );
};

export default function MansonryList({ data, media }) {
  const [refreshing, setRefreshing] = useState(false);
  const [displayMedia, setDisplayMedia] = useState({ vis: false, data: null });
  // console.log(media);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  console.log(data[0].type);

  const onEndReached = () => {
    // console.log("End Reached");
  };

  return (
    <View style={styles.container}>
      <MasonryList
        data={media}
        keyExtractor={(item, index) => item._id}
        numColumns={2}
        style={styles.mansonry}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, i }) => (
          <MansonryItem
            item={item}
            setDisplayMedia={setDisplayMedia}
            mediaType={data.type}
          />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
      />
      <MediaModal modalObject={displayMedia} setVisible={setDisplayMedia} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    marginHorizontal: width * 0.015,
    paddingTop: 15,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  mansonry: {
    paddingBottom: height * 0.11,
  },
  mediaContainer: {},
});
