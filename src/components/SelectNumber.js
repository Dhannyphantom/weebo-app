import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import colors from "../constants/colors";
import AppButton from "./AppButton";

const SelectNumber = ({ num, style, setNum, limitY = 7, limitX = 0 }) => {
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
      <AppButton title="-" bare onPress={handleDecrement} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
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
      <AppButton title="+" bare onPress={handleIncrement} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  inputContainer: {
    backgroundColor: colors.extraLight,
    borderRadius: 8,
    width: 60,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 19,
    fontFamily: "sen-bold-b2",
  },
});
export default SelectNumber;
