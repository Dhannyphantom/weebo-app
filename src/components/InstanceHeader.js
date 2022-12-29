import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import ActivityIndicator from "./ActivityIndicator";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Context as FeedContext } from "../config/FeedContext";
import { Context as AuthContext } from "../config/AuthContext";

import AppHeader from "./AppHeader";
import AppText from "./AppText";
import DropDown from "./DropDown";
import Icon from "./Icon";
import LoaderImage from "./LoaderImage";
import PopDropDown from "./PopDropDown";
import PopMessage from "./PopMessage";
import Link from "./Link";
import AppFadeIn from "../components/AppFadeIn";
import ProfilePic from "./ProfilePic";
import Separator from "./Separator";
import colors from "../constants/colors";
import getTimestamp from "../constants/getTimestamp";
import ThemeContext from "../config/ThemeContext";
import { capFirstLetter } from "../constants/helpers";

const { width } = Dimensions.get("window");
const TIMER = 60 * 60 * 24 * 7 * 4; // 4 WEEKS
const MINIMUM_FOLLOWERS = 1000;
const MINIMUM_FEEDBACK = 1000;

export const RenderVerifyInfo = ({
  vName,
  vList,
  vFollowers,
  vInstance,
  vInstanceID,
}) => {
  const theme = useContext(ThemeContext);
  const countdown = getTimestamp(vInstanceID ?? 0, "countdown", TIMER);
  const vPostive = vList?.filter((obj) => obj.feedback === "correct").length;
  const vNegative = vList?.filter((obj) => obj.feedback === "wrong").length;

  const totalPercentile =
    (vFollowers / MINIMUM_FOLLOWERS) * 40 +
    ((vPostive - vNegative) / MINIMUM_FEEDBACK) * 60;

  return (
    <View style={[styles.verifyModal, { backgroundColor: theme.background }]}>
      <AppText style={styles.verifyModalTitle} size="large" bold>
        {vName} verification stats
      </AppText>
      <View style={styles.verifyModalContent}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <AppText size="xxlarge" bold>
            {vFollowers}
          </AppText>
          <AppText bold style={{ color: colors.medium }}>
            Followers
          </AppText>
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <AppText size="xxlarge" bold>
            {vPostive}
          </AppText>
          <AppText bold style={{ color: colors.medium }}>
            +ve Feedback
          </AppText>
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <AppText size="xxlarge" bold>
            {vNegative}
          </AppText>
          <AppText bold style={{ color: colors.medium }}>
            -ve Feedback
          </AppText>
        </View>

        <ActivityIndicator visible={false} style={styles.activity} />
      </View>
      <AppText
        size="xxlarge"
        style={{ textAlign: "center", color: colors.primary }}
        bold
      >
        {Number(totalPercentile).toFixed(2)}%
      </AppText>
      <AppText style={styles.verifyModalSubtext}>
        {capFirstLetter(vInstance)} will be deleted if not verified in{" "}
        {countdown}
      </AppText>
    </View>
  );
};

const InstanceHeader = ({ instanceData }) => {
  const {
    cover_photo,
    description,
    coverLoading,
    listItems,
    owner,
    verified,
    handleLeftPress,
    handleRightPress,
    followers,
    verifiedList,
    subscribers,
    screenIcon,
    feedback,
    namePosition = "center",
    leftColor,
    name,
  } = instanceData;
  const { userFeedback } = useContext(FeedContext);
  const [dropDown, setDropDown] = useState(false);
  const [fBackModal, setFBackModal] = useState(false);
  const [popper, setPopper] = useState({ vis: false });
  const [fBack, setFBack] = useState(0);
  const [verifyModal, setVerifyModal] = useState(false);

  const safeInset = useSafeAreaInsets();
  const theme = useContext(ThemeContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  let posObj = {};

  // FEED BACK
  let feedbackColor;
  if (fBack === 0) {
    feedbackColor = colors.medium;
  } else if (fBack === 1) {
    feedbackColor = colors.primary;
  } else if (fBack === 2) {
    feedbackColor = colors.heart;
  }

  const { instanceID, finder, instanceName, instanceShow, instance } = feedback;

  const feedbackQuestion =
    instance === "character"
      ? `Is ${capFirstLetter(
          instanceName.slice(0, instanceName?.search(" "))
        )} the first name of a character in ${capFirstLetter(
          instanceShow
        )} show as portrayed in this cover photo?`
      : instance == "show"
      ? `Is ${capFirstLetter(
          instanceName
        )} the official title of an anime or manga in the Animedom as portrayed in this cover photo?`
      : instance === "group"
      ? `Is ${capFirstLetter(
          instanceName
        )} an organization or a group, team, squad and the likes in ${capFirstLetter(
          instanceShow
        )}`
      : null;

  const isChannel = instance == "channel";

  switch (namePosition) {
    case "left":
      posObj = {
        alignSelf: "flex-start",
        marginLeft: 15,
      };
      break;

    default:
      posObj = {};
      break;
  }

  const modalData = [
    {
      id: "1",
      title: "YES",
      icon: "check",
      onPress: function () {
        setFBack(1);
        setFBackModal(false);
        const data = {
          type: instance,
          typeId: instanceID,
          feedback: "correct",
        };
        userFeedback(
          data,
          () => {
            if (!finder)
              return setPopper({
                vis: true,
                msg: "Feedback sent successfully",
                type: "success",
              });
          },
          (err) => {
            setPopper({
              vis: true,
              msg: err?.response?.message,
              type: "failed",
            });
          }
        );
      },
    },
    {
      id: "2",
      title: "NO",
      icon: "cancel",
      onPress: function () {
        setFBack(2);
        setFBackModal(false);
        const data = {
          type: instance,
          typeId: instanceID,
          feedback: "wrong",
        };
        userFeedback(
          data,
          () => {
            if (!finder)
              return setPopper({
                vis: true,
                msg: "Feedback sent successfully",
                type: "success",
              });
          },
          (err) => {
            setPopper({
              vis: true,
              msg: err?.response?.message,
              type: "failed",
            });
          }
        );
      },
    },
  ];

  const checkFeedBack = () => {
    if (finder) {
      if (finder.feedback === "correct") {
        setFBack(1);
      } else if (finder.feedback === "wrong") {
        setFBack(2);
      }
    } else {
      setFBack(0);
    }
  };

  const handleUnverifyPress = () => {
    setVerifyModal(true);
  };

  const handleRightIconPress = () => {
    if (!userInfo.verified) {
      return setPopper({
        vis: true,
        type: "failed",
        msg: "Complete and verify your account",
      });
    }
    if (handleRightPress) {
      handleRightPress();
      return;
    }
    setFBackModal(true);
  };

  const RenderFeedback = () => {
    return (
      <View style={{ paddingBottom: width * 0.04 }}>
        <AppText
          style={{
            textAlign: "center",
            width: width * 0.75,
            alignSelf: "center",
          }}
        >
          {feedbackQuestion}
        </AppText>
        <View style={{ alignItems: "center", marginTop: 15 }}>
          {modalData.map((obj, idx) => (
            <Link
              key={idx}
              name={obj.title}
              iconName={obj.icon}
              style={{ width: width * 0.8 }}
              onPress={obj.onPress}
            />
          ))}
          {!finder && (
            <AppText style={{ color: colors.medium, marginTop: 20 }}>
              Earn 2CP by verifying instance
            </AppText>
          )}
        </View>
      </View>
    );
  };

  const RenderUnverifiedTag = () => {
    if (verified || isChannel) return null;
    return (
      <TouchableOpacity
        style={styles.unverifiedTagContainer}
        onPress={handleUnverifyPress}
      >
        {/* <View style={styles.unverifiedTag} /> */}
        <Ionicons name="analytics-outline" color={colors.heartDark} size={20} />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    checkFeedBack();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            aspectRatio: cover_photo
              ? cover_photo?.width / cover_photo?.height
              : 1.5,
          }}
        >
          <LoaderImage image={cover_photo} borderRadius={width * 0.05} />
          <View
            style={{
              position: "absolute",
              ...styles.image,
            }}
          >
            <ActivityIndicator
              visible={coverLoading}
              style={styles.activity}
              wTransparent
            />
            {!verified && !isChannel && (
              <View style={styles.unverified}>
                <AppText
                  style={{
                    color: colors.white,
                  }}
                  bold
                  size="xxlarge"
                >
                  UNVERIFIED
                </AppText>
              </View>
            )}
          </View>
          <AppHeader
            style={{ position: "absolute", top: safeInset.top }}
            type="transparent"
            dotPress={() => setDropDown(true)}
            iconColor={colors.white}
          />
        </View>

        <View style={styles.icons}>
          <Icon
            name="account-star"
            activeOpacity={0.9}
            size={55}
            onPress={() => handleLeftPress && handleLeftPress()}
            color={leftColor}
          />
          <ProfilePic
            source={owner?.avatar}
            size={130}
            border={4.5}
            userID={owner?._id}
            borderColor={theme.white}
          />
          {verified ? (
            <Icon
              text={null}
              name={feedbackColor ? "check-all" : null}
              size={55}
              color={colors.accentOld}
              disablePress
              onPress={null}
              activeOpacity={1}
            />
          ) : (
            <Icon
              text={subscribers ? subscribers : null}
              name={feedbackColor && !subscribers ? "account-check" : null}
              size={55}
              color={feedbackColor}
              onPress={handleRightIconPress}
              disablePress={isChannel}
              activeOpacity={1}
            />
          )}
        </View>
        <View style={styles.textCont}>
          <AppText style={styles.user} bold>
            @{owner?.username}
          </AppText>
          {name && instance !== "character" && (
            <View style={{ ...styles.headerBoxContainer, ...posObj }}>
              <View style={styles.headerBoxCont}>
                <Ionicons
                  name={screenIcon}
                  color={colors.primary}
                  size={width * 0.04}
                />
                <AppText size="xlarge" style={styles.tvText} bold>
                  {name}
                </AppText>
              </View>
              <RenderUnverifiedTag />
            </View>
          )}
          <Separator h={2} />
          <AppText
            style={{
              textAlign: "center",
              lineHeight: 35,
              textTransform: "capitalize",
            }}
          >
            {description}
          </AppText>
          <Separator h={2} />
          {name && instance === "character" && (
            <View style={styles.nameContainer}>
              <Fontisto
                name={name}
                color={colors.primary}
                size={width * 0.035}
              />
              <AppText size="xlarge" style={styles.name} bold>
                {instanceName}
              </AppText>
              <RenderUnverifiedTag />
            </View>
          )}
        </View>
        <DropDown
          lists={listItems}
          visible={dropDown}
          setVisible={setDropDown}
        />
        <PopDropDown
          visible={fBackModal}
          setter={() => setFBackModal(false)}
          headerTitle="INSTANCE VERIFICATION"
          RenderComponent={RenderFeedback}
        />
        <PopMessage
          popData={popper}
          setter={() => setPopper({ vis: false })}
          timer={0.2}
        />
        <AppFadeIn
          visible={verifyModal}
          setVisible={setVerifyModal}
          RenderComponent={() => (
            <RenderVerifyInfo
              vName={instanceName}
              vInstance={instance}
              vList={verifiedList}
              vFollowers={followers}
              vInstanceID={instanceID}
            />
          )}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  headerBoxCont: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  headerBoxContainer: {
    width: width * 0.94,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    bottom: 130 / 2,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  name: {
    marginLeft: 6,
    textTransform: "capitalize",
  },
  nameContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  textCont: {
    bottom: 52,
    alignItems: "center",
  },
  tvText: {
    color: colors.primary,
    textTransform: "capitalize",
    marginLeft: 5,
  },
  user: {
    textAlign: "center",
  },
  unverified: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.3,
  },
  unverifiedTagContainer: {
    padding: 5,
    paddingHorizontal: 7,
    marginLeft: 5,
    borderWidth: 2,
    borderColor: colors.heart,
    opacity: 0.7,
    borderRadius: 60,
  },
  unverifiedTag: {
    backgroundColor: colors.heart,
    width: 10,
    height: 10,
    borderRadius: 8,
  },
  verifiedText: {
    color: colors.facebook,
    padding: 5,
    borderWidth: 1,
    borderColor: colors.facebook,
    borderRadius: 8,
  },
  verifyModal: {
    width: width * 0.9,
    height: width * 0.5,
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: width * 0.02,
  },
  verifyModalTitle: {
    textTransform: "capitalize",
    textAlign: "center",
    marginTop: 6,
  },
  verifyModalContent: {
    flex: 0.9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  verifyModalSubtext: {
    color: colors.medium,
    width: width * 0.55,
    marginTop: 5,
    textAlign: "center",
    alignSelf: "center",
  },
});

export default InstanceHeader;
