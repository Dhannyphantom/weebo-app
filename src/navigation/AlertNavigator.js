import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AlertScreen from "../screens/AlertScreen";
import AlertDetailScreen from "../screens/AlertDetailScreen";
import AppButton from "../components/AppButton";

const Stack = createStackNavigator();

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
