import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

import AppText from "./AppText";
import { Context as FeedContext } from "../config/FeedContext";
import ThemeContext from "../config/ThemeContext";
import { AntDesign } from "@expo/vector-icons";
import colors from "../constants/colors";
import AppFadeIn from "./AppFadeIn";
import LoaderImage from "./LoaderImage";
import AppButton from "./AppButton";
import ActivityIndicator from "./ActivityIndicator";

const { width, height } = Dimensions.get("screen");

const RetryModal = ({ data, hideModal, setBools }) => {
  const { postPix } = useContext(FeedContext);

  const theme = useContext(ThemeContext);

  const mediaPost = data.data.post;
  const mediaPlaceholder = mediaPost[0];
  const hasMoreMedia = Array.isArray(mediaPost) && mediaPost?.length > 1;

  // console.log({ mediaPlaceholder, mediaPost, data });

  const handleRetryUpload = () => {
    if (data.context === "FeedContext" && data.url === "postPix") {
      postPix(
        data.data,
        async () => {
          // success
          await AsyncStorageLib.removeItem("failed_upload");
          setBools({ isSuccess: true });
        },
        () => {
          // error
          setBools({ isSuccess: false });
        }
      );
      hideModal();
      setBools({ isLoading: true });
    }
  };

  return (
    <View style={[styles.modal, { backgroundColor: theme.background }]}>
      <AppText size="large" style={styles.modalTitle} bold>
        Re-Upload Media
      </AppText>
      <AppText size="small" style={styles.modalSubtitle}>
        Retry uploading failed media upload now{" "}
      </AppText>
      <View style={styles.modalMedia}>
        {mediaPlaceholder && mediaPlaceholder.type === "image" && (
          <Image
            source={{ uri: mediaPlaceholder.uri }}
            style={{
              width: "95%",
              height: height * 0.45,
              borderRadius: 8,
            }}
          />
        )}
      </View>
      {hasMoreMedia && (
        <View style={styles.modalMore}>
          <AppText size="small" bold>
            {" "}
            +{mediaPost.length - 1} more media
          </AppText>
        </View>
      )}
      <View>
        <AppButton
          title={"Retry upload"}
          bare
          style={styles.modalBtn}
          onPress={handleRetryUpload}
        />
      </View>
    </View>
  );
};

const RetryMediaUpload = ({ data }) => {
  if (!Boolean(data)) return null;
  const theme = useContext(ThemeContext);

  const [bools, setBools] = useState({
    isLoading: false,
    isSuccess: false,
  });
  const [modal, setModal] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setModal(true)}
        style={[styles.content, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator
          visible={true}
          autoPlay={true}
          speed={bools.isLoading ? 5 : 1}
          size={0.1}
          transparent
          absolute
          type="retry"
        />
      </Pressable>
      <AppFadeIn
        visible={modal}
        setVisible={setModal}
        RenderComponent={() => (
          <RetryModal
            data={data}
            hideModal={() => setModal(false)}
            setBools={(val) => setBools({ ...bools, ...val })}
          />
        )}
      />
    </View>
  );
};

export default RetryMediaUpload;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: height * 0.35,
    right: 10,
    alignItems: "center",
    zIndex: 5,
  },
  content: {
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  modal: {
    width: width * 0.95,
    borderRadius: 20,
    minHeight: height * 0.6,
  },
  modalBtn: {
    width: "80%",
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  modalTitle: {
    textAlign: "center",
    marginVertical: 10,
  },
  modalMedia: {
    alignItems: "center",
    maxHeight: height * 0.5,
  },
  modalMore: {
    alignSelf: "center",
    marginTop: 15,
    borderBottomWidth: 3,
    borderRadius: 3,
  },
  modalSubtitle: {
    textAlign: "center",
    marginBottom: 15,
  },
});
