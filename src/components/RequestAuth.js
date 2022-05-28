import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

import AppButton from "./AppButton";
import { Context as AuthContext } from "../config/AuthContext";
import ActivityIndicator from "./ActivityIndicator";

const screen = Dimensions.get("window");

const RequestAuth = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const {
    tryLocalSignin,
    clearMessage,
    state: { errMsg },
  } = useContext(AuthContext);

  const signIN = () => {
    setLoading(true);
    navigation.navigate("Login");
  };

  const run = () => {
    clearMessage();
    tryLocalSignin(null, () => {
      navigation.navigate("Welcome");
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      run();
    });

    //remove listener
    return unsubscribe;
  }, []);
  if (errMsg)
    return (
      <View style={styles.container}>
        <View style={styles.loader}>
          <ActivityIndicator
            visible={true}
            type="network"
            size={0.4}
            text={errMsg}
          />
        </View>
        {errMsg.match(/sign in/gi) ? (
          <AppButton
            title="Sign in"
            loading={loading}
            style={styles.btn}
            bare
            onPress={signIN}
          />
        ) : (
          <AppButton title="Retry" style={styles.btn} onPress={run} />
        )}
      </View>
    );
  return <ActivityIndicator visible={true} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    marginVertical: 10,
  },
  loader: {
    width: screen.width,
    height: screen.height * 0.5,
  },
});

export default RequestAuth;
