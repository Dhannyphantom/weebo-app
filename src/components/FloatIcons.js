import React, { useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import colors from "../constants/colors";
import AppText from "./AppText";
import BallIcon from "./BallIcon";
import ProfilePic from "./ProfilePic";

const { width, height } = Dimensions.get("window");

const ICON_SIZE = (width * 0.1) / 2.5;
const BALL_SIZE = width * 0.1;
const BALLER = BALL_SIZE + 6;

// const data = [
//   {
//     id: "189686",
//     icon: "account-plus",
//     text: "Invite Character",
//     show: true,
//     onPress: () => {},
//   },
//   {
//     id: "9806792",
//     icon: "account",
//     text: "Check Invites",
//     show: true,
//     onPress: () => {},
//   },
// ];

const FloatIcons = ({ data }) => {
  const [toggle, setToggle] = useState(false);

  const translator = useRef(new Animated.Value(0)).current;
  const showData = data.filter((obj) => obj.show === true);
  const showDataLength = showData.length;
  const CHANGE_MOVE = BALLER * showDataLength;

  const getMoveY = (index) => {
    const sub = (showDataLength - (index + 1)) * BALLER;
    return Animated.add(translator, sub);
  };

  const getOpactiyInterpolate = (index) => {
    const sub = showDataLength - index;
    return -CHANGE_MOVE / sub;
  };

  let moverY = -BALLER * showDataLength;

  const handleTogglePress = () => {
    if (toggle) {
      moverY = 0;
    }
    Animated.timing(translator, {
      toValue: moverY,
      useNativeDriver: true,
    }).start();
    setToggle(!toggle);
  };

  return (
    <View style={styles.container}>
      {showData.map((obj, idx) => {
        const componentKey = (Math.random() / idx + 1).toString();
        return (
          <Animated.View
            key={componentKey}
            style={{
              position: "absolute",
              flexDirection: "row",
              alignItems: "center",
              transform: [{ translateY: getMoveY(idx) }],
              opacity: translator.interpolate({
                inputRange: [-CHANGE_MOVE, getOpactiyInterpolate(idx)],
                outputRange: [1, 0],
              }),
            }}
          >
            {!obj?.isProfile?.vis ? (
              <>
                <BallIcon
                  icon={obj.icon}
                  size={BALL_SIZE}
                  iconSize={ICON_SIZE}
                  style={{ margin: 4 }}
                  onPress={obj.onPress}
                  activeOpacity={0.85}
                />
                <AppText style={styles.text}>{obj.text}</AppText>
              </>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ProfilePic
                  source={obj?.isProfile?.data?.avatar?.uri}
                  borderRad={200}
                  border={1.2}
                  userID={obj?.isProfile?.data?._id}
                  size={BALL_SIZE}
                />
                <AppText
                  style={{
                    marginLeft: 5,
                    ...styles.text,
                  }}
                  bold
                >
                  @{obj?.isProfile?.data?.username}
                </AppText>
              </View>
            )}
          </Animated.View>
        );
      })}
      <BallIcon
        icon={toggle ? "cancel" : "chevron-double-up"}
        // icon = "pan-up"
        size={BALL_SIZE}
        iconSize={ICON_SIZE}
        style={{
          margin: 4,
          backgroundColor: toggle ? colors.heart : colors.primary,
        }}
        onPress={handleTogglePress}
        activeOpacity={0.9}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
  text: {
    backgroundColor: colors.white,
    padding: 6,
    borderRadius: width * 0.018,
  },
});
export default FloatIcons;
