import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import ActivityIndicator from "./ActivityIndicator";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Context as FeedContext } from "../config/FeedContext";

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

const { width, height } = Dimensions.get("window");
const TIMER = 60 * 60 * 24 * 7 * 3; // 3 WEEKS

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
      ? `Is ${instanceName
          .slice(0, instanceName?.search(" "))
          .toUpperCase()} the first name of a character in ${instanceShow?.toUpperCase()} show?`
      : instance == "show"
      ? `Does ${instanceName?.toUpperCase()} exists as a show or manga in the Animedom?`
      : null;

  const pFeedback = verifiedList?.filter(
    (obj) => obj.feedback === "correct"
  ).length;
  const nFeedback = verifiedList?.filter(
    (obj) => obj.feedback === "wrong"
  ).length;

  const totalPercentile =
    (followers / 2000) * 50 + ((pFeedback - nFeedback) / 1000) * 50;

  const countdown = getTimestamp(
    instanceID ? instanceID : 0,
    "countdown",
    TIMER
  );

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

  const RenderVerifyInfo = () => {
    return (
      <View style={styles.verifyModal}>
        <AppText style={styles.verifyModalTitle} size="large" bold>
          {instanceName} verification stats
        </AppText>
        <View style={styles.verifyModalContent}>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <AppText size="xxlarge" bold>
              {followers}
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
              {pFeedback}
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
              {nFeedback}
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
          {instance[0].toUpperCase() + instance.slice(1)} will be deleted if not
          verified in {countdown}
        </AppText>
      </View>
    );
  };

  const RenderUnverifiedTag = () => {
    if (verified || isChannel) return null;
    return (
      <TouchableOpacity style={{ marginLeft: 6 }} onPress={handleUnverifyPress}>
        <AppText
          style={{
            color: colors.facebook,
            padding: 5,
            borderWidth: 1,
            borderColor: colors.facebook,
            borderRadius: 8,
          }}
          bold
        >
          {" "}
          UNVERIFIED
        </AppText>
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
              type="spin"
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
            title="Hello"
            dotPress={() => setDropDown(true)}
            iconColor={colors.white}
          />
        </View>

        <View style={styles.icons}>
          <Icon
            name="account-star"
            activeOpacity={0.9}
            size={46}
            onPress={() => handleLeftPress && handleLeftPress()}
            color={leftColor}
          />
          <ProfilePic
            source={owner?.avatar}
            size={130}
            border={4.5}
            userID={owner?._id}
            borderColor={colors.white}
          />
          {verified ? (
            <Icon
              text={null}
              name={feedbackColor ? "check-all" : null}
              size={46}
              color={colors.accentOld}
              disablePress
              onPress={null}
              activeOpacity={1}
            />
          ) : (
            <Icon
              text={subscribers ? subscribers : null}
              name={feedbackColor && !subscribers ? "account-check" : null}
              size={46}
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
            <View style={{ ...styles.headerBoxCont, ...posObj }}>
              <Ionicons
                name={screenIcon}
                color={colors.primary}
                size={width * 0.04}
              />
              <AppText size="xlarge" style={styles.tvText} bold>
                {name}
              </AppText>
              <RenderUnverifiedTag />
            </View>
          )}
          <Separator h={1} />
          <AppText style={{ textAlign: "center", textTransform: "capitalize" }}>
            {description}
          </AppText>
          <Separator h={1} />
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
          RenderComponent={RenderVerifyInfo}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBoxCont: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
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
