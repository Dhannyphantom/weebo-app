import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  FlatList,
} from "react-native";
import { Formik } from "formik";

import { Context as AuthContext } from "../config/AuthContext";

import CreateForm from "../components/CreateForm";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";
import SubmitButton from "../components/SubmitButton";
import colors from "../constants/colors";
import ActivityIndicator from "../components/ActivityIndicator";
import AppHeader from "../components/AppHeader";
import ProfilePic from "../components/ProfilePic";
import AppFadeIn from "../components/AppFadeIn";
import Separator from "../components/Separator";
import PopMessage from "../components/PopMessage";

import yupSchema from "../constants/yupSchema";
import ThemeContext from "../config/ThemeContext";
const { editValidationSchema, passwordInitials, changePassValidation } =
  yupSchema;
import { emailers } from "../constants/data_store";
import Link from "../components/Link";
import { launchGallery } from "../constants/helpers";
import AlertModal from "../components/AlertModal";
import FormCountryPicker from "../components/FormCountryPicker";

const { width, height } = Dimensions.get("window");

const emailVerifiedPop = {
  type: "success",
  msg: "Email verification successful",
  vis: false,
};

const getLocatorAlert = (isOn) => ({
  visible: false,
  title: "Weebo Locator",
  btn: "OK",
  message: `${isOn ? "Disable" : "Enable"} your locator. Nearby weebs ${
    isOn ? "may not" : "will"
  } be able to find you`,
  type: "locator",
});

const RenderEmailPop = ({ vis, setPopper }) => {
  const theme = useContext(ThemeContext);
  const {
    recoverPassword,
    mailVerifier,
    state: { userInfo },
  } = useContext(AuthContext);

  const [emailVeriValues, setEmailVeriValues] = useState(emailers);
  const [isLoading, setIsLoading] = useState(false);
  const [mailText, setMailText] = useState({
    show: false,
    type: "ok",
    text: null,
  });

  const scalerOne = useRef(new Animated.Value(1)).current;
  const scalerTwo = useRef(new Animated.Value(0.5)).current;
  const scalerThree = useRef(new Animated.Value(0.5)).current;
  const scalerFour = useRef(new Animated.Value(0.5)).current;
  const scalerFive = useRef(new Animated.Value(0.5)).current;
  const scalerSix = useRef(new Animated.Value(0.5)).current;

  const textInputOne = useRef(null);
  const textInputTwo = useRef(null);
  const textInputThree = useRef(null);
  const textInputFour = useRef(null);
  const textInputFive = useRef(null);
  const textInputSix = useRef(null);

  const emailToken = emailVeriValues
    .map((obj) => obj.text)
    .join("")
    .trim();
  const isFocused = emailVeriValues.find((obj) => obj.focused);

  const handleVerification = (type) => {
    setIsLoading(true);
    setMailText({ ...mailText, show: false });
    if (type === "verify") {
      if (emailToken < 6)
        return setMailText({
          type: "bad",
          show: true,
          text: "Incomplete verification code",
        });

      const sendData = {
        token: emailToken,
      };

      mailVerifier(
        sendData,
        () => {
          setIsLoading(false);
          setPopper({ ...emailVerifiedPop, vis: true });
          setPageData({ ...pageData, verified: true });
          setEmailPop(false);
        },
        (err) => {
          setPopper({ vis: true, msg: err, type: "failed" });
          setIsLoading(false);
        }
      );
      //
    } else if (type === "request") {
      const sendData = {
        email: userInfo.email,
        type: "verification",
      };
      recoverPassword(
        sendData,
        (resData) => {
          setMailText({ text: resData.msg, show: true, type: "ok" });
          setIsLoading(false);
        },
        (err) => {
          const myMsg = err.includes("EREFUSED")
            ? "Bad internet connection"
            : err.includes("TIMEOUT")
            ? "Poor connection, please try again"
            : "Something went wrong!";
          setMailText({ text: myMsg, show: true, type: "bad" });
          setIsLoading(false);
        }
      );
    }
  };

  const onChangeInput = (val, idx, isEvent) => {
    let copier = [...emailVeriValues];
    const activeIndex = copier.findIndex((obj) => obj.id === idx);

    if (val !== "Backspace" && val.length > 0) {
      if (activeIndex > -1) {
        copier[activeIndex].focused = false;
        copier[activeIndex].isBackspace = false;
        copier[activeIndex].text = val;

        if (copier[activeIndex + 1]) {
          copier[activeIndex + 1].focused = true;
          copier[activeIndex + 1].isBackspace = false;
        }
      }
    } else {
      if (isEvent) {
        copier = copier.map((obj) => {
          return {
            ...obj,
            focused: false,
          };
        });
        // copier[activeIndex].focused = false;
        copier[activeIndex].text = "";

        if (copier[activeIndex - 1]) {
          copier[activeIndex - 1].focused = true;
          copier[activeIndex - 1].isBackspace = true;
        } else {
          copier[0].focused = true;
        }
      }
    }

    setEmailVeriValues(copier);
  };

  const handleAnimation = (refAnim, reverse = false) => {
    Animated.spring(refAnim, {
      toValue: reverse ? 0.5 : 1,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    switch (isFocused?.id) {
      case "1":
        textInputOne?.current?.focus();
        handleAnimation(
          isFocused.isBackspace ? scalerTwo : scalerOne,
          isFocused.isBackspace
        );
        break;
      case "2":
        textInputTwo?.current?.focus();
        handleAnimation(
          isFocused.isBackspace ? scalerThree : scalerTwo,
          isFocused.isBackspace
        );
        break;
      case "3":
        textInputThree?.current?.focus();
        handleAnimation(
          isFocused.isBackspace ? scalerFour : scalerThree,
          isFocused.isBackspace
        );
        break;
      case "4":
        textInputFour?.current?.focus();
        handleAnimation(
          isFocused.isBackspace ? scalerFive : scalerFour,
          isFocused.isBackspace
        );
        break;
      case "5":
        textInputFive?.current?.focus();
        handleAnimation(
          isFocused.isBackspace ? scalerSix : scalerFive,
          isFocused.isBackspace
        );
        break;
      case "6":
        textInputSix?.current?.focus();
        handleAnimation(scalerSix, isFocused.isBackspace);
        break;
    }
  }, [emailVeriValues]);

  useEffect(() => {
    textInputOne?.current?.focus();
  }, [vis]);
  return (
    <View style={[styles.emailPop, { backgroundColor: theme.background }]}>
      <AppText size="large" style={styles.emailPopTitle} bold>
        Email Verification
      </AppText>
      <Separator h={1} />
      {mailText.show && (
        <AppText
          style={{
            textAlign: "center",
            color: mailText.type == "ok" ? colors.primary : colors.heart,
          }}
        >
          {mailText.text}
        </AppText>
      )}
      <View style={{ flex: 1, justifyContent: "space-around" }}>
        <View style={styles.emailVeriBoxCont}>
          {emailVeriValues.map((str, idx) => {
            const emailItem = emailVeriValues[idx];

            let txtRef = textInputOne;
            let scaler = scalerOne;

            switch (idx) {
              case 0:
                txtRef = textInputOne;
                scaler = scalerOne;
                break;
              case 1:
                txtRef = textInputTwo;
                scaler = scalerTwo;
                break;
              case 2:
                txtRef = textInputThree;
                scaler = scalerThree;
                break;
              case 3:
                txtRef = textInputFour;
                scaler = scalerFour;

                break;
              case 4:
                txtRef = textInputFive;
                scaler = scalerFive;
                break;
              case 5:
                txtRef = textInputSix;
                scaler = scalerSix;
                break;
            }
            return (
              <Animated.View
                key={idx}
                style={{
                  ...styles.emailVeriBox,
                  backgroundColor: theme.extralight,
                  borderColor: theme.mediumLight,
                  borderWidth: emailItem.focused ? 3 : 0,
                  transform: [{ scale: scaler }],
                }}
              >
                <TextInput
                  value={emailItem.text}
                  keyboardType={"phone-pad"}
                  maxLength={1}
                  ref={txtRef}
                  allowFontScaling={false}
                  autoComplete="off"
                  autoCorrect={false}
                  caretHidden
                  clearTextOnFocus
                  // editable={emailItem.focused}
                  onKeyPress={({ nativeEvent: { key: keyValue } }) =>
                    onChangeInput(keyValue, emailItem.id, true)
                  }
                  autoFocus={idx === 0}
                  style={[styles.emailPopInput, { color: theme.color }]}
                  onChangeText={(val) =>
                    onChangeInput(val, emailItem.id, false)
                  }
                />
              </Animated.View>
            );
          })}
        </View>
        <View>
          {emailToken.length >= 6 && (
            <AppButton
              title="Verify"
              onPress={() => handleVerification("verify")}
              style={{ alignSelf: "center" }}
            />
          )}
          <AppButton
            title="Request token"
            bare
            onPress={() => handleVerification("request")}
            style={{
              alignSelf: "center",
              width: width * 0.65,
              marginTop: 12,
            }}
          />
        </View>
      </View>
      <ActivityIndicator
        visible={isLoading}
        style={styles.emailActivity}
        wTransparent
      />
    </View>
  );
};

const ChangePassword = ({ closeModal }) => {
  const { updateProfile } = useContext(AuthContext);
  const theme = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const handleFormSubmit = (formValues) => {
    setLoading(true);
    updateProfile(
      { ...formValues, type: "password" },
      () => closeModal(),
      (err) => {
        setErrMsg(err?.data ?? err?.msg);
        setLoading(false);
      }
    );
  };

  return (
    <View
      style={[styles.changePassCont, { backgroundColor: theme.background }]}
    >
      <AppText style={styles.changeTitle} size="large" bold>
        CHANGE PASSWORD
      </AppText>
      <Separator h={2} m={1} />
      {errMsg && <AppText style={styles.errText}> {errMsg} </AppText>}
      <Formik
        initialValues={passwordInitials}
        onSubmit={(formValues) => handleFormSubmit(formValues)}
        validationSchema={changePassValidation}
      >
        {() => (
          <View style={{ padding: 10 }}>
            <CreateForm
              header="Old password"
              place="Enter current password"
              name="oldPass"
              pass
            />
            <CreateForm
              header="New password"
              place="Enter new password"
              name="newPass"
              pass
            />
            <CreateForm
              header="Confirm new password"
              place="Confirn new password"
              name="confirmPass"
              pass
            />
            <SubmitButton
              bared
              title="Change Password"
              style={styles.submitBtn}
            />
          </View>
        )}
      </Formik>
      <ActivityIndicator visible={loading} style={styles.activity} />
    </View>
  );
};

const EditProfileScreen = ({ navigation, route }) => {
  const {
    updateProfile,
    updateAvatar,
    updateUserData,
    state: { userInfo },
  } = useContext(AuthContext);
  const params = route.params;
  const [toggle, setToggle] = useState(false);
  const [pageData, setPageData] = useState(userInfo);
  const [emailPop, setEmailPop] = useState(false);
  const [popper, setPopper] = useState(emailVerifiedPop);
  const [errMsg, setErrMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [alert, setAlert] = useState(
    getLocatorAlert(pageData?.location?.active)
  );

  const formInitials = {
    username: pageData.username,
    name: pageData.name ? pageData.name : "",
    second_name: pageData.second_name ? pageData.second_name : "",
    email: pageData.email,
    gender: pageData.gender,
    country: pageData.country ? pageData.country : "",
    city: pageData.city ? pageData.city : "",
    contact: "",
    contactCode: "+234",
    oldPass: "",
    newPass: "",
    confirmPass: "",
  };

  const locatorStatus = pageData?.location?.active ? "off" : "on";

  const selectProfileImage = async () => {
    const { results } = await launchGallery("image", true, false, [4, 4]);
    if (results) {
      setImageLoading(true);

      updateAvatar(
        results[0],
        () => {
          setPageData({ ...pageData, avatar: results[0].uri });
          setImageLoading(false);
        },
        (err) => {
          setImageLoading(false);
        },
        null
      );
    }
  };

  const onPassChanged = () => {
    setToggle(false);
    setPopper({
      vis: true,
      msg: "Password changed successfully",
      type: "success",
    });
  };

  const handleFormSubmit = (formValues) => {
    console.log(formValues);
    return;
    setIsLoading(true);
    updateProfile(
      formValues,
      () => navigation.pop(),
      (err) => {
        setErrMsg(err?.data ?? err?.msg);
        setIsLoading(false);
      }
    );
  };

  const handleLocationSwitch = () => {
    setIsLoading(true);

    const sendData = {
      action: "location",
      actionData: !pageData?.location?.active,
      instanceID: pageData._id,
    };

    updateUserData(
      sendData,
      (resData) => {
        setIsLoading(false);
        setPopper({
          vis: true,
          type: "success",
          msg: "Weebo locator updated!",
        });
        setPageData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            active: resData.data,
          },
        }));
      },
      (errData) => {
        setErrMsg(errData.data ?? errData.msg);
        setIsLoading(false);
      }
    );
  };

  const handleScreenAlert = () => {
    if (alert.type === "locator") {
      handleLocationSwitch();
    }
  };

  return (
    <Screen style={styles.container}>
      <AppHeader title="Edit Profile" />
      <FlatList
        data={["PROFILE SCREEN"]}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        contentContainerStyle={{ paddingBottom: height * 0.14 }}
        keyExtractor={(item) => item}
        renderItem={() => (
          <>
            <TouchableOpacity
              onPress={selectProfileImage}
              activeOpacity={0.9}
              style={styles.profilePic}
            >
              <ProfilePic
                source={pageData.avatar}
                size={width * 0.4}
                loading={imageLoading}
                border={2}
                disabled
              />
            </TouchableOpacity>

            <Formik
              initialValues={formInitials}
              onSubmit={(formValues) => handleFormSubmit(formValues)}
              validationSchema={editValidationSchema}
            >
              {() => (
                <View style={styles.form}>
                  <CreateForm
                    headerZ="username"
                    placeholder={pageData.username}
                  />
                  <CreateForm headerZ="email" placeholder={pageData.email} />
                  <CreateForm headerZ="gender" placeholder={pageData.gender} />

                  <CreateForm
                    headerZ="first name"
                    name="name"
                    mutable={
                      formInitials.name.length > 1 ? formInitials.name : "name"
                    }
                  />
                  <CreateForm
                    headerZ="last name"
                    name="second_name"
                    mutable={
                      formInitials.second_name.length > 1
                        ? formInitials.second_name
                        : "last name"
                    }
                  />
                  {/* <CreateForm
                headerZ="country"
                name="country"
                mutable={
                  formInitials.country.length > 1
                    ? formInitials.country
                    : "country"
                }
              /> */}
                  <FormCountryPicker />
                  <CreateForm
                    headerZ="city/town"
                    name="city"
                    mutable={
                      formInitials.city.length > 1 ? formInitials.city : "city"
                    }
                  />
                  {errMsg && (
                    <AppText style={styles.errText}> {errMsg} </AppText>
                  )}
                  <SubmitButton
                    bared
                    disabled={isLoading}
                    title="Update Profile"
                    style={styles.submitBtn}
                  />
                  <AppText bold size="large" style={styles.action}>
                    Profile Actions
                  </AppText>
                  <View style={styles.btnContainer}>
                    {!pageData.verified && params.isProfileCompleted && (
                      <Link
                        name="Verify Email"
                        onPress={() => setEmailPop(true)}
                        style={styles.btn}
                      />
                    )}
                    <Link
                      name="Change Password"
                      onPress={() => setToggle(!toggle)}
                      style={styles.btn}
                    />
                    <Link
                      name={`Turn ${locatorStatus} my weebo locator`}
                      onPress={() =>
                        setAlert({
                          ...getLocatorAlert(pageData?.location?.active),
                          visible: true,
                        })
                      }
                      style={styles.btn}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </>
        )}
      />

      <View style={styles.activity}>
        <ActivityIndicator type="spin" visible={isLoading} wTransparent />
      </View>
      <AppFadeIn
        visible={emailPop}
        setVisible={setEmailPop}
        RenderComponent={() => (
          <RenderEmailPop setPopper={setPopper} vis={emailPop} />
        )}
      />
      <AppFadeIn
        visible={toggle}
        setVisible={setToggle}
        RenderComponent={() => <ChangePassword closeModal={onPassChanged} />}
      />
      <PopMessage
        popData={popper}
        setter={() => setPopper({ ...popper, vis: false })}
        timer={0.5}
      />
      <AlertModal
        obj={alert}
        setVisible={setAlert}
        onPress={handleScreenAlert}
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  action: {
    marginTop: 10,
  },
  btnContainer: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    marginRight: 20,
    marginTop: 20,
  },
  btn: {},
  container: {
    flex: 1,
  },
  changePassCont: {
    width: width * 0.95,
    borderRadius: 15,
    overflow: "hidden",
    padding: 10,
  },
  changeTitle: {
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 15,
  },
  errText: {
    color: colors.heart,
    alignSelf: "center",
  },
  emailActivity: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: width * 0.03,
  },
  emailPop: {
    width: width * 0.85,
    height: height * 0.35,
    backgroundColor: colors.white,
    borderRadius: width * 0.03,
  },
  emailPopInput: {
    flex: 1,
    textAlign: "center",
    fontFamily: "sen-bold-b1",
    fontSize: width * 0.05,
  },
  emailPopTitle: {
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 10,
  },
  emailVeriBoxCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emailVeriBox: {
    width: (width * 0.85) / 7,
    height: (width * 0.85) / 7 + 10,
    borderRadius: 12,
    marginHorizontal: 3,
    backgroundColor: colors.extraLight,
  },
  form: {
    marginLeft: 20,
  },

  profilePic: {
    alignSelf: "center",
    margin: 15,
  },
  submitBtn: {
    alignSelf: "center",
    marginVertical: 15,
  },
});
export default EditProfileScreen;
