import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { Context as AuthContext } from "../config/AuthContext";
const { width, height } = Dimensions.get("window");

import AppText from "./AppText";
import Icon from "./Icon";
import Spacer from "./Spacer";
import colors from "../constants/colors";
import FormField from "./FormField";
import Screen from "./Screen";
import Separator from "./Separator";
import SubmitButton from "./SubmitButton";
import GrowInput from "./GrowInput";
import ActivityIndicator from "./ActivityIndicator";
import schemas from "../constants/yupSchema";
//FILES
import male from "../../assets/male.jpg";
import male2 from "../../assets/male2.jpg";
import female from "../../assets/female.jpg";
import female2 from "../../assets/female2.jpg";
import AppButton from "./AppButton";
import AppLogo from "./AppLogo";
import AppFadeIn from "./AppFadeIn";

const { validationSchemaLogin, validationSchemaRegister } = schemas;

const ForgotPassword = ({ setErrMsg, setPassModal }) => {
  const { resetPassword, recoverPassword } = useContext(AuthContext);

  const [passInput, setPassInput] = useState("");
  const [passCode, setPassCode] = useState("");
  const [passNew, setPassNew] = useState("");
  const [passNewConfirm, setPassNewConfirm] = useState("");
  const [passLoading, setPasLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ error: null, success: null });

  const handleForgotPass = (type) => {
    // setErrMsg(null);
    if (type === "recover") {
      setPasLoading(true);
      recoverPassword(
        { email: passInput },
        () => {
          setPassMsg({
            error: null,
            success: "Verification code sent to email!",
          });
          setPasLoading(false);
        },
        (err) => {
          let msg = "";
          if (err?.msg?.includes("getaddrinfo")) {
            msg = "No internet connection";
          } else {
            msg = err;
          }

          setPassMsg({ error: msg, success: null });
          setPasLoading(false);
        }
      );
    } else if (type === "reset") {
      setPasLoading(true);
      if (passNewConfirm.length < 6 || passNew.length < 6) {
        setPasLoading(false);

        return setPassMsg({
          ...passMsg,
          error: "Password should not be less than 6 characters",
        });
      }

      if (passNewConfirm !== passNew) {
        setPasLoading(false);
        return setPassMsg({ ...passMsg, error: "Passwords do not match" });
      }
      if (passInput.length < 2) {
        setPasLoading(false);
        return setPassMsg({ ...passMsg, error: "Provide an email" });
      }

      const data = {
        token: passCode,
        email: passInput,
        newPass: passNew,
      };
      resetPassword(
        data,
        () => {
          setPassMsg({
            error: null,
            success: "Password reset successful,Please log in!",
          });
          setPasLoading(false);
          setPassModal(false);
        },
        (err) => {
          setPassMsg({ ...passMsg, error: err });
          setPasLoading(false);
        }
      );
    }
  };

  return (
    <View style={styles.content}>
      <AppText style={{ textAlign: "center" }} bold>
        PASSWORD RESET
      </AppText>
      <Separator h={1} />
      {passMsg.error && (
        <AppText
          style={{
            textAlign: "center",
            color: colors.heart,
            marginBottom: 5,
          }}
        >
          {passMsg.error}
        </AppText>
      )}
      {passMsg.success && (
        <AppText
          style={{
            textAlign: "center",
            color: colors.primary,
            marginBottom: 5,
          }}
        >
          {passMsg.success}
        </AppText>
      )}
      <AppText style={{ margin: 15 }}>Enter your registered e-mail: </AppText>
      <GrowInput mLine={false} text={passInput} setText={setPassInput} />
      {passMsg.success && (
        <>
          <AppText style={{ margin: 15 }}>Enter Verification Code: </AppText>
          <GrowInput
            keyboardType="number-pad"
            text={passCode}
            setText={setPassCode}
          />
          <AppText style={{ margin: 15 }}>Enter New Password: </AppText>
          <GrowInput
            keyboardType="visible-password"
            text={passNew}
            setText={setPassNew}
          />
          <AppText style={{ margin: 15 }}>Confirm New Password: </AppText>
          <GrowInput
            keyboardType="visible-password"
            text={passNewConfirm}
            setText={setPassNewConfirm}
          />
        </>
      )}
      {passMsg.success && (
        <AppButton
          title="Resend code"
          onPress={() => handleForgotPass("recover")}
          style={styles.btn}
          naked
        />
      )}
      <AppButton
        title={passMsg.success ? "RESET PASSWORD" : "GET TOKEN"}
        onPress={() => handleForgotPass(passMsg.success ? "reset" : "recover")}
        style={styles.btn}
        bare
      />
      <ActivityIndicator
        type="spin"
        visible={passLoading}
        wTransparent
        style={styles.activityPass}
      />
    </View>
  );
};

const AppForm = ({
  login,
  register,
  btnTitle,
  headerTitle,
  onPress,
  p1,
  errorMessage,
  elevation,
  setErrMsg,
  setElevation,
  p2,
  loading,
  setLoading,
  p3,
  a,
  b,
  navTo,
}) => {
  const navigation = useNavigation();

  const [showPass, setShowPass] = useState(true);
  const [gender, setGender] = useState("male");
  const [passModal, setPassModal] = useState(false);

  let initialValues, schema;
  const handleGender = (type) => {
    setGender(type);
  };

  const handleFormSubmit = (formValues) => {
    if (register) {
      formValues.gender = gender;
    }
    // setPassInput(formValues.email ?? formValues.username);
    setElevation(false);
    onPress(formValues);
  };

  login
    ? ((initialValues = { username: "", password: "" }),
      (schema = validationSchemaLogin))
    : register
    ? ((initialValues = {
        username: "",
        email: "",
        password: "",
        gender: "male",
      }),
      (schema = validationSchemaRegister))
    : null;

  return (
    <Screen style={styles.container}>
      <View style={styles.info}>
        <AppLogo type="icon" />
        {/* <AppText style={{ marginTop: 16 }}>Welcome to the Community! </AppText> */}
        <AppText style={styles.title}>
          Connect and have fun with your fellow weebs
        </AppText>
      </View>
      <Spacer style={styles.headerTitleCont}>
        <AppText bold style={styles.headerTitle}>
          {headerTitle}
        </AppText>
      </Spacer>
      {/* //FORM */}
      {p1 && (
        <View style={styles.avatarCont}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handleGender("male")}
          >
            <Image
              source={gender === "male" ? male2 : male}
              style={{
                ...styles.avatars,
                borderColor: gender === "male" ? colors.primary : colors.light,
                width: gender === "male" ? 68 : 60,
                height: gender === "male" ? 68 : 60,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handleGender("female")}
          >
            <Image
              source={gender === "female" ? female2 : female}
              style={{
                ...styles.avatars,
                borderColor:
                  gender === "female" ? colors.primary : colors.light,
                width: gender === "female" ? 68 : 60,
                height: gender === "female" ? 68 : 60,
              }}
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.form}>
        <Formik
          initialValues={initialValues}
          onSubmit={(formValues) => handleFormSubmit(formValues)}
          validationSchema={schema}
        >
          {() => (
            <>
              {p1 && (
                <FormField
                  elevation={elevation}
                  icon="account"
                  placeholder="Username"
                  autoCapitalize="none"
                  autoCorrect={false}
                  name="username"
                />
              )}
              {p2 && (
                <FormField
                  elevation={elevation}
                  icon="email"
                  placeholder="Email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  name="email"
                />
              )}
              {p3 && (
                <FormField
                  elevation={elevation}
                  icon="account"
                  placeholder="Username or email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  name="username"
                />
              )}
              <FormField
                elevation={elevation}
                icon="lock"
                placeholder="Password"
                secureTextEntry={showPass}
                autoCapitalize="none"
                autoCorrect={false}
                pass
                onPress={() => setShowPass(!showPass)}
                name="password"
              />
              {errorMessage ? (
                <View>
                  <AppText style={styles.error}> {errorMessage} </AppText>
                  {/* {passMsg.success && passMsg?.success?.contains("success") && (
                    <AppText
                      style={{ textAlign: "center", color: colors.primary }}
                    >
                      {passMsg.success}
                    </AppText>
                  )} */}
                  {login && (
                    <AppButton
                      title="Forgot password?"
                      style={{ alignSelf: "center" }}
                      onPress={() => setPassModal(true)}
                      bare
                    />
                  )}
                </View>
              ) : null}
              <View style={{ marginTop: 20 }}>
                <SubmitButton
                  loading={loading}
                  setLoading={(bool) => setLoading(bool)}
                  title={btnTitle}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
      <AppText style={{ marginTop: 20 }}> Or sign {a} with</AppText>
      <View style={styles.icons}>
        <Icon
          name="facebook"
          pack="b"
          curve
          size={45}
          color={colors.facebook}
        />
        <Icon name="google-plus" curve size={45} color={colors.google} />
        <Icon name="twitter" curve size={45} color={colors.twitter} />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{ padding: 20 }}
        onPress={() => navigation.navigate(navTo)}
      >
        <AppText>
          {b === "up" ? "Don't" : "Already"} have an account?{" "}
          <AppText style={styles.link}>Sign {b}</AppText>
        </AppText>
      </TouchableOpacity>
      {loading && (
        <View style={styles.activity}>
          <ActivityIndicator visible={loading} wTransparent />
        </View>
      )}

      <AppFadeIn
        visible={passModal}
        setVisible={setPassModal}
        RenderComponent={() => (
          <ForgotPassword
            setPassModal={(val) => {
              setPassModal(val);
              setErrMsg(null);
            }}
          />
        )}
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  avatarCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatars: {
    marginHorizontal: 20,
    marginTop: 15,
    borderWidth: 3,
    borderRadius: 200,
  },
  activity: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  activityPass: {
    position: "absolute",
    width: "100%",
    height: "115%",
  },
  btn: { alignSelf: "center", marginTop: 15, marginBottom: 20 },
  container: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    width: width * 0.95,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.white,
    paddingVertical: 20,
  },
  error: {
    color: colors.heart,
    marginVertical: 6,
    textAlign: "center",
  },
  info: {
    alignItems: "center",
    marginTop: width * 0.03,
  },
  form: {
    marginTop: 12,
    alignItems: "center",
  },
  icons: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  link: {
    color: colors.primary,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    maxWidth: "60%",
    marginTop: 7,
    marginBottom: 14,
    textAlign: "center",
  },
  headerTitle: {
    fontSize: 12,
    marginTop: 10,
  },
  pass: {
    alignSelf: "flex-end",
    paddingRight: 50,
  },
});
export default AppForm;
