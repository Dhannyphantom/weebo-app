import React, { useContext, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, Modal } from "react-native";
import colors from "../constants/colors";
import { Context as AuthContext } from "../config/AuthContext";

//  ------------ FILES --------------------

import proFemale from "../../assets/arts/girl_1.png";
import proMale from "../../assets/arts/sasuke_1.png";
import AccountBox from "./AccountBox";
import ActivityIndicator from "./ActivityIndicator";
import MediaModal from "./MediaModal";
import ThemeContext from "../config/ThemeContext";

const ProfilePic = ({
  source,
  style,
  size,
  border,
  loading,
  callback,
  disabled,
  displayPic,
  userID,
  gender,
  borderColor,
  borderRad = 12,
}) => {
  const [picModal, setPicModal] = useState(false);
  const [display, setDisplay] = useState({ vis: false });
  const [bools, setBools] = useState({ showPlaceholder: true });

  const theme = useContext(ThemeContext);
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
    if (displayPic) {
      setDisplay({ vis: true, item: source });
      return;
    }
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
        {typeof source !== "number" && bools.showPlaceholder && (
          <Image
            source={avatarSource}
            resizeMethod="resize"
            resizeMode="contain"
            style={[
              {
                ...styles.image,
                position: "absolute",
                backgroundColor: theme.extralight,
              },
              style,
            ]}
          />
        )}

        {source && (
          <Image
            source={source}
            resizeMethod="resize"
            onLoad={() => setBools({ ...bools, showPlaceholder: false })}
            onError={() => setBools({ ...bools, showPlaceholder: true })}
            style={[styles.image, style]}
          />
        )}

        {source && source.thumb && (
          <Image
            source={{ uri: source.thumb }}
            resizeMethod="scale"
            defaultSource={avatarSource}
            onLoad={() => setBools({ ...bools, showPlaceholder: false })}
            onError={() => setBools({ ...bools, showPlaceholder: true })}
            style={[styles.thumb, style]}
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
      <MediaModal modalObject={display} setVisible={setDisplay} />
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
  thumb: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    height: "100%",
    width: "105%",
  },
});

export default ProfilePic;
