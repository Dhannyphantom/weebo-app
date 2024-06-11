import React, { forwardRef, useContext, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Dimensions,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import Cards from "./Cards";
import colors from "../constants/colors";
import ProfilePic from "./ProfilePic";
import ThemeContext from "../config/ThemeContext";

const screen = Dimensions.get("window");
export const INPUT_HEIGHT = 50;

const CommentBar = (
  {
    onSend,
    loaded,
    avatar,
    onFocus,
    placeholder = "Type your comments...",
    commentText,
    setCommentText,
    parentState = false,
    type,
    style,
    cancelIcon,
  },
  ref
) => {
  const [text, setText] = useState("");
  const [height, setHeight] = useState("");
  const theme = useContext(ThemeContext);

  const handleSend = () => {
    if (!parentState && text.length < 1 && cancelIcon)
      return onSend("cancel_op");
    if (!parentState && text.length < 1) return;
    if (parentState && commentText.length < 1) return;
    onSend(parentState ? commentText : text);
    parentState ? setCommentText("") : setText("");
  };

  return (
    <>
      <Cards
        style={{ ...styles.container, height: Math.max(35, height), ...style }}
      >
        <View style={styles.avatarCont}>
          <ProfilePic
            source={avatar}
            size={40}
            borderColor="#ddd"
            disabled
            border={2}
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
            onChangeText={(textVal) =>
              parentState ? setCommentText(textVal) : setText(textVal)
            }
            value={parentState ? commentText : text}
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
          {cancelIcon && !text[1] ? (
            <MaterialCommunityIcons
              name={cancelIcon ? "cancel" : ""}
              size={26}
              color={colors.heartDark}
            />
          ) : (
            <Feather name="send" size={26} color={colors.primary} />
          )}
        </TouchableOpacity>
      </Cards>
    </>
  );
};

const forwardedRef = forwardRef(CommentBar);

const styles = StyleSheet.create({
  avatarCont: {
    marginRight: 10,
  },
  container: {
    width: screen.width,
    minHeight: INPUT_HEIGHT,
    maxHeight: 150,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 11,
    elevation: 4,
  },
  emoji: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    paddingLeft: 6,
    marginRight: 4,
    height: "100%",
  },
  input: {
    flex: 1,
    lineHeight: 25,
    fontFamily: "sans-regular",
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
