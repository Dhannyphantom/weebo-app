import React, { useContext, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

import { Context as AuthContext } from "../config/AuthContext";

import colors from "../constants/colors";
import AppText from "./AppText";
import FriendBox from "./FriendBox";
import Separator from "./Separator";
import ActivityIndicator from "./ActivityIndicator";
import ThemeContext from "../config/ThemeContext";
import AppFadeIn from "./AppFadeIn";

const { width, height } = Dimensions.get("window");

// DELETE THIS COMPONENT AND REPLACE WITH APPFADEIN COMPONENT

const TransferInstance = ({
  visible,
  setVisible,
  instance = "character",
  updateThisInstance,
  instanceID,
}) => {
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const [errMsg, setErrMsg] = useState(null);

  return (
    <AppFadeIn
      visible={visible}
      RenderComponent={() => {
        return (
          <View style={[styles.content, { backgroundColor: theme.extralight }]}>
            <View
              style={[styles.container, { backgroundColor: theme.background }]}
            >
              <AppText
                size="large"
                style={{
                  textAlign: "center",
                  textTransform: "capitalize",
                  marginTop: 8,
                }}
                bold
              >
                Transfer {instance}
              </AppText>
              <Separator h={1} />
              {errMsg && <AppText style={styles.error}>{errMsg}</AppText>}
              {userInfo.friends[0] ? (
                <FriendBox
                  data={userInfo.friends}
                  type="transfer"
                  updateThisInstance={updateThisInstance}
                  typeObj={{ instance, instanceID }}
                  length={0.85}
                  instanceLogic={{ setVisible, setErrMsg }}
                  onPress={null}
                />
              ) : (
                <ActivityIndicator
                  visible={true}
                  type="isEmpty"
                  text="You have no weebos"
                />
              )}
            </View>
          </View>
        );
      }}
      setVisible={setVisible}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: width * 0.03,
  },
  content: {
    width: width * 0.95,
    minHeight: height * 0.4,
    borderRadius: width * 0.04,
    padding: 10,
  },
  error: {
    color: colors.heart,
    textAlign: "center",
    textTransform: "capitalize",
    marginTop: 12,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default TransferInstance;
