import React, { useContext } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import colors from "../constants/colors";
import AppText from "./AppText";

// FILES
import loaderAnim from "../../assets/animations/two_dotted_spinner.json";
import simpleLoader from "../../assets/animations/loader1.json";
import emptyComment from "../../assets/animations/message_pop.json";
import commentAnim from "../../assets/animations/comment-anim.json";
import networkAnim from "../../assets/animations/network-1.json";
import emptyLoader from "../../assets/animations/nice.json";
import ThemeContext from "../config/ThemeContext";

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
  const theme = useContext(ThemeContext);

  return (
    <View
      style={{
        ...styles.loaderCont,
        backgroundColor: transparent
          ? "transparent"
          : wTransparent
          ? theme.transparent
          : bTransparent
          ? theme.transparent
          : theme.background,
        justifyContent: type === "page" ? "flex-start" : "center",
        alignItems: type === "page" ? "stretch" : "center",
        ...style,
      }}
    >
      {type === "spin" && (
        <View style={styles.bounce}>
          <LottieView
            source={loaderAnim}
            colorFilters={[
              { keypath: "Round-line 2", color: colors.primary },
              { keypath: "Round-line", color: colors.primary },
              { keypath: "Line-Right", color: colors.primary },
              { keypath: "Line-Left", color: colors.primary },
            ]}
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
          source={commentAnim}
          colorFilters={[{ keypath: "Comp 1", color: theme.extralight }]}
          autoPlay
          style={{ width: screen.width * size, height: screen.width * size }}
          loop
        />
      )}

      {type === "empty" ||
        (type === "isEmpty" && (
          <>
            <LottieView
              source={emptyLoader}
              colorFilters={[
                { keypath: "bcg-2 Outlines", color: theme.extralight },
                { keypath: "bcg-1 Outlines", color: theme.backgroundLight },
                { keypath: "square-45 Outlines", color: colors.primary },
                {
                  keypath: "rond-scaleout-bubble Outlines",
                  color: colors.primary,
                },
                {
                  keypath: "rond-scaleout-bubble Outlines",
                  color: colors.primary,
                },
                { keypath: "square Outlines", color: colors.primary },
                {
                  keypath: "round-scaleout-slow Outlines",
                  color: colors.primary,
                },
              ]}
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
            source={networkAnim}
            colorFilters={[
              { keypath: "dish Outlines - Group 3", color: colors.primary },
              { keypath: "Merged Shape Layer", color: theme.extralight },
              { keypath: "Merged Shape Layer 2", color: theme.extralight },
            ]}
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
            source={simpleLoader}
            colorFilters={[
              { keypath: "形状图层 2", color: colors.primary },
              { keypath: "形状图层 1", color: theme.extralight },
            ]}
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
            source={emptyComment}
            colorFilters={[
              { keypath: "chat Outlines - Group 6", color: theme.extralight },
              { keypath: "Merged Shape Layer", color: theme.backgroundLight },
            ]}
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
