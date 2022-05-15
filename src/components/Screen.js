import React, { useContext } from "react";
import { StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeContext from "../config/themeContext";
//
const Screen = ({ children, panHandlers, style, ...otherProps }) => {
  const theme = useContext(ThemeContext);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
        ...style,
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
