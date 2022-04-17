import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Card from "./Card";

const screen = Dimensions.get("window");
const CARD_WIDTH = screen.width * 0.47;

const ChallengeCard = ({ series, seriesChar, large, ...otherProps }) => {
  if (large) {
    return (
      <Card
        style={styles.cardCont}
        btmStyle={styles.btmStyle}
        subTitleStyle={styles.subTitleLarge}
        mSize="xlarge"
        mIcon={CARD_WIDTH / 3.5}
        cardWidth={CARD_WIDTH}
        infoStyle={styles.info}
        avaterSize={CARD_WIDTH / 5}
        bIcon={CARD_WIDTH / 6.5}
        {...otherProps}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <Card
          style={{ ...styles.card, width: series ? 220 : 140 }}
          btmStyle={{ ...styles.btmContainer, width: series ? 220 : 140 }}
          iconContainerStyle={styles.iconContainer}
          mIcon={series ? 150 / 2.8 : 140 / 2.8}
          subTitleStyle={styles.subTitle}
          bIcon={25}
          series={seriesChar}
          avaterSize={30}
          infoStyle={styles.infoContainer}
          {...otherProps}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  card: {
    //135
    //163
    marginTop: 10,
    height: 163,
    // borderTopEndRadius: 2,
    // borderTopStartRadius: 2,
  },
  btmContainer: {
    height: 60,
    marginBottom: 5,
  },
  infoContainer: {
    marginTop: 0.5,
  },
  info: {
    bottom: 50,
  },
  subTitle: {
    // marginTop: 6,
  },
  subTitleLarge: {
    // marginTop: 8,
  },
  cardCont: {
    width: CARD_WIDTH,
    height: screen.height * 0.28,
  },
  btmStyle: {
    width: CARD_WIDTH,
    height: CARD_WIDTH / 2.9,
  },
});
export default ChallengeCard;
