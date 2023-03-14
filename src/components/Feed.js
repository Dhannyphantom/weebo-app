import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import BannerAds from "./BannerAds";

import FeedRender from "./FeedRender";

const Feed = ({ HeaderComp, ListEmpty, style, sticker, data, user }) => {
  const [myData, setMyData] = useState(data);

  useEffect(() => {
    setMyData(data);
  }, [data]);

  const renderFeed = ({ item, index }) => {
    return null;
    console.log(index);
    if (index % 3 === 0) {
      return (
        <>
          <BannerAds />
          <FeedRender style={style} index={index} item={item} user={user} />
        </>
      );
    } else {
      return <FeedRender style={style} index={index} item={item} user={user} />;
    }
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

export default Feed;
