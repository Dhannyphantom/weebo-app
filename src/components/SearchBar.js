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
        backgroundColor: theme.backgroundLight,
        ...style,
      }}
    >
      <Spacer ml={12} mr={6}>
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
      {searchBar.length > 0 && (
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => {
            setSearchBar("");
            closeCb && closeCb();
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
              size={15}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const forwardedSearchRef = forwardRef(SearchBar);

const styles = StyleSheet.create({
  closeIcon: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: "sen",
  },
  search: {
    width: "100%",
    flexDirection: "row",
    height: 40,
    borderRadius: 9,
    alignItems: "center",
  },
});
export default forwardedSearchRef;
