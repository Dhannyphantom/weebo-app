import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ThemeContext from "../config/ThemeContext";
import colors from "../constants/colors";
import AppText from "./AppText";

const screen = Dimensions.get("window");
const BAR_WIDTH = screen.width * 0.9;

const Points = ({ prog = 0, type, style }) => {
  const [progress, setProgress] = useState(prog);
  const theme = useContext(ThemeContext);

  let title, suffix, max, barWidth;
  if (type === "account") {
    title = "My Challenge points";
    max = 1000;
    suffix = " / 1000 cp";
  } else {
    title = "Upload progress";
    max = 100;
    suffix = "%";
    barWidth = (progress / max) * 100;
  }
  if (progress >= max) {
    barWidth = 100;
  } else {
    barWidth = (progress / max) * 100;
  }

  useEffect(() => {
    setProgress(prog);
  }, [prog]);
  return (
    <View style={{ ...styles.container, style }}>
      <View style={styles.barHeader}>
        <AppText bold style={styles.title}>
          {title}
        </AppText>
        <AppText style={styles.title} bold>
          {Math.min(1000, progress) + suffix}
        </AppText>
      </View>
      <View style={{ ...styles.barCont, backgroundColor: theme.extralight }}>
        <View style={{ flex: 1, flexDirection: "row", width: `${barWidth}%` }}>
          <View style={{ ...styles.bar }}></View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  bar: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 15,
  },

  barCont: {
    width: BAR_WIDTH,
    height: 8,
    borderRadius: 15,
    marginTop: 8,
  },
  btnCont: {
    width: BAR_WIDTH,
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container: {
    flex: 1,
    marginBottom: 5,
    alignSelf: "center",
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 5,
  },
  title: {
    color: colors.medium,
    textTransform: "uppercase",
  },
});
export default Points;

// <View style={{ ...styles.container, style }}>
// <AppText bold style={styles.title}>
//   My Challenge Points
// </AppText>
// <View style={styles.barCont}>
//   <View style={{ flex: 1, flexDirection: "row", width: `${progress}%` }}>
//     <View style={{ ...styles.bar }}></View>
//     <View
//       style={{ ...styles.caret, left: BAR_WIDTH * (progress / 100) - 10 }}
//     >
//       <FontAwesome5 name="caret-up" size={25} color={colors.medium} />
//       <AppText style={styles.pText}>{progress}</AppText>
//     </View>
//   </View>
// </View>
// </View>
