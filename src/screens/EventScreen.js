import React from "react";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import AppHeader from "../components/AppHeader";
import Events from "../components/Events";
import Screen from "../components/Screen";
import { capCapitalize, capFirstLetter } from "../constants/helpers";

const EventScreen = ({ route, navigation }) => {
  const data = route.params;
  const { instance, instanceID, instanceName, followers } = data;
  const closer = () => {
    navigation.pop();
  };
  return (
    <Screen style={styles.container}>
      <StatusBar style="dark" />
      <AppHeader
        title={`${capCapitalize(instanceName)} ${capFirstLetter(
          instance
        )} Event`}
      />
      <Events
        instance={instance}
        instanceName={instanceName}
        closer={closer}
        followersCount={followers}
        instanceID={instanceID}
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default EventScreen;
