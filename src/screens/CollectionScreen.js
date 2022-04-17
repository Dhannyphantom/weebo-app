import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../components/AppText";
import MansonryList from "../components/MansonryList";
import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import getTimeStamp from "../constants/getTimestamp";

const CollectionScreen = ({ route }) => {
  const [gallery, setGallery] = useState([]);
  const pageData = route?.params?.item;

  useEffect(() => {
    const elem = pageData.posts;
    const postUris = [];
    if (elem[0]) {
      for (let i = 0; i < elem.length; i++) {
        const e = elem[i];
        const time = getTimeStamp(e._id, "raw");

        for (let j = 0; j < e.uris.length; j++) {
          const f = e.uris[j];
          postUris.push({ ...f, postId: e.postId, time });
        }
      }
    }
    setGallery(postUris);
  }, [route]);

  return (
    <Screen style={styles.container}>
      <AppHeader title={`${pageData.name} Collections`} />
      <MansonryList images={gallery} />
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
