import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../components/AppText";
import MansonryList from "../components/MansonryList";
import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import getTimeStamp from "../constants/getTimestamp";

const CollectionScreen = ({ route }) => {
  const [postsArr, setPostArr] = useState([]);
  const [media, setMedia] = useState([]);
  const [isPostEmpty, setIsPostEmpty] = useState(true);
  const pageData = route?.params?.item;
  let counter = 0;
  let allUris = [];

  useEffect(() => {
    for (let i = 0; i < postsArr.length; i++) {
      const e = postsArr[i];
      allUris = allUris.concat(e.uris);
      for (let j = 0; j < e?.uris.length; j++) {
        counter++;
      }
    }
    setMedia(allUris);
    counter > 0 && setIsPostEmpty(false);
  }, [postsArr]);

  useEffect(() => {
    setPostArr(pageData.posts);
  }, [route]);

  return (
    <Screen style={styles.container}>
      <AppHeader title={`${pageData.name} Collections`} />
      {!isPostEmpty && <MansonryList data={postsArr} media={media.reverse()} />}

      {/* <MansonryList images={gallery} /> */}
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginVertical: 6,
    fontSize: 16,
  },
});
export default CollectionScreen;
