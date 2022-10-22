import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import ThemeContext from "../config/ThemeContext";
import colors from "../constants/colors";
import AppText from "./AppText";
import Cards from "./Cards";

const Score = ({ score, fScale, size = 50 }) => {
  const theme = useContext(ThemeContext);
  return (
    <Cards style={{ ...styles.box, width: size, height: size }}>
      <AppText style={{ color: theme.color, fontSize: fScale }} bold>
        {`${score}`}
      </AppText>
    </Cards>
  );
};
const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    borderRadius: 5,
  },
  text: {
    color: colors.twitter,
  },
});
export default Score;
