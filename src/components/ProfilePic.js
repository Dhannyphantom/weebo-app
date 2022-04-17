import React, { useContext, useState } from "react";
import { Image, StyleSheet, View, TouchableOpacity, Modal } from "react-native";
import colors from "../constants/colors";
import { Context as AuthContext } from "../config/AuthContext";

//  ------------ FILES --------------------
import proMale from "../../assets/male.jpg";
import proFemale from "../../assets/female.jpg";
import AccountBox from "./AccountBox";
import ActivityIndicator from "./ActivityIndicator";

const ProfilePic = ({
  source,
  style,
  size,
  border,
  loading,
  disabled,
  userID,
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
        overflow: "hidden"
      }}
    >
      {!source ? (
        <Image
          source={userInfo.gender === "male" ? proMale : proFemale}
          resizeMethod="resize"
          style={[
            {
              ...styles.image,
              // borderRadius: borderRad,
            },
            style,
          ]}
        />
      ) : source && source.length > 50 ? (
        <Image
          source={{ uri: source }}
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
