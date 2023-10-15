import React, { memo, useContext } from "react";
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

import { app_constants } from "../constants/data_store";
// import { Context as AuthContext } from "../config/AuthContext";
import ThemeContext from "../config/ThemeContext";
import { getFeedNumber } from "../constants/helpers";
const { width, scale } = Dimensions.get("window");

const Card = ({
  image,
  avatar,
  followers = 0,
  isFollowing,
  name,
  show,
  borderRadius,
  manager,
  onPress,
  // id,
  mSize,
  style,
  isVerified,
  avaterSize = 45,
  btmPadding = 16,
  mIcon = 75 / scale,
  bIcon = 50 / scale,
}) => {
  const theme = useContext(ThemeContext);

  let cardFollowers = getFeedNumber(
    Array.isArray(followers) ? followers.length : followers
  );

  return (
    <>
      <View style={[styles.card, style]}>
        <TouchableOpacity
          activeOpacity={0.94}
          style={[
            styles.imageContainer,
            {
              backgroundColor: theme.backgroundExtralight,
              borderRadius: borderRadius ? borderRadius : 8,
            },
          ]}
          onPress={onPress}
        >
          <Image
            resizeMethod="resize"
            resizeMode="stretch"
            source={{ uri: image.uri }}
            style={[
              styles.image,
              { borderRadius: borderRadius ? borderRadius : 8 },
            ]}
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
            borderRadius: borderRadius ?? 8,
          },
        ]}
      >
        <View
          style={{
            ...styles.iconContainer,
            bottom: mIcon / 2,
          }}
        >
          <Icon
            name="star"
            style={styles.icon}
            color={isFollowing ? colors.primary : colors.light}
            size={bIcon}
            disablePress
          />
          <Icon
            text={`${cardFollowers}`}
            size={mIcon}
            textSize={mSize}
            style={styles.icon}
            disablePress
            activeOpacity={1}
          />
          <Icon
            name="check-all"
            color={isVerified ? colors.accentOld : colors.light}
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
            size="small"
            ellipsizeMode="tail"
            style={styles.subTitle}
          >
            {show}
          </AppText>
        </View>
      </View>
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
export default memo(Card);

/**
 *   const handleFollowPress = () => {
    if (isFollowing) {
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
      // console.log(err.err.response.data);
      setPopper({
        vis: true,
        type: "failed",
        msg: err.msg,
      });
    });
  };

    const updateCardState = (bool) => {
    setCardState({
      ...cardState,
      isFollowing: bool,
      liked: bool ? cardState.liked + 1 : cardState.liked - 1,
    });
  };

 */
