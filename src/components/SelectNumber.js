import React, { useContext } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import colors from "../constants/colors";
import AppButton from "./AppButton";
import ThemeContext from "../config/ThemeContext";
import AppText from "./AppText";

const TouchButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.btnStyle}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <AppText style={styles.btnText} size="xlarge" textStyle="black">
        {text}
      </AppText>
    </TouchableOpacity>
  );
};

const SelectNumber = ({ num, style, setNum, limitY = 7, limitX = 0 }) => {
  const theme = useContext(ThemeContext);
  const handleIncrement = () => {
    if (Number.isNaN(Number(num))) {
      setNum(limitX);
      return;
    }
    num < limitY && setNum((prev) => prev + 1);
  };
  const handleDecrement = () => {
    if (Number.isNaN(Number(num))) {
      setNum(limitX);
      return;
    }
    num > limitX && setNum((prev) => prev - 1);
  };

  const onChangeNumber = (val, isKeypress) => {
    if (isKeypress) {
      if (val === "Backspace") {
        // setNum(num.slice(-1));
        setNum(String(num).slice(0, String(num).length - 1));
      }
    } else {
      setNum(val);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* <AppButton
        title="-"
        btnTextSize={"xlarge"}
        bare
        onPress={handleDecrement}
      /> */}
      <TouchButton text="-" onPress={handleDecrement} />
      <View
        style={[styles.inputContainer, { backgroundColor: theme.extralight }]}
      >
        <TextInput
          style={[styles.input, { color: theme.color }]}
          maxLength={2}
          onKeyPress={({ nativeEvent: { key: keyValue } }) =>
            onChangeNumber(keyValue, true)
          }
          numberOfLines={1}
          keyboardType="decimal-pad"
          onChangeText={(val) => onChangeNumber(val, false)}
          value={`${num}`}
        />
      </View>
      <TouchButton text="+" onPress={handleIncrement} />
    </View>
  );
};
const styles = StyleSheet.create({
  btnStyle: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: colors.primary,
    padding: 0,
    margin: 0,
    paddingBottom: 2,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  inputContainer: {
    borderRadius: 8,
    width: 60,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 19,
    fontFamily: "sans-semibold",
  },
});
export default SelectNumber;
