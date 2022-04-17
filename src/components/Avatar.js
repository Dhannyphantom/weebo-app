import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "./AppText";
import ProfilePic from "./ProfilePic";
import Spacer from "./Spacer";

const Avatar = ({
  name,
  feederID,
  avatar,
  size = 40,
  borderRad,
  style,
  nameStyle,
  bold,
  noAt,
}) => {
  let at;
  noAt ? (at = "") : (at = "@");
  return (
    <View style={[styles.container, style]}>
      <ProfilePic
        borderRad={borderRad}
        source={avatar}
        userID={feederID}
        size={size}
      />
      <Spacer ml={6}>
        <AppText size="small" style={nameStyle} bold={bold}>
          {at}
          {name}
        </AppText>
      </Spacer>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
export default Avatar;
