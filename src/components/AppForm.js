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
const screen = Dimensions.get("window");

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
import AppAnimModal from "./AppAnimModal";
import AppLogo from "./AppLogo";

const { validationSchemaLogin, validationSchemaRegister } = schemas;

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
  const { resetPassword, recoverPassword } = useContext(AuthContext);
  const navigation = useNavigation();

  const [showPass, setShowPass] = useState(true);
  const [gender, setGender] = useState("male");
  const [passInput, setPassInput] = useState("");
  const [passCode, setPassCode] = useState("");
  const [passNew, setPassNew] = useState("");
  const [passNewConfirm, setPassNewConfirm] = useState("");
  const [passLoading, setPasLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ error: null, success: null });
  const [passModal, setPassModal] = useState(false);

  let initialValues, schema;
  const handleGender = (type) => {
    setGender(type);
  };

  const handleFormSubmit = (formValues) => {
    if (register) {
      formValues.gender = gender;
    }
    setPassInput(formValues.email ?? formValues.username);
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

  const handleForgotPass = (type) => {
    setErrMsg(null);
    if (type === "modal") {
      setPasLoading(false);
      setPassModal(true);
    } else if (type === "recover") {
      setPasLoading(true);
      recoverPassword(
        { email: passInput },
        () => {
          console.log("success");
          setPassMsg({
            error: null,
            success: "Verification code sent to email!",
          });
          setPasLoading(false);
        },
        (err) => {
          setPassMsg({ error: err, success: null });
          setPasLoading(false);
        }
      );
    } else if (type === "reset") {
      setPasLoading(true);
      if (passNewConfirm.length < 6 || passNew.length < 6) {
        return setPassMsg({
          ...passMsg,
          error: "Password should not be less than 6 characters",
        });
      }

      if (passNewConfirm !== passNew) {
        return setPassMsg({ ...passMsg, error: "Passwords do not match" });
      }
      if (passInput.length < 2)
        return setPassMsg({ ...passMsg, error: "Provide an email" });

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
          setPassModal(false);
          setPasLoading(false);
        },
        (err) => {
          setPassMsg({ error: err, success: null });
          setPasLoading(false);
        }
      );
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.info}>
        <AppLogo type="icon" />
        {/* <AppText style={{ marginTop: 16 }}>Welcome to the Community! </AppText> */}
        <AppText style={{ marginTop: 7, marginBottom: 14 }}>
          Weebo welcomes you into it's community
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
                  {passMsg.success && passMsg?.success?.contains("success") && (
                    <AppText
                      style={{ textAlign: "center", color: colors.primary }}
                    >
                      {" "}
                      {passMsg.success}{" "}
                    </AppText>
                  )}
                  {login && (
                    <AppButton
                      title="Forgot password?"
                      style={{ alignSelf: "flex-end" }}
                      onPress={() => handleForgotPass("modal")}
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

      <Modal
        visible={passModal}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => setPassModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setPassModal(false)}
          style={styles.modal}
        >
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
            <AppText style={{ marginLeft: 10 }}>
              Enter your registered e-mail:{" "}
            </AppText>
            <GrowInput
              mLine={false}
              style={{
                width: screen.width * 0.7,
                marginTop: 8,
                marginBottom: 16,
              }}
              text={passInput}
              setText={setPassInput}
            />
            {passMsg.success && (
              <>
                <AppText style={{ marginLeft: 10 }}>
                  Enter Verification Code:{" "}
                </AppText>
                <GrowInput
                  keyboardType="number-pad"
                  text={passCode}
                  setText={setPassCode}
                />
                <AppText style={{ marginLeft: 10 }}>
                  Enter New Password:{" "}
                </AppText>
                <GrowInput
                  keyboardType="visible-password"
                  text={passNew}
                  setText={setPassNew}
                />
                <AppText style={{ marginLeft: 10 }}>
                  Confirm New Password:{" "}
                </AppText>
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
                style={{ alignSelf: "flex-end" }}
                naked
              />
            )}
            <AppButton
              title="RESET"
              onPress={() =>
                handleForgotPass(passMsg.success ? "reset" : "recover")
              }
              style={{ alignSelf: "center", marginBottom: 40 }}
              bare
            />
            <ActivityIndicator
              type="spin"
              visible={passLoading}
              wTransparent
              style={styles.activity}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    width: screen.width,
    height: screen.height * 0.8,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    width: "80%",
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
    marginTop: screen.width * 0.03,
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
