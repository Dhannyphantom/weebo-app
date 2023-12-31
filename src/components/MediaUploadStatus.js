import { StyleSheet, View, Animated } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import ActivityIndicator from "./ActivityIndicator";
import AppText from "./AppText";
import colors from "../constants/colors";

const MediaUploadStatus = ({ status, screen }) => {
  const [bools, setBools] = useState({
    vis: false,
  });

  const lottieProg = useRef(new Animated.Value(0)).current;

  const compareScreen = Array.isArray(screen)
    ? screen.includes(status?.screen)
    : status?.screen == screen;

  const checkBool =
    compareScreen &&
    status?.hasStarted &&
    !status?.hasFinished &&
    !status?.error;

  const onAnimationFinish = () => {
    setBools({ ...bools, vis: false });
    lottieProg.setValue(0);
  };

  const runAnimation = () => {
    Animated.sequence([
      Animated.timing(lottieProg, {
        toValue: 0.1,
        duration: 4000,
        delay: 2000,
        speed: 0.2,
        useNativeDriver: true,
      }),
      Animated.timing(lottieProg, {
        toValue: 0.78,
        duration: 30000, //30secs
        useNativeDriver: true,
      }),
      Animated.timing(lottieProg, {
        toValue: 0.8,
        duration: 4000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (checkBool) {
      setBools({ ...bools, vis: true });
      runAnimation();
    }

    if (!checkBool && bools.vis) {
      Animated.timing(lottieProg, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        onAnimationFinish();
      });
    }
  }, [status]);

  return (
    <>
      {bools.vis && (
        <View style={styles.row}>
          <ActivityIndicator
            visible
            // onAnimationFinish={onAnimationFinish}
            progress={lottieProg}
            autoPlay={false}
            transparent
            style={{
              flex: 1,
              height: 15,
            }}
            type="upload"
            // speed={speed}
            size={0.2}
          />
          <AppText
            size="xsmall"
            style={{ color: colors.medium, marginTop: 4 }}
            textStyle="black"
          >
            Uploading media...
          </AppText>
        </View>
      )}
    </>
  );
};

export default MediaUploadStatus;

const styles = StyleSheet.create({
  row: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
