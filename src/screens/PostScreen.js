import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";

import Avatar from "../components/Avatar";
import Screen from "../components/Screen";
import colors from "../constants/colors";
import vidMaxChecker from "../constants/vidMaxChecker";

import { Context as AuthContext } from "../config/AuthContext";
import { Context as FeedContext } from "../config/FeedContext";
import { Context as AcctContext } from "../config/AcctContext";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import PostVideo from "../components/PostVideo";
import AppHeader from "../components/AppHeader";
import SearchBar from "../components/SearchBar";
import GrowInput from "../components/GrowInput";
import ActivityIndicator from "../components/ActivityIndicator";
import PopMessage from "../components/PopMessage";
import SearchInstance from "../components/SearchInstance";
import ThemeContext from "../config/ThemeContext";
import { postColors as colorSet } from "../constants/colors";
const screen = Dimensions.get("window");

const PostScreen = ({ route, navigation }) => {
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const { postPix } = useContext(FeedContext);
  const { searchStuffs } = useContext(AcctContext);

  const router = route.params;
  const writer = route.params.write;
  // write = {id , write(bool)}
  const asset = writer ? null : route.params.uri;
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const [tagLists, setTagLists] = useState([]);
  const [tagged, setTagged] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popper, setPopper] = useState({ vis: false });
  const [display, setDisplay] = useState(asset);
  const [errMsg, setErrMsg] = useState(null);
  const [progBar, setProgBar] = useState(0);
  const [color, setColor] = useState(colorSet);
  const [input, setInput] = useState("");
  //get rid of one below
  const [media, setMedia] = useState(writer ? [] : [asset.uri]);
  const [flatStuffs, setFlatStuffs] = useState(writer ? [] : [asset]);

  const flatt = useRef();
  const searchInputRef = useRef(null);
  const mainFlatListRef = useRef(null);
  const textRef = useRef(null);
  const instanceData = {
    id: router.id,
    type: router.type,
  };
  const tagGroups = tagLists.filter((obj) => obj.type === "group");
  const tagShows = tagLists.filter((obj) => obj.type === "show");
  const tagCharacters = tagLists.filter((obj) => obj.type === "character");
  //
  const theme = useContext(ThemeContext);
  const getBgColor = () => {
    const data = color.find((item) => item.active === true);
    return data;
  };

  const textObj = {
    text: input,
    bg: getBgColor().bg,
    tColor: getBgColor().text,
  };
  const data = {
    title: writer ? textObj : text.trim(),
    type: writer ? "text" : asset.type,
    post: media,
    instancePost: router.type ? instanceData : null,
    meta: flatStuffs,
    tags: tagged,
  };

  //
  let tagTitle;

  !tagged[0] && !showTag
    ? (tagTitle = "Add")
    : showTag
    ? (tagTitle = "Hide")
    : (tagTitle = "Show");

  const handlePost = () => {
    if (!tagged[0]) return setErrMsg("Please add at least a tag");
    setShowTag(false);
    if (!userInfo.verified) {
      setPopper({
        vis: true,
        type: "failed",
        msg: "Pleae verify your account!",
      });
      return;
    }
    if (input.length < 1 && writer) {
      textRef?.current?.focus();
      return setErrMsg("Please write a post");
    }
    setIsLoading(true);
    setErrMsg(null);
    postPix(
      data,
      () => {
        setIsLoading(false);
        navigation.goBack();
      },
      (err) => {
        setErrMsg(err.msg);
        console.log(err);
        console.log(err.err?.response?.data);
        setIsLoading(false);
      },
      (e) => {
        setProgBar(Math.floor((e.loaded / e.total) * 100));
      }
    );
  };

  const handleAddMore = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (result.cancelled || media.length > 9) return;
    setDisplay(result);
    setMedia([...media, result.uri]);
    setFlatStuffs([...flatStuffs, result]);
  };

  const handleChangeVideo = async () => {
    const prevPost = display;
    setDisplay(null);
    setErrMsg(null);
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    //// CHECK THE DURATION

    if (!res.cancelled) {
      const { bool, vidErr } = vidMaxChecker(res.duration, 5);
      if (bool) {
        setMedia([]);
        return setErrMsg(vidErr);
      }
      setMedia(res);
      setDisplay(res);
    } else {
      setDisplay(prevPost);
    }
  };

  const handleChangeImage = (item) => {
    setDisplay(item);
  };

  const handleRemoveImage = (item) => {
    setFlatStuffs(flatStuffs.filter((obj) => obj.uri !== item.uri));
    setMedia(media.filter((uri) => uri !== item.uri));
    display.uri == item.uri ? setDisplay(flatStuffs[0]) : null;
  };

  const handleSearchTag = () => {
    setSearchLoading(true);
    searchStuffs(
      { term: search, type: "all" },
      (resData) => {
        const series = resData.series;
        const groups = resData.groups;
        const characters = resData.characters;
        series.map((obj) => (obj.type = "show"));
        groups.map((obj) => (obj.type = "group"));
        characters.map((obj) => (obj.type = "character"));
        setTagLists(series.concat(groups, characters));
        setSearchLoading(false);
      },
      (err) => {
        // setErrMsg(err);
        setSearchLoading(false);
      }
    );
  };

  const handleSearchItem = (item) => {
    const tagObj = {
      name: item.type,
      id: item._id,
      important: false,
      dpName: item.name ?? item.name_j ?? item.name_e,
      dpSubName: item.creator ?? item.show.name_j ?? item.show.name_e,
    };
    const finder = tagged.find((obj) => obj.id == item._id);
    if (!finder) {
      //add
      setTagged([...tagged, tagObj]);
    } else {
      //remove
      const copyArr = [...tagged];
      setTagged(copyArr.filter((obj) => obj.id != item._id));
    }
    mainFlatListRef.current.scrollToOffset(0);
  };

  const handleRemoveItem = (itemId, important) => {
    if (important) return;
    const copyArr = [...tagged];
    setTagged(copyArr.filter((obj) => obj.id != itemId));
  };

  const handleBoxTap = (items) => {
    const oldArr = [...color];
    const click = oldArr.findIndex((item) => item.id === items.id);
    const d2 = oldArr.findIndex((item) => item.active === true);
    if (click === d2) return;
    if (click > -1) oldArr[click].active = true;
    if (d2 > -1) oldArr[d2].active = false;
    setColor(oldArr);
  };

  const renderAddMores = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => handleChangeImage(item)}
        onLongPress={() => handleRemoveImage(item)}
      >
        <Image source={{ uri: item.uri }} style={styles.sm_img} />
      </TouchableOpacity>
    );
  };
  const renderColors = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => handleBoxTap(item)}
        style={{ ...styles.smallBox, backgroundColor: item.bg }}
      >
        {item.active && (
          <View
            style={{ ...styles.smallBox, backgroundColor: "rgba(0,0,0,0.2)" }}
          >
            <MaterialCommunityIcons name="check" color="white" size={20} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTagged = ({ item }) => {
    return (
      <View
        style={{
          ...styles.listTag,
          backgroundColor: item.important ? colors.unChange : colors.extraLight,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => handleRemoveItem(item.id, item.important)}
        >
          <MaterialCommunityIcons
            name="close-circle"
            size={16}
            color={colors.medium}
          />
        </TouchableOpacity>
        <AppText
          style={{ ...styles.searchTitle, textTransform: "capitalize" }}
          bold
        >
          {item.dpName} -{" "}
          <AppText style={{ color: colors.primary }} bold>
            {" "}
            {item.name}
          </AppText>
        </AppText>
      </View>
    );
  };

  useEffect(() => {
    if (router.type) {
      const tagObj = {
        name: router.type,
        id: router.id,
        important: true,
        dpName: router.name,
        dpSubName: router.type,
      };
      setTagged([...tagged, tagObj]);
    }
  }, [router]);

  useEffect(() => {
    if (!flatStuffs[0] && !writer) {
      navigation.goBack();
    }
  }, [flatStuffs]);

  useEffect(() => {
    if (!tagged[0]) {
      searchInputRef?.current?.focus();
    }
  }, [showTag]);

  return (
    <Screen>
      <StatusBar style={theme.bar} />
      <AppHeader
        title="Post Media"
        RightComponent={() => (
          <AppButton
            title="POST"
            naked
            style={styles.postBtn}
            onPress={handlePost}
          />
        )}
      />
      <FlatList
        data={["home"]}
        ref={mainFlatListRef}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingBottom: screen.height * 0.1 }}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
        renderItem={() => {
          return (
            <View style={styles.container}>
              <View style={styles.avatar}>
                <Avatar avatar={userInfo.avatar} name={userInfo.username} />
              </View>
              {!writer && (
                <View style={{ flex: 1 }}>
                  <AppText
                    bold
                    style={{ textAlign: "center", marginBottom: 12 }}
                  >
                    Write a Caption
                  </AppText>
                  <GrowInput
                    text={text}
                    setText={setText}
                    mLine={true}
                    placeholder="Add a caption.."
                  />
                </View>
              )}
              {errMsg && (
                <AppText style={styles.error} bold>
                  {errMsg}
                </AppText>
              )}
              <View style={styles.tagHeader}>
                {showTag && (
                  <AppText style={styles.searchTitle} bold>
                    Add instance tags
                  </AppText>
                )}
                {!showTag && <View />}
                <AppButton
                  title={`${tagTitle} tags`}
                  style={styles.postBtn}
                  onPress={() => {
                    setSearch("");
                    setTagLists([]);
                    setShowTag(!showTag);
                    setErrMsg(null);
                  }}
                  naked
                />
              </View>
              {/* {isLoading && <Points prog={progBar} />} */}

              {showTag && (
                <View style={{ flex: 1, marginBottom: 25 }}>
                  <SearchBar
                    searchBar={search}
                    ref={searchInputRef}
                    setSearchBar={setSearch}
                    pressCb={handleSearchTag}
                    loading={searchLoading}
                    style={styles.search}
                    placeholder="Search characters, shows and groups related to your post"
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      marginLeft: 9,
                    }}
                  >
                    <FlatList
                      data={tagged}
                      keyExtractor={(item) => item.id}
                      style={{ flexDirection: "row", flexWrap: "wrap" }}
                      renderItem={renderTagged}
                    />
                  </View>
                  {search[1] &&
                    (tagCharacters[0] || tagShows[0] || tagGroups[0]) && (
                      <View style={styles.searchInstance}>
                        <SearchInstance
                          data={tagCharacters}
                          onPress={handleSearchItem}
                          title="Characters"
                          type="rect"
                        />
                        <SearchInstance
                          data={tagShows}
                          onPress={handleSearchItem}
                          title="Shows"
                          type="box"
                        />
                        <SearchInstance
                          data={tagGroups}
                          onPress={handleSearchItem}
                          title="Groups"
                          type="box"
                        />
                      </View>
                    )}
                </View>
              )}
              {!writer && asset.type === "video" && (
                <View style={{ flex: 1 }}>
                  {display && (
                    <PostVideo
                      source={display}
                      allowVideoEditing
                      viewable={false}
                      disableDoublePress
                      disableLongPress
                      dim={{ width: asset.width, height: asset.height }}
                    />
                  )}
                  <AppButton
                    title="Change Video"
                    bare
                    onPress={handleChangeVideo}
                    style={{ alignSelf: "center", marginVertical: 12 }}
                    icon="reload"
                  />
                  <ActivityIndicator
                    visible={isLoading}
                    style={styles.activity}
                    type="spin"
                    wTransparent
                  />
                </View>
              )}
              {!writer && asset.type === "image" && display && (
                <View
                  style={{
                    ...styles.imageCont,
                    aspectRatio: display.width / display.height,
                  }}
                >
                  <Image
                    source={{ uri: display.uri }}
                    style={{
                      ...styles.image,
                      borderRadius: display.width * 0.02,
                    }}
                  />
                  <ActivityIndicator
                    style={styles.activity}
                    visible={isLoading}
                    type="spin"
                    wTransparent
                  />
                </View>
              )}
              {!writer && asset.type === "image" && (
                <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
                  <FlatList
                    data={flatStuffs}
                    keyExtractor={(item) => item.uri}
                    ref={flatt}
                    onContentSizeChange={() => flatt.current.scrollToEnd()}
                    horizontal
                    ListFooterComponent={
                      media.length <= 25 && (
                        <TouchableOpacity
                          style={[
                            styles.addMore,
                            { backgroundColor: theme.extralight },
                          ]}
                          activeOpacity={0.78}
                          onPress={handleAddMore}
                        >
                          <MaterialCommunityIcons
                            name="camera"
                            size={20}
                            color={colors.medium}
                          />
                          <AppText>Add More</AppText>
                        </TouchableOpacity>
                      )
                    }
                    renderItem={renderAddMores}
                  />
                </View>
              )}
              {writer && (
                <View>
                  <View
                    style={{ ...styles.box, backgroundColor: getBgColor().bg }}
                  >
                    <TextInput
                      value={input}
                      ref={textRef}
                      onChangeText={(val) => setInput(val)}
                      style={{ ...styles.input, color: getBgColor().text }}
                      placeholderTextColor={getBgColor().text}
                      multiline
                      maxLength={150}
                      numberOfLines={6}
                      placeholder="Write a post..."
                    />
                    <ActivityIndicator
                      visible={isLoading}
                      style={styles.activity}
                      type="spin"
                      wTransparent
                    />
                  </View>
                  <View>
                    <FlatList
                      data={colorSet}
                      keyExtractor={(item, index) => item.bg + index}
                      horizontal
                      keyboardShouldPersistTaps="handled"
                      showsHorizontalScrollIndicator={false}
                      renderItem={renderColors}
                    />
                  </View>
                </View>
              )}
            </View>
          );
        }}
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
  avatar: {
    margin: screen.width * 0.02,
  },
  addMore: {
    width: screen.width * 0.3,
    height: screen.width * 0.4,
    borderRadius: screen.width * 0.018,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
    marginLeft: 14,
  },
  box: {
    height: 400,
    borderRadius: 20,
    width: screen.width * 0.98,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 5,
    overflow: "hidden",
  },
  container: {
    flex: 1,
  },
  error: {
    textAlign: "center",
    textTransform: "capitalize",
    color: colors.heart,
    marginVertical: 9,
  },
  header: {},
  imageCont: {
    width: screen.width * 0.95,
    alignSelf: "center",
    maxHeight: screen.height * 0.9,
    marginBottom: 10,
  },
  image: {
    borderRadius: 25,
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  input: {
    textAlign: "center",
    fontSize: 23,
    fontFamily: "sen-bold-b1",
    flex: 1,
    padding: 10,
  },
  postBtn: {
    alignSelf: "flex-end",
    marginRight: 10,
  },
  listTag: {
    flexDirection: "row",
    backgroundColor: colors.extraLight,
    alignSelf: "flex-start",
    borderRadius: 100,
    marginLeft: 8,
    marginTop: 12,
    padding: 8,
  },
  smallBox: {
    width: 70,
    height: 70,
    marginHorizontal: 6,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  sm_img: {
    width: screen.width * 0.3,
    height: screen.width * 0.4,
    borderRadius: screen.width * 0.018,
    margin: 5,
  },
  search: {
    width: screen.width * 0.9,
    alignSelf: "center",
    height: 50,
  },
  searchTitle: {
    fontSize: 16,
    marginLeft: 8,
  },
  searchInstance: {
    backgroundColor: colors.extraLight,
    marginTop: 15,
    borderRadius: 15,
    width: screen.width * 0.95,
    alignSelf: "center",
  },
  tagHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 12,
  },
});
export default PostScreen;
