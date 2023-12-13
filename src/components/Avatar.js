import React, { useContext, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./AppText";
import ProfilePic from "./ProfilePic";
import Spacer from "./Spacer";
import AppFadeIn from "./AppFadeIn";

import { Context as AuthContext } from "../config/AuthContext";
import AccountBox from "./AccountBox";

const Avatar = ({
  name,
  feederID,
  avatar,
  gender,
  size = 40,
  borderRad,
  style,
  nameStyle,
  bold,
  noAt,
}) => {
  const [modal, setModal] = useState(false);

  const {
    getUserData,
    tryLocalSignin,
    addWeeb,
    state: { userInfo },
  } = useContext(AuthContext);

  let at;
  noAt ? (at = "") : (at = "@");
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => setModal(true)}
      style={[styles.container, style]}
    >
      <ProfilePic
        borderRad={borderRad}
        source={avatar}
        gender={gender}
        userID={feederID}
        size={size}
      />
      <Spacer ml={4}>
        <AppText
          size="small"
          // ellipsizeMode="tail"
          style={{ ...styles.text, ...nameStyle }}
          bold={bold}
        >
          {at}
          {name}
        </AppText>
      </Spacer>
      <AppFadeIn
        visible={modal}
        setVisible={setModal}
        RenderComponent={() => (
          <AccountBox
            setPicModal={setModal}
            callback={null}
            userInfo={userInfo}
            getUserData={getUserData}
            tryLocalSignin={tryLocalSignin}
            addWeeb={addWeeb}
            userID={feederID}
          />
        )}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
export default Avatar;
