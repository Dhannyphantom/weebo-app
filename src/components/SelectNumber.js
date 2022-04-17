import React from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "./AppButton";
import AppText from "./AppText";

const SelectNumber = ({ num, style, setNum, limitY = 7, limitX = 0 }) => {
  const handleIncrement = () => {
    num < limitY && setNum((prev) => prev + 1);
  };
  const handleDecrement = () => {
    num > limitX && setNum((prev) => prev - 1);
  };
  return (
    <View style={[styles.container, style]}>
      <AppButton title="-" bare onPress={handleDecrement} />
      <AppText> {num} </AppText>
      <AppButton title="+" bare onPress={handleIncrement} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
export default SelectNumber;
