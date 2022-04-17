import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "./AppText";
import colors from "../constants/colors";
import Separator from "./Separator";

const AppDetail = ({ icon, title, item }) => {
  return (
    <>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color={colors.primary}
          />
          <AppText size="large" style={styles.infoTitle} bold>
            {title}
          </AppText>
        </View>
        <AppText style={styles.infoItem}>{item}</AppText>
      </View>
      <Separator h={1} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  infoTitle: {
    marginLeft: 4,
    textTransform: "capitalize",
  },
});
export default AppDetail;
