import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
} from "react-native";
import AppText from "./AppText";

const AppFadeIn = ({ visible, RenderComponent, setVisible }) => {
  if (!visible) return null;

  const scaler = useRef(new Animated.Value(0.75)).current;

  const handleCloseModal = () => {
    Animated.spring(scaler, {
      toValue: 0.75,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  useEffect(() => {
    Animated.spring(scaler, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      statusBarTranslucent
      transparent
      onRequestClose={handleCloseModal}
      animationType="none"
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleCloseModal}
        style={styles.container}
      >
        <Animated.View
          style={{
            ...styles.viewContainer,
            opacity: scaler.interpolate({
              inputRange: [0, 0.75, 1],
              outputRange: [0, 0, 1],
            }),
          }}
        >
          <TouchableOpacity activeOpacity={1}>
            <Animated.View style={{ transform: [{ scale: scaler }] }}>
              {RenderComponent && <RenderComponent closer={handleCloseModal} />}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppFadeIn;
