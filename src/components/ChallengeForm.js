import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ActivityIndicator from "./ActivityIndicator";
import AppButton from "./AppButton";
import AppText from "./AppText";
import Link from "./Link";
import PostVideo from "./PostVideo";
import Separator from "./Separator";
import colors from "../constants/colors";

const asp = { width: 1, height: 1 };
const screen = Dimensions.get("window");

const checkPropArr = [
  "groups",
  "brothers",
  "sisters",
  "other_names",
  "genres",
  "subGenres",
  "spinoffs",
];

const ChallengeForm = ({
  modalVis,
  setAsset,
  isStarting,
  asset,
  errMsg,
  badInfoData,
  handleContestTextChange,
  infoContest,
  handleInfoPress,
  character,
  challengeType,
  handleContest,
  handleStartChallenge,
  isMine,
  setModalVis,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  let answer;
  const renderBadInfos = ({ item }) => {
    const checkGrpArr = checkPropArr.includes(item.prop);
    const editable = ["role", "type", "genres", "subGenres"].includes(
      item.prop
    );
    for (key in character) {
      if (key === "show" && item.prop === "show") {
        answer = character[key][item.prop2] || character[key][item.prop3];
      } else if (checkGrpArr) {
        answer = character[item.prop].join(", ");
      } else if (!Array.isArray(key) && item.prop !== "show") {
        answer = character[item.prop];
      }
    }
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleInfoPress(item)}
          style={styles.infoCont}
        >
          <View style={styles.infoBox}>
            <View style={styles.infoTextCont}>
              <AppText bold>{item.name} - </AppText>
              <AppText numberOfLines={3} style={styles.infoText}>
                {answer}
              </AppText>
            </View>
            {!item.selected && (
              <MaterialCommunityIcons
                name="circle"
                size={12}
                color={colors.light}
              />
            )}
            {item.selected && (
              <MaterialCommunityIcons
                name="check-circle"
                size={12}
                color={colors.primary}
              />
            )}
          </View>
        </TouchableOpacity>
        {item.selected && (
          <View style={styles.infoTextInputCont}>
            <TextInput
              placeholder={`Add correct ${item.name.toLowerCase()}`}
              value={
                infoContest[item.name.toLowerCase()] ?? infoContest[item.prop]
              }
              editable={!editable}
              onChangeText={(val) => handleContestTextChange(val, item.prop)}
              style={styles.infoInput}
            />
            {editable && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleInfoPress(item, true)}
                style={{ flex: 1, alignItems: "center" }}
              >
                <MaterialCommunityIcons
                  name="plus-box"
                  color={colors.primary}
                  size={screen.width * 0.035}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </>
    );
  };

  return (
    <Modal
      visible={modalVis}
      animationType="slide"
      onRequestClose={() => setModalVis(false)}
      statusBarTranslucent
      transparent
    >
      <TouchableOpacity
        onPress={() => {
          setModalVis(false);
          setAsset(null);
        }}
        activeOpacity={1}
        style={styles.modalCont}
      >
        {asset && asset.type === "image" && (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              ...styles.modalDisplay,
              aspectRatio: asset.width / asset.height,
            }}
          >
            <View style={styles.modalLoad}>
              <ActivityIndicator visible={isStarting} wTransparent />
            </View>
            <Image source={{ uri: asset.uri }} style={styles.modalImage} />
          </TouchableOpacity>
        )}
        {asset && asset.type === "video" && (
          <TouchableOpacity
            onPress={() => console.log("Yes")}
            activeOpacity={1}
            style={styles.vidCont}
          >
            <PostVideo
              vidUri={asset.uri}
              style={styles.video}
              disableDoublePress
              disableLongPress
              viewable={false}
            />
            <ActivityIndicator
              style={styles.modalLoad}
              visible={isStarting}
              wTransparent
            />
          </TouchableOpacity>
        )}
        {asset && asset.type === "info" && (
          <>
            {!isStarting ? (
              <TouchableOpacity activeOpacity={1} style={styles.badInfo}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 12,
                  }}
                >
                  <View />
                  <AppText style={styles.infoTitleText} bold>
                    Select Info Property
                  </AppText>
                  <TouchableOpacity
                    style={{ marginRight: 12, alignSelf: "center" }}
                    activeOpacity={0.6}
                    onPress={() => setShowInfo(!showInfo)}
                  >
                    <MaterialCommunityIcons
                      name="information"
                      size={screen.width * 0.05}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                <Separator h={2} />
                {showInfo && (
                  <>
                    <AppText style={{ textAlign: "center", marginBottom: 8 }}>
                      Select a field you know is invalid or incomplete and add
                      your choice and pre-existing ones (if valid)
                    </AppText>
                    <Separator h={1} />
                  </>
                )}

                <FlatList
                  data={badInfoData}
                  keyExtractor={(item) => item.id}
                  renderItem={renderBadInfos}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.badInfo}>
                <ActivityIndicator visible={true} type="spin" />
              </View>
            )}
          </>
        )}
        {asset && asset.type == "info_start" && (
          <View style={styles.modalDisplay}>
            <ActivityIndicator visible={isStarting} type="spin" />
          </View>
        )}
        <TouchableOpacity activeOpacity={1} style={styles.modalView}>
          <AppText style={{ textAlign: "center", margin: 16 }} bold>
            {/* WORK BELOW */}
            {!isMine ? "CHALLENGE BY" : "ACCEPT CHALLENGE"}
          </AppText>
          <Separator h={1} m={0.1} />
          {errMsg && <AppText style={styles.error}>{errMsg}</AppText>}
          <>
            {!isMine && (
              <>
                <Link
                  name="Image Contest"
                  onPress={() => handleContest("image")}
                  style={styles.links}
                />
                <Link
                  name="Video Contest"
                  onPress={() => handleContest("video")}
                  style={styles.links}
                />
                <Link
                  name="Bad Info Contest"
                  onPress={() => handleContest("info")}
                  style={styles.links}
                />
                <AppButton
                  title="GO"
                  ///TODO::  validate this button
                  onPress={() => handleStartChallenge("challenge")}
                  style={styles.modalBtn}
                />
                <AppButton
                  title="CANCEL"
                  onPress={() => setModalVis(false)}
                  style={styles.modalBtn}
                  bare
                />
              </>
            )}
            {isMine && (
              <View>
                {challengeType === "image" && (
                  <Link
                    name="Image Contest"
                    onPress={() => handleContest("image")}
                    style={styles.links}
                  />
                )}
                {challengeType === "video" && (
                  <Link
                    name="Video Contest"
                    onPress={() => handleContest("video")}
                    style={styles.links}
                  />
                )}
                {challengeType === "info" && (
                  <Link
                    name="Bad Info Contest"
                    clickable={false}
                    style={styles.links}
                  />
                )}
                <AppButton
                  title="GO"
                  onPress={() => handleStartChallenge("accept")}
                  style={styles.modalBtn}
                />
                <AppButton
                  title="CANCEL"
                  onPress={() => setModalVis(false)}
                  style={styles.modalBtn}
                  bare
                />
              </View>
            )}
          </>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
const styles = StyleSheet.create({
  badInfo: {
    width: screen.width * 0.96,
    height: screen.height * 0.6,
    backgroundColor: colors.white,
    marginBottom: 30,
    borderRadius: 23,
    paddingBottom: 10,
    overflow: "hidden",
    alignSelf: "center",
  },
  container: {},

  infoTextCont: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: screen.width * 0.65,
  },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    marginBottom: 10,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    borderRadius: 12,
    paddingVertical: 13,
    backgroundColor: colors.extraLight,
  },

  infoTitleText: {
    textAlign: "center",
    textTransform: "uppercase",
  },
  infoText: {
    marginLeft: 5,
    textTransform: "capitalize",
  },
  infoTextInputCont: {
    backgroundColor: colors.extraLight,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginHorizontal: 20,
    paddingLeft: 10,
    height: screen.width * 0.08,
  },
  infoInput: {
    width: "90%",
    color: colors.black,
  },
  modalBtn: {
    marginTop: 6,
    width: screen.width * 0.55,
    alignSelf: "center",
  },

  modalLoad: {
    position: "absolute",
    zIndex: 150,
    height: "100%",
    borderRadius: 25,
    width: "100%",
  },
  modalDisplay: {
    backgroundColor: colors.white,
    marginBottom: 30,
    width: "90%",
    maxHeight: screen.height * 0.6,
    alignSelf: "center",
    borderRadius: 20,
  },

  links: {
    alignSelf: "center",
    width: screen.width * 0.5,
  },
  modalImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  modalCont: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalView: {
    backgroundColor: colors.white,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    paddingBottom: 20,
  },
  vidCont: {
    width: screen.width,
    height: screen.height * 0.7,
  },
  video: {
    maxHeight: screen.height * 0.65,
    zIndex: 19,
  },
});
export default ChallengeForm;
