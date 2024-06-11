import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";

import { Context as AuthContext } from "../config/AuthContext";
import colors from "../constants/colors";
import ThemeContext from "../config/ThemeContext";
import AppFadeIn from "./AppFadeIn";
import AppText from "./AppText";
import CommentBar from "./CommentBar";
import getFormatTime from "../constants/getFormatTime";

const { height, width } = Dimensions.get("screen");

const data = [
  {
    id: "1",
    isSystem: false,
    user: "dhan",
    message: "I think the UI is great!",
    date: new Date().toISOString(),
    read: false,
    delivered: false,
  },
  {
    id: "2",
    isSystem: true,
    user: "",
    message: "Thanks for the feedback. Get back to you shortly!",
    date: new Date().toISOString(),
    read: false,
    delivered: false,
  },
];

const ChatBubble = ({ item }) => {
  return (
    <View style={styles.feedBubbleContainer}>
      <View
        style={[
          styles.feedBubble,
          {
            alignSelf: item.isSystem ? "flex-start" : "flex-end",
            backgroundColor: item.isSystem ? colors.light : colors.primary,
          },
        ]}
      >
        <AppText style={{ color: item.isSystem ? colors.black : colors.white }}>
          {" "}
          {item.message}{" "}
        </AppText>
      </View>
      <AppText
        size="small"
        style={{ alignSelf: item.isSystem ? "flex-start" : "flex-end" }}
      >
        {" "}
        {getFormatTime(item.date).fullTime}{" "}
      </AppText>
    </View>
  );
};

const RenderFeedBack = () => {
  const theme = useContext(ThemeContext);
  const {
    sendAppFeedback,
    state: { userInfo },
  } = useContext(AuthContext);

  const renderFeedChats = ({ item }) => {
    return <ChatBubble item={item} />;
  };

  const handleSendFeedback = (text) => {
    sendAppFeedback({ message: text, date: new Date() });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: "center" }}
      behavior="padding"
    >
      <View style={[styles.feedback, { backgroundColor: theme.background }]}>
        <AppText size="large" bold style={styles.feedbackTitle}>
          App Feedback
        </AppText>

        <View style={{ flex: 1, marginTop: 20 }}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderFeedChats}
          />
        </View>

        <View style={styles.feedbackFooter}>
          <CommentBar
            style={{ width: "100%" }}
            placeholder="Enter your feedback"
            onSend={handleSendFeedback}
            avatar={userInfo.avatar}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const GetFeedbacks = () => {
  const [modal, setModal] = useState(false);
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
        RenderComponent={RenderFeedBack}
        disableTouchModal
        disableCloseModal
        setVisible={setModal}
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
    opacity: 0.4,
  },
  feedback: {
    width: width * 0.9,
    height: height * 0.5,
    borderRadius: 20,
  },
  feedbackTitle: {
    textAlign: "center",
    marginTop: 6,
  },
  feedbackFooter: {
    justifyContent: "flex-end",
  },
  feedBubbleContainer: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  feedBubble: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 100,
    marginBottom: 3,
  },
});
