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
import { Settings, Profile, LoginManager } from "react-native-fbsdk-next";

Settings.initializeSDK();

Settings.setAppID("406752991548934");

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
import PopMessage from "./PopMessage";

const {
  validationSchemaLogin,
  validationSchemaRegister,
  recoverPassValidation,
  resetPassValidation,
  forgotPassResetInitials,
  forgotPassRecoverInitials,
} = schemas;

GoogleSignin.configure({
  webClientId:
    "556387937205-u0dqikikimj4oivrplmvrupcv49klgci.apps.googleusercontent.com",
  androidClientId:
    "556387937205-egppvnvnskbmkt36bau7sukvho1j2tpn.apps.googleusercontent.com",
  offlineAccess: false,
  scopes: ["https://www.googleapis.com/auth/user.gender.read"],
});

const ForgotPassword = ({ setPassModal }) => {
  const { resetPassword, recoverPassword } = useContext(AuthContext);

  const [passLoading, setPasLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ error: null, success: null });

  const handleForgotPass = (formValues, extraData) => {
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

const SelectGender = ({ gender, setGender, useFormiks, noFormik = false }) => {
  const maleTranslator = useRef(new Animated.Value(1)).current;
  const femaleTranslator = useRef(new Animated.Value(1)).current;

  const theme = useContext(ThemeContext);

  const { setFieldValue, touched, errors } = useFormiks ?? {};

  const handleGender = (type) => {
    // console.log(type, useFormiks);
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
    setFieldValue && setFieldValue("gender", type);
  };

  return (
    <View>
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
      {!noFormik && errors["gender"] && touched["gender"] && (
        <AppText style={styles.error}>{errors["gender"]}</AppText>
      )}
    </View>
  );
};

const RenderAuthModal = ({ data, handleAuthSignIn }) => {
  const [gender, setGender] = useState(null);
  const [username, setUsername] = useState(data?.username ?? "");
  const [email, setEmail] = useState(data?.email ?? "");
  const [errMsg, setErrMsg] = useState(null);
  const [bools, setBools] = useState({ loading: false });

  const theme = useContext(ThemeContext);

  // console.log(data);

  const handleSubmit = () => {
    setErrMsg(null);
    if (gender === null) {
      return setErrMsg("Please select gender");
    } else if (!Boolean(email)) {
      return setErrMsg("Please enter your email");
    } else if (!Boolean(username)) {
      return setErrMsg("Please enter your username");
    }
    const sendObj = {
      ...data,
      email,
      gender,
    };
    handleAuthSignIn(sendObj, (bool) => setBools({ ...bools, loading: bool }));
  };

  return (
    <View style={[styles.authModal, { backgroundColor: theme.background }]}>
      <AppText bold size="large" style={styles.modalText}>
        Complete Profile
      </AppText>
      <View style={styles.form}>
        <SelectGender gender={gender} noFormik setGender={setGender} />
        <AppText bold size="large" style={styles.authFormTitle}>
          Username:
        </AppText>
        <GrowInput
          text={username}
          setText={setUsername}
          placeholder={Boolean(username) ? username : "Enter your username"}
        />
        {!data?.email && (
          <>
            <AppText bold size="large" style={styles.authFormTitle}>
              Email:
            </AppText>
            <GrowInput
              text={email}
              setText={setEmail}
              placeholder={Boolean(email) ? email : "Enter your email"}
            />
          </>
        )}
        {errMsg && <AppText style={styles.error}> {errMsg} </AppText>}
        <AppButton
          style={{ marginTop: 20, marginBottom: 10 }}
          title="Submit"
          onPress={handleSubmit}
          bare
        />
      </View>
      <ActivityIndicator visible={bools.loading} absolute wTransparent />
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
  p3,
  a,
  b,
  navTo,
}) => {
  const navigation = useNavigation();

  const [showPass, setShowPass] = useState(true);
  const [gender, setGender] = useState("null");
  const [passModal, setPassModal] = useState(false);
  const [popper, setPopper] = useState({ vis: false });
  const [bools, setBools] = useState({ authModal: false });
  const [authData, setAuthData] = useState(null);

  const { authSignIn } = useContext(AuthContext);

  let initialValues, schema;

  const handleFormSubmit = (formValues) => {
    if (register) {
      formValues.gender = gender;
    }
    Keyboard.dismiss();
    setElevation(false);
    onPress(formValues);
  };

  const handleAuthSignIn = (user, cb) => {
    // cb && cb(true);
    const sendData = {
      userID: user.id ?? user.userID,
      firstName: user.givenName ?? user.firstName ?? user.name,
      lastName: user.familyName ?? user.lastName ?? user.second_name,
      avatar: user.photo ?? user.imageURL ?? user.avatar,
      email: user.email,
      gender: user.gender,
    };
    //
    authSignIn(
      sendData,
      (_data) => {
        cb && cb(false);
      },
      (errData) => {
        if (
          errData?.data?.msg?.includes("gender") ||
          errData?.data?.msg?.includes("email")
        ) {
          setBools({ ...bools, authModal: true });
          setAuthData(errData?.data?.data);
        }
        cb && cb(false);
      }
    );
  };

  const googleSignIn = async () => {
    try {
      const hasPlay = await GoogleSignin.hasPlayServices();
      if (hasPlay) {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          const userInfo = await GoogleSignin.getCurrentUser();
          // console.log("Signed User", userInfo.user);
          handleAuthSignIn(userInfo.user);
          // await GoogleSignin.revokeAccess();
        } else {
          const userInfo = await GoogleSignin.signIn();
          handleAuthSignIn(userInfo.user);
        }
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        setPopper({ vis: true, msg: "Sign in cancelled", type: "failed" });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setPopper({
          vis: true,
          msg: "Sign in still in progress",
          type: "failed",
        });
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        setPopper({
          vis: true,
          msg: "Play services not available",
          type: "failed",
        });
      } else {
        // some other error happened
        setPopper({ vis: true, msg: `${error}`, type: "failed" });
      }
    }
  };

  const getFBCurrentUser = () => {
    Profile.getCurrentProfile().then(function (currentProfile) {
      if (currentProfile) {
        handleAuthSignIn(currentProfile);
      }
    });
  };

  const fbSignIn = () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function (result) {
        if (result.isCancelled) {
          setPopper({ vis: true, type: "failed", msg: "Login cancelled" });
        } else {
          getFBCurrentUser();
        }
      },
      function (error) {
        setPopper({
          vis: true,
          type: "failed",
          msg: "Login fail with error: " + error,
        });
      }
    );
  };

  login
    ? ((initialValues = { username: "", password: "" }),
      (schema = validationSchemaLogin))
    : register
    ? ((initialValues = {
        username: "",
        email: "",
        password: "",
        gender: "",
      }),
      (schema = validationSchemaRegister))
    : null;

  return (
    <Screen style={styles.container}>
      <View style={styles.info}>
        <AppLogo type="icon" />
        <AppText style={styles.title}>
          Connect and have fun with your fellow weebs
        </AppText>
      </View>
      <Spacer>
        <AppText bold style={styles.headerTitle}>
          {headerTitle}
        </AppText>
      </Spacer>
      {/* //FORM */}
      <View style={styles.form}>
        <Formik
          initialValues={initialValues}
          onSubmit={(formValues) => handleFormSubmit(formValues)}
          validationSchema={schema}
        >
          {({ setFieldValue, errors, touched }) => (
            <>
              {p1 && (
                <SelectGender
                  gender={gender}
                  setGender={setGender}
                  useFormiks={{ setFieldValue, errors, touched }}
                />
              )}
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
              <AppFadeIn
                visible={bools.authModal}
                setter={() => setBools({ authModal: false })}
                RenderComponent={() => (
                  <RenderAuthModal
                    data={authData}
                    handleAuthSignIn={handleAuthSignIn}
                  />
                )}
              />
            </>
          )}
        </Formik>
      </View>
      {/* FORM END */}
      <AppText bold style={{ marginTop: 25 }}>
        {" "}
        &bull;&bull;&bull; OR &bull;&bull;&bull;{" "}
      </AppText>
      <View style={styles.icons}>
        <Oauth name="Google" icon="google" onPress={googleSignIn} />
        <Oauth
          name="Facebook"
          icon="facebook"
          onPress={fbSignIn}
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

      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
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
  authModal: {
    width: width * 0.96,
    padding: 12,
    borderRadius: 15,
  },
  authText: {
    marginLeft: 8,
    width: 100,
  },
  authFormTitle: {
    marginTop: 25,
    marginBottom: 15,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  avatarCont: {
    marginTop: 35,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
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
  modalText: {
    textAlign: "center",
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
