import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import colors from "../constants/colors";
import AppText from "./AppText";

const { width } = Dimensions.get("window");

const GroupCard = ({ item, showName, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.96}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.grpImage}>
        <Image
          source={{ uri: item?.cover_photo?.uri }}
          style={styles.image}
          resizeMethod="resize"
        />
        <View style={styles.textContainer}>
          <AppText style={styles.grpImageText} size="xlarge" bold>
            {item.name}
          </AppText>
          {showName && (
            <AppText style={styles.grpImageText} size="large">
              {item.show.name_j ?? item.show.name_e}
            </AppText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 9,
    marginBottom: 10,
    width: width * 0.68,
    height: width * 0.5,
  },
  grpImage: {
    flex: 1,
  },
  grpImageText: {
    color: colors.white,
    fontSize: 20,
    textTransform: "capitalize",
  },
  textContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: width * 0.0255,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    height: "100%",
    width: "100%",
    borderRadius: width * 0.025,
  },
});
export default GroupCard;
