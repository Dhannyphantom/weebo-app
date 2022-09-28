import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Animated, Modal } from "react-native";
import ThemeContext from "../config/ThemeContext";
import colors from "../constants/colors";
import AppText from "./AppText";
import BallIcon from "./BallIcon";
import ProfilePic from "./ProfilePic";

const { width, height } = Dimensions.get("window");

const ICON_SIZE = (width * 0.1) / 2.5;
const BALL_SIZE = width * 0.1;
const BALLER = BALL_SIZE + 12;

const FloatIcons = ({ data }) => {
  // data = [{id, icon, text, show: bool, onPress: func}]
  const [toggle, setToggle] = useState(false);
  const [modal, setModal] = useState(false);

  const translator = useRef(new Animated.Value(0)).current;
  const showData = data.filter((obj) => obj.show === true);
  const showDataLength = showData.length;
  const CHANGE_MOVE = BALLER * showDataLength;
  const theme = useContext(ThemeContext);

  const getMoveY = (index) => {
    let sub = (showDataLength - (index + 1)) * BALLER;
    sub -= 25;
    return Animated.add(translator, sub);
  };

  const getOpactiyInterpolate = (index) => {
    const sub = showDataLength - index;
    return -CHANGE_MOVE / sub;
  };
  let moverY = -BALLER * showDataLength;

  const opaciter = translator.interpolate({
    inputRange: [moverY, 0],
    outputRange: [1, 0],
  });

  const handleTogglePress = (val) => {
    val && setModal(val);
    return setToggle(!toggle);
  };

  useEffect(() => {
    if (toggle && modal) {
      Animated.timing(translator, {
        toValue: moverY,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translator, {
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        setToggle(false);
        setModal(false);
      });
    }
  }, [toggle, modal]);

  return (
    <View style={styles.container}>
      <Modal
        visible={modal}
        onRequestClose={() => handleTogglePress(false)}
        statusBarTranslucent
        animationType="none"
        transparent
      >
        <Animated.View style={[styles.wrapper, { opacity: opaciter }]}>
          {showData.map((obj, idx) => {
            const componentKey = (Math.random() / idx + 1).toString();
            return (
              <Animated.View
                key={componentKey}
                style={{
                  ...styles.modal,
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
                  <View style={styles.picContainer}>
                    <ProfilePic
                      source={obj?.isProfile?.data?.avatar?.uri}
                      borderRad={200}
                      border={1.2}
                      userID={obj?.isProfile?.data?._id}
                      size={BALL_SIZE}
                    />
                    <AppText
                      style={{
                        marginLeft: 2,
                        backgroundColor: theme.background,
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
            size={BALL_SIZE}
            iconSize={ICON_SIZE}
            style={{
              margin: 16,
              backgroundColor: toggle ? colors.heart : colors.primary,
            }}
            onPress={() => handleTogglePress(false)}
            activeOpacity={0.9}
          />
        </Animated.View>
      </Modal>
      <BallIcon
        icon={toggle ? "cancel" : "chevron-double-up"}
        size={BALL_SIZE}
        iconSize={ICON_SIZE}
        style={{
          margin: 4,
          backgroundColor: toggle ? colors.heart : colors.primary,
        }}
        onPress={() => handleTogglePress(true)}
        activeOpacity={0.9}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
  text: {
    padding: 6,
    borderRadius: width * 0.018,
  },
  modal: {
    position: "absolute",
    flexDirection: "row",
    paddingLeft: 10,
    alignItems: "center",
  },
  picContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
    marginBottom: 5,
  },
  wrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.51)",
    justifyContent: "flex-end",
  },
});
export default FloatIcons;
