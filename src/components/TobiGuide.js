import React, { useContext, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";

import ThemeContext from "../config/ThemeContext";
import AppFadeIn from "./AppFadeIn";
import AppText from "./AppText";
import colors from "../constants/colors";

import chibi from "../../assets/arts/luffy_1.png";

const { width, height } = Dimensions.get("screen");
const MODAL_WIDTH = width * 0.9;

const stateObj = [
  {
    icon: "account-check",
    text: "Earn 2WP by clicking this icon to VERIFY this instance",
  },
  {
    icon: "trophy",
    text: "Challenge instances with cool images, video or correction",
  },
  {
    icon: "settings-helper",
    text: "Explore different settings now to engage more",
  },
];

const RowGuide = ({ icon, translator, text }) => {
  return (
    <Animated.View
      style={[styles.row, { transform: [{ translateX: translator }] }]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={width * 0.15}
        color={colors.primary}
      />
      <AppText style={styles.guideText}>{text}</AppText>
    </Animated.View>
  );
};

const RenderGuide = () => {
  const theme = useContext(ThemeContext);

  const [indexer, setIndexer] = useState(1);

  const translator = useRef(new Animated.Value(0)).current;

  const handleNextGuide = () => {
    if (indexer < stateObj.length) {
      console.log(indexer, stateObj.length);
      Animated.spring(translator, {
        toValue: -width * 0.8 * indexer,
        useNativeDriver: true,
      }).start(() => {
        setIndexer((prev) => prev + 1);
      });
    } else {
    }
  };

  return (
    <View style={[styles.guide, { backgroundColor: "#fff" }]}>
      <View style={styles.chibi}>
        <Image resizeMode="contain" source={chibi} style={styles.chibiImage} />
      </View>
      <AppText style={styles.title} bold size="large">
        Instance Actions
      </AppText>

      <View style={styles.guideSection}>
        <RowGuide
          icon={stateObj[0].icon}
          text={stateObj[0].text}
          translator={translator}
        />
        <RowGuide
          translator={translator}
          icon={stateObj[1].icon}
          text={stateObj[1].text}
        />
        <RowGuide
          icon={stateObj[2].icon}
          text={stateObj[2].text}
          translator={translator}
        />
      </View>
      <TouchableOpacity
        style={styles.nextBtn}
        activeOpacity={1}
        onPress={handleNextGuide}
      >
        <Ionicons name="chevron-forward" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default function TobiGuide({ visible, setVisible }) {
  return (
    <AppFadeIn
      RenderComponent={RenderGuide}
      visible={visible}
      //   disableCloseModal
      setVisible={setVisible}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chibi: {
    position: "absolute",
    borderWidth: 5,
    borderColor: "#ddd",
    top: -55,
    left: MODAL_WIDTH / 2 - 50,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  chibiImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  guide: {
    borderWidth: 6,
    borderColor: "#ddd",
    width: MODAL_WIDTH,
    maxHeight: height * 0.95,
    borderRadius: 25,
    padding: 30,
  },
  guideSection: {
    marginTop: 35,
    flexDirection: "row",
  },
  guideText: {
    marginLeft: 12,
    maxWidth: "70%",
    textAlign: "center",
  },
  nextBtn: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    borderRadius: (40 + 15) / 2,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: width * 0.8,
  },
  title: {
    textAlign: "center",
    marginTop: 32,
  },
});
