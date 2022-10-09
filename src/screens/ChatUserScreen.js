import React, { useContext, useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { Context as AuthContext } from "../config/AuthContext";
import ChatRender from "../components/ChatRender";
import CommentBar from "../components/CommentBar";
import Screen from "../components/Screen";
import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";
import colors from "../constants/colors";
import ThemeContext from "../config/ThemeContext";
import AppHeader from "../components/AppHeader";

const { width } = Dimensions.get("window");

const ChatUserScreen = ({ route, navigation }) => {
  const {
    sendMessage,
    getChatMessages,
    getSocket,
    joinRoom,
    state: { userInfo },
  } = useContext(AuthContext);

  const [chats, setChats] = useState([]);
  const [empty, setEmpty] = useState(false);
  // chats = [{message, time, read,sender: {_id, username, avatar}}]
  const [errMsg, setErrMsg] = useState(null);
  const [chatLoaded, setChatLoaded] = useState(false);

  const flatRef = useRef();
  const { _id, username, avatar } = route.params.item;
  // ABOVE IS RECIPIENT
  const theme = useContext(ThemeContext);

  const handleSendChatMsg = (message, chatId) => {
    chats.length < 1 && setEmpty(false);
    const chatsArr = [...chats];
    const senderData = {
      _id: userInfo._id,
      username: userInfo.username,
      avatar: userInfo.avatar,
    };

    const senderObj = {
      _id: chatId,
      sender: senderData,
      read: false,
      sent: false,
      message: message.trim(),
      time: new Date(),
    };

    chatsArr[chatsArr.length] = senderObj;

    setChats(chatsArr);
  };

  const onSend = (text) => {
    // add text and if text is sent show user else notify an error
    const chatId = (Math.random() * 1000).toString();

    const sendData = {
      sender: { username: userInfo.username, id: userInfo._id },
      recipient: { username, id: _id },
      message: text.trim(),
      chatId,
      time: new Date(),
    };
    handleSendChatMsg(text, chatId);
    sendMessage(
      sendData,
      (resData) => {
        //tag the message sent
      },
      (err) => {
        console.log("clientError", err);
      }
    );
  };

  const renderChats = ({ item }) => {
    const findIndex = chats[0] && chats.findIndex((obj) => obj._id == item._id);
    const lowerChat = chats[findIndex + 1] ? chats[findIndex + 1] : null;
    const upperChat = chats[findIndex - 1] ? chats[findIndex - 1] : null;

    return (
      <ChatRender
        user={userInfo.username}
        upperChat={upperChat}
        lowerChat={lowerChat}
        item={item}
      />
    );
  };

  const handleGetDone = (info) => {
    if (info) {
      setChats(info && info.chats);
      info && info.chats.length == 0 ? setEmpty(true) : setEmpty(false);
    } else {
      setEmpty(true);
    }
    setChatLoaded(true);
  };

  const RenderChatFooter = () => {
    return <View style={{ height: 15 }} />;
  };

  //chatMsg useEffect
  useEffect(() => {
    getSocket().on("message", ({ sender, message, sent, chatId, time }) => {
      if (sender.username == username) {
        const id = (Math.random() * 1000).toString();
        //recipients' client
        setChats([
          ...chats,
          {
            _id: id,
            sender: { ...sender, avatar },
            read: false,
            message,
            time,
          },
        ]);
      } else {
        // senders' client
        // look for the message and tag is sent;
        const chatsArr = [...chats];
        const index = chatsArr.findIndex((obj) => obj._id == chatId);
        if (index > -1) {
          chatsArr[index] = { ...chatsArr[index], sent };
        }
        setChats(chatsArr);
      }
    });

    return () => {
      getSocket().off();
    };
  });

  //TODO:: - try caching chats and getting them locally
  useEffect(() => {
    joinRoom(userInfo._id, _id);

    getChatMessages(
      userInfo._id,
      _id,
      (data) => {
        handleGetDone(data);
        flatRef?.current?.scrollToEnd();
      },
      (err) => setErrMsg(err)
    );
  }, []);

  return (
    <Screen style={{ ...styles.container, backgroundColor: theme.chat }}>
      <StatusBar style="light" />
      <AppHeader
        title={username}
        titleStyle={{ color: colors.white }}
        style={{ marginTop: 15 }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.comment}
      >
        {chatLoaded ? (
          <View style={[styles.content, { backgroundColor: theme.background }]}>
            <FlatList
              data={chats}
              ref={flatRef}
              keyExtractor={(item) => item._id}
              onContentSizeChange={() => flatRef.current.scrollToEnd()}
              ListFooterComponent={RenderChatFooter}
              renderItem={renderChats}
            />
            <ActivityIndicator
              visible={empty}
              style={styles.activityTwo}
              type="isEmpty"
              text={`Say hi to ${username}`}
            />
          </View>
        ) : (
          <ActivityIndicator
            visible={true}
            style={styles.activity}
            type="isEmpty"
            text="Retrieving chats..."
          />
        )}
        <CommentBar
          placeholder="Type your message..."
          avatar={userInfo.avatar}
          onSend={onSend}
          type="send"
        />
      </KeyboardAvoidingView>
    </Screen>
  );
};
const styles = StyleSheet.create({
  activity: {
    borderTopStartRadius: width * 0.045,
    borderTopEndRadius: width * 0.045,
  },
  activityTwo: {
    borderTopStartRadius: width * 0.045,
    borderTopEndRadius: width * 0.045,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  comment: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    flex: 1,
    borderTopStartRadius: width * 0.045,
    borderTopEndRadius: width * 0.045,
    paddingTop: 15,
    elevation: 10,
  },
});
export default ChatUserScreen;
