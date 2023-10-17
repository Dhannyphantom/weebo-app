import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Modal, Dimensions, Animated } from "react-native";
import ThemeContext from "../config/ThemeContext";
import GrowInput from "./GrowInput";
import colors from "../constants/colors";
import AppButton from "./AppButton";
import AppText from "./AppText";
import Separator from "./Separator";

const { width, height } = Dimensions.get("window");

const BOX_WIDTH = width * 0.88;

const AlertModal = ({ obj, setVisible, onPress, verifyPrompt }) => {
  // obj has a title, btn,  message, visible
  /*
const obj = {
  visible: true,
  title: "Sign Out",
  message: "Are sure you want to miss out all the fun?",
  btn: "YES",
  type: "signout",
  data: {}
};
  */

  const [prompt, setPrompt] = useState("");

  const translator = useRef(new Animated.Value(height)).current;
  const theme = useContext(ThemeContext);

  const translatorStyles = {
    ...styles.mbox,
    backgroundColor: theme.backgroundExtralight,
    transform: [{ translateY: translator }],
    opacity: translator.interpolate({
      inputRange: [0, height],
      outputRange: [1, 0],
    }),
  };

  const onDiscard = () => {
    Animated.timing(translator, {
      toValue: height,
      useNativeDriver: true,
    }).start(() => setVisible({ visible: false }));
  };

  useEffect(() => {
    if (obj.visible) {
      Animated.spring(translator, {
        toValue: 0,
        speed: 5,
        useNativeDriver: true,
      }).start();
      setPrompt("");
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
            {verifyPrompt && (
              <View>
                <AppText size="large" bold style={styles.prompt}>
                  {verifyPrompt}
                </AppText>
                <GrowInput text={prompt} setText={setPrompt} mLine={false} />
              </View>
            )}
            {verifyPrompt ? (
              <View style={styles.promptBtns}>
                {prompt === verifyPrompt && (
                  <AppButton
                    title={obj.btn}
                    onPress={() => {
                      onPress();
                      onDiscard();
                    }}
                    bare
                    LIcon="check"
                    style={{ marginBottom: 5 }}
                  />
                )}
                <AppButton
                  title="CANCEL"
                  bare
                  bareRed
                  LIcon="cancel"
                  onPress={onDiscard}
                />
              </View>
            ) : (
              <View style={{ marginTop: 25 }}>
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
            )}
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
    justifyContent: "center",
  },
  mbox: {
    width: BOX_WIDTH,
    backgroundColor: colors.extraLight,
    alignItems: "center",
    elevation: 10,
    paddingBottom: 15,
    borderRadius: width * 0.03,
  },
  mboxIn: {
    alignSelf: "center",
  },
  message: {
    textAlign: "center",
    width: width * 0.5,
    paddingVertical: 30,
    alignSelf: "center",
  },
  prompt: {
    textAlign: "center",
    marginBottom: 6,
    color: colors.primary,
  },
  promptBtns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 20,
  },
  title: {
    marginTop: 10,
    textTransform: "uppercase",
  },
});
export default AlertModal;
