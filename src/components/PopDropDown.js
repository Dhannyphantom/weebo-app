import React, { useRef, useEffect, useContext } from "react";
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
import ThemeContext from "../config/ThemeContext";

const { width, height } = Dimensions.get("window");

const PopDropDown = ({
  visible = false,
  setter,
  closer = null,
  closeCallback,
  extraCallback,
  disableCloseTouch = false,
  RenderComponent,
  TopperComponent,
  headerTitle,
}) => {
  const theme = useContext(ThemeContext);
  const translator = useRef(new Animated.Value(height)).current;
  const opaciter = translator.interpolate({
    inputRange: [0, height * 0.7],
    outputRange: [1, 0],
  });

  const handleCloseModal = () => {
    Animated.timing(translator, {
      toValue: height,
      useNativeDriver: true,
    }).start(() => {
      setter && setter();
      closeCallback && closeCallback("open");
      extraCallback && extraCallback();
    });
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(translator, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (closer) {
      const status = closer();
      if (status === "close") {
        handleCloseModal();
      }
    }
  }, [closer]);

  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          opacity: opaciter,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleCloseModal}
          disabled={disableCloseTouch}
          style={styles.container}
        >
          <Animated.View
            style={{
              opacity: opaciter,
              flex: 1,
              transform: [{ scale: opaciter }],
            }}
          >
            {TopperComponent && <TopperComponent />}
          </Animated.View>
          <Animated.View style={{ transform: [{ translateY: translator }] }}>
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.content, { backgroundColor: theme.background }]}
            >
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
    overflow: "hidden",
    maxHeight: height * 0.98,
  },
  headerTitle: {
    textAlign: "center",
    textTransform: "capitalize",
    marginTop: 7,
  },
});

export default PopDropDown;
