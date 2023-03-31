import React, { useContext, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, Modal } from "react-native";
import colors from "../constants/colors";
import { Context as AuthContext } from "../config/AuthContext";

//  ------------ FILES --------------------

import proFemale from "../../assets/arts/girl_1.png";
import proMale from "../../assets/arts/sasuke_1.png";
import AccountBox from "./AccountBox";
import ActivityIndicator from "./ActivityIndicator";

const ProfilePic = ({
  source,
  style,
  size,
  border,
  loading,
  callback,
  disabled,
  userID,
  gender,
  borderColor,
  borderRad = 12,
}) => {
  const [picModal, setPicModal] = useState(false);
  const {
    getUserData,
    tryLocalSignin,
    addWeeb,
    state: { userInfo },
  } = useContext(AuthContext);
  let borderStyles;
  border ? (borderStyles = borderColor ? borderColor : colors.primary) : null;

  const handlePicPress = () => {
    if (disabled) return;
    setPicModal(true);
  };
  let avatarSource;
  if (gender) {
    avatarSource = gender === "male" ? proMale : proFemale;
  } else {
    avatarSource = userInfo.gender === "male" ? proMale : proFemale;
  }

  return (
    <>
      <TouchableOpacity
        onPress={handlePicPress}
        activeOpacity={disabled ? 1 : 0.9}
        disabled={disabled}
        style={{
          width: size,
          height: size,
          borderWidth: border,
          borderColor: borderStyles,
          borderRadius: borderRad,
          overflow: "hidden",
        }}
      >
        {!source ? (
          <Image
            source={avatarSource}
            resizeMethod="resize"
            resizeMode="contain"
            style={[
              {
                ...styles.image,
                // borderRadius: borderRad,
              },
              style,
            ]}
          />
        ) : source && source?.uri?.length > 50 ? (
          <Image
            source={source}
            resizeMethod="resize"
            style={[
              {
                ...styles.image,
                // borderRadius: borderRad,
              },
              style,
            ]}
          />
        ) : (
          <Image
            source={source}
            resizeMethod="scale"
            style={[
              {
                ...styles.image,
                // borderRadius: borderRad + 1,
              },
              style,
            ]}
          />
        )}
        <ActivityIndicator
          visible={loading}
          size={0.22}
          type="loader"
          style={{ ...styles.activity, borderRadius: 30 }}
          wTransparent
        />
      </TouchableOpacity>
      <Modal
        visible={picModal}
        animationType="fade"
        transparent
        statusBarTranslucent
        style={styles.modalComp}
      >
        <AccountBox
          setPicModal={setPicModal}
          callback={callback}
          userInfo={userInfo}
          getUserData={getUserData}
          tryLocalSignin={tryLocalSignin}
          addWeeb={addWeeb}
          userID={userID}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  modalComp: {
    flex: 1,
  },
});

export default ProfilePic;
