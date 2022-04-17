import React from "react";
import { View, StyleSheet, Modal, Dimensions, Image } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

import AppText from "./AppText";
import colors from "../constants/colors";
const { width, height } = Dimensions.get("window");

const Overlay = ({ visible, data, setVisible }) => {
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.rightContent}>
            <View style={styles.imageCont}>
              <Image
                source={require("../../assets/testImages/img2.jpg")}
                style={styles.image}
              />
            </View>
            <Ionicons name="heart" color={colors.heart} size={40} />
            <Ionicons
              name="chatbubble-ellipses"
              color={colors.heart}
              size={40}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
    justifyContent: "flex-end",
  },
  content: {},
  imageCont: {
    width: 100,
    height: 100,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 200,
  },
  rightContent: {
    alignItems: "flex-end",
  },
});
export default Overlay;
