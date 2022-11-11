import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import uuid from "react-native-uuid";

import { Context as AuthContext } from "../config/AuthContext";

import AppText from "../components/AppText";
import MansonryList from "../components/MansonryList";
import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import DropDown from "../components/DropDown";
import GrowInput from "../components/GrowInput";
import AlertModal from "../components/AlertModal";
import ThemeContext from "../config/ThemeContext";
import AppFadeIn from "../components/AppFadeIn";
import Separator from "../components/Separator";
import AppButton from "../components/AppButton";
import FriendBox from "../components/FriendBox";
import ActivityIndicator from "../components/ActivityIndicator";
import PopMessage from "../components/PopMessage";

const { width, height } = Dimensions.get("screen");

const RenameCollection = ({ name, setter, id }) => {
  const theme = useContext(ThemeContext);
  const { updateCollection } = useContext(AuthContext);
  const [text, setText] = useState(name ?? "");

  const renameCollection = () => {
    updateCollection(
      {
        id,
        type: "update",
        name: text,
      },
      (resData) => {
        setter.setCollection((prev) => ({
          ...prev,
          name: resData.name,
        }));
        setter.setRenameModal(false);
      },
      (errData) => {
        console.log(errData);
      }
    );
  };

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
          onPress={renameCollection}
          bare
          style={styles.modalBtn}
        />
      </View>
    </View>
  );
};

const ShareCollection = ({ setter, id }) => {
  const theme = useContext(ThemeContext);
  const {
    state: { userInfo },
    getUserData,
    updateCollection,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [weebos, setWeebos] = useState([]);

  const fetchWeebs = useCallback(() => {
    // setLoading(true);
    getUserData(
      {
        id: userInfo._id,
        type: "get_weebs",
        query: "",
      },
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

  const shareCollection = (userId) => {
    updateCollection(
      {
        id,
        type: "share",
        user: userId,
      },
      (resData) => {
        setter.setPopper({
          vis: true,
          type: "success",
          msg: "Collection shared successfully",
        });
        setter.setShareModal(false);
      },
      (errData) => {
        console.log(errData);
      }
    );
  };

  useEffect(() => {
    if (setter.vis) {
      fetchWeebs();
    }
  }, []);

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
                callback={(data) => shareCollection(data._id)}
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

const CollectionScreen = ({ route, navigation }) => {
  const [dropMenu, setDropMenu] = useState(false);
  const [prompt, setPrompt] = useState({ visible: false });
  const [renameModal, setRenameModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [collection, setCollection] = useState({ media: [] });
  const [popper, setPopper] = useState({ vis: false });

  const theme = useContext(ThemeContext);
  const {
    updateCollection,
    getUserData,
    state: { userInfo },
  } = useContext(AuthContext);

  const pageData = route?.params?.item;

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
        updateCollection(
          {
            id: pageData._id,
            type: "delete",
          },
          (resData) => {
            navigation.goBack();
          },
          (errData) => {
            console.log(errData);
          }
        );
        break;

      default:
        break;
    }
  };

  const fetchCollectionPosts = (cb) => {
    getUserData(
      {
        id: userInfo._id, // could be any user so change this,
        type: "get_collection_posts",
        query: pageData.name,
      },
      (resData) => {
        // console.log(resData);
        setCollection({ name: pageData?.name, media: resData.collections });
        cb && cb();
      },
      (errData) => {
        console.log(errData);
        cb && cb();
      }
    );
  };

  useEffect(() => {
    fetchCollectionPosts();
  }, []);

  return (
    <Screen style={styles.container}>
      <AppHeader
        title={`${collection?.name ?? pageData.name} Collections`}
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
      <MansonryList
        media={collection?.media}
        handleRefresh={fetchCollectionPosts}
        data={{ isMine: true }}
      />
      <DropDown visible={dropMenu} setVisible={setDropMenu} lists={dropLists} />
      <AlertModal obj={prompt} setVisible={setPrompt} onPress={handlePrompt} />
      <AppFadeIn
        visible={renameModal}
        setVisible={setRenameModal}
        RenderComponent={() => (
          <RenameCollection
            name={pageData?.name}
            setter={{ setCollection, setRenameModal }}
            id={pageData?._id}
          />
        )}
      />
      <AppFadeIn
        visible={shareModal}
        setVisible={setShareModal}
        RenderComponent={() => (
          <ShareCollection
            setter={{ setShareModal, vis: shareModal, setPopper }}
            id={pageData?._id}
          />
        )}
      />
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
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
