import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import ThemeContext from "../config/ThemeContext";

const Cards = ({
  children,
  elevation = true,
  onLayout,
  style,
  ...otherProps
}) => {
  const theme = useContext(ThemeContext);
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: theme.background,
        elevation: elevation ? 5 : 0,
        ...style,
      }}
      onLayout={(ev) => onLayout && onLayout(ev)}
      {...otherProps}
    >
      {children}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    shadowRadius: 6,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 1.8,
    },
  },
});
export default Cards;
