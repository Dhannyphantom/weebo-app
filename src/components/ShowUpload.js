import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Image,
  Dimensions,
  PanResponder,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import { Context as FeedContext } from "../config/FeedContext";
import { Feather, AntDesign } from "@expo/vector-icons";

import colors from "../constants/colors";
import ActivityIndicator from "./ActivityIndicator";
import AppButton from "./AppButton";
import PostVideo from "./PostVideo";
import Separator from "./Separator";
import AppText from "./AppText";
import Screen from "./Screen";
import PopMessage from "./PopMessage";

const { width } = Dimensions.get("window");

const ShowUpload = ({ visObj, setVisible }) => {
  // data = {uri, type, height, width }
  const { vis, data } = visObj;
  if (!data) return null;
  /// =--
  const { statusUploader } = useContext(FeedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [inputHeight, setInputHeight] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [popData, setPopData] = useState({ vis: false });
  // const [errMsg, setErrMsg] = useState(null);
  const [vidDuration, setVidDuration] = useState(0);
  const [playVid, setPlayVid] = useState(false);
  const [statusInput, setStatusInput] = useState("");
  const [editOptions, setEditOptions] = useState({
    color: "normal",
    show: false,
    drag: false,
    openCap: false,
  });
  const { post } = data;

  const textInputRef = useRef(null);
  const dragger = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  // ### DRAGGER
  const dragResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setEditOptions({ ...editOptions, drag: true });
        setPlayVid(false);
      },
      onPanResponderMove: (evt, gestureState) => {
        dragger.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        setEditOptions({ ...editOptions, drag: false });
        Animated.spring(dragger, {
          toValue: {
            x: gestureState.dx + 10,
            y: gestureState.dy + 10,
          },
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const showMark = showInput && statusInput.length > 1;
  const showStatusView = !showInput && statusInput.length > 0;
  let textArrays = statusInput.split("\n");
  textArrays = textArrays.filter((text) => text !== "");

  const panelMenu = [
    {
      id: "1",
      title: "Invert caption colour",
      onPress: () => handlePanelMenu("invert"),
      icon: "",
      iconName: "circle",
    },
    {
      id: "3",
      title: "Reset Caption",
      icon: "",
      onPress: () => handlePanelMenu("reset"),
      iconName: "rotate-cw",
    },
  ];

  const handleUploadPress = () => {
    setIsLoading(true);
    // setErrMsg(null);
    const sendData = {
      ...data,
      post: {
        ...data.post,
        tColor: editOptions.color,
        pos: dragger,
        text: textArrays,
        durationMillis: vidDuration,
      },
    };
    statusUploader(
      sendData,
      (resData) => {
        setIsLoading(false);
        setVisible(true);
      },
      (err) => {
        setPopData({
          vis: true,
          type: "failed",
          msg: err.msg,
        });
        setIsLoading(false);
      }
    );
  };

  const handleVidLoad = (dur) => {
    setVidDuration(dur);
  };

  const handlePanelMenu = (type) => {
    switch (type) {
      case "invert":
        if (editOptions.color === "normal") {
          setEditOptions({ ...editOptions, show: false, color: "inverted" });
        } else {
          setEditOptions({ ...editOptions, show: false, color: "normal" });
        }
        break;
      case "reset":
        setEditOptions({ ...editOptions, color: "normal" });
        Animated.spring(dragger, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: true,
        }).start();

        break;
    }
  };

  const handleHeaderAction = (type) => {
    switch (type) {
      case "delete":
        setStatusInput("");
        setShowInput(false);
        break;
      case "more":
        setEditOptions({ ...editOptions, show: true });
        break;
      case "write":
        setShowInput(!showInput);
        break;
    }
  };

  const renderPanelMenu = ({ item }) => {
    return (
      <>
        <TouchableOpacity
          onPress={item.onPress}
          activeOpacity={0.6}
          style={styles.optionItem}
        >
          <Feather
            name={item.iconName}
            color={colors.primary}
            size={width * 0.02}
          />
          <AppText style={styles.optionText} bold>
            {item.title}
          </AppText>
        </TouchableOpacity>
        <Separator h={1} />
      </>
    );
  };

  useEffect(() => {
    textInputRef?.current?.focus();
  }, [showInput]);

  return (
    <Modal
      visible={vis}
      statusBarTranslucent
      transparent
      onRequestClose={() => setVisible(false)}
    >
      <Screen style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => handleHeaderAction("write")}
              activeOpacity={0.8}
              style={styles.iconCont}
            >
              <AntDesign
                name={showMark ? "check" : "edit"}
                size={width * 0.035}
                color={colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleHeaderAction("delete")}
              activeOpacity={0.8}
              style={styles.iconCont}
            >
              <AntDesign
                name="delete"
                size={width * 0.035}
                color={colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleHeaderAction("more")}
              activeOpacity={0.8}
              style={styles.iconCont}
            >
              <AntDesign
                name="menu-fold"
                size={width * 0.035}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
          <AppButton
            bareWhite
            bare
            style={{ padding: 10 }}
            onPress={handleUploadPress}
            RIcon="chevron-up"
            title="Upload"
          />
        </View>
        {/* CAPTION UI */}
        {showStatusView && (
          <Animated.View
            // onPress={() => setPlayVid(!playVid)}
            style={{
              ...styles.statusView,
              borderColor: editOptions.drag
                ? colors.unChange
                : editOptions.color == "inverted"
                ? colors.black
                : colors.white,
              transform: [{ translateY: dragger.y }, { translateX: dragger.x }],
            }}
            {...dragResponder.panHandlers}
          >
            {textArrays.map((text, index) => {
              return (
                <AppText
                  size="xlarge"
                  bold
                  key={index}
                  style={{
                    ...styles.statusText,
                    backgroundColor: editOptions.drag
                      ? colors.unChange
                      : editOptions.color === "normal"
                      ? colors.white
                      : colors.black,
                    color:
                      editOptions.color === "normal"
                        ? colors.black
                        : colors.white,
                    bottom: index !== 0 ? index * 5 : 0,
                  }}
                >
                  {text}
                </AppText>
              );
            })}
          </Animated.View>
        )}

        {post?.type === "image" ? (
          <View
            style={{
              ...styles.imageContainer,
              aspectRatio: post?.width / post?.height,
            }}
          >
            <Image source={{ uri: post.uri }} style={styles.image} />
            <ActivityIndicator
              visible={isLoading}
              type="loader"
              style={styles.activity}
              wTransparent
            />
          </View>
        ) : (
          <View style={styles.vidContainer}>
            <PostVideo
              source={post}
              disableDoublePress
              onLoadEnd={handleVidLoad}
              viewable={false}
              playFunc={playVid}
              disableLongPress
              full
            />
            <ActivityIndicator
              visible={isLoading}
              type="loader"
              style={styles.activity}
              wTransparent
            />
          </View>
        )}

        {showInput && (
          <View
            style={{
              ...styles.inputContainer,
              height: Math.max(35, inputHeight),
            }}
          >
            <TextInput
              value={statusInput}
              onChangeText={(val) => setStatusInput(val)}
              placeholder="Add a caption..."
              ref={textInputRef}
              placeholderTextColor={colors.white}
              multiline
              numberOfLines={5}
              onContentSizeChange={({ nativeEvent }) => {
                if (inputHeight < 140) {
                  setInputHeight(nativeEvent.contentSize.height);
                }
              }}
              style={styles.input}
            />
          </View>
        )}
      </Screen>
      <Modal
        visible={editOptions.show}
        statusBarTranslucent
        animationType="slide"
        transparent
        onRequestClose={() => setEditOptions({ ...editOptions, show: false })}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setEditOptions({ ...editOptions, show: false })}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <TouchableOpacity activeOpacity={1} style={styles.optionPanel}>
            <FlatList
              data={panelMenu}
              keyExtractor={(item) => item.id}
              renderItem={renderPanelMenu}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <PopMessage popData={popData} setter={() => setPopData({ vis: false })} />
    </Modal>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 100,
  },
  header: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    alignItems: "center",
    top: "7%",
    width,
    zIndex: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  imageContainer: {
    width,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    position: "absolute",
    justifyContent: "center",
    width,
    padding: 4,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  iconCont: {
    padding: 10,
  },
  input: {
    flex: 1,
    alignSelf: "center",
    color: colors.white,
    textAlign: "center",
    lineHeight: 30,
    fontFamily: "sen",
    fontSize: width * 0.03,
    width: "100%",
    height: "100%",
  },
  optionPanel: {
    backgroundColor: colors.white,
    width: width,
    paddingTop: 20,
    paddingLeft: 20,
    borderTopStartRadius: width * 0.05,
    borderTopEndRadius: width * 0.05,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    width: "100%",
  },
  optionText: {
    paddingLeft: 10,
  },
  statusView: {
    position: "absolute",
    zIndex: 4,
    alignSelf: "center",
    // borderWidth: 1.2,
    padding: 10,
    borderRadius: width * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    backgroundColor: colors.white,
    textAlign: "center",
    padding: 6,
    borderRadius: 7,
    color: colors.black,
  },
  vidContainer: {
    flex: 1,
    // height: height * 0.96,
  },
});
export default ShowUpload;
