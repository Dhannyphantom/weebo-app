import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import EditProfileScreen from "../screens/EditProfieScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CharactersList from "../screens/CharactersList";
import FollowersScreen from "../screens/FollowersScreen";

import CharacterScreen from "../screens/CharacterScreen";
import MyPostScreen from "../screens/MyPostScreen";
import SavedCollectionScreen from "../screens/SavedCollectionScreen";
import ChallengePointScreen from "../screens/ChallengePointScreen";
import CollectionScreen from "../screens/CollectionScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={AccountScreen} />
      <Stack.Screen name="MyPost" component={MyPostScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Saved" component={SavedCollectionScreen} />
      <Stack.Screen name="Collection" component={CollectionScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Points" component={ChallengePointScreen} />
      <Stack.Screen name="Character" component={CharacterScreen} />
      <Stack.Screen name="CharacterList" component={CharactersList} />
      <Stack.Screen name="Followers" component={FollowersScreen} />
    </Stack.Navigator>
  );
};

export default AccountNavigator;
