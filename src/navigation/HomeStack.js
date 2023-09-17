import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CharacterScreen from "../screens/CharacterScreen";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import CreateInstanceScreen from "../screens/CreateInstanceScreen";
import ShowScreen from "../screens/ShowScreen";
import PostScreen from "../screens/PostScreen";
import ImageGallery from "../components/ImageGallery";
import ChannelScreen from "../screens/ChannelScreen";
import MyPostScreen from "../screens/MyPostScreen";
import ViewRoomScreen from "../screens/ViewRoomScreen";
import CharactersList from "../screens/CharactersList";
import FollowersScreen from "../screens/FollowersScreen";
import GroupsScreen from "../screens/GroupsScreen";
import ShowsScreen from "../screens/ShowsScreen";
import FriendListScreen from "../screens/FriendListScreen";
import ChannelPostScreen from "../screens/ChannelPostScreen";
import EventScreen from "../screens/EventScreen";
import ContestCharacterScreen from "../screens/ContestCharacterScreen";
import SavedCollectionScreen from "../screens/SavedCollectionScreen";
import CollectionScreen from "../screens/CollectionScreen";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Character" component={CharacterScreen} />
      <Stack.Screen name="Show" component={ShowScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Friends" component={FriendListScreen} />
      <Stack.Screen name="Channel" component={ChannelScreen} />
      <Stack.Screen name="Saved" component={SavedCollectionScreen} />
      <Stack.Screen name="Collection" component={CollectionScreen} />
      <Stack.Screen name="ChannelPost" component={ChannelPostScreen} />
      <Stack.Screen name="CharacterList" component={CharactersList} />
      <Stack.Screen name="Followers" component={FollowersScreen} />
      <Stack.Screen name="MyPost" component={MyPostScreen} />
      <Stack.Screen name="Group" component={GroupsScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="Room" component={ViewRoomScreen} />
      <Stack.Screen name="Shows" component={ShowsScreen} />
      <Stack.Screen name="Post" component={PostScreen} />
      <Stack.Screen name="Contest" component={ContestCharacterScreen} />
      <Stack.Screen name="Gallery" component={ImageGallery} />
      <Stack.Screen name="CreateInstance" component={CreateInstanceScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
