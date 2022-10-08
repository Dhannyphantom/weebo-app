import React, { useContext, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Modal,
  PanResponder,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Drag from "./Drag";
import ThemeContext from "../config/ThemeContext";

const { height, width } = Dimensions.get("window");

const INITIAL_HEIGHT = height * 0.4;
const FULL_HEIGHT = 0;
const PopUpModal = ({
  visible,
  // modalHeight = height * 0.95,
  ContentComponent,
  DownContent,
  style,
  closeCb,
  setVisible,
  full = false,
  setter,
}) => {
  const translator = useRef(new Animated.Value(height)).current;
  const topper = useSafeAreaInsets().top;
  const opaciter = translator.interpolate({
    inputRange: [INITIAL_HEIGHT, height],
    outputRange: [1, 0],
  });

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        const lastPos = gestureState.y0 - 60;
        const totalPos = lastPos + gestureState.dy;
        translator.setValue(totalPos);
      },

      onPanResponderRelease: (evt, gestureState) => {
        // const lastPos = gestureState.y0 - 60;
        // const totalPos = lastPos + gestureState.dy;
        if (gestureState.dy > height * 0.3 || gestureState.vy > 0.75) {
          handleCloseModal();
        } else {
          Animated.spring(translator, {
            toValue: FULL_HEIGHT,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderGrant: (evt, gestureState) => {},
    })
  ).current;
  const theme = useContext(ThemeContext);

  const handleCloseModal = () => {
    Animated.timing(translator, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      closeCb && closeCb();
      setter && setter();
      setVisible && setVisible(false);
    });
  };

  useEffect(() => {
    if (visible) {
      if (full) {
        Animated.timing(translator, {
          toValue: 0,
          useNativeDriver: true,
          // bounciness: 3,
        }).start();
      } else {
        Animated.spring(translator, {
          toValue: INITIAL_HEIGHT,
          useNativeDriver: true,
          // bounciness: 3,
        }).start();
      }
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      statusBarTranslucent
      transparent
      animationType="none"
      onRequestClose={handleCloseModal}
    >
      <Animated.View
        activeOpacity={1}
        onPress={handleCloseModal}
        style={{
          ...styles.modalCont,
          marginTop: topper,
          opacity: opaciter,
        }}
      >
        <Animated.View
          activeOpacity={1}
          style={{
            ...styles.modalContent,
            ...style,
            backgroundColor: theme.background,
            transform: [{ translateY: translator }],
            height: height,
            opacity: opaciter,
          }}
        >
          <Drag panHandlers={{ ...panResponder.panHandlers }} />
          <ContentComponent />
        </Animated.View>
      </Animated.View>
      {DownContent && (
        <View
          onStartShouldSetResponder={false}
          onMoveShouldSetResponder={false}
          style={{
            ...styles.downContainer,
          }}
        >
          <DownContent />
        </View>
      )}
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {},
  downContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },

  modalCont: {
    flex: 1,
    // justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  modalContent: {
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
  },
});
export default PopUpModal;
