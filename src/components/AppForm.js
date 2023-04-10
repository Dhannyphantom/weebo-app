import React, { useContext, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { Context as AuthContext } from "../config/AuthContext";
import { Fontisto } from "@expo/vector-icons";
const { width } = Dimensions.get("window");
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import AppText from "./AppText";
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
import femaleAvatar from "../../assets/arts/girl_1.png";
import maleAvatar from "../../assets/arts/sasuke_1.png";
import AppButton from "./AppButton";
import AppLogo from "./AppLogo";
import AppFadeIn from "./AppFadeIn";
import ThemeContext from "../config/ThemeContext";

const {
  validationSchemaLogin,
  validationSchemaRegister,
  recoverPassValidation,
  resetPassValidation,
  forgotPassResetInitials,
  forgotPassRecoverInitials,
} = schemas;

GoogleSignin.configure();

/*
{
  androidClientId:
    "556387937205-n6i2k2jungjc7svmmigdd1j81m8ukgvp.apps.googleusercontent.com",
}
*/

const ForgotPassword = ({ setPassModal }) => {
  const { resetPassword, recoverPassword } = useContext(AuthContext);

  const [passLoading, setPasLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ error: null, success: null });

  const handleForgotPass = (formValues, extraData) => {
    console.log("FORM:: ", formValues);
    console.log("EXTRA:: ", extraData);

    if (!passMsg.success || (extraData && extraData.type === "recover")) {
      // No token so fetch token
      setPasLoading(true);
      recoverPassword(
        { email: formValues.email, type: "password" },
        () => {
          setPassMsg({
            error: null,
            success: "Verification code sent to email!",
          });
          setPasLoading(false);
        },
        (err) => {
          let msg = "";
          if (err?.msg?.includes("getaddrinfo") || err?.includes("EREFUSED")) {
            msg = "No internet connection";
          } else {
            msg = err;
          }

          setPassMsg({ error: msg, success: null });
          setPasLoading(false);
        }
      );
    } else {
      setPasLoading(true);
      const data = {
        token: formValues.token,
        email: formValues.email,
        newPass: formValues.newPass,
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
      <Formik
        initialValues={
          passMsg.success ? forgotPassResetInitials : forgotPassRecoverInitials
        }
        onSubmit={(formValues) => handleForgotPass(formValues)}
        validationSchema={
          passMsg.success ? resetPassValidation : recoverPassValidation
        }
      >
        {() => (
          <>
            <AppText style={{ margin: 15 }}>
              Enter your registered e-mail:{" "}
            </AppText>
            <GrowInput mLine={false} formik={{ name: "email" }} />
            {passMsg.success && (
              <>
                <AppText style={{ margin: 15 }}>
                  Enter Verification Code:{" "}
                </AppText>
                <GrowInput
                  keyboardType="number-pad"
                  formik={{ name: "token" }}
                />
                <AppText style={{ margin: 15 }}>Enter New Password: </AppText>
                <GrowInput
                  keyboardType="visible-password"
                  formik={{ name: "newPass" }}
                />
                <AppText style={{ margin: 15 }}>Confirm New Password: </AppText>
                <GrowInput
                  keyboardType="visible-password"
                  formik={{ name: "confirmPass" }}
                />
              </>
            )}
            {passMsg.success && (
              <SubmitButton
                extraData={{ type: "recover" }}
                title="Resend code"
                style={styles.btn}
                naked
              />
            )}
            <SubmitButton
              title={passMsg.success ? "RESET PASSWORD" : "FETCH TOKEN"}
              style={styles.btn}
              bare
            />
          </>
        )}
      </Formik>

      <ActivityIndicator
        type="spin"
        visible={passLoading}
        wTransparent
        style={styles.activityPass}
      />
    </View>
  );
};

const Oauth = ({ name, onPress, icon, color = colors.google }) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.auth,
        {
          backgroundColor: theme.white,
        },
      ]}
    >
      <Fontisto name={icon} size={25} color={color} />
      <AppText size="xsmall" style={styles.authText}>
        Continue with {name}
      </AppText>
    </TouchableOpacity>
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
  p3,
  a,
  b,
  navTo,
}) => {
  const navigation = useNavigation();

  const [showPass, setShowPass] = useState(true);
  const [gender, setGender] = useState("male");
  const [passModal, setPassModal] = useState(false);

  const maleTranslator = useRef(new Animated.Value(1.4)).current;
  const femaleTranslator = useRef(new Animated.Value(1)).current;

  const theme = useContext(ThemeContext);

  let initialValues, schema;
  const handleGender = (type) => {
    if (type === "male") {
      Animated.parallel([
        Animated.spring(maleTranslator, {
          toValue: 1.4,
          useNativeDriver: true,
          bounciness: 25,
        }),
        Animated.spring(femaleTranslator, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(maleTranslator, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(femaleTranslator, {
          toValue: 1.4,
          useNativeDriver: true,
          bounciness: 25,
        }),
      ]).start();
    }
    setGender(type);
  };

  const handleFormSubmit = (formValues) => {
    if (register) {
      formValues.gender = gender;
    }
    Keyboard.dismiss();
    setElevation(false);
    onPress(formValues);
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      console.log("HAS PLAY SERVICES");
      await GoogleSignin.addScopes({
        scopes: ["https://www.googleapis.com/auth/user.gender.read"],
      });
      const userInfo = await GoogleSignin.signIn();
      console.log("USERINFO:: ", userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        console.log(error);
        // some other error happened
      }
    }
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
            <Animated.View
              style={[
                styles.avatarView,
                { transform: [{ scale: maleTranslator }] },
              ]}
            >
              <Image
                source={maleAvatar}
                resizeMethod="scale"
                resizeMode="contain"
                style={{
                  ...styles.avatars,
                  backgroundColor:
                    gender === "male" ? colors.accent : theme.extralight,
                }}
              />
            </Animated.View>
            <AppText
              bold
              style={{
                textAlign: "center",
                marginTop: gender === "male" ? 20 : 6,
                color: gender === "male" ? colors.accent : colors.light,
              }}
            >
              Male
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handleGender("female")}
          >
            <Animated.View
              style={[
                styles.avatarView,
                { transform: [{ scale: femaleTranslator }] },
              ]}
            >
              <Image
                source={femaleAvatar}
                resizeMethod="scale"
                resizeMode="contain"
                style={{
                  ...styles.avatars,
                  backgroundColor:
                    gender === "female" ? colors.facebook : theme.extralight,
                }}
              />
            </Animated.View>
            <AppText
              bold
              style={{
                textAlign: "center",
                marginTop: gender === "female" ? 20 : 6,
                color: gender === "female" ? colors.facebook : colors.light,
              }}
            >
              Female
            </AppText>
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
                      bareRed
                    />
                  )}
                </View>
              ) : null}
              <View style={{ marginTop: 20 }}>
                <SubmitButton
                  // loading={loading}
                  // setLoading={(bool) => setLoading(bool)}
                  title={btnTitle}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
      <AppText style={{ marginTop: 20 }}> Or sign {a} with</AppText>
      <View style={styles.icons}>
        <Oauth name="Google" icon="google-plus" onPress={googleSignIn} />
        <Oauth
          name="Facebook"
          icon="facebook"
          onPress={googleSignIn}
          color={colors.facebook}
        />
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
  auth: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    borderRadius: 12,
    backgroundColor: colors.white,
    elevation: 1.3,
    paddingHorizontal: 15,
    maxWidth: width * 0.46,
    shadowRadius: 6,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 1.8,
    },
  },
  authText: {
    marginLeft: 8,
  },
  avatarCont: {
    marginTop: 35,
    flexDirection: "row",
    alignItems: "center",
  },
  avatars: {
    backgroundColor: colors.primary,
    width: "100%",
    height: "100%",
    borderRadius: 200,
  },
  avatarView: {
    marginHorizontal: 20,
    width: 65,
    height: 65,
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
