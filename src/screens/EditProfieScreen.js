import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";

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
const { editValidationSchema } = yupSchema;

const { width, height } = Dimensions.get("window");

const emailers = [
  {
    id: "1",
    text: "",
    focused: true,
  },
  {
    id: "2",
    text: "",
    focused: false,
  },
  {
    id: "3",
    text: "",
    focused: false,
  },
  {
    id: "4",
    text: "",
    focused: false,
  },
  {
    id: "5",
    text: "",
    focused: false,
  },
  {
    id: "6",
    text: "",
    focused: false,
  },
];
const emailVerifiedPop = {
  type: "success",
  msg: "Email verification successful",
  vis: false,
};

const EditProfileScreen = ({ navigation, route }) => {
  const {
    updateProfile,
    recoverPassword,
    updateMe,
    mailVerifier,
    updateAvatar,
    state: { userInfo },
  } = useContext(AuthContext);
  const params = route.params;
  const theme = useContext(ThemeContext);
  // SOMETHING WRONG WITH THE ERROR MESSAGE
  const [toggle, setToggle] = useState(false);
  const [pageData, setPageData] = useState(userInfo);
  const [emailPop, setEmailPop] = useState(false);
  const [popper, setPopper] = useState(emailVerifiedPop);
  const [errMsg, setErrMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const formInitials = {
    username: pageData.username,
    name: pageData.name ? pageData.name : "",
    second_name: pageData.second_name ? pageData.second_name : "",
    email: pageData.email,
    gender: pageData.gender,
    country: pageData.country ? pageData.country : "",
    city: pageData.city ? pageData.city : "",
    oldPass: "",
    newPass: "",
    confirmPass: "",
  };

  const selectProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.6,
    });
    if (!result.cancelled) {
      setImageLoading(true);

      updateAvatar(
        result,
        () => {
          setPageData({ ...pageData, avatar: result.uri });
          setImageLoading(false);
        },
        (err) => {
          console.log("CLIENT", err);
          setImageLoading(false);
        },
        null
      );
    }
  };

  const handleFormSubmit = (formValues) => {
    setIsLoading(true);
    updateProfile(
      formValues,
      () => navigation.pop(),
      (err) => {
        setErrMsg(err);
        setIsLoading(false);
      }
    );
    setIsLoading(false);
  };

  const RenderEmailPop = ({ vis }) => {
    const [emailVeriValues, setEmailVeriValues] = useState(emailers);
    const [isLoading, setIsLoading] = useState(false);
    const [mailText, setMailText] = useState({
      show: false,
      type: "ok",
      text: null,
    });

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
              let nxtRef = textInputTwo;
              let prevRef = null;
              switch (idx) {
                case 0:
                  txtRef = textInputOne;
                  nxtRef = textInputTwo;
                  prevRef = null;
                  break;
                case 1:
                  txtRef = textInputTwo;
                  nxtRef = textInputThree;
                  prevRef = textInputOne;
                  break;
                case 2:
                  txtRef = textInputThree;
                  nxtRef = textInputFour;
                  prevRef = textInputTwo;
                  break;
                case 3:
                  txtRef = textInputFour;
                  nxtRef = textInputFive;
                  prevRef = textInputThree;
                  break;
                case 4:
                  txtRef = textInputFive;
                  nxtRef = textInputSix;
                  prevRef = textInputFour;
                  break;
                case 5:
                  txtRef = textInputSix;
                  prevRef = textInputFive;
                  nxtRef = null;
                  break;

                default:
                  txtRef = textInputOne;
                  nxtRef = textInputTwo;
                  break;
              }
              return (
                <View
                  key={idx}
                  style={{
                    ...styles.emailVeriBox,
                    backgroundColor: theme.extralight,
                    borderColor: theme.mediumLight,
                    borderWidth: emailItem.focused ? 3 : 0,
                  }}
                >
                  <TextInput
                    value={emailItem.text}
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={txtRef}
                    allowFontScaling={false}
                    autoComplete="off"
                    autoCorrect={false}
                    caretHidden
                    clearTextOnFocus
                    // editable={emailItem.focused}
                    onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                      const copier = [...emailVeriValues];
                      if (keyValue === "Backspace") {
                        if (copier[idx].text.length < 1) {
                          if (idx != 0) {
                            prevRef?.current?.clear();
                            prevRef?.current?.focus();
                            copier[idx - 1].focused = true;
                            copier[idx].focused = false;
                            copier[idx - 1].text = "";
                            setEmailVeriValues(copier);
                            txtRef.current.blur();
                          }
                        }
                      }
                    }}
                    autoFocus={idx === 0}
                    style={[styles.emailPopInput, { color: theme.color }]}
                    onChangeText={(val) => {
                      const copier = [...emailVeriValues];
                      copier[idx].text = val;
                      if (val.length > 0 && idx + 1 < emailVeriValues.length) {
                        copier[idx + 1].focused = true;
                        copier[idx].focused = false;
                        txtRef.current.blur();
                        nxtRef.current.focus();
                      }
                      setEmailVeriValues(copier);
                    }}
                  />
                </View>
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

  return (
    <Screen style={styles.container}>
      <AppHeader
        title="Edit Profile"
        RightComponent={() => (
          <AppButton
            naked
            title="Change Password"
            style={styles.changeBtn}
            onPress={() => setToggle(!toggle)}
          />
        )}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        contentContainerStyle={{ paddingBottom: height * 0.1 }}
      >
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
              <CreateForm headerZ="username" placeholder={pageData.username} />
              <CreateForm headerZ="email" placeholder={pageData.email} />
              <CreateForm headerZ="gender" placeholder={pageData.gender} />

              <CreateForm
                headerZ="last name"
                name="second_name"
                mutable={
                  formInitials.second_name.length > 1
                    ? formInitials.second_name
                    : "last name"
                }
              />
              <CreateForm
                headerZ="first name"
                name="name"
                mutable={
                  formInitials.name.length > 1 ? formInitials.name : "name"
                }
              />
              <CreateForm
                headerZ="country"
                name="country"
                mutable={
                  formInitials.country.length > 1
                    ? formInitials.country
                    : "country"
                }
              />
              <CreateForm
                headerZ="city/town"
                name="city"
                mutable={
                  formInitials.city.length > 1 ? formInitials.city : "city"
                }
              />

              {toggle && (
                <View style={styles.changePassCont}>
                  <AppText style={styles.changeTitle} bold>
                    Change Your Password
                  </AppText>
                  <CreateForm headerZ="Old password" name="oldPass" pass />
                  <CreateForm headerZ="New password" name="newPass" pass />
                  <CreateForm
                    headerZ="Confirm new password"
                    name="confirmPass"
                    pass
                  />
                </View>
              )}
              {!pageData.verified && params.isProfileCompleted && (
                <View>
                  <AppButton
                    title="Verify Email"
                    naked
                    style={styles.verifyEmail}
                    onPress={() => setEmailPop(true)}
                  />
                </View>
              )}
              {errMsg && <AppText style={styles.errText}> {errMsg} </AppText>}
              {!isLoading && (
                <SubmitButton title="Update Profile" style={styles.submitBtn} />
              )}
            </View>
          )}
        </Formik>
      </ScrollView>
      <View style={styles.activity}>
        {isLoading && (
          <ActivityIndicator type="spin" visible={isLoading} wTransparent />
        )}
      </View>
      <AppFadeIn
        visible={emailPop}
        setVisible={setEmailPop}
        RenderComponent={() => <RenderEmailPop vis={emailPop} />}
      />
      <PopMessage
        popData={popper}
        setter={() => setPopper({ ...popper, vis: false })}
        timer={0.5}
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width: width,
    height: height,
  },
  container: {
    flex: 1,
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
  changeBtn: {
    alignSelf: "flex-end",
    marginRight: 3,
  },
  changePassCont: {
    marginTop: 20,
  },
  changeTitle: {
    alignSelf: "center",
  },
  profilePic: {
    alignSelf: "center",
    margin: 15,
  },
  submitBtn: {
    alignSelf: "center",
    marginTop: width * 0.1,
  },
  verifyEmail: {
    marginTop: 12,
    alignSelf: "flex-end",
    marginRight: width * 0.05,
  },
});
export default EditProfileScreen;
