import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../constants/colors";
import AppText from "./AppText";
import Separator from "./Separator";
import ThemeContext from "../config/ThemeContext";

const screen = Dimensions.get("window");

const SelectItem = ({ item, pickItem, setPopper, check }) => {
  const theme = useContext(ThemeContext);
  const index = check.findIndex((obj) => obj.name === item.name);
  const handlePickItem = () => {
    if (!item.verified) {
      setPopper &&
        setPopper({
          vis: true,
          msg: "Instance not verified",
          type: "failed",
        });
      return;
    }
    pickItem(item);
  };
  const iconName = index > -1 ? "check-circle" : "checkbox-blank-circle";
  const iconColor = index > -1 ? colors.primary : colors.light;
  return (
    <>
      <View style={styles.div}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePickItem}
          style={[
            styles.container,
            {
              backgroundColor: theme.extralight,
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AppText style={styles.itemName} bold>
              {item.name}
              {" - "}
            </AppText>
            <AppText style={styles.itemInstance} bold>
              {item?.show?.name_j ?? " - " + item?.show?.name_e}
            </AppText>
          </View>
          <TouchableOpacity>
            {item.verified ? (
              <MaterialCommunityIcons
                name={iconName}
                color={iconColor}
                size={screen.width * 0.035}
              />
            ) : (
              <MaterialCommunityIcons
                name="cancel"
                color={colors.heartDark}
                size={screen.width * 0.035}
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
        <Separator
          style={{ width: screen.width * 0.9, alignSelf: "center" }}
          h={1}
          m={1}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: screen.width * 0.03,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: screen.width * 0.02,
    marginTop: 2,
  },
  div: {
    width: screen.width * 0.95,
    paddingHorizontal: 6,
  },
  itemName: {
    textTransform: "capitalize",
  },
  itemInstance: {
    textTransform: "capitalize",
    color: colors.primary,
  },
});
export default SelectItem;
