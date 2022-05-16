import React, { useContext } from "react";
import { StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeContext from "../config/ThemeContext";
//
const Screen = ({ children, panHandlers, style, ...otherProps }) => {
  const theme = useContext(ThemeContext);
  const contentBg = style.backgroundColor
    ? style.backgroundColor
    : theme.background;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: contentBg,
      }}
    >
      <Animated.View
        style={[styles.container, style]}
        {...otherProps}
        {...panHandlers}
      >
        {children}
      </Animated.View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Screen;
