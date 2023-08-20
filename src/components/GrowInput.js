import { useFormikContext } from "formik";
import React, { forwardRef, useContext, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import ThemeContext from "../config/ThemeContext";
import colors from "../constants/colors";
import AppText from "./AppText";

const { width } = Dimensions.get("window");

const FormikGrowInput = (
  {
    placeholder,
    style,
    name,
    pressCb,
    mLine = true,
    maxHeight = 1,
    ...otherProps
  },
  ref
) => {
  const theme = useContext(ThemeContext);

  const [inputHeight, setInputHeight] = useState(55);

  const { setFieldTouched, handleChange, values, touched, errors } =
    useFormikContext();

  const onChangeInput = (barheight) => {
    if (barheight < 180) setInputHeight(Math.max(55, barheight));
  };

  return (
    <>
      <View
        style={[
          styles.inputCont,
          { backgroundColor: theme.extralight, height: inputHeight },
        ]}
      >
        <TextInput
          style={[styles.input, { color: theme.color }, style]}
          placeholder={placeholder}
          placeholderTextColor={theme.color}
          maxLength={80}
          ref={ref}
          {...otherProps}
          multiline={mLine}
          textAlginVertical="top"
          numberOfLines={8}
          onContentSizeChange={({
            nativeEvent: {
              contentSize: { height },
            },
          }) => onChangeInput(height)}
          onBlur={() => setFieldTouched(name)}
          onChangeText={handleChange(name)}
          onChange={() => setFieldTouched(name, false, true)}
          value={values[name]}
        />
      </View>
      {touched[name] && errors[name] && (
        <AppText style={{ color: "red", marginTop: 8, textAlign: "center" }}>
          {errors[name]}
        </AppText>
      )}
    </>
  );
};

const FormikGrowInputWithRef = forwardRef(FormikGrowInput);

const GrowInput = (
  {
    text,
    setText,
    placeholder,
    formik = null,
    style,
    pressCb,
    mLine = true,
    maxHeight = 1,
    ...otherProps
  },
  ref
) => {
  const theme = useContext(ThemeContext);

  const [inputHeight, setInputHeight] = useState(55);

  const onChangeInput = (barheight) => {
    if (barheight < 180) setInputHeight(Math.max(55, barheight));
  };

  if (formik) {
    return (
      <FormikGrowInputWithRef
        placeholder={placeholder}
        name={formik.name}
        maxHeight={maxHeight}
        mLine={mLine}
        pressCb={pressCb}
        style={style}
        {...otherProps}
      />
    );
  }

  return (
    <View
      style={[
        styles.inputCont,
        { backgroundColor: theme.extralight, height: inputHeight },
      ]}
    >
      <TextInput
        style={[styles.input, { color: theme.color }, style]}
        placeholder={placeholder}
        placeholderTextColor={theme.color}
        maxLength={80}
        ref={ref}
        {...otherProps}
        multiline={mLine}
        textAlginVertical="top"
        numberOfLines={8}
        onContentSizeChange={({
          nativeEvent: {
            contentSize: { height },
          },
        }) => onChangeInput(height)}
        onChangeText={(textVal) => setText(textVal)}
        value={text}
      />
    </View>
  );
};

const growForwardedRef = forwardRef(GrowInput);

const styles = StyleSheet.create({
  inputCont: {
    borderWidth: 3,
    borderColor: colors.light,
    borderRadius: width * 0.02,
    width: width * 0.8,
    overflow: "hidden",
    alignSelf: "center",
  },
  input: {
    flex: 1,
    fontFamily: "sans-regular",
    padding: 5,
    paddingLeft: 10,
    lineHeight: 28,
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
