import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import uuid from "react-native-uuid";

import { Context as AuthContext } from "../config/AuthContext";

import AppText from "../components/AppText";
import MansonryList from "../components/MansonryList";
import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import getTimeStamp from "../constants/getTimestamp";
import colors from "../constants/colors";
import DropDown from "../components/DropDown";
import GrowInput from "../components/GrowInput";
import AlertModal from "../components/AlertModal";
import ThemeContext from "../config/ThemeContext";
import AppFadeIn from "../components/AppFadeIn";
import Separator from "../components/Separator";
import AppButton from "../components/AppButton";
import FriendBox from "../components/FriendBox";
import ActivityIndicator from "../components/ActivityIndicator";

const { width, height } = Dimensions.get("screen");

const RenameCollection = ({ name, id }) => {
  const theme = useContext(ThemeContext);
  const [text, setText] = useState(name ?? "");

  return (
    <View style={[styles.modal, { backgroundColor: theme.background }]}>
      <AppText style={styles.modalHeaderText} size="large" bold>
        Rename Collection
      </AppText>
      <Separator h={2} />
      <View>
        <GrowInput
          text={text}
          setText={setText}
          placeholder={`Rename ${name} collection`}
          mLine={false}
        />

        <AppButton
          title="Rename"
          onPress={() => console.log(text)}
          bare
          style={styles.modalBtn}
        />
      </View>
    </View>
  );
};
const ShareCollection = ({ name, id }) => {
  const theme = useContext(ThemeContext);
  const {
    state: { userInfo },
    getUserData,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [weebos, setWeebos] = useState([]);

  const fetchWeebs = useCallback(() => {
    getUserData(
      userInfo._id,
      "get_weebs",
      (res_data) => {
        setWeebos(res_data.friends);
        setLoading(false);
      },
      (err_data) => {
        console.log(err_data?.err?.response?.data);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    fetchWeebs();
  }, []);

  console.log(weebos);

  return (
    <View
      style={[
        styles.modal,
        { backgroundColor: theme.background, minHeight: height * 0.5 },
      ]}
    >
      <>
        <AppText style={styles.modalHeaderText} size="large" bold>
          Share Collection
        </AppText>
        <Separator h={2} />
        {!loading && (
          <>
            {weebos[0] ? (
              <FriendBox
                length={0.9}
                data={weebos}
                type="share"
                friended
                callback={(data) => console.log(data)}
              />
            ) : (
              <ActivityIndicator
                type="isEmpty"
                visible={true}
                text="You don't have a fellow weeb"
              />
            )}
          </>
        )}
      </>
      <ActivityIndicator
        visible={loading}
        wTransparent
        style={styles.activity}
      />
    </View>
  );
};

const CollectionScreen = ({ route }) => {
  const [postsArr, setPostArr] = useState([]);
  const [media, setMedia] = useState([]);
  const [dropMenu, setDropMenu] = useState(false);
  const [prompt, setPrompt] = useState({ visible: false });
  const [renameModal, setRenameModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [isPostEmpty, setIsPostEmpty] = useState(true);

  const theme = useContext(ThemeContext);
  const pageData = route?.params?.item;

  let counter = 0;
  let allUris = [];
  const dropLists = [
    {
      id: uuid.v4(),
      name: "Rename Collection",
      onPress: () => setRenameModal(true),
      show: true,
      icon: "edit",
      iconPack: "F",
    },

    {
      id: uuid.v4(),
      name: "Share Collection",
      onPress: () => setShareModal(true),
      show: true,
      icon: "share",
      iconPack: "F",
    },
    {
      id: uuid.v4(),
      name: "Delete Collection",
      onPress: () =>
        setPrompt({
          visible: true,
          title: "Delete Collection",
          message: `Are you sure you want to delete your ${pageData.name} collection?`,
          type: "delete_collection",
          btn: "Delete",
        }),
      show: true,
      icon: "trash",
      iconPack: "F",
    },
  ];

  const handlePrompt = () => {
    switch (prompt?.type) {
      case "delete_collection":
        console.log("DELETE COLLECTION");
        break;

      default:
        break;
    }
  };

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
      <AppHeader
        title={`${pageData.name} Collections`}
        RightComponent={() => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.moreIcon}
            onPress={() => setDropMenu(true)}
          >
            <Feather name="more-vertical" size={19} color={theme.color} />
          </TouchableOpacity>
        )}
      />
      {!isPostEmpty && <MansonryList data={postsArr} media={media.reverse()} />}
      <DropDown visible={dropMenu} setVisible={setDropMenu} lists={dropLists} />
      <AlertModal obj={prompt} setVisible={setPrompt} onPress={handlePrompt} />
      <AppFadeIn
        visible={renameModal}
        setVisible={setRenameModal}
        RenderComponent={() => (
          <RenameCollection name={pageData?.name} id={pageData?._id} />
        )}
      />
      <AppFadeIn
        visible={shareModal}
        setVisible={setShareModal}
        RenderComponent={() => (
          <ShareCollection name={pageData?.name} id={pageData?._id} />
        )}
      />
    </Screen>
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
  moreIcon: {
    padding: 10,
  },
  modal: {
    width: width * 0.97,
    borderRadius: 18,
    overflow: "hidden",
  },
  modalHeaderText: {
    textAlign: "center",
    marginTop: 12,
    marginBottom: 5,
  },
  modalBtn: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    textAlign: "center",
    marginVertical: 6,
    fontSize: 16,
  },
});
export default CollectionScreen;
