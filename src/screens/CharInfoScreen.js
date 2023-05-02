import React, { useContext, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Context as AuthContext } from "../config/AuthContext";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import PopMessage from "../components/PopMessage";
import colors from "../constants/colors";
import getFormatTime from "../constants/getFormatTime";

const CharList = ({ name, icon, names, show, parentProps }) => {
  const { character, cardState } = parentProps;

  if (name && !names) {
    let prop = name.replace(/\s/g, "");
    return (
      <View style={styles.charLists}>
        <MaterialCommunityIcons name={icon} color={colors.primary} size={12} />
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
            <AppText style={styles.infoText}>
              {name === "birthday"
                ? getFormatTime(new Date(character[prop]), null, "month_day")
                    .date
                : character[prop]}
            </AppText>
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

const CharFlat = ({ name, icon, id, parentProps }) => {
  const { character } = parentProps;
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

const CharInfoScreen = ({
  isMine,
  challenged,
  character,
  handleWithdrawChallenge,
  handleCharacterTransfer,
  cardState,
  setChallengeModal,
}) => {
  const [popper, setPopper] = useState({ vis: false });

  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const initializeChallenge = () => {
    if (!userInfo.verified) {
      return setPopper({
        vis: true,
        type: "failed",
        msg: "Please verify your account",
      });
    }
    setChallengeModal({ vis: true, contest: { mode: "start" } });
  };

  return (
    <View style={styles.info}>
      <View style={styles.charInfo}>
        <CharList
          parentProps={{ cardState, character }}
          name="show"
          show
          icon="television"
        />
        <CharList
          parentProps={{ cardState, character }}
          name="role"
          icon="face-agent"
        />
        <CharList
          parentProps={{ cardState, character }}
          names="followers"
          icon="account-group"
        />
        <CharList
          parentProps={{ cardState, character }}
          names="favorites"
          icon="star"
        />
        <CharList
          parentProps={{ cardState, character }}
          name="type"
          icon="baby-face"
        />
        <CharList
          parentProps={{ cardState, character }}
          name="birthday"
          icon="gift"
        />
        <CharList
          parentProps={{ cardState, character }}
          name="gender"
          icon="gender-male-female"
        />
        <CharList
          parentProps={{ cardState, character }}
          name="height"
          icon="human-male-height"
        />
        <CharList
          parentProps={{ cardState, character }}
          name="rival"
          icon="target-account"
        />
        <CharList
          parentProps={{ cardState, character }}
          name="father"
          icon="human-male"
        />
        <CharList
          parentProps={{ cardState, character }}
          name="mother"
          icon="human-female"
        />
      </View>
      <CharFlat
        parentProps={{ character }}
        name="voice Actor"
        icon="headset"
        id="voiceActor"
      />
      <CharFlat
        parentProps={{ character }}
        name="brothers"
        icon="human-male-boy"
        id="a"
      />
      <CharFlat
        parentProps={{ character }}
        name="sisters"
        icon="human-female-girl"
        id="b"
      />
      <CharFlat
        parentProps={{ character }}
        name="groups"
        icon="account-multiple"
        id="c"
      />

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
            onPress={initializeChallenge}
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
      <PopMessage
        popData={popper}
        setter={() => setPopper({ vis: false })}
        timer={0.2}
      />
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
