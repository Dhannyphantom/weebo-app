import React, { useContext, useEffect, useRef, useState } from "react";
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
import AppButton from "./AppButton";

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
      <AppText size="large" style={styles.guideText}>
        {text}
      </AppText>
    </Animated.View>
  );
};

const RenderGuide = ({ visObj, setVisObj }) => {
  const theme = useContext(ThemeContext);

  const [indexer, setIndexer] = useState(1);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const translator = useRef(new Animated.Value(0)).current;
  const scaler = useRef(new Animated.Value(0.3)).current;
  const scalerCurrent = useRef(new Animated.Value(1)).current;

  const handleNextGuide = (type) => {
    setBtnDisabled(true);
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
        setBtnDisabled(false);
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
        setBtnDisabled(false);
      });
    } else if (type === "next" && indexer >= stateObj.length) {
      setVisObj({ ...visObj, close: true });
      setBtnDisabled(false);
    }
  };

  return (
    <View style={[styles.guide, { backgroundColor: "#fff" }]}>
      <View style={styles.chibi}>
        <Image resizeMode="contain" source={chibi} style={styles.chibiImage} />
      </View>
      <AppText style={styles.title} bold>
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
        <AppButton
          bare
          disabled={btnDisabled}
          onPress={() => handleNextGuide("prev")}
          LIcon="chevron-back"
          LIconPack="I"
        />
        <AppButton
          disabled={btnDisabled}
          bare
          RIcon={indexer < stateObj.length ? "chevron-forward" : "close"}
          RIconPack="I"
          style={{ marginLeft: 40 }}
          onPress={() => handleNextGuide("next")}
        />
      </View>
    </View>
  );
};

export default function TobiGuide({ data, setData }) {
  // console.log(data);
  return (
    <AppFadeIn
      RenderComponent={() => <RenderGuide visObj={data} setVisObj={setData} />}
      visible={data?.vis}
      disableCloseModal
      closeModal={data}
      setter={() => setData({ close: false, vis: false })}
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
