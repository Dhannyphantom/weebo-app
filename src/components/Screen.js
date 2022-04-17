import React from "react";
import { StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
//
const Screen = ({ children, panHandlers, style, ...otherProps }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: style?.backgroundColor || "transparent",
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
