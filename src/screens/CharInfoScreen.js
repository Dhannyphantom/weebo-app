import React from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import colors from "../constants/colors";

const CharInfoScreen = ({
  isMine,
  challenged,
  character,
  handleWithdrawChallenge,
  handleCharacterTransfer,
  cardState,
  setChallengeModal,
}) => {
  const CharList = ({ name, icon, names, show }) => {
    if (name && !names) {
      let prop = name.replace(/\s/g, "");
      return (
        <View style={styles.charLists}>
          <MaterialCommunityIcons
            name={icon}
            color={colors.primary}
            size={12}
          />
          <AppText style={{ marginVertical: 3, marginLeft: 6 }}>
            <AppText style={{ textTransform: "uppercase" }} bold>
              {name} :{" "}
            </AppText>
            {show && (
              <AppText style={styles.infoText}>
                {character[prop].name_j || character[prop].name_e}
              </AppText>
            )}
            {!show && (
              <AppText style={styles.infoText}> {character[prop]} </AppText>
            )}
          </AppText>
        </View>
      );
    }
    return (
      <View style={styles.charLists}>
        <MaterialCommunityIcons name={icon} color={colors.primary} size={12} />
        <AppText style={{ marginVertical: 3, marginLeft: 6 }}>
          <AppText style={{ textTransform: "uppercase" }} bold>
            {" "}
            {names} :{" "}
          </AppText>
          <AppText style={styles.infoText}>
            {" "}
            {names == "followers" ? cardState.liked : cardState.favNum}
          </AppText>
        </AppText>
      </View>
    );
  };

  const CharFlat = ({ name, icon, id }) => {
    let prop = name.replace(/\s/g, "");
    if (character[prop].length <= 0) return null;
    return (
      <FlatList
        data={character[prop]}
        keyExtractor={(item) => item}
        ListHeaderComponent={
          <View style={styles.charLists}>
            <MaterialCommunityIcons
              name={icon}
              color={colors.primary}
              size={12}
            />
            <AppText style={{ textTransform: "uppercase", marginLeft: 6 }} bold>
              {" "}
              {name} :{" "}
            </AppText>
          </View>
        }
        renderItem={({ item }) => (
          <>
            <AppText style={{ textTransform: "capitalize", marginLeft: 30 }}>
              {item}
            </AppText>
          </>
        )}
        listKey={id}
      />
    );
  };

  return (
    <View style={styles.info}>
      <View style={styles.charInfo}>
        <CharList name="show" show icon="television" />
        <CharList name="role" icon="face-agent" />
        <CharList names="followers" icon="account-group" />
        <CharList names="favorites" icon="star" />
        <CharList name="type" icon="baby-face" />
        <CharList name="birthday" icon="gift" />
        <CharList name="gender" icon="gender-male-female" />
        <CharList name="height" icon="human-male-height" />
        <CharList name="rival" icon="target-account" />
        <CharList name="father" icon="human-male" />
        <CharList name="mother" icon="human-female" />
      </View>
      <CharFlat name="voice Actor" icon="headset" id="voiceActor" />
      <CharFlat name="brothers" icon="human-male-boy" id="a" />
      <CharFlat name="sisters" icon="human-female-girl" id="b" />
      <CharFlat name="groups" icon="account-multiple" id="c" />

      <View style={styles.btnCont}>
        {isMine && !challenged && character?.verified ? (
          <AppButton
            style={styles.btnAction}
            title="Transfer"
            onPress={handleCharacterTransfer}
          />
        ) : !isMine && !challenged && character?.verified ? (
          <AppButton
            title="Challenge"
            style={styles.btnAction}
            onPress={() =>
              setChallengeModal({ vis: true, contest: { mode: "start" } })
            }
          />
        ) : !isMine && challenged ? (
          <AppButton
            title="Withdraw challenge"
            bare
            style={styles.btnAction}
            onPress={handleWithdrawChallenge}
          />
        ) : null}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  ballHead: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  btnAction: {
    width: "65%",
    alignSelf: "center",
    marginTop: 15,
  },
  btnCont: {
    flex: 1,
  },
  ballIcons: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 6,
  },
  charInfo: {
    marginTop: 15,
  },
  charLists: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    padding: 12,
    bottom: 52,
  },
  infoText: {
    textTransform: "capitalize",
  },

  titleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleText: {
    marginLeft: 4,
  },
});
export default CharInfoScreen;
