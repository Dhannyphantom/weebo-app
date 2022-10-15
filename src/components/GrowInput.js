import React, { forwardRef, useContext, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import ThemeContext from "../config/ThemeContext";
import colors from "../constants/colors";

const screen = Dimensions.get("window");
const VIEW_HEIGHT = screen.height * 0.2;

const GrowInput = (
  { text, setText, placeholder, style, pressCb, mLine = true, ...otherProps },
  ref
) => {
  const theme = useContext(ThemeContext);

  return (
    <View style={[styles.inputCont, { backgroundColor: theme.extralight }]}>
      <TextInput
        style={[styles.input, { color: theme.color }, style]}
        placeholder={placeholder}
        placeholderTextColor={theme.color}
        maxLength={80}
        ref={ref}
        {...otherProps}
        numberOfLines={mLine ? 5 : 1}
        multiline={mLine}
        onChangeText={(textVal) => setText(textVal)}
        value={text}
      />
    </View>
  );
};

const growForwardedRef = forwardRef(GrowInput);

const styles = StyleSheet.create({
  inputCont: {
    minHeight: 55,
    borderWidth: 3,
    backgroundColor: colors.extraLight,
    borderColor: colors.medium,
    borderRadius: screen.width * 0.02,
    width: screen.width * 0.8,
    overflow: "hidden",
    alignSelf: "center",
  },
  input: {
    flex: 1,
    fontFamily: "sen",
    padding: 5,
    paddingLeft: 10,
    // lineHeight: 25,
  },
});
export default growForwardedRef;

/*

  // height: Math.max(35, height)
  //     <View style={{ ...styles.inputCont, ...style }}>
  const [height, setHeight] = useState(0);


 // onContentSizeChange={({ nativeEvent }) => {
      //   const changeSize = nativeEvent.contentSize.height;
      //   if (height < VIEW_HEIGHT) {
      //     setHeight(changeSize);
      //   } else {
      //     setHeight(VIEW_HEIGHT);
      //   }
      // }}
*/
