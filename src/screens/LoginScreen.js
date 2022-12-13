import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";

import { Context as AuthContext } from "../config/AuthContext";
import AppForm from "../components/AppForm";

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [elevation, setElevation] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  const { signIn, clearMessage } = useContext(AuthContext);

  const handleSignIn = (data) => {
    setLoading(true);
    signIn(data, null, (err) => {
      setErrMsg(err);
      setLoading(false);
      setElevation(true);
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => clearMessage());
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView>
        <AppForm
          headerTitle="Sign in to your Account: "
          p3
          a="in"
          b="up"
          btnTitle="Sign in"
          elevation={elevation}
          setElevation={setElevation}
          setErrMsg={setErrMsg}
          loading={loading}
          setLoading={(bool) => setLoading(bool)}
          navTo="Register"
          login
          errorMessage={errMsg}
          onPress={handleSignIn}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default LoginScreen;
