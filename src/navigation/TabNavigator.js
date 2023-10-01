import React, { useContext, useEffect, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";

import { Context as AuthContext } from "../config/AuthContext";

import ChallengeStack from "./ChallengeStack";
import colors from "../constants/colors";
import AccountNavigator from "./AccountNavigator";
import AlertNavigator from "./AlertNavigator";
import HomeStack from "./HomeStack";
import ProfilePic from "../components/ProfilePic";
import ThemeContext from "../config/ThemeContext";
import Badger from "../components/Badger";

const { width } = Dimensions.get("window");

const Tab = createBottomTabNavigator();

const TabArr = [
  {
    id: "1",
    name: "HomeStack",
    component: HomeStack,
    iconName: "appstore-o",
    iconPack: "AD",
    iconFName: "appstore1",
    iconFPack: "AD",
  },
  {
    id: "1",
    name: "ChallengeStack",
    component: ChallengeStack,
    iconName: "trophy-variant-outline",
    iconPack: "MCI",
    iconFName: "trophy-variant",
    iconFPack: "MCI",
  },
  {
    id: "1",
    name: "AlertStack",
    component: AlertNavigator,
    iconName: "bell-outline",
    iconPack: "MCI",
    iconFName: "bell",
    iconFPack: "MCI",
  },
  {
    id: "1",
    name: "AccountStack",
    component: AccountNavigator,
    iconName: "",
    iconPack: "",
    iconFName: "",
    iconFPack: "",
  },
];

const tabStyle = {
  borderRadius: width * 0.015,
  height: width * 0.09,
  borderWidth: 0,
  paddingHorizontal: 8,
  alignSelf: "center",
  justifyContent: "space-evenly",
};

const style = {
  // height: 62,
  height: "6.5%",
  minHeight: 65,
  maxHeight: 80,
  backgroundColor: colors.white,
  borderWidth: -1,
  position: "absolute", //THIS WILL MAKE THE BACKGROUND TAB-BAR TRANSPARENT
  borderRadius: 10,
  width: width * 0.7,
  left: width / 2 - (width * 0.7) / 2,
  elevation: 12,
  shadowRadius: 6,
  bottom: 15,
  shadowColor: "black",
  shadowOpacity: 0.15,
  shadowOffset: {
    width: 0,
    height: 1.8,
  },
  // borderColor: colors.white,
};

const screenOptions = {
  headerShown: false,
  tabBarLabelPosition: "beside-icon",
  tabBarStyle: style,
  tabBarActiveTintColor: colors.primary,
  tabBarItemStyle: tabStyle,
  tabBarHideOnKeyboard: true,
  tabBarShowLabel: false,
};

const TabIcon = ({ focused, color, size = 40, item }) => {
  const { iconName, name, iconPack, iconFName, iconFPack } = item;
  const theme = useContext(ThemeContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  let Icon, IconFocused;
  switch (iconPack) {
    case "AD":
      Icon = AntDesign;
      break;
    case "MCI":
      Icon = MaterialCommunityIcons;
  }
  switch (iconFPack) {
    case "AD":
      IconFocused = AntDesign;
      break;
    case "MCI":
      IconFocused = MaterialCommunityIcons;
      break;
  }

  if (name.toLowerCase() == "accountstack") {
    return (
      <ProfilePic
        source={userInfo.avatar}
        size={size}
        border={2}
        borderRad={size / 2}
        borderColor={focused ? "#ddd" : theme.backgroundLight}
        disabled
      />
    );
  }

  return (
    <>
      {focused ? (
        <IconFocused name={iconFName} color={color} size={size / 1.5} />
      ) : (
        <Icon name={iconName} color={color} size={size / 1.5} />
      )}
    </>
  );
};

const TabButton = (props) => {
  const theme = useContext(ThemeContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState?.selected;

  const scaler = useRef(new Animated.Value(0.4)).current;
  const rotater = scaler.interpolate({
    inputRange: [0.7, 1],
    outputRange: ["0deg", "360deg"],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (focused) {
      Animated.timing(scaler, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaler, {
        toValue: 0.7,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={styles.container}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaler }, { rotate: rotater }],
        }}
      >
        <TabIcon
          item={item}
          color={focused ? colors.primary : theme.medium}
          focused={focused}
        />
        {item.name === "AlertStack" && (
          <Badger number={userInfo.notifications} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const TabNavigator = () => {
  const theme = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        ...screenOptions,
        tabBarStyle: {
          ...screenOptions.tabBarStyle,
          backgroundColor: theme.background,
          borderColor: theme.background,
        },
      }}
      backBehavior="none"
    >
      {TabArr.map((obj, idx) => {
        return (
          <Tab.Screen
            key={idx}
            name={obj.name}
            component={obj.component}
            options={{
              tabBarButton: (props) => <TabButton {...props} item={obj} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
