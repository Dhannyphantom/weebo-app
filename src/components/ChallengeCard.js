import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Card from "./Card";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.48;

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
        borderRadius={15}
        infoStyle={styles.info}
        avaterSize={CARD_WIDTH / 5}
        btmPadding={40}
        bIcon={CARD_WIDTH / 6.5}
        {...otherProps}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <Card
          style={{ ...styles.card, width: series ? width * 0.5 : 140 }}
          btmStyle={{ ...styles.btmContainer, width: series ? 220 : 140 }}
          iconContainerStyle={styles.iconContainer}
          mIcon={series ? CARD_WIDTH / 5 : CARD_WIDTH / 5.5}
          subTitleStyle={styles.subTitle}
          bIcon={series ? CARD_WIDTH / 8 : CARD_WIDTH / 10}
          btmPadding={20}
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
    height: 163,
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
    height: height * 0.28,
  },
  btmStyle: {
    paddingTop: 30,
  },
});
export default ChallengeCard;
