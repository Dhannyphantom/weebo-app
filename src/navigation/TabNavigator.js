import React, { useContext } from "react";
import { Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";

import { Context as AuthContext } from "../config/AuthContext";

import ChallengeStack from "./ChallengeStack";
import colors from "../constants/colors";
import AccountNavigator from "./AccountNavigator";
import AlertNavigator from "./AlertNavigator";
import HomeStack from "./HomeStack";
import ProfilePic from "../components/ProfilePic";

const { width } = Dimensions.get("window");

const Tab = createBottomTabNavigator();

const tabStyle = {
  borderRadius: width * 0.015,
  height: width * 0.09,
  borderWidth: 0,
  paddingHorizontal: 8,
  alignSelf: "center",
  justifyContent: "space-evenly",
};

// console.log(width * 0.12);

const style = {
  minHeight: width * 0.12,
  backgroundColor: colors.white,
  borderWidth: -1,
  position: "absolute", //THIS WILL MAKE THE BACKGROUND TAB-BAR TRANSPARENT
  marginBottom: 9,
  // marginHorizontal: width * 0.05,
  borderRadius: width * 0.022,
  width: width * 0.7,
  left: width / 2 - (width * 0.7) / 2,
  elevation: 12,
  shadowRadius: 6,
  shadowColor: "black",
  shadowOpacity: 0.15,
  shadowOffset: {
    width: 0,
    height: 1.8,
  },
  borderColor: colors.white,
};

const screenOptions = {
  headerShown: false,
  tabBarLabelPosition: "beside-icon",
  tabBarLabelStyle: {
    marginLeft: 3,
  },
  tabBarStyle: style,
  tabBarItemStyle: tabStyle,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.medium,
  tabBarHideOnKeyboard: true,
  tabBarShowLabel: false,
};

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  // console.log(insets);
  return (
    <Tab.Navigator screenOptions={screenOptions} backBehavior="none">
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="appstore-o" color={color} size={size - 8} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="ChallengeStack"
        component={ChallengeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="Trophy" color={color} size={size - 8} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="AlertStack"
        component={AlertNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="bell-outline"
              color={color}
              size={size - 8}
            />
          ),
          tabBarLabel: () => null,
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="AccountStack"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            // <AntDesign name="user" color={color} size={size - 8} />
            <ProfilePic
              source={userInfo.avatar}
              size={focused ? size : size + width * 0.008}
              border={1.1}
              borderRad={size / 2}
              borderColor={focused ? colors.primary : colors.white}
              disabled
            />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
