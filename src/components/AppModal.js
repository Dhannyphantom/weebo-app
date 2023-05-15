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
import uuid from "react-native-uuid";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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
import { downloadMedia } from "../constants/helpers";
import AppFadeIn from "./AppFadeIn";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const RenderReportItem = ({ item }) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={item.onPress}
      style={styles.reportItem}
    >
      <MaterialCommunityIcons
        name={item.icon}
        color="#ddd"
        size={width * 0.1}
      />
      <AppText> {item.title} </AppText>
    </TouchableOpacity>
  );
};

const RenderPostReports = ({ state, postId }) => {
  const theme = useContext(ThemeContext);
  const [text, setText] = useState("");
  const [bools, setBools] = useState({ showInput: false, loading: false });
  const [popper, setPopper] = useState({ vis: false });

  const { postReport } = useContext(FeedContext);

  const post_reposts = [
    {
      id: uuid.v4(),
      title: "Not anime related",
      onPress: () => handleReportPost({ data: "not_related", type: "default" }),
      icon: "cancel",
    },
    {
      id: uuid.v4(),
      title: "Inappropriate content",
      onPress: () =>
        handleReportPost({ data: "inappropriate", type: "default" }),
      icon: "account-cancel-outline",
    },
    {
      id: uuid.v4(),
      title: "Missing content",
      onPress: () => handleReportPost({ data: "missing", type: "default" }),
      icon: "folder-information-outline",
    },
    {
      id: uuid.v4(),
      title: "Others",
      onPress: () => setBools({ ...bools, showInput: true }),
      icon: "information-outline",
    },
  ];

  const handleReportPost = (complaints) => {
    setBools({ ...bools, loading: true });
    postReport(
      { ...complaints, postId },
      (resData) => {
        setPopper({
          vis: true,
          msg: resData,
          type: "success",
          cb: () => state.setBools({ ...state.bools, report: false }),
        });
        setBools({ ...bools, loading: false });
      },
      (errData) => {
        console.log(errData);
        setPopper({
          vis: true,
          msg: errData.msg,
          type: "failed",
        });
        setBools({ ...bools, loading: false });
      }
    );
  };

  return (
    <View style={[styles.report, { backgroundColor: theme.background }]}>
      <AppText bold style={styles.reportTitle} size="large">
        Report Post
      </AppText>

      {bools.showInput && (
        <View>
          <GrowInput
            text={text}
            setText={setText}
            placeholder="Enter complaints..."
          />
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <AppButton
              onPress={() => handleReportPost({ data: text, type: "others" })}
              title="Report"
              bare
              style={styles.reportBtn}
            />
            <AppButton
              title="Cancel"
              onPress={() => setBools({ ...bools, showInput: false })}
              bare
              bareRed
              style={styles.reportBtn}
            />
          </View>
        </View>
      )}

      <FlatList
        data={post_reposts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={RenderReportItem}
      />
      <PopMessage
        popData={popper}
        timer={0.6}
        setter={() => setPopper({ vis: false })}
      />
      <ActivityIndicator visible={bools.loading} wTransparent absolute />
    </View>
  );
};

const RenderTags = ({ tags, translator, handleCloseModal }) => {
  const theme = useContext(ThemeContext);

  const navigation = useNavigation();
  const opaciter = translator.interpolate({
    inputRange: [0, height / 2],
    outputRange: [1, 0],
  });

  const navigateToTagInstance = (tag) => {
    switch (tag.name) {
      case "character":
        navigation.navigate("Character", { item: tag[tag.name]._id });
        break;
      case "show":
        // return console.log(tag);
        navigation.navigate("Show", { show: { _id: tag[tag.name]._id } });
        break;
      case "channel":
        // return console.log(tag);
        navigation.navigate("ChannelPost", { id: tag[tag.name]._id });
        break;

      default:
        break;
    }
    handleCloseModal();
  };

  const renderTagItems = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.tagContainer, { backgroundColor: theme.extralight }]}
        onPress={() => navigateToTagInstance(item)}
        key={uuid.v4()}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons color={colors.primary} name="circle-double" />
        <AppText bold size="large" style={styles.tagName}>
          {item[item.name].name_j ||
            item[item.name].name_e ||
            item[item.name].name ||
            item[item.name].dpName}
        </AppText>
        <AppText> &bull; </AppText>
        <AppText> {item.name} </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={{ opacity: opaciter }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleCloseModal}
        style={styles.close}
      >
        <MaterialCommunityIcons
          name="close"
          size={30}
          color={colors.heartDark}
        />
      </TouchableOpacity>
      <View style={[styles.tags, { backgroundColor: theme.background }]}>
        {tags.map((item) => renderTagItems({ item }))}
      </View>
    </Animated.View>
  );
};

const AppModal = ({
  action,
  pId,
  setAction,
  onPress,
  isMine,
  isVideo,
  isText,
  tags,
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
  const [bools, setBools] = useState({ loading: false, report: false });

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
          setErrMsg(err.data ?? err.msg);
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
                style={{ alignSelf: "center", marginTop: 15 }}
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
          style={styles.activityCollection}
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

  const showContent = async (str, close) => {
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
    } else if (str?.startsWith("download")) {
      setBools({ ...bools, loading: true });
      const { result, error } = downloadMedia(postUris);
      // fix download media await promise
      if (error) {
        setPopData({
          vis: true,
          msg: error,
          type: "failed",
        });
      } else {
        setPopData({
          vis: true,
          msg: "Media saved",
          type: "success",
        });
      }
      setBools({ ...bools, loading: false });
    } else if (str === "report") {
      setBools({ ...bools, report: true });
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
                style={{ width: width * 0.85 }}
                text={text}
                ref={growInputRef}
                setText={setText}
                placeholder={placeholder}
              />
              {oldText === text || text == "" ? (
                <AppButton
                  title="Cancel"
                  style={{ alignSelf: "center", marginTop: 15 }}
                  onPress={() => {
                    showContent("edit", true);
                    Keyboard.dismiss();
                  }}
                  bare
                  bareRed
                  LIcon="cancel"
                />
              ) : (
                <AppButton
                  style={{ alignSelf: "center", marginTop: 15 }}
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
                  style={{ width: "90%" }}
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
        <RenderTags
          tags={tags}
          handleCloseModal={handleCloseModal}
          translator={translator}
        />
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
              <Link
                name="Report Post"
                iconName="information-outline"
                onPress={() => showContent("report")}
              />
            </View>
          </TouchableOpacity>
          <ActivityIndicator
            visible={bools.loading}
            style={styles.activity}
            wTransparent
          />
        </Animated.View>
      </TouchableOpacity>
      <PopMessage popData={popData} setter={() => setPopData({ vis: false })} />
      <AppFadeIn
        visible={bools.report}
        setter={() => setBools({ ...bools, report: false })}
        RenderComponent={() => (
          <RenderPostReports state={{ bools, setBools }} postId={pId} />
        )}
      />
    </Modal>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  activityCollection: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  bg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  box: {
    flex: 1,
  },
  close: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 100,
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
  report: {
    width: width * 0.95,
    padding: 20,
    borderRadius: 20,
  },
  reportTitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  reportItem: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: width * 0.4,
    margin: 6,
    marginVertical: 20,
    marginBottom: 15,
  },
  reportBtn: {
    alignSelf: "center",
    marginTop: 15,
    marginHorizontal: 6,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: width * 0.97,
    padding: 10,
    marginVertical: 12,
    borderRadius: 12,
    alignSelf: "center",
    maxHeight: height * 0.5,
    paddingBottom: 0,
  },
  tagContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    marginRight: 6,
    borderRadius: 8,
  },
  tagName: {
    textTransform: "capitalize",
    marginLeft: 7,
  },
});

export default AppModal;
