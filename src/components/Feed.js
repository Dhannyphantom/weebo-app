import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";

import FeedRender from "./FeedRender";

const Feed = ({ HeaderComp, ListEmpty, style, sticker, data, user }) => {
  const [myData, setMyData] = useState(data);

  useEffect(() => {
    setMyData(data);
  }, [data]);

  const renderFeed = ({ item }) => {
    return <FeedRender style={style} item={item} user={user} />;
  };
  const keyExtractor = (item) => item._id;
  return (
    <FlatList
      data={myData}
      keyExtractor={keyExtractor}
      ListHeaderComponent={HeaderComp}
      ListEmptyComponent={ListEmpty}
      stickyHeaderIndices={sticker}
      initialNumToRender={7}
      keyboardShouldPersistTaps="handled"
      renderItem={renderFeed}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Feed;
