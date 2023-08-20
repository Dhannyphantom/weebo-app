import React from "react";
import { View, StyleSheet, Dimensions, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";

import AppButton from "../components/AppButton";
import Spacer from "../components/Spacer";
import colors from "../constants/colors";

// files
import welcomeImage from "../../assets/welcome.jpg";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={{ backgroundColor: colors.dark, flex: 1 }}>
      <StatusBar style="light" translucent />
      <ImageBackground
        source={welcomeImage}
        style={styles.image}
        // blurRadius={6}
      >
        <View style={styles.contents}>
          <View style={styles.btnCont}>
            <Spacer mv={width * 0.01}>
              <AppButton
                title="Login"
                style={styles.btn}
                onPress={() => navigation.navigate("Login")}
              />
            </Spacer>
            <Spacer mv={width * 0.01}>
              <AppButton
                title="Register"
                style={styles.btn}
                sec
                onPress={() => navigation.navigate("Register")}
              />
            </Spacer>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    alignSelf: "center",
  },
  image: {
    width,
    height,
    alignItems: "center",
  },
  contents: {
    flex: 1,
    justifyContent: "flex-end",
  },
  btnCont: {
    bottom: width * 0.1,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});
export default WelcomeScreen;
