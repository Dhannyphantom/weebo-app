import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import AppText from "../components/AppText";
import BallIcon from "../components/BallIcon";
import Challengers from "../components/Challengers";
import Separator from "../components/Separator";

const CharChallengerScreen = ({
  isMine,
  challengerArr,
  // setChallengeType,
  // setModalVis,
  handleChangeTab,
  setChallengeModal,
  // setChallenger,
  name,
}) => {
  const challLength = challengerArr.length;

  const handleCalls = (item) => {
    console.log(item);
    setChallengeModal({ vis: true, contest: item });
    // handleChangeTab && handleChangeTab("challenger");

    // setChallengeType(item.type);
    // setModalVis(true);
    // setChallenger(item);
  };

  const renderChallengers = ({ item }) => {
    const thisIndex = challengerArr.findIndex((obj) => obj._id == item._id);
    // check top challenger to see if its ongoing;
    let clickable;
    if (thisIndex == 0) {
      clickable = true;
    } else {
      clickable = !challengerArr[thisIndex - 1].pending;
    }

    return (
      <Challengers
        item={item}
        clickable={clickable}
        isMine={isMine}
        onPress={() => handleCalls(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.ballIcons}>
        {challLength <= 0 ? (
          <AppText style={styles.noChallengerText}>
            {name[0].toUpperCase() + name.slice(1)} has not been challenged yet!
          </AppText>
        ) : (
          <AppText size="xlarge" bold>
            Challengers
          </AppText>
        )}
        <BallIcon
          textSize="large"
          text={`${challLength}`}
          activeOpacity={1}
          boldText
        />
      </View>
      <Separator h={1} m={0.1} />
      <FlatList
        data={challengerArr}
        keyExtractor={(item) => item._id}
        style={{ marginTop: 7 }}
        listKey={({ i }) => i.toString()}
        renderItem={renderChallengers}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ballIcons: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 13,
    marginTop: 11,
    marginBottom: 6,
  },
  noChallengerText: {
    width: "80%",
  },
});
export default CharChallengerScreen;
