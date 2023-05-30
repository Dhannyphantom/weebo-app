import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ChallengeScreen from "../screens/ChallengeScreen";
import CharacterScreen from "../screens/CharacterScreen";

const Stack = createNativeStackNavigator();

const ChallengeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Challenge" component={ChallengeScreen} />
      <Stack.Screen name="Character" component={CharacterScreen} />
    </Stack.Navigator>
  );
};

export default ChallengeStack;
