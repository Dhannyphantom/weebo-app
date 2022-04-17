import React from "react";
import { View, StyleSheet } from "react-native";

const Spacer = ({
  children,
  style,
  p,
  b,
  t,
  m,
  ph,
  pv,
  mh,
  mv,
  mr,
  mt,
  mb,

  ml,
  pt,
  pb,
  pr,
  pl,
}) => {
  return (
    <View
      style={{
        margin: m,
        marginHorizontal: mh,
        marginVertical: mv,
        marginRight: mr,
        marginLeft: ml,
        marginBottom: mb,
        marginTop: mt,
        padding: p,
        paddingHorizontal: ph,
        paddingVertical: pv,
        paddingTop: pt,
        paddingBottom: pb,
        paddingLeft: pl,
        paddingRight: pr,
        bottom: b,
        top: t,
        ...style,
      }}
    >
      {children}
    </View>
  );
};

export default Spacer;
