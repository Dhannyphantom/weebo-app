import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import uuid from "react-native-uuid";
import Animated, {
  BounceInDown,
  scrollTo,
  useAnimatedRef,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";

import { Context as AuthContext } from "../config/AuthContext";
import colors from "../constants/colors";
import ThemeContext from "../config/ThemeContext";
import AppFadeIn from "./AppFadeIn";
import AppText from "./AppText";
import CommentBar from "./CommentBar";
import getFormatTime from "../constants/getFormatTime";
import ActivityIndicator from "./ActivityIndicator";

const { height, width } = Dimensions.get("screen");

const ChatBubble = ({ item, shouldDelay }) => {
  return (
    <Animated.View
      entering={BounceInDown.duration(1000).delay(
        shouldDelay && item.isSystem ? 5500 : 0
      )}
      style={styles.feedBubbleContainer}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: item.isSystem ? "flex-start" : "flex-end",
        }}
      >
        <View
          style={[
            styles.feedBubble,
            {
              backgroundColor: item.error
                ? colors.heartDark
                : item.isSystem
                ? colors.light
                : colors.primary,
            },
          ]}
        >
          <AppText
            style={{ color: item.isSystem ? colors.black : colors.white }}
          >
            {" "}
            {item.message}{" "}
          </AppText>
        </View>
        {!item.isSystem && (
          <Feather
            name={item.read ? "check-circle" : "circle"}
            size={16}
            color={item.delivered ? colors.primary : colors.medium}
          />
        )}
      </View>
      <AppText
        size="small"
        style={{
          ...styles.feedBubbleDate,
          alignSelf: item.isSystem ? "flex-start" : "flex-end",
        }}
      >
        {" "}
        {getFormatTime(item.date).fullTime}{" "}
      </AppText>
    </Animated.View>
  );
};

const RenderFeedBack = ({ setter }) => {
  const theme = useContext(ThemeContext);
  const {
    sendAppFeedback,
    getAppFeedback,
    state: { userInfo },
  } = useContext(AuthContext);
  const flatRef = useAnimatedRef();

  const scrollY = useSharedValue(0);

  useDerivedValue(() => {
    scrollTo(flatRef, 0, scrollY.value, true);
  });
  const scrollOffset = useScrollViewOffset(flatRef);

  const [feedData, setFeedData] = useState([]);
  const [bools, setBools] = useState({ loading: true, delayAI: false });

  const renderFeedChats = ({ item, index }) => {
    return <ChatBubble item={item} shouldDelay={bools.delayAI} />;
  };

  const handleSendFeedback = (text) => {
    if (text === "cancel_op") return setter(true);
    setBools({ ...bools, delayAI: true });
    // optimistic update
    const feedId = uuid.v4();
    const feedObj = {
      _id: feedId,
      message: text,
      date: new Date(),
      isSystem: false,
      read: false,
      delivered: false,
    };

    setFeedData([...feedData, feedObj]);
    sendAppFeedback(
      { message: text, date: new Date() },
      (resData) => {
        // AI feedback
        feedObj.delivered = true;
        feedObj.read = true;

        setFeedData([...feedData, feedObj, resData.message]);
        // flatRef?.current?.scrollToEnd();
      },
      (err) => {
        setFeedData(
          feedData.map((feedItem) => {
            if (feedItem._id == feedId) {
              return {
                ...feedItem,
                error: true,
              };
            } else {
              return feedItem;
            }
          })
        );
      }
    );
    // flatRef?.current?.scrollToEnd();
  };

  useEffect(() => {
    getAppFeedback(
      (resData) => {
        setBools({ ...bools, loading: false });
        setFeedData(resData.messages);
      },
      (err) => {
        setBools({ ...bools, loading: false });
      }
    );
  }, [setter]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: "center" }}
      behavior="padding"
    >
      <View style={[styles.feedback, { backgroundColor: theme.background }]}>
        <AppText size="large" bold style={styles.feedbackTitle}>
          My Feedback
        </AppText>

        <View
          style={{
            flex: 1,
            marginTop: 20,
            backgroundColor: theme.backgroundExtralight,
            margin: 8,
            borderRadius: 15,

            elevation: 2,
          }}
        >
          <Animated.FlatList
            data={feedData}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingVertical: 20 }}
            ref={flatRef}
            // onContentSizeChange={() => flatRef?.current?.scrollToEnd()}
            ListEmptyComponent={() => (
              <ActivityIndicator
                visible
                size={0.45}
                type="isEmpty"
                transparent
                text={
                  "Your feedback is very valuable to us.\nLet us know about your app experience!"
                }
              />
            )}
            renderItem={renderFeedChats}
          />
        </View>

        <View style={styles.feedbackFooter}>
          <CommentBar
            style={{ width: "100%" }}
            placeholder="Tell us your experience..."
            onSend={handleSendFeedback}
            avatar={userInfo.avatar}
            cancelIcon
          />
        </View>
        <ActivityIndicator visible={bools.loading} absolute />
      </View>
    </KeyboardAvoidingView>
  );
};

const GetFeedbacks = () => {
  const [modal, setModal] = useState(false);
  const [bools, setBools] = useState({ closeModal: { close: false } });
  const theme = useContext(ThemeContext);
  return (
    <>
      <Pressable
        onPress={() => setModal(!modal)}
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Ionicons name="pencil-outline" size={20} color={colors.primary} />
      </Pressable>
      <AppFadeIn
        visible={modal}
        RenderComponent={() => (
          <RenderFeedBack
            setter={(val) => {
              setBools({ ...bools, closeModal: { close: val } });
              setModal(false);
            }}
          />
        )}
        setVisible={setModal}
        closeModal={bools.closeModal.close}
        disableTouchModal
        disableCloseModal
      />
    </>
  );
};

export default GetFeedbacks;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: height * 0.3,
    right: 10,
    padding: 10,
    borderRadius: 100,
    opacity: 0.5,
  },
  feedback: {
    width: width * 0.95,
    height: height * 0.6,
    borderRadius: 20,
    overflow: "hidden",
  },
  feedbackTitle: {
    textAlign: "center",
    marginTop: 6,
  },
  feedbackFooter: {
    justifyContent: "flex-end",
    marginTop: 10,
  },
  feedBubbleContainer: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  feedBubbleDate: {
    marginHorizontal: 12,
  },
  feedBubble: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 100,
    marginBottom: 3,
    marginRight: 5,
    maxWidth: "90%",
  },
});
