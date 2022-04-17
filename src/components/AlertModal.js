import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Modal, Dimensions, Animated } from "react-native";
import colors from "../constants/colors";
import AppButton from "./AppButton";
import AppText from "./AppText";
import Separator from "./Separator";

const { width, height } = Dimensions.get("window");

const BOX_WIDTH = width * 0.8;
const BOX_HEIGHT = width * 0.5;
const MOVE_BOX = height * 0.5 + BOX_HEIGHT / 2;

const AlertModal = ({ obj, setVisible, onPress }) => {
  // obj has a title, btn,  message, visible
  /*
const modalShow = {
  visible: true,
  title: "Sign Out",
  message: "Are sure you want to miss out all the fun?",
  btn: "YES",
  type: "signout",
};
  */
  const translator = useRef(new Animated.Value(0)).current;

  const translatorStyles = {
    ...styles.mbox,
    transform: [{ translateY: translator }],
  };

  const onDiscard = () => {
    Animated.timing(translator, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => setVisible({ visible: false }));
  };

  useEffect(() => {
    if (obj.visible) {
      Animated.spring(translator, {
        toValue: -MOVE_BOX,
        speed: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [obj]);

  return (
    <Modal
      visible={obj.visible}
      statusBarTranslucent
      transparent
      animationType="none"
    >
      <View style={styles.container}>
        <Animated.View style={translatorStyles}>
          <AppText size="large" style={styles.title} bold>
            {obj.title}
          </AppText>
          <Separator h={1} />
          <View style={styles.mboxIn}>
            <AppText size="large" style={styles.message}>
              {obj.message}
            </AppText>
            <View>
              <AppButton
                title={obj.btn}
                onPress={() => {
                  onPress();
                  onDiscard();
                }}
                bare
                style={{ marginBottom: 5 }}
              />
              <AppButton title="DISCARD" onPress={onDiscard} />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  mbox: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    top: BOX_HEIGHT,
    backgroundColor: colors.extraLight,
    alignItems: "center",
    elevation: 2,
    borderRadius: width * 0.03,
  },
  mboxIn: {
    flex: 1,
    justifyContent: "space-around",
  },
  message: {
    textAlign: "center",
    width: width * 0.5,
    alignSelf: "center",
  },
  title: {
    marginTop: 10,
    textTransform: "uppercase",
  },
});
export default AlertModal;
