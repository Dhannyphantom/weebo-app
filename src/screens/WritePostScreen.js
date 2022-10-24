import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Avatar from "../components/Avatar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { postColors as colorSet } from "../constants/colors";
import SearchBar from "../components/SearchBar";

import { Context as AuthContext } from "../config/AuthContext";
import { Context as FeedContext } from "../config/FeedContext";
import ActivityIndicator from "../components/ActivityIndicator";

const screen = Dimensions.get("window");

const WritePostScreen = ({ navigation, route }) => {
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const {
    postText,
    state: { posts },
  } = useContext(FeedContext);

  const [color, setColor] = useState(colorSet);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const params = route.params;
  const textRef = useRef(null);

  const getBgColor = () => {
    const data = color.find((item) => item.active === true);
    return data;
  };

  const handleBoxTap = (items) => {
    const oldArr = [...color];
    const click = oldArr.findIndex((item) => item.id === items.id);
    const d2 = oldArr.findIndex((item) => item.active === true);
    if (click === d2) return;
    if (click > -1) oldArr[click].active = true;
    if (d2 > -1) oldArr[d2].active = false;
    setColor(oldArr);
  };

  const handlePostButton = () => {
    setIsLoading(true);
    const info = {
      text: input,
      bg: getBgColor().bg,
      // tag: params.tag,
      // tagId: params.id,
      tColor: getBgColor().text,
    };
    if (input.length > 1) {
      postText(info, () => {
        setIsLoading(false);
        navigation.goBack();
      });
    }
  };

  const renderColors = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => handleBoxTap(item)}
        style={{ ...styles.smallBox, backgroundColor: item.bg }}
      >
        {item.active && (
          <View
            style={{ ...styles.smallBox, backgroundColor: "rgba(0,0,0,0.2)" }}
          >
            <MaterialCommunityIcons name="check" color="white" size={20} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar avatar={userInfo.avatar} name={userInfo.username} />
        <AppButton title="POST" onPress={handlePostButton} bare />
      </View>
      <View style={{ ...styles.box, backgroundColor: getBgColor().bg }}>
        {!isLoading ? (
          <TextInput
            value={input}
            ref={textRef}
            onChangeText={(val) => setInput(val)}
            style={{ ...styles.input, color: getBgColor().text }}
            placeholderTextColor={getBgColor().text}
            multiline
            maxLength={150}
            numberOfLines={6}
            placeholder="Write a post..."
          />
        ) : (
          <ActivityIndicator visible={isLoading} type="spin" wTransparent />
        )}
      </View>
      <View>
        <FlatList
          data={colorSet}
          keyExtractor={(item, index) => item.bg + index}
          horizontal
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          renderItem={renderColors}
        />
      </View>
      <View style={styles.tags}>
        <AppText style={{ fontSize: 15 }} bold>
          {" "}
          Add related tags{" "}
        </AppText>
        <SearchBar
          style={{ marginTop: 5 }}
          searchBar={searchText}
          placeholder="Search characters, groups or shows"
          setSearchBar={setSearchText}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  box: {
    height: 400,
    borderRadius: 20,
    width: screen.width * 0.98,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 5,
    overflow: "hidden",
  },
  container: {
    marginTop: 50,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 5,
    padding: 10,
  },
  input: {
    textAlign: "center",
    fontSize: 22,
    flex: 1,
    padding: 10,
  },
  smallBox: {
    width: 70,
    height: 70,
    marginHorizontal: 6,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  tags: {
    marginTop: 6,
    padding: 8,
  },
});
export default WritePostScreen;
