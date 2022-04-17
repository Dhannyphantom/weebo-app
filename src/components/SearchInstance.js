import React from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import AppText from "./AppText";
import colors from "../constants/colors";

const { width, height } = Dimensions.get("window");

const SearchInstance = ({ data, title, onPress, type }) => {
  //
  const renderTags = ({ item }) => {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(item)}>
        <View
          style={type === "rect" ? styles.rectImageStyle : styles.boxImageStyle}
        >
          <Image
            source={{ uri: item?.cover_photo?.uri }}
            style={styles.image}
          />
        </View>
        <LinearGradient
          colors={["transparent", "#111"]}
          style={
            type === "rect"
              ? { ...styles.rectImageStyle, position: "absolute" }
              : { ...styles.boxImageStyle, position: "absolute" }
          }
        >
          <View style={styles.textCont}>
            <AppText style={styles.name} bold>
              {item.name ?? item.name_j ?? item.name_e}
            </AppText>
            <AppText style={styles.subName}>
              {item.creator ?? item?.show?.name_j ?? item?.show?.name_e}
            </AppText>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {data[0] && (
        <AppText style={styles.title} bold>
          {title}
        </AppText>
      )}
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        listKey={title}
        renderItem={renderTags}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  boxImageStyle: {
    width: width * 0.6,
    height: width * 0.4,
    borderRadius: 12,

    margin: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  name: {
    color: colors.extraLight,
    fontSize: 14,
    textAlign: "center",
    textTransform: "capitalize",
  },
  subName: {
    color: colors.extraLight,
    fontSize: 12,
    textAlign: "center",
    marginTop: 3,
    textTransform: "capitalize",
  },

  rectImageStyle: {
    width: width * 0.4,
    height: width * 0.6,
    borderRadius: 12,
    margin: 10,
    overflow: "hidden",
  },
  textCont: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 15,
  },
  title: {
    fontSize: 17,
    color: colors.primary,
    marginLeft: 10,
  },
});
export default SearchInstance;
