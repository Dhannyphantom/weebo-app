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

const {
  characterValidationSchema,
  showValidationschema,
  groupValidationSchema,
} = schemas;
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
    role: "",
    type: "",
    gender: "",
    height: "",
    birthday: new Date("January 1, 2000"),
    voiceActor: [],
    father: "none",
    mother: "none",
    sisters: [],
    brothers: [],
    creator: userInfo._id,
    manager: userInfo._id,
    lover: "none",
    rival: "none",
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
    creators: "",
    manager: userInfo._id,
    releaseDate: "",
    endDate: "Currently airing",
    genres: [],
    subGenres: [],
    episodes: 0,
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
    setErrText(obj?.data ?? obj?.msg);
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

  const nav = (info) => {
    //TODO:: ONLY UPDATE SPECIFIC FIELDS
    // characterCreated(info.user);
    updateMe({ data: info.points, prop: "points" });
    navigation.replace("Character", {
      item: info.characterID,
      toScreen: "Home",
    });
  };

  const navShow = (info) => {
    updateMe({ data: info.points, prop: "points" });
    navigation.replace("Show", { show: info.show, toScreen: "Home" });
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      setIsLoading(false);
      Keyboard.dismiss();
    });
    navigation.addListener("blur", () => {
      Keyboard.dismiss();
    });
  }, [navigation]);

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
                          (data) => nav(data),
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
                      <CreateForm headerA="father" name="father" />
                      <CreateForm headerA="mother" name="mother" />
                      <CreateFormArray headerA="sister" name="sisters" type1 />
                      <CreateFormArray
                        headerA="brother"
                        name="brothers"
                        type1
                      />
                      <CreateForm headerA="lover" name="lover" />
                      <CreateForm headerA="rival" name="rival" />
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

                    createShow(formValues, navShow, (obj) =>
                      actionCallback(obj)
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
                        navigation.goBack();
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
