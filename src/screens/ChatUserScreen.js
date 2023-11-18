import React, { useContext, useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

import { Context as AuthContext } from "../config/AuthContext";
import ChatRender from "../components/ChatRender";
import CommentBar from "../components/CommentBar";
import Screen from "../components/Screen";
import ActivityIndicator from "../components/ActivityIndicator";
import colors from "../constants/colors";
import ThemeContext from "../config/ThemeContext";
import AppHeader from "../components/AppHeader";
import { LoadMoreContent } from "../components/Comments";

const { width, height } = Dimensions.get("window");

const CHAT_COUNT = 25;

const ChatUserScreen = ({ route }) => {
  const {
    sendMessage,
    getChatMessages,
    getSocket,
    joinRoom,
    state: { userInfo },
  } = useContext(AuthContext);

  const [chats, setChats] = useState({ results: [] });
  // chats = [{message, time, read,sender: {_id, username,gender, avatar}}]
  const [empty, setEmpty] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [chatLoaded, setChatLoaded] = useState(false);
  const [bools, setBools] = useState({ loadMore: false });

  const flatRef = useRef();
  const { _id, username, avatar } = route.params.item;
  // ABOVE IS RECIPIENT
  const theme = useContext(ThemeContext);

  const handleSendChatMsg = (message, chatId) => {
    chats.length < 1 && setEmpty(false);
    const chatsArr = [...chats.results];
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

    setChats({ ...chats, results: chatsArr });
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
        flatRef.current.scrollToEnd();
      },
      (err) => {
        setErrMsg("Message not sent");
      }
    );
    flatRef.current.scrollToEnd();
  };

  const renderChats = ({ item }) => {
    const findIndex =
      chats?.results[0] &&
      chats?.results.findIndex((obj) => obj._id == item._id);
    const lowerChat = chats?.results[findIndex + 1]
      ? chats?.results[findIndex + 1]
      : null;
    const upperChat = chats?.results[findIndex - 1]
      ? chats?.results[findIndex - 1]
      : null;

    return (
      <ChatRender
        user={userInfo.username}
        upperChat={upperChat}
        lowerChat={lowerChat}
        item={item}
      />
    );
  };

  const handleGetDone = async (chatz, shouldAddMore) => {
    if (!chatz) return setChatLoaded(true);
    if (shouldAddMore) {
      setChats({ ...chatz, results: chatz?.results?.concat(chats?.results) });
    } else {
      setChats(chatz);
    }
    chatz && chatz?.results.length == 0 ? setEmpty(true) : setEmpty(false);
    await AsyncStorage.setItem(`chat_${_id}`, JSON.stringify(chatz));
    flatRef.current.scrollToEnd();
  };

  const handleLoadMoreChats = () => {
    setBools({ loadMore: true });
    getChatMessages(
      {
        senderId: userInfo._id,
        recipientId: _id,
        page: chats?.next?.page,
        limit: 20,
      },
      (data) => {
        handleGetDone(data, true);
        flatRef?.current?.scrollToEnd();
        setBools({ loadMore: false });
      },
      (err) => setErrMsg(err)
    );
  };

  const fetchStoredChats = async () => {
    let user_chat = await AsyncStorage.getItem(`chat_${_id}`);
    if (user_chat) {
      user_chat = JSON.parse(user_chat);
      // setChats({ ...user_chat, results: user_chat?.results?.slice(-25) ?? [] });
      setChatLoaded(true);
      flatRef.current.scrollToEnd();
    }
  };

  const RenderChatFooter = () => {
    return <View style={{ height: height * 0.1 }} />;
  };

  //chatMsg useEffect
  useEffect(() => {
    getSocket().on("message", ({ sender, message, sent, chatId, time }) => {
      if (sender.username == username) {
        const id = (Math.random() * 1000).toString();
        //recipients' client
        setChats({
          ...chats,
          results: [
            ...chats.results,
            {
              _id: id,
              sender: { ...sender, avatar },
              read: false,
              message,
              time,
            },
          ],
        });
        // Send another event that message is read

        getSocket().emit("readMessage", {
          recipient: _id,
          sender: userInfo._id,
          chatId,
        });
      } else {
        // senders' client
        // look for the message and tag is sent;
        const chatsArr = chats.results.map((chatObj) => {
          if (chatObj._id == chatId) {
            return {
              ...chatObj,
              sent,
            };
          } else {
            return chatObj;
          }
        });

        setChats({ ...chats, results: chatsArr });
      }
    });

    getSocket().on("messageRead", ({ sender, recipient }) => {
      if (sender == _id) {
        const myChats = [...chats.results].map((chatObj) => {
          if (!chatObj.read) {
            return {
              ...chatObj,
              read: true,
            };
          } else {
            return chatObj;
          }
        });
        setChats({ ...chats, results: myChats });
      }
    });

    return () => {
      getSocket().off();
    };
  });

  //TODO:: - try caching chats and getting them locally
  useEffect(() => {
    fetchStoredChats();
    joinRoom(userInfo._id, _id);

    getChatMessages(
      { senderId: userInfo._id, recipientId: _id, page: 1, limit: CHAT_COUNT },
      (data) => {
        handleGetDone(data);
        flatRef?.current?.scrollToEnd();
      },
      (err) => setErrMsg(err)
    );
    flatRef?.current?.scrollToEnd();
  }, []);

  return (
    <Screen style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.backdrop, { backgroundColor: colors.primary }]} />
      <AppHeader
        title={username}
        titleStyle={{ color: colors.white }}
        iconColor={colors.white}
        separator={false}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.comment}
      >
        {chatLoaded ? (
          <View style={[styles.content, { backgroundColor: theme.background }]}>
            <FlatList
              data={chats.results}
              ref={flatRef}
              keyExtractor={(item) => item._id}
              onContentSizeChange={() => flatRef.current.scrollToEnd()}
              ListFooterComponent={RenderChatFooter}
              ListHeaderComponent={() => (
                <>
                  {chats.hasOwnProperty("next") && (
                    <LoadMoreContent
                      loading={bools.loadMore}
                      onPress={handleLoadMoreChats}
                      type="chats"
                    />
                  )}
                </>
              )}
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
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
  },
  comment: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    flex: 1,
    borderTopStartRadius: width * 0.045,
    borderTopEndRadius: width * 0.045,
    paddingTop: 18,
    elevation: 10,
  },
});
export default ChatUserScreen;
