import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../components/AppText";
import BallIcon from "../components/BallIcon";
import PostCollection from "../components/PostCollection";

const CharPostScreen = ({
  handleBallPress,
  handleChangeTab,
  character,
  isMine,
  charImages,
}) => {
  return (
    <View style={styles.container}>
      {isMine && (
        <View style={styles.ballIcons}>
          <BallIcon
            icon="plus"
            size={42}
            iconSize={15}
            onPress={() => handleBallPress("post")}
          />
        </View>
      )}
      <AppText style={styles.postStat} bold>
        {" "}
        {character.name} has {charImages.length} posts{" "}
      </AppText>
      <View style={styles.postCollection}>
        <PostCollection imgData={charImages} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
  ballHead: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ballIcons: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 6,
  },
  imgTest: {
    width: 300,
    height: 600,
  },
  postCollection: {
    marginTop: 15,
  },
  postStat: {
    textAlign: "center",
    marginTop: 15,
    textTransform: "capitalize",
  },
});
export default CharPostScreen;
