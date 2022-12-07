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
  showGenres,
  subGenres,
} from "../constants/data_store";
import schemas from "../constants/yupSchema";
import Separator from "../components/Separator";
import ActivityIndicator from "../components/ActivityIndicator";
import ThemeContext from "../config/ThemeContext";
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

const CreateCharacterScreen = ({ route, navigation }) => {
  const [name, setName] = useState(route.params.name.trim());
  const [isLoading, setIsLoading] = useState(false);
  const [errText, setErrText] = useState(null);

  const { createCharacter, createGroup, prepareState, createShow } =
    useContext(CharContext);

  const {
    state: { userInfo },
    characterCreated,
    updateMe,
  } = useContext(AuthContext);

  useEffect(() => {
    navigation.addListener("focus", () => {
      setIsLoading(false);
      prepareState();
      Keyboard.dismiss();
    });
    navigation.addListener("blur", () => {
      Keyboard.dismiss();
    });
  }, [navigation]);

  const characterFormInitials = {
    name,
    dpName: "",
    other_names: [],
    show: "",
    role: characterRoles[0].title,
    type: characterTypes[0].title,
    gender: "male",
    height: "123cm",
    birthday: "June 25",
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
    creator: "",
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
  const [role, setRole] = useState(characterRoles[0]);
  const [cType, setCtype] = useState(characterTypes[0]);
  const [changeD, setChangeD] = useState(false);
  // createName helps render the whole as a flatlist
  const [createName, setCreateName] = useState([{ id: "1", name }]);
  // const theme = useContext(ThemeContext);

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
      ? (setCardState({ character: true, show: false, group: false }),
        setCreateName([{ id: "2", name }]))
      : pressed === "show"
      ? (setCardState({ character: false, show: true, group: false }),
        setCreateName([{ id: "3", name }]))
      : (setCardState({ character: false, show: false, group: true }),
        setCreateName([{ id: "4", name }]));
  };

  const nav = (info) => {
    //TODO:: ONLY UPDATE SPECIFIC FIELDS
    updateMe({ prop: "points", data: info?.user?.points });
    characterCreated(info.user);
    navigation.navigate("Character", { item: info?.character?._id });
  };
  const navShow = (info) => {
    updateMe({ prop: "points", data: info?.user?.points });
    navigation.navigate("Show", { show: info.show });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <AppText bold>
          {name} instance requires
          <AppText style={{ color: colors.primary }}>{weebo_points}WP</AppText>
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
            data={createName}
            contentContainerStyle={{ paddingBottom: height * 0.11 }}
            overScrollMode="never"
            listKey="characters"
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <>
                  <View>
                    <CreateFormik
                      initialValues={characterFormInitials}
                      onSubmit={(formValues) => {
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
                        headerA="nick names"
                        name="other_names"
                        type1
                      />
                      <CreateFormArray
                        headerA="show or manga series"
                        name="show"
                        list="shows"
                        handleChange={handleCardState}
                      />
                      <CreateFormArray
                        headerA="group or organizations"
                        name="groups"
                        list="groups"
                        handleChange={handleCardState}
                      />
                      <CreateForm
                        headerA="role"
                        onSelectItem={(item) => setRole(item)}
                        selectedItem={role}
                        dropdownA={characterRoles}
                        name="role"
                      />
                      <CreateForm
                        headerB="type"
                        onSelectItem={(item) => setCtype(item)}
                        selectedItem={cType}
                        dropdownA={characterTypes}
                        numColumns={2}
                        name="type"
                      />
                      <CreateForm headerA="gender" name="gender" />
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
            data={createName}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: height * 0.11 }}
            overScrollMode="never"
            renderItem={({ item }) => (
              <View style={{ marginTop: 10 }}>
                <CreateFormik
                  initialValues={showFormInitials}
                  onSubmit={(formValues) => {
                    setIsLoading(true);
                    // console.log(formValues);
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
                  <CreateFormArray
                    headerC="other names"
                    name="other_names"
                    type1
                  />
                  <CreateFormArray
                    headerC="movies, spinoffs or manga related"
                    name="spinoffs"
                    type1
                  />
                  <CreateForm headerC="creator or author" name="creator" />
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
                  <CreateForm headerC="current episodes" name="episodes" />
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
            data={createName}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: height * 0.11 }}
            overScrollMode="never"
            renderItem={({ item }) => (
              <View>
                <CreateFormik
                  initialValues={groupInitials}
                  validationSchema={groupValidationSchema}
                  onSubmit={(formValues) => {
                    setIsLoading(true);
                    createGroup(
                      formValues,
                      (resData) => {
                        // updateMe({
                        //   prop: "points",
                        //   data: resData?.user?.points,
                        // });
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
                  <CreateForm headerF="leader" name="leader" />
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
export default CreateCharacterScreen;
