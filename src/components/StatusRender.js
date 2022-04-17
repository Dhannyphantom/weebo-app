import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import AppText from "./AppText";
import Cards from "./Cards";
import characterTypes from "../constants/characterTypes";

import ProfilePic from "./ProfilePic";
import colors from "../constants/colors";
import DisplayStatus from "./DisplayStatus";

const { height, width } = Dimensions.get("window");
// const gradientColors = ["#18acbb", "#e8ffe6", "#4abb0b"];
// const gradientColors = ["#00ffff", "#17c8ff", "#329bff"];
const gradientColors = ["#4A10C7", "#17c8ff", "#00ffff"];

const StatusRender = ({ data, show, setter }) => {
  const [display, setDisplay] = useState({ vis: false, data: null });

  if (!show) return null;
  const CircularGradient = ({ children, diameter }) => {
    return (
      <LinearGradient
        style={styles.circular}
        start={[1, 0.5]}
        end={[0, 0]}
        colors={gradientColors}
      >
        <View style={styles.circularInner}>{children}</View>
      </LinearGradient>
    );
  };

  const StatusCardItem = ({ item, all }) => {
    let cardName;
    switch (item.instance) {
      case "character":
        cardName = "dpName";
        break;
      case "show":
        cardName = "name_j";
        break;
      default:
        cardName = "name";
        break;
    }
    return (
      <TouchableOpacity
        onPress={() => handleCardPress(item, all)}
        activeOpacity={0.9}
      >
        <Cards style={styles.cards}>
          <CircularGradient diameter={width * 0.16}>
            <Image
              source={{ uri: item[item.instance]?.cover_photo?.uri }}
              resizeMethod="resize"
              style={styles.image}
            />
          </CircularGradient>
          <View>
            <AppText style={styles.title} bold>
              {item[item.instance][cardName] ?? item[item.instance].name_e}
            </AppText>
            <AppText style={styles.subTitle}>{item.instance}</AppText>
          </View>
        </Cards>
      </TouchableOpacity>
    );
  };

  const RenderHeader = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setter()}
        style={styles.statusHeader}
      >
        <Cards style={styles.statusHeaderCard}>
          <AppText bold style={styles.statusText}>
            STORIES
          </AppText>
        </Cards>
      </TouchableOpacity>
    );
  };

  const RenderFooter = () => {
    return <View style={styles.spacer} />;
  };

  const renderStatuses = ({ item }) => {
    return <StatusCardItem item={item} all={data} />;
  };

  const handleCardPress = (item, all) => {
    setDisplay({ vis: true, data: { _id: item._id, all } });
    //item: item.posts,
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={RenderHeader}
        ListFooterComponent={RenderFooter}
        data={data}
        listKey="@statuses"
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <AppText style={styles.empty} bold>
              You don't have any recent stories
            </AppText>
          </View>
        }
        keyExtractor={(item) => item._id}
        renderItem={renderStatuses}
      />
      <DisplayStatus modalObj={display} setVisible={setDisplay} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    // alignItems: "center",
    minHeight: width * 0.15,
  },
  circularInner: {
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 900,
    width: width * 0.14,
    height: width * 0.14,
  },
  circular: {
    borderRadius: 900,
    width: width * 0.15,
    height: width * 0.15,
    backgroundColor: colors.white,
    alignSelf: "center",
    padding: 3,
  },
  cards: {
    width: width * 0.28,
    height: width * 0.42,
    borderRadius: width * 0.03,
    marginHorizontal: 2.5,
    marginBottom: 10,
    marginTop: 8,
    justifyContent: "space-around",
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    alignSelf: "center",
    color: colors.medium,
    marginLeft: 35,
  },
  image: {
    width: width * 0.122,
    height: width * 0.122,
    borderRadius: 900,
  },
  subTitle: {
    textAlign: "center",
    top: 3,
    color: colors.primary,
    textTransform: "capitalize",
  },
  statusHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statusHeaderCard: {
    width: 80,
    height: 80,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    marginRight: 7,
  },
  statusText: {
    color: colors.primary,
  },
  spacer: {
    padding: 10,
  },
  title: {
    textAlign: "center",
    textTransform: "capitalize",
  },
});
export default StatusRender;
