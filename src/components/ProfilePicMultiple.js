import React from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ProfilePic from "./ProfilePic";
import colors from "../constants/colors";

const avatars = [
  {
    _id: "1",
    // image: require("../../assets/testImages/img1.jpg"),
  },
  {
    _id: "2",
    // image: require("../../assets/testImages/img2.jpg"),
  },
  {
    _id: "4",
    // image: require("../../assets/testImages/img3.jpg"),
  },
  {
    _id: "5",
    // image: require("../../assets/testImages/img3.jpg"),
  },
];

const { width } = Dimensions.get("window");

const ProfilePicMultiple = () => {
  // avatars =
  const renderProfilePics = ({ item, index }) => {
    let position, marPosition;
    switch (index) {
      case 0:
        position = 0;
        marPosition = 30;
        break;

      case 1:
        position = -20;
        break;

      case 2:
        position = -30;
        break;

      default:
        position = -30;
        marPosition = 0;

        break;
    }
    return (
      <View style={{ left: position, marginLeft: marPosition }}>
        {index < 3 ? (
          <ProfilePic
            source={item.image}
            border={2}
            borderColor={colors.white}
            size={45}
          />
        ) : (
          <View style={styles.plusIcon}>
            <MaterialCommunityIcons
              name="plus"
              color={colors.white}
              size={width * 0.03}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={avatars}
          keyExtractor={(item) => item._id}
          renderItem={renderProfilePics}
          contentContainerStyle={{ flexDirection: "row" }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 50,
  },
  plusIcon: {
    alignSelf: "center",
  },
});
export default ProfilePicMultiple;
