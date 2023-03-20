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

import chibi from "../../assets/arts/levi_1.png";

const { width, height } = Dimensions.get("screen");
const MODAL_WIDTH = width * 0.9;
const ITEM_SIZE = width * 1.2;

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

const RowGuide = ({ icon, translator, scaler, text }) => {
  return (
    <Animated.View
      style={[
        styles.row,
        {
          transform: [{ translateX: translator }, { scale: scaler }],
          opacity: scaler,
        },
      ]}
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

const RenderGuide = ({ closer, setVisible }) => {
  const theme = useContext(ThemeContext);

  const [indexer, setIndexer] = useState(1);

  const translator = useRef(new Animated.Value(0)).current;
  const scaler = useRef(new Animated.Value(0.3)).current;
  const scalerCurrent = useRef(new Animated.Value(1)).current;

  const handleNextGuide = (type) => {
    if (type === "next" && indexer < stateObj.length) {
      Animated.parallel([
        Animated.spring(translator, {
          toValue: -ITEM_SIZE * indexer,
          bounciness: 10,
          useNativeDriver: true,
        }),
        Animated.timing(scaler, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(scalerCurrent, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndexer(indexer + 1);
        scaler.setValue(0.3);
        scalerCurrent.setValue(1);
      });
    } else if (type === "prev" && indexer > 1) {
      Animated.parallel([
        Animated.spring(translator, {
          toValue: -ITEM_SIZE * (indexer - 2),
          bounciness: 10,
          useNativeDriver: true,
        }),
        Animated.timing(scaler, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(scalerCurrent, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndexer(indexer - 1);
        scaler.setValue(0.3);
        scalerCurrent.setValue(1);
      });
    } else if (type === "next" && indexer >= stateObj.length) {
      closer && closer({ close: true });
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
          scaler={indexer === 1 ? scalerCurrent : scaler}
        />
        <RowGuide
          translator={translator}
          icon={stateObj[1].icon}
          text={stateObj[1].text}
          scaler={indexer === 2 ? scalerCurrent : scaler}
        />
        <RowGuide
          icon={stateObj[2].icon}
          text={stateObj[2].text}
          translator={translator}
          scaler={indexer === 3 ? scalerCurrent : scaler}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        {indexer > 1 && (
          <TouchableOpacity
            style={styles.nextBtn}
            activeOpacity={1}
            onPress={() => handleNextGuide("prev")}
          >
            <Ionicons name="chevron-back" size={30} color={colors.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.nextBtn}
          activeOpacity={1}
          onPress={() => handleNextGuide("next")}
        >
          <Ionicons
            name={indexer < stateObj.length ? "chevron-forward" : "close"}
            size={30}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function TobiGuide({ visible, setVisible }) {
  const [closeModal, setCloseModal] = useState({ close: false });
  return (
    <AppFadeIn
      RenderComponent={() => (
        <RenderGuide closer={setCloseModal} setVisible={setVisible} />
      )}
      visible={visible}
      disableCloseModal
      closeModal={closeModal}
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
    // backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: (40 + 15) / 2,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 30,
    marginHorizontal: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: ITEM_SIZE,
  },
  title: {
    textAlign: "center",
    marginTop: 32,
  },
});
