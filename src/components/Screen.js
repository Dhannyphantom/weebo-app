import React, { useContext } from "react";
import { StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ThemeContext from "../config/ThemeContext";
//
const Screen = ({ children, panHandlers, style, ...otherProps }) => {
  const theme = useContext(ThemeContext);
  const safeInsets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingTop: safeInsets.top, backgroundColor: theme.background },
        style,
      ]}
      {...otherProps}
      {...panHandlers}
    >
      {children}
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Screen;
