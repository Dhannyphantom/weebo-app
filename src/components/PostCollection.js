import React from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PostVideo from "./PostVideo";

import FeedImage from "./FeedImage";

const screen = Dimensions.get("window");

const PostCollection = ({ imgData }) => {
  const navigation = useNavigation();
  const renderImages = ({ item }) => {
    const video = item.endsWith("mp4") || item.endsWith("mkv");
    return (
      <View style={{ flex: 1 }}>
        {!video ? (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("Display", { item })}
          >
            <FeedImage style={styles.posts} image={item} lDisabled />
          </TouchableOpacity>
        ) : (
          <PostVideo vidUri={item} style={styles.vid} small />
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={imgData}
      keyExtractor={(item, index) => item + index}
      renderItem={renderImages}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.columnWrapper}
      numColumns={2}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  columnWrapper: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  posts: {
    width: screen.width * 0.47,
    marginHorizontal: 10,
    marginBottom: 10,
  },
});
export default PostCollection;
