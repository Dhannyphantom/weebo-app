import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import colors from "../constants/colors";
import AppText from "./AppText";

// FILES
import loaderAnim from "../../assets/animations/two_dotted_spinner.json";

const screen = Dimensions.get("window");

const ActivityIndicator = ({
  visible = false,
  type = "spin",
  style,
  text,
  size = 0.4,
  bTransparent,
  ComponentRenderer,
  transparent,
  wTransparent,
}) => {
  if (!visible) return null;
  return (
    <View
      style={{
        ...styles.loaderCont,
        backgroundColor: transparent
          ? "transparent"
          : wTransparent
          ? "rgba(255, 255, 255, 0.65)"
          : bTransparent
          ? "rgba(0, 0, 0, 0.4)"
          : colors.white,
        justifyContent: type === "page" ? "flex-start" : "center",
        alignItems: type === "page" ? "stretch" : "center",
        ...style,
      }}
    >
      {type === "spin" && (
        <View style={styles.bounce}>
          <LottieView
            source={loaderAnim}
            autoPlay
            style={{
              width: screen.width * size * 0.45,
              height: screen.width * size * 0.45,
            }}
            loop
          />
        </View>
      )}
      {type === "comment" && (
        <LottieView
          source={require("../../assets/animations/comment-anim.json")}
          autoPlay
          style={{ width: screen.width * size, height: screen.width * size }}
          loop
        />
      )}

      {type === "empty" ||
        (type === "isEmpty" && (
          <>
            <LottieView
              source={require("../../assets/animations/nice.json")}
              autoPlay
              style={{
                width: screen.width * size,
                height: screen.width * size,
              }}
              loop
            />
            <AppText
              style={{
                ...styles.text,
                color:
                  type === "empty"
                    ? colors.medium
                    : type === "isEmpty"
                    ? colors.primary
                    : null,
              }}
            >
              {" "}
              {text}{" "}
            </AppText>
          </>
        ))}

      {type === "network" && (
        <>
          <LottieView
            source={require("../../assets/animations/network-1.json")}
            autoPlay
            style={{ width: screen.width * size, height: screen.width * size }}
            loop
          />
          {text && (
            <AppText style={styles.text}>
              {" "}
              {text}
              {" !"}
            </AppText>
          )}
        </>
      )}
      {type === "loader" && (
        <>
          <LottieView
            source={require("../../assets/animations/loader1.json")}
            autoPlay
            style={{ width: screen.width * size, height: screen.width * size }}
            loop
          />
          {text && <AppText style={styles.text}> {text} </AppText>}
        </>
      )}
      {type === "emptyComment" && (
        <>
          <LottieView
            source={require("../../assets/animations/message_pop.json")}
            autoPlay
            style={{ width: screen.width * size, height: screen.width * size }}
            loop
          />
          {text && <AppText style={styles.text}> {text} </AppText>}
        </>
      )}
      {ComponentRenderer && <ComponentRenderer />}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderCont: {
    flex: 1,
  },
  text: {
    color: colors.medium,
    width: screen.width * 0.55,
    textAlign: "center",
    lineHeight: 30,
  },
  bounce: {
    width: 90,
    height: 90,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ActivityIndicator;
