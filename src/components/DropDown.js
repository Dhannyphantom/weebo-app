import React, { useContext, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import {
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  Ionicons,
} from "@expo/vector-icons";

import colors from "../constants/colors";
import AppText from "./AppText";
import Separator from "./Separator";
import ThemeContext from "../config/ThemeContext";

const { width, height } = Dimensions.get("window");

const BOX_SIZE = width * 0.5;
const BOX_OFFSET = BOX_SIZE + 40;

const DropDown = ({
  visible,
  listKey,
  closeFunc,
  setVisible,
  setter,
  lists,
}) => {
  // list = [{id, name, show, onPress, icon, iconPack}]
  if (!visible) return null;

  const translator = useRef(new Animated.Value(BOX_OFFSET)).current;
  const scaler = translator.interpolate({
    inputRange: [0, BOX_OFFSET],
    outputRange: [1, 0],
  });
  const theme = useContext(ThemeContext);

  const renderDropLists = ({ item, index }) => {
    if (!item.show) return null;
    const lastItem = index === lists.map((obj) => obj.show).lastIndexOf(true);
    // console.log(lists.filter((obj) => obj.show).length, index);

    let Icon;
    switch (item.iconPack) {
      case "F":
        Icon = Feather;
        break;
      case "I":
        Icon = Ionicons;
        break;
      case "AD":
        Icon = AntDesign;
        break;

      default:
        Icon = MaterialCommunityIcons;
        break;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          // setVisible(false);
          handleBoxAction(false);
          item.onPress && item.onPress();
        }}
        style={styles.itemWrapper}
      >
        <View style={styles.itemContainer}>
          <Icon
            name={item.icon}
            size={18}
            color={item.selected ? colors.primary : theme.medium}
          />
          <AppText style={styles.itemTitle} bold>
            {item.name}
          </AppText>
        </View>
        {!lastItem && <Separator h={1} />}
      </TouchableOpacity>
    );
  };

  const handleCloseModal = () => {
    closeFunc && closeFunc();
    handleBoxAction(false);
  };

  const handleBoxAction = (vis) => {
    if (vis) {
      Animated.timing(translator, {
        toValue: 0,
        useNativeDriver: true,
        easing: Easing.elastic(0.8),
      }).start(() => {
        setVisible && setVisible(vis);
        setter && setter(vis);
      });
    } else {
      Animated.timing(translator, {
        toValue: BOX_OFFSET,
        useNativeDriver: true,
      }).start(() => {
        setVisible && setVisible(vis);
        setter && setter(vis);
      });
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
          backgroundColor: theme.background,
          transform: [{ translateX: translator }, { scale: scaler }],
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
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
  },
  content: {
    elevation: 2,
    alignSelf: "flex-end",
    marginRight: 30,
    marginTop: "15%",
    paddingBottom: 10,
    borderRadius: width * 0.024,
    width: BOX_SIZE,
    // maxWidth: BOX_SIZE + 1000,
  },
  closer: {
    position: "absolute",
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
    paddingVertical: 12,
  },
});

export default DropDown;
