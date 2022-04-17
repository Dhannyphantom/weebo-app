import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

import colors from "../constants/colors";
import AppText from "./AppText";
import Avatar from "./Avatar";
import Cards from "./Cards";

const { width, height } = Dimensions.get("screen");

const Challengers = ({ item, isMine, clickable, onPress }) => {
  const checker = isMine && item.pending && clickable;
  return (
    <Cards style={styles.container}>
      <TouchableOpacity
        activeOpacity={checker ? 0.5 : 1}
        onPress={checker ? onPress : null}
      >
        <View style={styles.listCont}>
          <Avatar
            avatar={item.user.avatar}
            feederID={item?.user?._id}
            name={item.user.username}
            style={{ width: "40%" }}
          />
          <AppText size="small" style={styles.type} bold>
            {item.type}{" "}
          </AppText>
          {item.pending ? (
            <AppText style={styles.pending}>Pending</AppText>
          ) : (
            <AppText style={styles.ongoing}>Ongoing</AppText>
          )}
        </View>
      </TouchableOpacity>

      {/* <Separator h={1} /> */}
    </Cards>
  );
};
const styles = StyleSheet.create({
  container: {
    width: width * 0.94,
    borderRadius: width * 0.01,
    elevation: 3,
    padding: 12,
    marginBottom: 4,
    alignSelf: "center",
  },
  listCont: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  ongoing: {
    color: colors.primary,
    textAlign: "center",
    width: "20%",
  },
  pending: {
    color: colors.heart,
    textAlign: "center",
    width: "20%",
    fontSize: 9,
  },

  type: {
    color: colors.medium,
    textTransform: "uppercase",
    width: "20%",
    textAlign: "center",
    fontSize: 8,
  },
});
export default Challengers;
