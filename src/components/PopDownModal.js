import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import colors from "../constants/colors";
import AppButton from "./AppButton";
import AppText from "./AppText";
import Link from "./Link";
import GrowInput from "./GrowInput";
import Separator from "./Separator";

const screen = Dimensions.get("window");

const PopDownModal = ({
  visible,
  setVisible,
  title,
  text,
  handleDone,
  subtitle,
  data,
}) => {
  // data = [ { onPress, title, icon, id } ]
  const [descText, setDescText] = useState(text);
  const [boxTwo, setBoxTwo] = useState(false);

  const inputRef = useRef(null);

  const renderData = ({ item }) => {
    const handleLinkPress = () => {
      if (item.toggle) {
        setBoxTwo(!boxTwo);
      } else {
        item.onPress();
      }
    };
    return (
      <Link
        name={item.title}
        iconName={item.icon}
        onPress={handleLinkPress}
        style={styles.link}
      />
    );
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [boxTwo]);

  return (
    <Modal
      visible={visible}
      statusBarTranslucent
      transparent
      animationType="slide"
      style={styles.container}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.wrapper}
        onPress={() => setVisible(false)}
      >
        {boxTwo && (
          <TouchableOpacity activeOpacity={1} style={styles.contentTwo}>
            <AppText style={styles.title} bold>
              EDIT CAPTION
            </AppText>
            <Separator />
            <View style={styles.inputBtn}>
              <GrowInput
                ref={inputRef}
                text={descText}
                setText={setDescText}
                mLine
              />
              {text !== descText ? (
                <AppButton
                  title="SAVE CHANGES"
                  onPress={() => handleDone(descText)}
                  style={styles.btn}
                />
              ) : (
                <AppButton
                  title="CANCEL"
                  onPress={() => setBoxTwo(false)}
                  bare
                  style={styles.btn}
                />
              )}
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity activeOpacity={1} style={styles.content}>
          <AppText style={styles.title} bold>
            {title}
          </AppText>
          <Separator h={2} />
          {subtitle && <AppText style={styles.subtitle}>{subtitle}</AppText>}
          <View>
            <FlatList
              data={data}
              renderItem={renderData}
              keyExtractor={(item) => item.id}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
const styles = StyleSheet.create({
  btn: {
    alignSelf: "center",
    marginTop: 8,
  },
  container: {},
  content: {
    backgroundColor: colors.white,
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
    paddingVertical: 15,
  },
  contentTwo: {
    // position: "absolute",
    backgroundColor: colors.white,
    borderRadius: 18,
    alignSelf: "center",
    minHeight: 250,
    marginBottom: screen.height * 0.3,
    width: screen.width * 0.9,
    paddingVertical: 15,
  },
  input: {
    backgroundColor: colors.extraLight,
    borderRadius: 12,
    paddingHorizontal: 9,
    height: 40,
  },
  inputBtn: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  title: {
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 14,
  },
  link: {
    width: "90%",
    alignSelf: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
export default PopDownModal;
