import React, { useContext, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useFormikContext } from "formik";
import CountryDropdown from "react-native-dropdown-country-picker";
import AppText from "./AppText";
import ThemeContext from "../config/ThemeContext";

const { width } = Dimensions.get("screen");

export default function FormCountryPicker({ style }) {
  const { setFieldValue, values } = useFormikContext();

  const [selected, setSelected] = useState(values["contactCode"]);

  const theme = useContext(ThemeContext);

  const handleSelect = (state) => {
    setFieldValue("country", state.name);
    setFieldValue("contactCode", state.dial_code);
  };

  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.title} bold>
        Your country and contact info:
      </AppText>
      <View style={{ marginLeft: 15, width: width * 0.8 }}>
        <CountryDropdown
          selected={selected}
          phone={String(values["contact"])}
          setPhone={(phoneCode) => setFieldValue("contact", phoneCode)}
          setCountryDetails={handleSelect}
          setSelected={setSelected}
          dropdownStyles={{
            ...styles.dropdownStyles,
            backgroundColor: theme.extralight,
            borderColor: "#ddd",
            marginBottom: 15,
          }}
          dropdownTextStyles={{
            color: theme.color,
            fontFamily: "sen",
          }}
          countryCodeContainerStyles={{
            backgroundColor: theme.extralight,
            borderColor: "#ddd",
          }}
          countryCodeTextStyles={{ color: theme.color, fontFamily: "sen" }}
          phoneStyles={{
            height: 55,
            backgroundColor: theme.extralight,
            borderColor: "#ddd",
            color: theme.color,
            fontFamily: "sen",
          }}
          searchStyles={{ height: 55, color: theme.color }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  dropdownStyles: {
    backgroundColor: "red",
  },
  title: {
    marginBottom: 10,
  },
});
