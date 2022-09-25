import React, { useContext, useState } from "react";
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Cards from "./Cards";
import colors from "../constants/colors";
import ThemeContext from "../config/ThemeContext";

const { width } = Dimensions.get("window");

const Input = ({
  icon,
  pass,
  elevation,
  onPress,
  placeholder,
  ...otherProps
}) => {
  const [eyeState, setEyestate] = useState(false);
  const [iconState, setIconState] = useState(false);

  const theme = useContext(ThemeContext);

  const handleToggle = () => {
    setEyestate(!eyeState);
    onPress();
  };

  return (
    <Cards elevation={elevation} style={{ ...styles.inputBox }}>
      <View style={styles.icon}>
        <MaterialCommunityIcons
          name={icon}
          size={15}
          color={iconState ? colors.primary : colors.medium}
        />
      </View>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.medium}
        style={[styles.input, { color: theme.color }]}
        onFocus={() => setIconState(true)}
        onBlur={() => setIconState(false)}
        {...otherProps}
      />
      {pass && eyeState && (
        <TouchableOpacity style={styles.eyeIcon} onPress={handleToggle}>
          <MaterialCommunityIcons
            name="eye-off-outline"
            size={14}
            color={colors.primary}
          />
        </TouchableOpacity>
      )}
      {pass && !eyeState && (
        <TouchableOpacity style={styles.eyeIcon} onPress={handleToggle}>
          <MaterialCommunityIcons
            name="eye-outline"
            size={14}
            color={colors.medium}
          />
        </TouchableOpacity>
      )}
    </Cards>
  );
};
const styles = StyleSheet.create({
  inputBox: {
    width: width * 0.78,
    marginBottom: 15,
    borderRadius: width * 0.021,
    borderColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 15,
  },
  icon: {
    marginLeft: 15,
  },
  eyeIcon: {
    height: 40,
    width: 40,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Input;
