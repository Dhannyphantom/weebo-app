import React, { useRef, useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Modal,
  PanResponder,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import { Feather } from "@expo/vector-icons";

import { Context as AuthContext } from "../config/AuthContext";
import { Context as FeedContext } from "../config/FeedContext";

import AppText from "./AppText";
import ProfilePic from "./ProfilePic";
import DropDown from "./DropDown";
import colors from "../constants/colors";
import Screen from "./Screen";
import PostVideo from "./PostVideo";
import getTimestamp from "../constants/getTimestamp";
import ActivityIndicator from "./ActivityIndicator";

const { width, height } = Dimensions.get("window");

const DisplayStatus = ({ modalObj, setVisible }) => {
  if (!modalObj) return null;
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const { viewStatus } = useContext(FeedContext);
  const [count, setCount] = useState(0);
  const [viewCounter, setViewCounter] = useState("...");
  const [statuses, setStatuses] = useState(null);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [dropModal, setDropModal] = useState(false);
  const [showAnim, setShowAnim] = useState({ vis: false, dir: null });
  const [statusText, setStatusText] = useState({
    bg: null,
    tColor: null,
    show: false,
    text: null,
    pos: null,
  });
  const [playVid, setPlayVid] = useState(null);
  const [speedo, setSpeedo] = useState(0.05);

  const isVisible = modalObj.vis;
  const modalData = statuses && statuses.posts;
  const modalCurrID = modalObj?.data?._id;
  const allStatuses = modalObj?.data?.all;
  // // modalData = [{type: "image/jpeg", uri, width, height, thumb}]
  // if (!isVisible || !modalData) return null;

  const lottieRef = useRef(null);
  const nextAnimRef = useRef(null);
  const translator = useRef(new Animated.Value(0)).current;

  const modalPanresponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // DISABLE GESTURES FOR VIDEO DISPLAY
        // if (params.type === "video") {
        //   return false;
        // }
        return true;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 50) {
          translator.setValue(gestureState.dy - 50);
        } else {
          // NOT A SWIPE GESTURE POSSIBLY
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > height * 0.35 || gestureState.vy > 0.8) {
          Animated.timing(translator, {
            toValue: height * 0.7,
            useNativeDriver: true,
          }).start(() => handleCloseModal());
        } else {
          Animated.spring(translator, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  let currStatus = allStatuses?.find((obj) => obj._id == modalCurrID);

  const dropModalList = [
    {
      id: "1",
      name: "Remove Story",
      icon: "delete",
      show: true,
      onPress: () => {
        console.log("Deleted");
      },
      iconPack: "MCI",
    },
    {
      id: "1428",
      name: "Report Story",
      icon: "message-minus-outline",
      show: true,
      onPress: () => {
        console.log("Reported");
      },
      iconPack: "MCI",
    },
  ];

  const handleCloseModal = () => {
    setVisible({ vis: false, data: null });
    setCount(0);
  };

  const handleAnimFinish = (inc, isBtn) => {
    // console.log("MODAL", modalData);
    // console.log("STATUSES", allStatuses);
    if (!modalData[count + inc]) {
      const currIndex = allStatuses.findIndex((obj) => obj._id == statuses._id);
      const nextIndex = allStatuses[currIndex + inc]; //
      if (nextIndex) {
        //go forward or backwards
        const nextCount =
          inc === -1 && isBtn ? nextIndex?.posts?.length - 1 : 0;
        setShowAnim({ vis: true, dir: inc });
        setCount(nextCount);
        return setStatuses(nextIndex);
      }
      setCount(0);
      if (isBtn) return null;
      return handleCloseModal();
    }
    setCount(count + inc);
    setMediaLoading(true);
    // lottieRef?.current?.play();
  };

  const handleNextAnimFinish = () => {
    setShowAnim({ vis: false, dir: null });
  };

  let timer;
  const handleModalPress = (type) => {
    clearTimeout(timer);
    // REMOVE CODE BELOW AND SET IT RIGHT LATER
    // TRY AND MAKE THE VIDEO PAUSE ON PRESS IN AND PLAY AND PRESS OUT
    // if (modalData[count]?.type === "video") return;
    // ADD LOGIC TO CHECK TIME FOR PRESS
    if (type === "in") {
      // lottieRef?.current?.pause();
      timer = setTimeout(() => {
        setPlayVid(true);
      }, 500);
    } else {
      clearTimeout(timer);
      // lottieRef?.current?.resume();
      timer = setTimeout(() => {
        setPlayVid(false);
      }, 250);
    }
  };

  const handleMediaLoad = () => {
    lottieRef?.current?.play();
    setMediaLoading(false);
  };

  const handleMenuIcon = () => {
    // console.log("Icon pressed");
    setDropModal(!dropModal);
    if (playVid) {
      setPlayVid(false);
    } else {
      setPlayVid(true);
    }
  };

  const handleStatusViewer = () => {
    const currCounter = modalData && modalData[count]?.viewers?.length;
    const viewersArr = modalData && modalData[count]?.viewers;
    const isViewed = viewersArr && viewersArr.includes(userInfo._id);
    if (isViewed) {
      setViewCounter(currCounter);
    } else {
      setViewCounter(currCounter + 1);
    }
    if (isVisible && !isViewed) {
      // console.log(viewersArr, userInfo._id);
      const viewData = {
        user: userInfo._id,
        status: modalCurrID,
        post: modalData[count]?._id,
      };
      viewStatus(
        viewData,
        (resData) => {
          // console.log(resData);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };

  const handlePageStory = () => {
    if (modalData) {
      if (modalData[count]?.type === "image") {
        setSpeedo(3);
      } else if (modalData[count]?.type === "video") {
        // console.log(modalData[count]);
        const millis = modalData[count]?.durationMillis / 1000;
        if (millis !== 0) {
          const speed = 15 / millis;
          setSpeedo(speed);
        }
      }

      /// CAPTEXT
      const capText =
        modalData[count]?.text?.length > 0 ? modalData[count]?.text : null;

      /// CAPBG
      let capBg;
      if (modalData[count]?.tColor === "normal") {
        capBg = {
          color: colors.black,
          bg: colors.white,
        };
      } else if (modalData[count]?.tColor === "inverted") {
        capBg = {
          color: colors.white,
          bg: colors.black,
        };
      }
      const statusObj = {
        pos: modalData[count]?.pos,
        tColor: capBg.color,
        bg: capBg.bg,
        text: capText,
        show: true,
      };
      setStatusText(statusObj);
    }
    handleStatusViewer();
  };

  const handleStatusNav = (type) => {
    if (type === "right") {
      handleAnimFinish(1, true);
    } else if (type === "left") {
      handleAnimFinish(-1, true);
    }
  };

  useEffect(() => {
    setStatuses(currStatus);
  }, [isVisible]);

  useEffect(() => {
    if (dropModal) {
      lottieRef?.current?.pause();
    } else {
      lottieRef?.current?.resume();
    }
  }, [dropModal]);

  useEffect(() => {
    if (playVid) {
      lottieRef?.current?.pause();
    } else {
      lottieRef?.current?.resume();
    }
  }, [playVid]);

  useEffect(() => {
    handlePageStory();
  }, [count, statuses]);

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      statusBarTranslucent
      transparent
      onRequestClose={handleCloseModal}
    >
      <Animated.View
        style={{
          backgroundColor: colors.black,
          flex: 1,
          transform: [{ translateY: translator }],
          // opacity: 0.5,
        }}
      >
        <Screen>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              lottieRef?.current?.pause();
            }}
            style={styles.container}
          >
            <View style={styles.headerContainer}>
              <View style={styles.activity}>
                <LottieView
                  source={require("../../assets/animations/circe_countdown.json")}
                  autoPlay={false}
                  style={{ width: width * 0.075, height: width * 0.075 }}
                  speed={speedo}
                  ref={lottieRef}
                  autoSize
                  loop={false}
                  onAnimationFinish={() => handleAnimFinish(1)}
                />
                {modalData && (
                  <View style={styles.activityText}>
                    <AppText style={{ color: colors.white }} bold size="xlarge">
                      {(modalData.length - count).toString()}
                    </AppText>
                  </View>
                )}
              </View>
              <TouchableOpacity activeOpacity={1} style={styles.header}>
                {statuses && (
                  <View style={styles.headerCont}>
                    <View style={styles.headerTitles}>
                      <AppText bold size="xlarge" style={styles.headerText}>
                        {statuses[statuses.instance]?.dpName ??
                          statuses[statuses.instance]?.name ??
                          statuses[statuses.instance]?.name_j ??
                          statuses[statuses.instance]?.name_e}
                      </AppText>
                      <AppText style={styles.headerInstance}>
                        {statuses.instance}
                      </AppText>
                      {modalData && (
                        <AppText style={styles.headerDate}>
                          {getTimestamp(modalData[count]?._id, "status")}
                        </AppText>
                      )}
                    </View>
                    <ProfilePic
                      source={statuses[statuses.instance]?.cover_photo?.uri}
                      size={60}
                      border={1.5}
                      borderColor={colors.white}
                      disabled
                    />
                    <TouchableOpacity
                      onPress={handleMenuIcon}
                      style={styles.menuIcon}
                    >
                      <Feather
                        name="more-vertical"
                        color={colors.white}
                        size={width * 0.035}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {modalData && modalData[0] && (
              <>
                <View style={styles.mediaContainer}>
                  <View
                    style={{
                      ...styles.mediaCont,
                      aspectRatio:
                        modalData[count]?.width / modalData[count]?.height,
                    }}
                  >
                    {modalData[count]?.type === "image" && (
                      <>
                        <Image
                          source={{ uri: modalData[count]?.uri }}
                          onLoadEnd={handleMediaLoad}
                          style={styles.image}
                        />
                        <ActivityIndicator
                          visible={mediaLoading}
                          size={0.3}
                          type="loader"
                          style={styles.loader}
                          transparent
                        />
                      </>
                    )}
                  </View>
                </View>
                {modalData[count]?.type === "video" && (
                  <View style={styles.vidContainer}>
                    <PostVideo
                      vidUri={modalData[count]?.uri}
                      disableDoublePress
                      disableLongPress
                      viewable={false}
                      onLoadEnd={handleMediaLoad}
                      contStyle={styles.vidContStyle}
                      showTimer={false}
                      full
                      style={styles.vidComp}
                      playFunc={playVid}
                    />
                    <ActivityIndicator
                      visible={mediaLoading}
                      size={0.3}
                      type="loader"
                      style={styles.loader}
                      transparent
                    />
                  </View>
                )}
              </>
            )}
          </TouchableOpacity>

          <View
            style={{
              position: "absolute",
              width,
              height: height,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={() => handleStatusNav("left")}
              style={{ flex: 0.6, height: height }}
            />
            <TouchableOpacity
              onPress={() => handleStatusNav("mid")}
              onPressIn={() => handleModalPress("in")}
              onPressOut={() => handleModalPress("out")}
              activeOpacity={1}
              style={{ flex: 1, height }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <View style={styles.viewers}>
                  <Feather
                    name="eye"
                    color={colors.white}
                    size={width * 0.03}
                  />
                  <AppText
                    bold
                    size="large"
                    style={{ color: colors.white, marginLeft: 4 }}
                  >
                    {" "}
                    {Number.isNaN(viewCounter) ? "..." : viewCounter}
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleStatusNav("right")}
              style={{
                flex: 0.6,
                height: height,
                marginTop: height * 0.2,
              }}
              activeOpacity={1}
            />
          </View>
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              justifyContent: "center",
            }}
          >
            {statusText?.text?.length > 0 && statusText.show && (
              <View
                style={{
                  ...styles.statusDisplay,
                  transform: [
                    { translateX: statusText?.pos?.x + 10 || 0 },
                    { translateY: statusText?.pos?.y + 10 || 0 },
                  ],
                }}
              >
                <>
                  {statusText?.text?.map((text, idx) => {
                    return (
                      <AppText
                        size="xxlarge"
                        key={idx}
                        bold
                        style={{
                          ...styles.statusText,
                          backgroundColor: statusText.bg,
                          color: statusText.tColor,
                          bottom: idx !== 0 ? idx * 5 : 0,
                        }}
                      >
                        {text}
                      </AppText>
                    );
                  })}
                </>
              </View>
            )}
          </View>
          {showAnim.vis && (
            <View style={styles.nextLottie}>
              <View
                style={{
                  transform: [
                    { rotate: showAnim.dir === 1 ? "0deg" : "180deg" },
                  ],
                }}
              >
                <LottieView
                  source={require("../../assets/animations/next_arrow.json")}
                  autoPlay
                  style={{ width: width * 0.4, height: width * 0.4 }}
                  speed={6}
                  ref={nextAnimRef}
                  autoSize
                  loop={false}
                  onAnimationFinish={() => handleNextAnimFinish()}
                />
              </View>
            </View>
          )}

          <DropDown
            visible={dropModal}
            setVisible={setDropModal}
            closeFunc={handleMenuIcon}
            lists={dropModalList}
          />
        </Screen>
      </Animated.View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  activity: {
    marginLeft: 15,
  },
  activityText: {
    position: "absolute",
    // zIndex: 6,
    width: width * 0.075,
    height: width * 0.075,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  flatList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {},
  headerCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: colors.white,
    textTransform: "capitalize",
    textAlign: "right",
  },
  headerTitles: {
    marginRight: 8,
  },
  headerContainer: {
    width,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  headerInstance: {
    textTransform: "capitalize",
    textAlign: "right",
    color: colors.primaryOld,
  },
  headerDate: {
    textAlign: "right",
    color: colors.extraLight,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loader: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  mediaCont: {
    width,
    justifyContent: "center",
  },
  mediaContainer: {
    width,
    height,
    justifyContent: "center",
  },
  menuIcon: {
    borderRadius: 100,
    width: width * 0.06,
    justifyContent: "center",
    alignItems: "center",
    height: width * 0.06,
    marginRight: 12,
  },
  nextLottie: {
    position: "absolute",
    width: "100%",
    height: "105%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  statusDisplay: {
    position: "absolute",
    zIndex: 4,
    alignSelf: "center",
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
  viewers: {
    flexDirection: "row",
    top: width * 0.06,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: width * 0.05,
    padding: 10,
    paddingHorizontal: 15,
  },
  vidContainer: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  vidComp: {
    maxHeight: height * 0.95,
  },
  vidContStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
});
export default DisplayStatus;
