import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Context as FeedContext } from "../config/FeedContext";
import { Context as AuthContext } from "../config/AuthContext";

import colors from "../constants/colors";
import gradients from "../constants/gradients";
import AppText from "./AppText";
import Link from "./Link";
import Separator from "./Separator";
import GrowInput from "./GrowInput";
import AppButton from "./AppButton";
import ActivityIndicator from "./ActivityIndicator";
import PopMessage from "./PopMessage";
import ThemeContext from "../config/ThemeContext";

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
  getPosts,
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

    const renderCollection = ({ item, index }) => {
      let colNum;
      index % 2 == 0 ? (colNum = 1) : (colNum = 2);
      return (
        <TouchableOpacity
          onPress={() => handleAddToCollection(item)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[gradients[colNum].bg, gradients[colNum].bg1]}
            style={styles.collBox}
          >
            <AppText style={styles.collText} bold>
              {item.name}
            </AppText>
          </LinearGradient>
        </TouchableOpacity>
      );
    };

    return (
      <>
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
          renderItem={renderCollection}
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
    setAction(false);
    setBoxState({ caption: false, save: false, index: null });
  };
  const hanldeEditCaption = () => {
    editPostCaption(
      pId,
      text,
      () => {
        getPosts();
      },
      (err) => setError(err)
    );
    handleCloseModal();
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

  return (
    <Modal
      statusBarTranslucent
      transparent
      animationType="fade"
      onRequestClose={handleCloseModal}
      visible={action}
      style={styles.container}
    >
      <TouchableOpacity
        onPress={handleCloseModal}
        activeOpacity={1}
        style={styles.bg}
      >
        {boxState.caption && (
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
                  title="CANCEL"
                  style={{ alignSelf: "center" }}
                  onPress={() => setBoxState({ ...boxState, caption: false })}
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
        )}
        {(boxState.save || boxState.saveAll) && (
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
        )}
        <TouchableOpacity
          style={[styles.content, { backgroundColor: theme.background }]}
          activeOpacity={1}
        >
          <AppText style={styles.headerTitle} bold>
            {" "}
            POst Actions{" "}
          </AppText>
          <Separator m={12} h={1} />
          <View style={styles.links}>
            {isMine && (
              <Link
                name="Edit Post Caption"
                iconName="pencil"
                onPress={() => onPress("edit")}
              />
            )}
            {isText ? (
              <Link
                name="Copy Text"
                iconName="clipboard-text"
                onPress={() => onPress("copy_text")}
              />
            ) : (
              <Link
                name="Download Post Media"
                iconName="download"
                onPress={() => onPress("download")}
              />
            )}
            {!isText && (
              <>
                <Link
                  name="Add This To My Saved Collection"
                  iconName="star-outline"
                  onPress={() => onPress("save_one")}
                />
                {!isVideo && postUris.length > 1 && (
                  <Link
                    name="Add All To My Saved Collection"
                    iconName="star"
                    onPress={() => onPress("save")}
                  />
                )}
              </>
            )}
            {isMine && (
              <Link
                name="Delete Post"
                iconName="delete"
                onPress={() => onPress("delete")}
              />
            )}
          </View>
        </TouchableOpacity>
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
    // justifyContent: "center",
    // alignItems: "center",
  },
  collBox: {
    // backgroundColor: colors.primary,
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
    width: "100%",
    height: "30%",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    position: "absolute",
    top: "20%",
  },
  captionTwo: {
    width: "100%",
    minHeight: height * 0.5,
    maxHeight: height * 0.62,
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    position: "absolute",
    top: "10%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  content: {
    backgroundColor: colors.white,
    padding: 12,
    marginBottom: 30,
    borderRadius: 20,
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
