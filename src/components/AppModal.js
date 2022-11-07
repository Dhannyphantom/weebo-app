import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  Animated,
  Easing,
  Keyboard,
} from "react-native";

import { Context as FeedContext } from "../config/FeedContext";
import { Context as AuthContext } from "../config/AuthContext";

import colors from "../constants/colors";
import AppText from "./AppText";
import Link from "./Link";
import Separator from "./Separator";
import GrowInput from "./GrowInput";
import AppButton from "./AppButton";
import ActivityIndicator from "./ActivityIndicator";
import PopMessage from "./PopMessage";
import ThemeContext from "../config/ThemeContext";
import { CollectionCard } from "../screens/SavedCollectionScreen";

const { height, width } = Dimensions.get("window");

const AppModal = ({
  action,
  pId,
  setAction,
  onPress,
  isMine,
  isVideo,
  isText,
  setError,
  editPostCaption,
  postUris,
  boxState,
  setBoxState,
  updatePosts,
  placeholder,
}) => {
  const { addNewCollection } = useContext(FeedContext);
  const {
    updateMe,
    addToCollection,
    state: { userInfo },
  } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [oldText, setOldText] = useState("");
  const [collectionText, setCollectionText] = useState("");
  const [isNewCollLoading, setIsNewCollLoading] = useState(false);
  const [collectionData, setCollectionData] = useState(userInfo.my_collections);
  const [showText, setShowText] = useState(false);
  const [popData, setPopData] = useState({ vis: false });
  const [errMsg, setErrMsg] = useState(null);

  const growInputRef = useRef();
  const growInputRefTwo = useRef();
  const translator = useRef(new Animated.Value(height / 2)).current;
  const contentX = useRef(new Animated.Value(0.85)).current;
  const contentXb = useRef(new Animated.Value(0.85)).current;
  const contentXOpaciter = contentX.interpolate({
    inputRange: [0.85, 1],
    outputRange: [0, 1],
  });
  const contentXbOpaciter = contentXb.interpolate({
    inputRange: [0.85, 1],
    outputRange: [0, 1],
  });

  let collBtnText = "New Collection";
  const theme = useContext(ThemeContext);

  const RenderCollection = () => {
    //
    const handleAddToCollection = (item) => {
      setIsNewCollLoading(true);
      setErrMsg(null);
      let urisArr = [];
      if (boxState.index && boxState.index > -1) {
        for (let i = 0; i < postUris.length; i++) {
          const e = postUris[i];
          if (i + 1 == boxState.index) {
            // urisArr = [{ uri: e.uri, width: e.width, height: e.height }];
            const postObj = { ...e };
            delete postObj._id;
            urisArr.push(postObj);
            break;
          }
        }
      } else {
        urisArr = postUris.map((obj) => {
          return { ...obj };
          // return { uri: obj.uri, width: obj.width, height: obj.height };
        });
      }
      const data = {
        name: item.name,
        isSingle: boxState.index !== null ? true : false,
        postData: {
          postId: pId,
          type: "post",
          uris: urisArr,
        },
      };
      addToCollection(
        data,
        () => {
          setPopData({
            vis: true,
            type: "success",
            msg: "Added to collection!",
          });
          setIsNewCollLoading(false);
        },
        (err) => {
          setErrMsg(err);
          setIsNewCollLoading(false);
        }
      );
    };

    return (
      <>
        {/* use RenderCollections component from SavedCollectioScreen */}
        <FlatList
          data={collectionData}
          style={{ flex: 1, height: height * 0.54 }}
          ListHeaderComponent={
            <>
              <AppButton
                title={collBtnText}
                onPress={handleNewCollection}
                style={{ alignSelf: "center" }}
                LIcon="plus"
                bare
              />
              {errMsg && <AppText style={styles.error}>{errMsg}</AppText>}
            </>
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <ActivityIndicator
              type="isEmpty"
              visible={true}
              style={{ marginTop: 30 }}
              text="No collections"
            />
          }
          numColumns={3}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => (
            <CollectionCard
              onPress={handleAddToCollection}
              item={item}
              index={index}
            />
          )}
        />
        <ActivityIndicator
          style={{ position: "absolute", width: "100%", height: height * 0.5 }}
          type="spin"
          visible={isNewCollLoading}
          wTransparent
        />
      </>
    );
  };

  const handleCloseModal = () => {
    showContent(null, true);
    Animated.timing(translator, {
      toValue: height / 2,
      useNativeDriver: true,
    }).start(() => {
      setAction(false);
      setBoxState({ caption: false, save: false, index: null });
    });
  };
  const hanldeEditCaption = () => {
    editPostCaption(
      pId,
      text,
      () => {
        updatePosts();
      },
      (err) => setError(err)
    );
    handleCloseModal();
  };

  const showContent = (str, close) => {
    if (str?.startsWith("edit")) {
      contentXb.setValue(0.85);
      Animated.timing(contentX, {
        toValue: boxState.caption ? 0.85 : 1,
        useNativeDriver: true,
      }).start(() => {
        str && onPress(str);
      });
    } else if (str?.startsWith("save")) {
      Animated.timing(contentXb, {
        toValue: boxState.save || boxState.saveAll ? 0.85 : 1,
        useNativeDriver: true,
      }).start(() => {
        str && onPress(str);
      });
      contentX.setValue(0.85);
    } else if (close) {
      if (str === "delete") return onPress(str);
      Animated.parallel([
        Animated.timing(contentX, {
          toValue: 0.85,
          useNativeDriver: true,
        }).start(() => {
          str && onPress(str);
        }),
        Animated.timing(contentXb, {
          toValue: 0.85,
          useNativeDriver: true,
        }).start(() => {
          str && onPress(str);
        }),
      ]);
    }
  };

  if (collectionText.length > 1) {
    collBtnText = "Save Collection";
  }
  const handleNewCollection = () => {
    const data = {
      name: collectionText,
    };
    if (showText) {
      if (collectionText.length > 1 && collBtnText.startsWith("Save")) {
        setIsNewCollLoading(true);
        addNewCollection(
          data,
          (resData) => {
            setCollectionData(resData);
            updateMe(resData, "my_collections");
            setCollectionText("");
            setIsNewCollLoading(false);
          },
          (err) => {
            console.log(err);
          }
        );
      }
      setShowText(false);
    } else {
      setShowText(true);
    }
  };

  useEffect(() => {
    growInputRefTwo?.current?.focus();
  }, [showText]);

  useEffect(() => {
    setCollectionData(userInfo.my_collections);
    setOldText(placeholder);
    setText(placeholder);
    if (boxState.caption) {
      growInputRef?.current?.focus();
    }
    setErrMsg(null);
  }, [boxState]);

  useEffect(() => {
    if (action) {
      translator.setValue(height / 2);
      Animated.timing(translator, {
        toValue: 0,
        duration: 600,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }).start();
    }
  }, [action]);

  return (
    <Modal
      statusBarTranslucent
      transparent
      animationType="fade"
      onRequestClose={handleCloseModal}
      visible={action}
    >
      <TouchableOpacity
        onPress={handleCloseModal}
        activeOpacity={1}
        style={styles.bg}
      >
        <Animated.View
          style={{
            ...styles.contentContainer,
            transform: [{ scale: contentX }],
            opacity: contentXOpaciter,
            zIndex: contentXOpaciter,
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.caption, { backgroundColor: theme.background }]}
          >
            <AppText style={styles.headerTitle} bold>
              Edit Caption
            </AppText>
            <Separator h={1} />
            <View style={styles.box}>
              <GrowInput
                style={{ width: width * 0.85, marginBottom: 20 }}
                text={text}
                ref={growInputRef}
                setText={setText}
                placeholder={placeholder}
              />
              {oldText === text || text == "" ? (
                <AppButton
                  title="CLOSE"
                  style={{ alignSelf: "center" }}
                  onPress={() => {
                    showContent("edit", true);
                    Keyboard.dismiss();
                  }}
                  bare
                />
              ) : (
                <AppButton
                  style={{ alignSelf: "center" }}
                  title="EDIT"
                  onPress={hanldeEditCaption}
                />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={{
            ...styles.contentContainer,
            transform: [{ scale: contentXb }],
            opacity: contentXbOpaciter,
            zIndex: contentXbOpaciter,
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.captionTwo, { backgroundColor: theme.background }]}
          >
            <AppText style={styles.headerTitle} bold>
              Save {boxState.save ? "This" : boxState.saveAll ? "All" : null} To
              My Collection
            </AppText>
            <Separator h={1} />
            <View style={{ ...styles.box }}>
              {showText && (
                <GrowInput
                  style={{ width: "90%", marginBottom: 15 }}
                  text={collectionText}
                  mLine={false}
                  ref={growInputRefTwo}
                  setText={setCollectionText}
                  placeholder="Collection's name"
                />
              )}
              <RenderCollection />
            </View>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ transform: [{ translateY: translator }] }}>
          <TouchableOpacity
            style={[styles.content, { backgroundColor: theme.background }]}
            activeOpacity={1}
          >
            <AppText style={styles.headerTitle} bold>
              Post Actions
            </AppText>
            <Separator m={12} h={1} />
            <View style={styles.links}>
              {isMine && (
                <Link
                  name="Edit Post Caption"
                  iconName="pencil"
                  onPress={() => showContent("edit")}
                />
              )}
              {isText ? (
                <Link
                  name="Copy Text"
                  iconName="clipboard-text"
                  onPress={() => showContent("copy_text", true)}
                />
              ) : (
                <Link
                  name="Download Post Media"
                  iconName="download"
                  onPress={() => showContent("download", true)}
                />
              )}
              {!isText && (
                <>
                  <Link
                    name="Add To My Collection"
                    iconName="star-outline"
                    onPress={() => showContent("save_one")}
                  />
                  {!isVideo && postUris.length > 1 && (
                    <Link
                      name="Add All To My Collection"
                      iconName="star"
                      onPress={() => showContent("save")}
                    />
                  )}
                </>
              )}
              {isMine && (
                <Link
                  name="Delete Post"
                  iconName="delete"
                  onPress={() => showContent("delete", true)}
                />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
      <PopMessage popData={popData} setter={() => setPopData({ vis: false })} />
    </Modal>
  );
};
const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  box: {
    flex: 1,
  },
  collBox: {
    height: width * 0.27,
    width: width * 0.3,
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: width * 0.005,
    marginTop: 8,
  },
  collText: {
    textAlign: "center",
    color: colors.white,
    fontSize: 17,
    marginBottom: 5,
  },
  caption: {
    width: "97%",
    height: "30%",
    padding: 20,
    borderRadius: 20,
  },
  captionTwo: {
    width: "97%",
    minHeight: height * 0.5,
    maxHeight: height * 0.64,
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  content: {
    backgroundColor: colors.white,
    padding: 12,
    marginBottom: 30,
    borderRadius: 20,
  },
  contentContainer: {
    position: "absolute",
    top: 0,
    width,
    height: height * 0.66,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    textTransform: "capitalize",
    textAlign: "center",
    marginTop: 5,
    color: colors.white,
    padding: 5,
    borderRadius: 10,
    backgroundColor: colors.heart,
  },
  headerTitle: {
    textAlign: "center",
    textTransform: "uppercase",
  },
  links: {
    justifyContent: "space-evenly",
  },
});
export default AppModal;
