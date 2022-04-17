import React, { forwardRef, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import colors from "../constants/colors";

const screen = Dimensions.get("window");
const VIEW_HEIGHT = screen.height * 0.2;

const GrowInput = (
  { text, setText, placeholder, style, pressCb, mLine = true, ...otherProps },
  ref
) => {
  const [height, setHeight] = useState(1);

  useEffect(() => {
    setHeight(4);
  }, []);

  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      maxLength={80}
      ref={ref}
      {...otherProps}
      numberOfLines={height}
      enablesReturnKeyAutomatically
      multiline={mLine}
      onChangeText={(textVal) => setText(textVal)}
      value={text}
    />
  );
};

const growForwardedRef = forwardRef(GrowInput);

const styles = StyleSheet.create({
  inputCont: {
    maxHeight: 250,
    marginHorizontal: screen.width * 0.075,
    marginVertical: 10,
  },
  input: {
    // height: 40,
    borderWidth: 1,
    backgroundColor: colors.extraLight,
    borderColor: colors.unChange,
    borderRadius: screen.width * 0.02,
    width: screen.width * 0.8,
    alignSelf: "center",
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
