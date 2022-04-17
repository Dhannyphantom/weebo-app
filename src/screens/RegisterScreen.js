import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import { Context as AuthContext } from "../config/AuthContext";
import AppForm from "../components/AppForm";

const RegisterScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [elevation, setElevation] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  const { signUp, clearMessage } = useContext(AuthContext);

  const handleSignIn = (data) => {
    setLoading(true);
    signUp(data, null, (err) => {
      setErrMsg(err);
      setLoading(false);
      setElevation(true);
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => clearMessage());
    return unsubscribe;
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AppForm
        headerTitle="Sign up for your Account: "
        p2
        p1
        a="up"
        b="in"
        btnTitle="Sign Up"
        elevation={elevation}
        setElevation={setElevation}
        setErrMsg={setErrMsg}
        loading={loading}
        setLoading={setLoading}
        navTo="Login"
        register
        errorMessage={errMsg}
        onPress={handleSignIn}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default RegisterScreen;
