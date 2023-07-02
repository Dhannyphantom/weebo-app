import React, { useContext, useEffect, useRef } from "react";
import { StyleSheet, Modal, Animated, TouchableOpacity } from "react-native";
import ThemeContext from "../config/ThemeContext";

const AppFadeIn = ({
  visible,
  disableCloseModal,
  disableTouchModal,
  closeModal,
  RenderComponent,
  setter,
  setVisible,
}) => {
  if (!visible) return null;

  const scaler = useRef(new Animated.Value(0.75)).current;
  const theme = useContext(ThemeContext);

  const handleCloseModal = () => {
    Animated.spring(scaler, {
      toValue: 0.75,
      useNativeDriver: true,
    }).start(() => {
      if (setter) return setter();
      setVisible && setVisible(false);
    });
  };

  useEffect(() => {
    if (closeModal?.close) {
      handleCloseModal();
    }
  }, [closeModal]);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaler, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      statusBarTranslucent
      transparent
      onRequestClose={() => {
        if (disableTouchModal) return;
        handleCloseModal();
      }}
      animationType="none"
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleCloseModal}
        disabled={disableCloseModal}
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
          <TouchableOpacity disabled={disableTouchModal} activeOpacity={1}>
            <Animated.View style={{ transform: [{ scale: scaler }] }}>
              {RenderComponent && (
                <RenderComponent
                  closer={handleCloseModal}
                  style={{ backgroundColor: theme.background }}
                />
              )}
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
