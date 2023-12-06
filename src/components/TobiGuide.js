import React, { useContext, useRef, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ThemeContext from "../config/ThemeContext";
import AppFadeIn from "./AppFadeIn";
import AppText from "./AppText";

import chibi from "../../assets/arts/levi_1.png";
import AppButton from "./AppButton";

const { width, height } = Dimensions.get("screen");
const MODAL_WIDTH = width * 0.9;
const ITEM_SIZE = width * 1.2;

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
      <MaterialCommunityIcons name={icon} size={width * 0.15} color={"#ddd"} />
      <AppText size="large" style={styles.guideText}>
        {text}
      </AppText>
    </Animated.View>
  );
};

const RenderGuide = ({ visObj, stateObj, title, setter, setVisObj }) => {
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
      setVisObj && setVisObj({ ...visObj, close: true });
      setter && setter();
      setBtnDisabled(false);
    } else {
      setBtnDisabled(false);
    }
  };

  return (
    <View style={[styles.guide, { backgroundColor: "#fff" }]}>
      <View style={styles.chibiContainer}>
        <View style={styles.chibi}>
          <Image
            resizeMode="contain"
            source={chibi}
            style={styles.chibiImage}
          />
        </View>
        <AppText style={styles.title} size="xlarge" bold>
          {title}
        </AppText>
      </View>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={styles.guideSection}>
          {stateObj.map((guide, index) => {
            return (
              <RowGuide
                icon={guide.icon}
                key={guide.text}
                text={guide.text}
                translator={translator}
                scaler={indexer === index + 1 ? scalerCurrent : scaler}
              />
            );
          })}
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
            LIcon={indexer < stateObj.length ? "chevron-forward" : null}
            title={indexer < stateObj.length ? "" : "CLOSE"}
            LIconPack="I"
            style={{ marginLeft: 40 }}
            onPress={() => handleNextGuide("next")}
          />
        </View>
      </View>
    </View>
  );
};

export default function TobiGuide({
  data,
  setData,
  setter,
  title,
  stateObj,
  ...otherProps
}) {
  return (
    <AppFadeIn
      RenderComponent={() => (
        <RenderGuide
          visObj={data}
          setVisObj={setData}
          title={title}
          stateObj={stateObj}
          setter={setter}
          {...otherProps}
        />
      )}
      visible={data?.vis}
      disableCloseModal
      closeModal={data}
      setter={() => {
        setData && setData({ close: false, vis: false });
        setter && setter();
      }}
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
    borderWidth: 5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  chibiImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  chibiContainer: {
    position: "absolute",
    top: -55,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  guide: {
    borderWidth: 6,
    borderColor: "#ddd",
    width: MODAL_WIDTH,
    maxHeight: height * 0.95,
    borderRadius: 25,
    padding: 30,
    minHeight: height * 0.45,
  },
  guideSection: {
    marginTop: 35,
    flexDirection: "row",
    flex: 0.8,
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
    marginTop: 25,
  },
});
