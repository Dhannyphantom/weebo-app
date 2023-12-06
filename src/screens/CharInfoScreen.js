import React, { useContext, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import uuid from "react-native-uuid";

import { Context as AuthContext } from "../config/AuthContext";

const { width, height } = Dimensions.get("screen");

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import PopMessage from "../components/PopMessage";
import colors from "../constants/colors";
import getFormatTime from "../constants/getFormatTime";
import { canChallengeInstance } from "../constants/helpers";
import Separator from "../components/Separator";
import EventRender from "../components/EventRender";
import ThemeContext from "../config/ThemeContext";

const sortArr = [
  "other_names",
  "show",
  "role",
  "dpName",
  "followers",
  "favorites",
  "gender",
  "type",
  "birthday",
  "height",
  "father",
  "mother",
  "brothers",
  "sisters",
  "lover",
  "rival",
  "voiceActors",
];

const isStats = ["followers", "favorites"];
const shouldFormatDate = ["birthday"];
const renameProps = {
  dpName: "Card display name",
  voiceActor: "voice actors",
  show: "Character's show/manga",
  other_names: "Aliases",
};

export const InfoDisplay = ({ type = "list", data }) => {
  // type = 'text' | 'stat' | 'list'
  if (!data) return null;
  const theme = useContext(ThemeContext);

  if (type === "text") {
    const textVal = Array.isArray(data.value) ? data.value?.length : data.value;
    return (
      <View style={styles.display}>
        <View style={styles.displayIcon}>
          <Feather name="disc" size={22} color={colors.primary} />
        </View>
        <View style={styles.displayInfo}>
          <View
            style={[styles.displayHeader, { backgroundColor: theme.light }]}
          >
            <AppText style={styles.displayText} textStyle="black">
              {data.title}
            </AppText>
          </View>
          <View
            style={[styles.displayContent, { backgroundColor: theme.light }]}
          >
            <AppText style={styles.displayText}>{textVal}</AppText>
          </View>
        </View>
      </View>
    );
  } else if (type === "list") {
    if (!data.value[0]) return null;
    // return null;
    return (
      <View style={styles.displayList}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.displayIcon}>
            <Feather name="layers" size={22} color={colors.primary} />
          </View>
          <View
            style={[styles.displayHeaderList, { backgroundColor: theme.light }]}
          >
            <AppText style={styles.displayText} textStyle="black">
              {data.title}
            </AppText>
          </View>
        </View>
        {data.value.map((str) => {
          return (
            <View
              key={uuid.v4()}
              style={[
                styles.displayContentList,
                { backgroundColor: theme.light },
              ]}
            >
              <AppText style={styles.displayText}>{str}</AppText>
            </View>
          );
        })}
      </View>
    );
  }
};

const CharInfoScreen = ({
  isMine,
  challenged,
  character,
  handleWithdrawChallenge,
  handleCharacterTransfer,
  cardState,
  setChallengeModal,
  setPopper,
}) => {
  const {
    updateMe,
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

    // Check If instance can be challenged;
    const { isExpired, data } = canChallengeInstance(character.challenge_stat);

    if (!isExpired) {
      return setPopper(data);
    }

    setChallengeModal({ vis: true, contest: { mode: "start" } });
  };

  return (
    <View style={styles.info}>
      <View style={styles.charInfo}>
        {sortArr.map((key) => {
          if (character.hasOwnProperty(key)) {
            let val,
              headerTitle,
              value = character[key];

            if (shouldFormatDate.includes(key)) {
              val = getFormatTime(new Date(value), null, "month_day").date;
            } else if (key == "show") {
              val = value?.name_j ?? value?.name_e;
            } else if (
              Array.isArray(value) &&
              !value[0] &&
              !isStats.includes(key)
            ) {
              val = "None";
            } else {
              val = value;
            }

            if (renameProps.hasOwnProperty(key)) {
              headerTitle = renameProps[key];
            } else {
              headerTitle = key;
            }

            const type =
              Array.isArray(val) && !isStats.includes(key) ? "list" : "text";
            const data = {
              title: headerTitle,
              value: val,
            };

            // return console.log({ type, key, value });
            return <InfoDisplay key={uuid.v4()} type={type} data={data} />;
          }
        })}
      </View>

      {character?.event && (
        <>
          <Separator />
          <AppText style={{ marginLeft: 18 }} size="large" bold>
            EVENT
          </AppText>
          <Separator />
          <EventRender
            eventData={character.event}
            isFollowing={cardState.selected}
            userID={userInfo._id}
            renderType="single"
            updateMe={updateMe}
          />
        </>
      )}

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
  display: {
    marginBottom: 15,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  displayList: {
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  displayStat: {
    marginBottom: 15,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  displayHeader: {
    alignSelf: "flex-start",
    padding: 15,
    borderRadius: 8,
    margin: 0,
  },
  displayHeaderList: {
    alignSelf: "flex-start",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    margin: 0,
  },
  displayHeaderStat: {
    // alignSelf: "flex-start",
    padding: 15,
    paddingLeft: 15,
    paddingRight: 25,
    borderRadius: 8,
    margin: 0,
  },
  displayContentList: {
    width: width * 0.8,
    padding: 15,
    paddingVertical: 20,
    marginTop: -10,
    marginLeft: 15,
    borderRadius: 10,
  },
  displayContent: {
    width: width * 0.8,
    padding: 15,
    marginTop: -10,
    paddingVertical: 23,
    borderRadius: 10,
  },
  displayContentStat: {
    padding: 20,
    paddingHorizontal: 25,
    borderRadius: 100,
    marginLeft: -10,
  },
  displayText: {
    textTransform: "capitalize",
  },
  displayIcon: {
    margin: 5,
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

/* 

 {Object.entries(character).map(([key, value]) => {
          if (!hideProps.includes(key)) {
            let val, headerTitle;

            if (shouldFormatDate.includes(key)) {
              val = getFormatTime(new Date(value), null, "month_day").date;
            } else if (key == "show") {
              val = value?.name_j ?? value?.name_e;
            } else {
              val = value;
            }

            if (renameProps.hasOwnProperty(key)) {
              headerTitle = renameProps[key];
            } else {
              headerTitle = key;
            }

            const type =
              Array.isArray(value) && !isStats.includes(key) ? "list" : "text";
            const data = {
              title: headerTitle,
              value: val,
            };

            // return console.log({ type, key, value });
            return <InfoDisplay key={uuid.v4()} type={type} data={data} />;
          }
        })}
*/
