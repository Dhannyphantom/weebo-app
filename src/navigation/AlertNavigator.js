import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AlertScreen from "../screens/AlertScreen";
import AlertDetailScreen from "../screens/AlertDetailScreen";

const Stack = createNativeStackNavigator();

const AlertNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Alert"
        component={AlertScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
    </Stack.Navigator>
  );
};

export default AlertNavigator;
