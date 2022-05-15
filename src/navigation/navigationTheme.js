import { DefaultTheme, DarkTheme } from "@react-navigation/native";

import colors from "../constants/colors";

export default {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme,
    primary: colors.primary,
  },
};
