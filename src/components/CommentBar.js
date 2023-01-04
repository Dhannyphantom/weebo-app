import React, { forwardRef, useContext, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Dimensions,
  View,
  TouchableOpacity,
} from "react-native";
import {
  Ionicons,
  Feather,
  AntDesign,
  MaterialCommunityIcons,
  Entypo,
  Fontisto,
} from "@expo/vector-icons";

import Cards from "./Cards";
import colors from "../constants/colors";
import ProfilePic from "./ProfilePic";
import ThemeContext from "../config/ThemeContext";

const screen = Dimensions.get("window");

const CommentBar = (
  {
    onSend,
    loaded,
    avatar,
    onFocus,
    placeholder = "Type your comments...",
    type,
  },
  ref
) => {
  const [text, setText] = useState("");
  const [height, setHeight] = useState("");
  const theme = useContext(ThemeContext);

  const handleSend = () => {
    if (text.length < 1) return;
    onSend(text);
    setText("");
  };

  const handleEmojiSelect = (emoji) => {
    setText(text + emoji);
  };

  return (
    <>
      <Cards style={{ ...styles.container, height: Math.max(35, height) }}>
        <View style={styles.avatarCont}>
          <ProfilePic
            source={avatar}
            size={40}
            border={1}
            style={styles.avatar}
          />
        </View>
        <View style={[styles.inputBox, { backgroundColor: theme.extralight }]}>
          <TouchableOpacity activeOpacity={1} style={styles.emoji}>
            <Ionicons name="happy-outline" size={20} color={colors.medium} />
          </TouchableOpacity>
          <TextInput
            numberOfLines={4}
            ref={ref}
            editable={loaded}
            returnKeyType="send"
            onFocus={onFocus}
            multiline
            placeholderTextColor={colors.medium}
            maxLength={500}
            onChangeText={(textVal) => setText(textVal)}
            value={text}
            onContentSizeChange={({ nativeEvent }) =>
              setHeight(nativeEvent.contentSize.height)
            }
            placeholder={placeholder}
            style={[styles.input, { color: theme.color }]}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.sendBtn}
          onPress={handleSend}
        >
          <Feather
            name="send"
            size={25}
            color={type === "send" ? colors.primary : colors.heart}
            fon
          />
        </TouchableOpacity>
      </Cards>
    </>
  );
};

const forwardedRef = forwardRef(CommentBar);

const styles = StyleSheet.create({
  avatar: {},
  avatarCont: {
    marginRight: 10,
  },
  container: {
    width: screen.width,
    minHeight: 60,
    maxHeight: 150,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 11,
    elevation: 15,
  },
  emoji: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: "100%",
  },
  input: {
    flex: 1,
    lineHeight: 25,
    fontFamily: "sen",
    paddingVertical: 8,
  },
  inputBox: {
    height: "85%",
    backgroundColor: colors.extraLight,
    borderRadius: 12,
    flexDirection: "row",
    flex: 1,
    marginVertical: 5,
  },
  sendBtn: {
    justifyContent: "center",
    flex: 0.11,
    width: 10,
    height: 40,
    // transform: [{ rotate: "-30deg" }],
    marginLeft: 4,
    marginRight: 8,
    borderTopEndRadius: 12,
    borderRadius: 3,
    alignItems: "flex-start",
    alignItems: "center",
  },
});
export default forwardedRef;
