import React, { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import MasonryList from "@react-native-seoul/masonry-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ThemeContext from "../config/ThemeContext";

import { Context as AuthContext } from "../config/AuthContext";

import LoaderImage from "./LoaderImage";
import MediaModal from "./MediaModal";
import AppText from "./AppText";
import colors from "../constants/colors";
import getVideoTime from "../constants/getVideoTime";
import DropDown from "./DropDown";
import AppFadeIn from "./AppFadeIn";
import { RenderCollections } from "../screens/SavedCollectionScreen";
import PopMessage from "./PopMessage";
import ActivityIndicator from "./ActivityIndicator";

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

const RenderUserCollections = ({ isMine, collections = [], item }) => {
  const { addToCollection } = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const [bools, setBools] = useState({ loading: false });
  const [errMsg, setErrMsg] = useState(null);
  const [msg, setMsg] = useState(null);
  const [popper, setPopper] = useState({ vis: false });

  const onAddToCollection = (coll_item) => {
    setBools({ ...bools, loading: true });
    const data = {
      name: coll_item.name,
      isSingle: true,
      postData: {
        postId: coll_item.postId ?? item.postId,
        type: "post", // was post b4
        uris: [item],
      },
    };
    setErrMsg(null);
    setMsg(null);

    addToCollection(
      data,
      (_resData) => {
        // setMsg("Added to collection successfully");
        setPopper({
          vis: true,
          msg: "Added to collection successfully",
          type: "success",
        });
        setBools({ ...bools, loading: false });
      },
      (err) => {
        console.log(err);
        setErrMsg(err.data ?? err.msg);
        setBools({ ...bools, loading: false });
        // setLoading(false);
      },
      false //callDispatch = false
    );
  };

  return (
    <View style={[styles.collections, { backgroundColor: theme.background }]}>
      {errMsg && <AppText style={styles.error}> {errMsg} </AppText>}
      {msg && (
        <AppText bold size="large" style={styles.message}>
          {msg}
        </AppText>
      )}
      <RenderCollections
        onPress={onAddToCollection}
        collections={collections}
        noPadding
      />
      <ActivityIndicator
        style={styles.activity}
        visible={bools.loading}
        wTransparent={bools.loading}
      />
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
    </View>
  );
};

export default function MansonryList({ media, handleRefresh, data }) {
  // data = {isMine}
  const [refreshing, setRefreshing] = useState(false);
  const [displayMedia, setDisplayMedia] = useState({ vis: false, data: null });
  const [menu, setMenu] = useState({ vis: false, item: null, collections: [] });
  const [actions, setActions] = useState({ collection: false });

  const theme = useContext(ThemeContext);
  const {
    state: { userInfo },
    getUserData,
    deleteMediaItem,
  } = useContext(AuthContext);

  const onRefresh = () => {
    setRefreshing(true);
    if (handleRefresh) {
      handleRefresh(() => setRefreshing(false));
    } else {
      setRefreshing(false);
    }
  };

  const onEndReached = () => {
    // console.log("End Reached");
  };

  const fetchCollections = () => {
    getUserData(
      {
        id: userInfo._id,
        type: "get_collections",
        query: "",
      },
      (resData) => {
        // setBools({ ...bools, fetch: false });
        setMenu({ ...menu, collections: resData.my_collections });
      },
      (errData) => {
        console.log(errData);
      }
    );
  };

  const openMenu = (item) => {
    setMenu({ ...menu, vis: true, item });
  };

  const onDeleteCollectionItem = () => {
    // id, type, itemId
    const sendData = {
      itemId: menu.item._id,
      id: data.type == "post" ? menu.item.postId : data.collectionId,
      type: data.type,
    };

    // return console.log(sendData);

    deleteMediaItem(
      sendData,
      (resData) => {
        console.log(resData);
        handleRefresh();
      },
      (errData) => {
        console.log(errData);
      }
    );
  };

  const menuList = [
    {
      id: "1",
      name: "Add to Collection",
      show: true,
      onPress: () => setActions({ ...actions, collection: true }),
      icon: "plus",
      iconPack: "F",
    },
    {
      id: "3",
      name: "Flag as inappropriate",
      show: !data?.isMine,
      onPress: () => setActions({ ...actions, collection: true }),
      icon: "flag",
      iconPack: "F",
    },
    {
      id: "2",
      name: "Delete Post",
      show: data?.isMine,
      onPress: () => onDeleteCollectionItem(),
      icon: "trash",
      iconPack: "F",
    },
  ];

  useEffect(() => {
    fetchCollections();
  }, []);

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
      <AppFadeIn
        visible={actions.collection}
        setter={() => setActions({ ...actions, collection: false })}
        RenderComponent={() => (
          <RenderUserCollections
            isMine={data?.isMine}
            collections={menu.collections}
            item={menu.item}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  container: {
    flex: 1,
  },
  collections: {
    width: width * 0.98,
    height: height * 0.9,
    borderRadius: 18,
    paddingLeft: 5,
    paddingVertical: 5,
  },
  error: {
    textAlign: "center",
    marginVertical: 10,
    color: colors.heart,
    width: "80%",
    alignSelf: "center",
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
  message: {
    textAlign: "center",
    marginVertical: 12,
    width: "80%",
    alignSelf: "center",
    color: colors.greenDark,
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
