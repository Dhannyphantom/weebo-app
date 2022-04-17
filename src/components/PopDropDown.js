import React, { useRef, useEffect } from "react";
import {
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";

import AppText from "./AppText";
import Separator from "./Separator";
import colors from "../constants/colors";

const { width, height } = Dimensions.get("window");

const PopDropDown = ({
  visible = false,
  setter,
  RenderComponent,
  headerTitle,
}) => {
  const translator = useRef(new Animated.Value(height)).current;

  const handleCloseModal = () => {
    Animated.timing(translator, {
      toValue: height,
      useNativeDriver: true,
    }).start(() => setter && setter());
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(translator, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          opacity: translator.interpolate({
            inputRange: [0, height * 0.7],
            outputRange: [1, 0],
          }),
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleCloseModal}
          style={styles.container}
        >
          <Animated.View style={{ transform: [{ translateY: translator }] }}>
            <TouchableOpacity activeOpacity={1} style={styles.content}>
              {headerTitle && (
                <View>
                  <AppText size="xlarge" style={styles.headerTitle} bold>
                    {headerTitle}
                  </AppText>
                  <Separator h={1} />
                </View>
              )}
              <RenderComponent />
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    width: width,
    borderTopStartRadius: width * 0.04,
    borderTopEndRadius: width * 0.04,
    backgroundColor: colors.white,
    // minHeight: height * 0.3,
  },
  headerTitle: {
    textAlign: "center",
    marginTop: 7,
  },
});

export default PopDropDown;
