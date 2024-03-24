import React, { forwardRef, useContext } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Spacer from "./Spacer";
import colors from "../constants/colors";
import ActivityIndicator from "./ActivityIndicator";
import ThemeContext from "../config/ThemeContext";

const SearchBar = (
  { setSearchBar, searchBar, loading, closeCb, pressCb, placeholder, style },
  ref
) => {
  const handleTextChange = (textVal) => {
    setSearchBar(textVal);
    pressCb && pressCb();
  };
  const theme = useContext(ThemeContext);
  return (
    <View
      style={{
        ...styles.search,
        backgroundColor: theme.extralight,
        ...style,
      }}
    >
      <Spacer pl={20} pr={10}>
        <Feather name="search" size={16} color={colors.primary} />
      </Spacer>
      <TextInput
        ref={ref}
        style={[styles.input, { color: theme.color }]}
        placeholder={placeholder}
        placeholderTextColor={colors.medium}
        onChangeText={handleTextChange}
        value={searchBar}
      />
      {searchBar.length > 0 ? (
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => {
            setSearchBar("");
          }}
        >
          {loading ? (
            <ActivityIndicator
              type="spin"
              visible={loading}
              style={{ position: "absolute", paddingRight: 15 }}
              transparent
              size={0.18}
            />
          ) : (
            <MaterialCommunityIcons
              name="close-circle"
              color={colors.medium}
              size={20}
            />
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.closeIcon}
          activeOpacity={1}
          onPress={() => {
            setSearchBar("");
            closeCb && closeCb();
          }}
        >
          <MaterialCommunityIcons
            name="cancel"
            color={colors.medium}
            size={20}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const forwardedSearchRef = forwardRef(SearchBar);

const styles = StyleSheet.create({
  closeIcon: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  input: {
    fontFamily: "sans-regular",
    flex: 1,
    height: "100%",
    textTransform: "capitalize",
    paddingVertical: 15,
  },
  search: {
    width: "100%",
    flexDirection: "row",
    borderRadius: 9,
    alignItems: "center",
  },
});
export default forwardedSearchRef;
