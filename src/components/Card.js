import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import AppText from "./AppText";
import Icon from "./Icon";
import ProfilePic from "./ProfilePic";
import colors from "../constants/colors";
import Spacer from "./Spacer";
import getNumberFormat from "../constants/getNumberFormat";

import { app_constants } from "../constants/data_store";
import { Context as AuthContext } from "../config/AuthContext";
import { Context as CharContext } from "../config/CharContext";
import AlertModal from "./AlertModal";
import PopMessage from "./PopMessage";
import ThemeContext from "../config/ThemeContext";
const { width } = Dimensions.get("window");

const Card = ({
  image,
  avatar,
  followers = [],
  name,
  show,
  avaterSize = 45,
  series,
  manager,
  onPress,
  btmPadding = 16,
  id,
  mSize,
  style,
  isVerified,
  mIcon = 75,
  bIcon = 50,
}) => {
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const { followChar } = useContext(CharContext);
  const theme = useContext(ThemeContext);

  let followingArr = series ? series : userInfo.following.map((obj) => obj._id);
  const [alertData, setAlertData] = useState({ visible: false });
  const [popper, setPopper] = useState({ vis: false });
  const [cardState, setCardState] = useState({
    liked: followers.length,
    isFollowing: followingArr.includes(series ? userInfo._id : id),
  });

  const { isFollowing } = cardState;
  const charID = id;
  const userID = userInfo._id;

  let cardFollowers = getNumberFormat(cardState.liked);

  const updateCardState = (bool) => {
    setCardState({
      ...cardState,
      isFollowing: bool,
      liked: bool ? cardState.liked + 1 : cardState.liked - 1,
    });
  };

  const handleFollowPress = () => {
    if (isFollowing) {
      // console.log(followingArr);
      setAlertData({
        title: "Unfollow Character",
        visible: true,
        message: `Are you sure you want to unfollow ${
          name[0].toUpperCase() + name.slice(1)
        }`,
        btn: "Yes",
      });
    } else {
      updateCardState(true);
      followChar({ charID, userID, route: "follow" }, null, (err) =>
        setPopper({
          vis: true,
          type: "failed",
          msg: err.msg,
        })
      );
    }
  };

  const handleConfirmAlert = () => {
    updateCardState(false);
    followChar({ charID, userID, route: "unfollow" }, null, (err) => {
      console.log(err.err.response.data);
      setPopper({
        vis: true,
        type: "failed",
        msg: err.msg,
      });
    });
  };

  return (
    <>
      <View style={[styles.card, style]}>
        <TouchableOpacity
          activeOpacity={0.94}
          style={[
            styles.imageContainer,
            { backgroundColor: theme.backgroundExtralight },
          ]}
          onPress={onPress}
        >
          <Image
            resizeMethod="resize"
            resizeMode="stretch"
            source={{ uri: image.uri }}
            style={styles.image}
          />
          <View style={styles.proPic}>
            {manager && manager?._id === app_constants.appID ? null : (
              <Spacer p={10}>
                <ProfilePic
                  source={avatar}
                  border={1.5}
                  borderRad={avaterSize / 3}
                  borderColor={colors.white}
                  userID={manager?._id}
                  size={avaterSize}
                />
              </Spacer>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.btmCard,
          {
            backgroundColor: theme.background,
            elevation: theme.mode === "dark" ? 8 : 2,
          },
        ]}
      >
        <View
          style={{
            ...styles.iconContainer,
            bottom: mIcon / 2,
            // ...iconContainerStyle,
          }}
        >
          <Icon
            name="star"
            style={styles.icon}
            color={isFollowing ? colors.heart : colors.medium}
            onPress={handleFollowPress}
            size={bIcon}
          />
          <Icon
            text={`${cardFollowers}`}
            size={mIcon}
            textSize={mSize}
            style={styles.icon}
            activeOpacity={1}
          />
          <Icon
            name="check-all"
            color={isVerified ? colors.accentOld : colors.medium}
            style={styles.icon}
            size={bIcon}
            iconSize={bIcon / 2.2}
            disablePress
          />
        </View>
        <View style={[styles.info, { paddingTop: btmPadding }]}>
          <AppText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.title}
            bold
          >
            {name}
          </AppText>
          <AppText
            numberOfLines={1}
            size="xsmall"
            ellipsizeMode="tail"
            style={styles.subTitle}
          >
            {show}
          </AppText>
        </View>
      </View>
      <AlertModal
        obj={alertData}
        setVisible={setAlertData}
        onPress={handleConfirmAlert}
      />
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
    </>
  );
};
const styles = StyleSheet.create({
  card: {
    width: width * 0.7,
  },
  btmCard: {
    shadowRadius: 3,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 1.8,
    },
    marginTop: 3,
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imageContainer: {
    borderRadius: 8,
  },
  info: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 15,
    paddingBottom: 9,
  },
  iconContainer: {
    position: "absolute",
    width: "100%",
    zIndex: 5,
    top: -45,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  proPic: {
    position: "absolute",
    right: 0,
  },
  title: {
    // marginTop: 15,
    marginBottom: 2,
    textTransform: "capitalize",
  },
  subTitle: {
    textTransform: "capitalize",
    color: colors.medium,
  },
});
export default Card;
