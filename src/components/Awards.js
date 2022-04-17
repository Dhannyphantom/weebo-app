import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Card from "./Card";
import FeedHeader from "./FeedHeader";
import Separator from "./Separator";

const screen = Dimensions.get("window");

const Awards = ({ data }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <FeedHeader challenge={data.awardType} />
      <Card
        image={data.character.cover_photo}
        avatar={data.character.avatar}
        followers={data.character.followers}
        name={data.character.name}
        show={data.character.show}
        style={styles.cardContainer}
        bIcon={40}
        fScale={13}
        infoStyle={styles.cardInfo}
        subTitleStyle={styles.subTitleStyle}
        btmStyle={styles.btmStyle}
        onPress={() =>
          navigation.navigate("Character", { item: data.character })
        }
      />
      <Separator h={1} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  cardInfo: {
    bottom: 50,
  },
  subTitleStyle: {
    bottom: 15,
  },
  btmStyle: {
    marginBottom: 10,
    width: 280,
  },
  cardContainer: {
    width: 280,
    height: 320,
  },
});
export default Awards;
