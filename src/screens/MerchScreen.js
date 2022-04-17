import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "../components/AppText";
import ActivityIndicator from "../components/ActivityIndicator";

const TrophieScreen = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.title} size="xlarge" bold>
        Otaku Merchandise!!!
      </AppText>
      <View style={styles.activityCont}>
        <ActivityIndicator visible type="isEmpty" text="Coming Soon!!!" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activityCont: {
    height: 200,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 40,
  },
});
export default TrophieScreen;
