import React from "react";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

import colors from "../constants/colors";
import AppText from "./AppText";

const { width, height } = Dimensions.get("window");

const InfoChallenge = ({ data, size = "small", flatKey, color }) => {
  const navigation = useNavigation();

  const dataObj = {
    type: "info",
    post: [],
    infoData: data,
    color,
  };

  const handlePress = () => {
    if (size === "full") return;
    navigation.navigate("Display", { data: dataObj });
  };

  const contStyle = {
    backgroundColor: color === "a" ? colors.chat : colors.facebook,
    width: size === "small" ? width * 0.48 : width * 0.98,
    maxHeight: size === "small" ? height * 0.5 : height * 0.9,
    minHeight: size === "small" ? height * 0.35 : height * 0.8,
  };

  const renderInfoData = ({ item, index }) => {
    return (
      <View style={styles.textCont}>
        <AppText bold style={styles.title}>
          {item.prop}
        </AppText>
        {item.value && item.value != "null" && (
          <AppText
            style={{
              ...styles.value,
              fontSize: size === "small" ? 10 : 20,
            }}
          >
            {item.value}
          </AppText>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={size === "small" ? 0.94 : 1}
      onPress={handlePress}
      style={{
        ...styles.container,
        ...contStyle,
      }}
    >
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          style={size === "full" ? { flex: 1, width: "100%" } : null}
          listKey={flatKey}
          renderItem={renderInfoData}
        />
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: width * 0.022,
    // overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  listContainer: {
    flex: 1,
    padding: 10,
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  textCont: {
    marginBottom: 10,
  },
  title: {
    textTransform: "uppercase",
    color: colors.black,
    textAlign: "center",
  },
  flat: {
    backgroundColor: "orange",
  },
  value: {
    textTransform: "capitalize",
    textAlign: "center",
    color: colors.white,
    fontSize: 10,
  },
});
export default InfoChallenge;

/*



{data.map((obj, i) => {
          return (
            <View style={styles.textCont} key={i}>
              <AppText
                bold
                style={{
                  ...styles.title,
                  fontSize: size === "small" ? 10 : 22,
                }}
              >
                {obj.prop}
              </AppText>
              {obj.value && (
                <AppText
                  style={{
                    ...styles.value,
                    fontSize: size === "small" ? 10 : 20,
                  }}
                >
                  
                  {obj.value}
                </AppText>
              )}
              {obj.values && (
                <AppText style={styles.value}>{obj.values.join(", ")}</AppText>
              )}
            </View>
          );
        })}









*/
