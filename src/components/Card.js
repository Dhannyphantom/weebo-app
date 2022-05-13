import React, { useContext, useEffect, useState } from "react";
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

import konstants from "../constants/konstants";
import { Context as AuthContext } from "../config/AuthContext";
import { Context as CharContext } from "../config/CharContext";
import { Context as FeedContext } from "../config/FeedContext";
import AlertModal from "./AlertModal";
import PopMessage from "./PopMessage";
const screen = Dimensions.get("window");

const CARD_WIDTH = screen.width * 0.6;

const Card = ({
  image,
  avatar,
  followers = [],
  name,
  show,
  avaterSize = 45,
  series,
  cardWidth = CARD_WIDTH,
  owner,
  onPress,
  id,
  mSize,
  style,
  iconContainerStyle,
  subTitleStyle,
  infoStyle,
  btmStyle,
  isVerified,
  mIcon = 75,
  bIcon = 50,
}) => {
  const {
    tryLocalSignin,
    state: { userInfo },
  } = useContext(AuthContext);
  const { followChar } = useContext(CharContext);
  const { getShows } = useContext(FeedContext);

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
      followChar({ charID, userID, type: "follow" }, null, (err) =>
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
    followChar({ charID, userID, type: "unfollow" }, null, (err) => {
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
          style={styles.imageContainer}
          onPress={onPress}
        >
          <Image
            resizeMethod="resize"
            resizeMode="stretch"
            source={{ uri: image.uri }}
            style={styles.image}
          />
          <View style={styles.proPic}>
            {owner && owner?._id === konstants.appID ? null : (
              <Spacer p={10}>
                <ProfilePic
                  source={avatar}
                  border={1.2}
                  borderRad={100}
                  borderColor={colors.white}
                  userID={owner?._id}
                  size={avaterSize}
                />
              </Spacer>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.btmCard, btmStyle]}>
        <View
          style={{
            ...styles.iconContainer,
            bottom: mIcon / 2,
            ...iconContainerStyle,
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
        <View style={[styles.info, infoStyle]}>
          <AppText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.title}
            bold
          >
            {name}
          </AppText>
          <View style={styles.showText}>
            <AppText
              numberOfLines={1}
              size="xsmall"
              ellipsizeMode="tail"
              style={{ ...styles.subTitle, ...subTitleStyle }}
            >
              {show}
            </AppText>
          </View>
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
    width: screen.width * 0.6,
    height: 390,
  },
  btmCard: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowRadius: 3,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 1.8,
    },
    marginTop: 1.5,
    borderRadius: screen.width * 0.025,
    width: screen.width * 0.6,
    height: 89,
  },
  image: {
    width: "100%",
    height: "100%",
    alignItems: "flex-end",
    borderRadius: 12,
    // borderTopStartRadius: screen.width * 0.023,
    // borderTopEndRadius: screen.width * 0.023,
    // backgroundColor: colors.medium,
  },

  imageContainer: {
    borderRadius: 10,
    backgroundColor: colors.extraLight,
    // overflow: "hidden",
  },

  info: {
    alignItems: "center",
    width: "100%",
    bottom: 40,
    height: "90%",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  proPic: {
    position: "absolute",
    left: "70%",
  },
  title: {
    marginTop: 15,
    marginHorizontal: 3,
    textTransform: "capitalize",
  },
  subTitle: {
    textTransform: "capitalize",
    color: colors.medium,
  },
  showText: {
    marginBottom: 4,
    justifyContent: "flex-end",
  },
});
export default Card;
