import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../constants/colors";
import AppText from "./AppText";
import Separator from "./Separator";

const { width, height } = Dimensions.get("window");

const BOX_SIZE = width * 0.48;
const BOX_MARGIN = width * 0.04;
const BOX_HEIGHT = height * 0.45;
const BOX_TOP = width * 0.17;

const DropDown = ({
  visible,
  listKey,
  closeFunc,
  setVisible,
  lists,
  style,
}) => {
  // list = [{id, name, show, onPress, icon, iconPack}]
  if (!visible) return null;

  const translator = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const renderDropLists = ({ item }) => {
    if (!item.show) return null;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setVisible(false);
          // handleBoxAction(false);
          item.onPress && item.onPress();
        }}
        style={styles.itemWrapper}
      >
        <View style={styles.itemContainer}>
          <MaterialCommunityIcons
            name={item.icon}
            size={18}
            color={item.selected ? colors.primary : colors.medium}
          />
          <AppText size="large" style={styles.itemTitle} bold>
            {item.name}
          </AppText>
        </View>
        <Separator h={1} />
      </TouchableOpacity>
    );
  };

  const handleCloseModal = () => {
    closeFunc && closeFunc();
    // setVisible(false);
    handleBoxAction(false);
  };

  const handleBoxAction = (vis) => {
    if (vis) {
      Animated.parallel([
        Animated.timing(translator.x, {
          toValue: -(BOX_SIZE + BOX_MARGIN),
          useNativeDriver: true,
        }),
        Animated.timing(translator.y, {
          toValue: BOX_TOP,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(vis));
    } else {
      Animated.timing(translator, {
        toValue: {
          x: 0,
          y: 0,
        },
        useNativeDriver: true,
      }).start(() => setVisible(vis));
    }
  };

  useEffect(() => {
    handleBoxAction(visible);
  }, [visible]);

  return (
    <TouchableOpacity
      onPress={handleCloseModal}
      activeOpacity={1}
      style={styles.bgWrapper}
    >
      <Animated.View
        style={{
          ...styles.content,
          transform: translator.getTranslateTransform(),
        }}
      >
        <View>
          <FlatList
            data={lists}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            listKey={listKey}
            bounces={false}
            renderItem={renderDropLists}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  bgWrapper: {
    flex: 1,
    //
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  content: {
    elevation: 2,
    alignSelf: "flex-end",
    borderRadius: width * 0.024,
    width: BOX_SIZE,
    left: BOX_SIZE,
    // flexDirection: "row",
    backgroundColor: colors.white,
  },
  closer: {
    position: "absolute",
    // marginTop: BOX_HEIGHT / 2 - width * 0.1,
    backgroundColor: colors.extraLight,
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: (width * 0.1) / 2,
    marginLeft: -width * 0.12,
  },
  closerText: {
    marginLeft: 6,
  },
  itemTitle: {
    textTransform: "capitalize",
    color: colors.black,
    marginLeft: 8,
  },
  itemWrapper: {
    marginLeft: 9,
    paddingTop: 7,
  },
  itemContainer: {
    borderRadius: width * 0.01,
    marginVertical: 1,
    paddingLeft: 8,
    flexDirection: "row",
    width: "95%",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: 12,
  },
});

/*
    <Modal
      visible={true}
      // onRequestClose={handleCloseModal}
      animationType="fade"
      statusBarTranslucent
      transparent
    >
*/
export default DropDown;
