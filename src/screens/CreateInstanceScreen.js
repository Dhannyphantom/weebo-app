import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, FlatList, Keyboard } from "react-native";

import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../constants/colors";
import CreateForm from "../components/CreateForm";
import CoverUpload from "../components/CoverUpload";
import CreateFormik from "../components/CreateFormik";
import SubmitButton from "../components/SubmitButton";
import CreateFormArray from "../components/CreateFormArray";
import { CommonActions } from "@react-navigation/native";

import { Context as CharContext } from "../config/CharContext";
import { Context as AuthContext } from "../config/AuthContext";

import {
  characterRoles,
  characterTypes,
  gender_droplist,
  showGenres,
  subGenres,
} from "../constants/data_store";
import schemas from "../constants/yupSchema";
import Separator from "../components/Separator";
import ActivityIndicator from "../components/ActivityIndicator";
import TabList from "../components/TabList";
import AlertModal from "../components/AlertModal";

const {
  characterValidationSchema,
  showValidationschema,
  groupValidationSchema,
} = schemas;

const beforeLeavePrompt = {
  visible: false,
  title: "Leave Screen",
  message:
    "Are sure you want to leave screen?\nAll screen changes are not saved!",
  btn: "LEAVE",
  type: "",
  // type: "leave_screen",
  data: {},
};
const { width, height } = Dimensions.get("window");

const CHARACTER_WP = 150;
const GROUP_WP = 100;
const SHOW_WP = 200;

const CreateInstanceScreen = ({ route, navigation }) => {
  const [name, setName] = useState(route.params.name.trim());
  const [isLoading, setIsLoading] = useState(false);
  const [errText, setErrText] = useState(null);

  const { createCharacter, createGroup, createShow } = useContext(CharContext);

  const {
    state: { userInfo },
    updateMe,
  } = useContext(AuthContext);

  const characterFormInitials = {
    name,
    dpName: "",
    other_names: [],
    show: "",
    role: "Protagonist / Main Character",
    type: "kamidere",
    gender: "male",
    height: "195cm",
    birthday: new Date("January 1, 2000"),
    voiceActor: [],
    creator: userInfo._id,
    manager: userInfo._id,
    affiliations: [],
    groups: [],
    cover_photo: {
      uri: "",
      width: 0,
      height: 0,
    },
  };

  const showFormInitials = {
    name_j: name,
    name_e: "none",
    other_names: [],
    spinoffs: [],
    creators: "Jin mori, Kory Baggs",
    manager: userInfo._id,
    releaseDate: "",
    endDate: "Currently airing",
    genres: ["Action"],
    subGenres: ["Psychology", "Sci-Fi"],
    episodes: 210,
    cover_photo: {
      uri: "",
      width: 0,
      height: 0,
    },
  };

  const groupInitials = {
    name,
    show: "",
    leader: "",
    cover_photo: {
      uri: "",
      width: 0,
      height: 0,
    },
  };

  const [cardState, setCardState] = useState({
    character: true,
    show: false,
    group: false,
  });
  const [changeD, setChangeD] = useState(false);
  const [screenData, setScreenData] = useState({ leave: false, data: {} });
  const [prompt, setPrompt] = useState(beforeLeavePrompt);

  const weebo_points = cardState.character
    ? CHARACTER_WP
    : cardState.group
    ? GROUP_WP
    : SHOW_WP;

  const handleCardState = (stateObj, value) => {
    setCardState(stateObj);
    setName(value);
  };

  const actionCallback = (obj) => {
    setErrText(`${obj?.data ?? obj?.msg}, Please try again`);
    setIsLoading(false);
  };

  const handleDefaultChange = () => {
    setChangeD(true);
  };

  const handleCardPress = (pressed) => {
    pressed === "character"
      ? setCardState({ character: true, show: false, group: false })
      : pressed === "show"
      ? setCardState({ character: false, show: true, group: false })
      : setCardState({ character: false, show: false, group: true });
  };

  const handleNavigation = (name, params) => {
    setScreenData({ leave: true, data: { name, params } });
    setPrompt({
      ...prompt,
      type: "auto_nav",
      // message: "Instance created successfully",
      // btn: "GOTO INSTANCE",
      // visible: false,
      data: { name, params },
    });
  };

  const handlePrompts = () => {
    switch (prompt.type) {
      case "leave_screen":
        navigation.dispatch(prompt.data);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      setIsLoading(false);
      Keyboard.dismiss();
    });
    navigation.addListener("blur", () => {
      Keyboard.dismiss();
    });
    const navSubs = navigation.addListener("beforeRemove", (e) => {
      if (!screenData.leave) {
        e.preventDefault();
        setPrompt({
          ...prompt,
          type: "leave_screen",
          visible: true,
          data: e.data.action,
        });
      } else {
        console.log("Navigate to other screen");
      }
    });

    return () => {
      navSubs;
    };
  }, [navigation, prompt, screenData]);

  useEffect(() => {
    if (prompt.type === "auto_nav" && screenData.leave) {
      navigation.dispatch((state) => {
        const routes = [
          ...state.routes.slice(0, -1),
          { name: prompt.data?.name, params: prompt?.data?.params },
        ];
        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    }
  }, [prompt]);

  return (
    <Screen>
      <View style={styles.container}>
        <AppText bold>
          {name} instance requires{" "}
          <AppText style={{ color: colors.primary }} bold>
            {weebo_points}WP
          </AppText>
        </AppText>
        <Separator h={1} />
        <TabList
          state={cardState}
          onPress={handleCardPress}
          items={[{ tab: "character" }, { tab: "group" }, { tab: "show" }]}
        />
        {cardState.character && (
          <FlatList
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            data={[name]}
            contentContainerStyle={{ paddingBottom: height * 0.11 }}
            overScrollMode="never"
            listKey="characters"
            keyExtractor={(item) => item}
            renderItem={() => {
              return (
                <>
                  <View>
                    <CreateFormik
                      initialValues={characterFormInitials}
                      onSubmit={(formValues) => {
                        setErrText(null);
                        setIsLoading(true);
                        createCharacter(
                          formValues,
                          (data) => handleNavigation("Character", data),
                          (obj) => actionCallback(obj)
                        );
                      }}
                      validationSchema={characterValidationSchema}
                    >
                      <CreateForm
                        headerA="full name (first name first)"
                        placeholder={name}
                      />
                      <CreateFormArray
                        headerA="show or manga series"
                        name="show"
                        list="shows"
                        handleChange={handleCardState}
                      />
                      <CreateFormArray
                        headerA="nick names"
                        name="other_names"
                        type1
                      />

                      <CreateFormArray
                        headerA="group or organizations"
                        name="groups"
                        list="groups"
                        handleChange={handleCardState}
                      />
                      <CreateForm
                        headerA="role"
                        dropdownA={characterRoles}
                        name="role"
                      />
                      <CreateForm
                        headerB="type"
                        dropdownA={characterTypes}
                        numColumns={2}
                        name="type"
                      />
                      <CreateForm
                        headerA="gender"
                        dropdownA={gender_droplist}
                        name="gender"
                      />
                      <CreateForm headerA="height" name="height" />
                      <CreateForm
                        headerA="birthday"
                        name="birthday"
                        dateTime2
                        dateTime
                      />
                      <CreateFormArray
                        headerA="anime voice actors"
                        name="voiceActor"
                        type1
                      />
                      <CreateFormArray
                        headerA="other relations / affiliations"
                        name="affiliations"
                        type1
                      />
                      {/* /// DISPLAY NAME */}
                      <CreateFormArray
                        headerA="card display name (use first name or common name)"
                        name="dpName"
                        typeTagUpdate
                      />
                      <CoverUpload name="cover_photo" />

                      {errText ? (
                        <AppText style={styles.errText}>{errText}</AppText>
                      ) : null}
                      <SubmitButton
                        title="Upload Character"
                        onPress={() =>
                          setPrompt({ ...prompt, type: "auto_nav" })
                        }
                        bared
                        style={styles.uploadBtn}
                      />
                    </CreateFormik>
                  </View>
                </>
              );
            }}
          />
        )}
        {cardState.show && (
          <FlatList
            data={[name]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingBottom: height * 0.11 }}
            overScrollMode="never"
            renderItem={() => (
              <View style={{ marginTop: 10 }}>
                <CreateFormik
                  initialValues={showFormInitials}
                  onSubmit={(formValues) => {
                    setIsLoading(true);
                    setErrText(null);

                    createShow(
                      formValues,
                      (params) => handleNavigation("Show", params),
                      (obj) => actionCallback(obj)
                    );
                  }}
                  validationSchema={showValidationschema}
                >
                  {!changeD && (
                    <CreateForm
                      headerC="name"
                      placeholder={name}
                      add=" ( Japanese ) "
                      name="name_j"
                      close={handleDefaultChange}
                    />
                  )}
                  <CreateForm
                    headerC="name"
                    add=" ( English ) "
                    placeholder={changeD ? name : null}
                    name="name_e"
                  />
                  <CreateFormArray headerC="aliases" name="other_names" type1 />
                  <CreateFormArray
                    headerC="movies titles, spinoffs or manga related titles"
                    name="spinoffs"
                    type1
                  />
                  <CreateForm
                    add=" (separate using a comma)"
                    headerC="creators/writers"
                    name="creators"
                  />
                  <CreateForm
                    headerC="release date"
                    name="releaseDate"
                    dateTime
                  />
                  <CreateForm headerC="end date" name="endDate" dateTime curr />
                  <CreateFormArray
                    headerC="genres"
                    name="genres"
                    type2
                    dropdown={showGenres}
                  />
                  <CreateFormArray
                    headerC="sub genres"
                    name="subGenres"
                    dropdown={subGenres}
                    type2
                  />
                  <CreateForm
                    headerC="current episodes"
                    name="episodes"
                    keyboardType="phone-pad"
                  />
                  <CoverUpload type="show" show name="cover_photo" />

                  {errText ? (
                    <AppText style={styles.errText}>{errText}</AppText>
                  ) : null}
                  <SubmitButton
                    title="Upload Show"
                    onPress={() => setPrompt({ ...prompt, type: "auto_nav" })}
                    bared
                    style={styles.uploadBtn}
                  />
                </CreateFormik>
              </View>
            )}
          />
        )}
        {cardState.group && (
          <FlatList
            data={[name]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingBottom: height * 0.11 }}
            overScrollMode="never"
            renderItem={({ item }) => (
              <View>
                <CreateFormik
                  initialValues={groupInitials}
                  validationSchema={groupValidationSchema}
                  onSubmit={(formValues) => {
                    setIsLoading(true);
                    setErrText(null);
                    createGroup(
                      formValues,
                      (resData) => {
                        updateMe({ data: resData.points, prop: "points" });

                        handleNavigation("Room", {
                          instance: "group",
                          instanceID: resData.group._id,
                        });
                      },
                      (obj) => actionCallback(obj)
                    );
                  }}
                >
                  <CreateForm headerE="name" placeholder={name} />
                  <CreateFormArray
                    headerE="show"
                    name="show"
                    list="shows"
                    handleChange={handleCardState}
                  />
                  <CreateForm
                    headerF="leader/founder's full name"
                    name="leader"
                  />
                  {/* <CreateForm headerE="theme song" name="song" /> */}
                  <CoverUpload type="group" show name="cover_photo" />

                  {errText ? (
                    <AppText style={styles.errText}>{errText}</AppText>
                  ) : null}

                  <SubmitButton
                    title="Upload Group"
                    onPress={() => setPrompt({ ...prompt, type: "auto_nav" })}
                    bared
                    style={styles.uploadBtn}
                  />
                </CreateFormik>
              </View>
            )}
          />
        )}
      </View>
      <View style={styles.activity}>
        {isLoading && (
          <ActivityIndicator visible={true} type="spin" wTransparent />
        )}
      </View>
      <AlertModal
        obj={prompt}
        setVisible={setPrompt}
        oneButton={prompt?.oneButton}
        onPress={handlePrompts}
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
    padding: width * 0.025,
    flex: 1,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: width * 0.11,
    width: width * 0.85,
    alignSelf: "center",
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
    elevation: 3,
    shadowRadius: 3,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 1.8,
    },
  },
  errText: {
    color: "red",
    marginVertical: 30,
    alignSelf: "center",
  },
  select: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "34%",
  },
  headerTitle: {
    fontSize: 10,
  },
  selector: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
    // backgroundColor: colors.extraLight,
    borderRadius: 100,
  },
  separator: {
    backgroundColor: colors.extraLight,
    width: 0.9,
    height: "100%",
  },
  uploadBtn: {
    width: "60%",
    alignSelf: "center",
    marginVertical: 10,
  },
});
export default CreateInstanceScreen;
