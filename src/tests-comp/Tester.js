import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import CountryPicker from "react-native-dropdown-country-picker";

const { width, height } = Dimensions.get("screen");

export default function Tester() {
  const [country, setCountry] = useState("");
  const [selected, setSelected] = useState("+234");
  const [phone, setPhone] = useState("");

  return (
    <View style={styles.container}>
      <Text>Hii</Text>
      <View style={{ width: width * 0.6 }}>
        <CountryPicker
          selected={selected}
          setSelected={setSelected}
          setCountryDetails={setCountry}
          phone={phone}
          setPhone={setPhone}
          countryCodeTextStyles={{ font: "sen" }}
          searchStyles={{
            padding: 20,
            height: 65,
            maxWidth: width * 0.96,
            flex: 0.8,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
