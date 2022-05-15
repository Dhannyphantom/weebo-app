import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { Context as AuthContext } from "../config/AuthContext";
import AppText from "../components/AppText";
import Cards from "../components/Cards";
import ProfilePic from "../components/ProfilePic";
import Screen from "../components/Screen";
import Info from "../components/Info";
import Link from "../components/Link";
import colors from "../constants/colors";
import Points from "../components/Points";
import Separator from "../components/Separator";
import AlertModal from "../components/AlertModal";
import { StatusBar } from "expo-status-bar";
import ThemeContext from "../config/themeContext";

const { width, height } = Dimensions.get("window");
const modalShow = {
  visible: true,
  title: "Sign Out",
  message: "Are sure you want to miss out all the fun?",
  btn: "YES",
  type: "signout",
};

const AccountScreen = ({ navigation, route }) => {
  const {
    signOut,
    updateAvatar,
    tryLocalSignin,
    state: { userInfo },
  } = useContext(AuthContext);
  const [imageLoading, setImageLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({ visible: false });
  const [imageProgress, setImageProgress] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [account, setAccount] = useState([userInfo]);

  const theme = useContext(ThemeContext);

  let prefixPro;
  const isProfileCompleted =
    userInfo.name && userInfo.second_name && userInfo.country && userInfo.city
      ? true
      : false;
  const isEmailVerified = userInfo.verified;

  if (isProfileCompleted) {
    prefixPro = "Edit";
  } else {
    prefixPro = "Complete";
  }

  let placeholder;
  userInfo.gender === "male"
    ? (placeholder = require("../../assets/male.jpg"))
    : (placeholder = require("../../assets/female.jpg"));

  const selectProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.6,
    });
    if (!result.cancelled) {
      setImageLoading(true);
      delete result.cancelled;
      updateAvatar(
        result,
        (res) => {
          setAccount([{ ...account[0], avatar: result.uri }]);
          setImageLoading(false);
        },
        (err) => {
          console.log(err);
          console.log(err.err?.response?.data);
          setImageLoading(false);
        },
        null
      );
    }
  };

  const handleScreenRefresh = (showRefresher = true) => {
    showRefresher && setRefreshing(true);
    tryLocalSignin((resData) => {
      setAccount([resData]);
      showRefresher && setRefreshing(false);
    });
  };

  const handlePressAlert = () => {
    signOut();
  };

  const RenderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.profilePicContainer}>
          <ProfilePic
            source={account[0]?.avatar}
            loading={imageLoading}
            size={width * 0.32}
            border={2}
            disabled
          />
          <View style={styles.editIcon}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.editIconTouch}
              onPress={selectProfileImage}
            >
              <MaterialCommunityIcons
                name="circle-edit-outline"
                size={width * 0.032}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <AppText size="large" style={styles.coolName} bold>
          @{account[0]?.username}
        </AppText>
      </View>
    );
  };

  const RenderFooter = () => {
    if (isProfileCompleted && isEmailVerified) return null;
    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}
      >
        <MaterialCommunityIcons
          name="account-question"
          size={width * 0.04}
          color={colors.medium}
        />
        <AppText style={{ color: colors.medium, marginLeft: 5 }}>
          {!isProfileCompleted ? "Complete your profile" : null}
          {!isProfileCompleted && !isEmailVerified ? ", " : null}
          {!isEmailVerified ? "Verify your email" : null} and earn{" "}
          <AppText bold style={{ color: colors.primary }}>
            80CP
          </AppText>
        </AppText>
      </View>
    );
  };

  useEffect(() => {
    const sub2 = navigation.addListener(
      "blur",
      () => (route.params = undefined)
    );
    const sub = navigation.addListener("focus", () => {
      setAccount([userInfo]);
    });
    return () => {
      sub;
      sub2;
    };
  }, [userInfo, navigation]);

  return (
    <Screen style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="dark" />
      <FlatList
        data={account}
        extraData={userInfo}
        refreshing={refreshing}
        onRefresh={handleScreenRefresh}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={RenderHeader}
        renderItem={({ item }) => (
          <Cards style={styles.card}>
            <View style={styles.information}>
              <AppText size="xxlarge" style={styles.name} bold>
                {item.name && item.second_name
                  ? `${item.second_name} ${item.name}`
                  : "Your Name"}
              </AppText>
              <AppText style={{ marginBottom: 12 }}>{item.email}</AppText>
              <AppText style={styles.username}>
                {item.country && item.city
                  ? `${item.country}, ${item.city}`
                  : "Country, city"}
              </AppText>
              <AppText style={styles.username}>{item.gender}</AppText>
            </View>
            <Separator h={1} />
            <View style={styles.info}>
              <Info
                title="Characters"
                count={item.charactersOwned.length}
                onPress={() =>
                  navigation.navigate("CharacterList", {
                    id: userInfo._id,
                    type: "myCharacters",
                  })
                }
              />
              <Info
                title="Following"
                count={item.following.length}
                onPress={() =>
                  navigation.navigate("CharacterList", {
                    id: userInfo._id,
                    type: "following",
                  })
                }
              />

              <Info
                title="Followers"
                count={item.followers.length}
                onPress={() =>
                  navigation.navigate("Followers", { type: "isMine" })
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <Separator h={1} />
              <TouchableOpacity
                onPress={() => navigation.navigate("Points")}
                activeOpacity={0.8}
                style={{ paddingVertical: 10 }}
              >
                <Points type="account" prog={userInfo.points} />
              </TouchableOpacity>
            </View>
            {route.params && (
              <AppText style={styles.routeText}> {route.params.msg} </AppText>
            )}
            <Link
              name="My Post Collection"
              iconName="image-multiple"
              onPress={() =>
                navigation.navigate("MyPost", { screen: "account" })
              }
            />
            <Link
              name={`${prefixPro} Profile`}
              iconName="account-edit"
              onPress={() =>
                navigation.navigate("EditProfile", { isProfileCompleted })
              }
            />
            <Link
              name="Saved Collection"
              iconName="star"
              onPress={() => navigation.navigate("Saved")}
            />
            <Link
              name="Settings"
              iconName="settings"
              pack="b"
              onPress={() => navigation.navigate("Settings")}
            />

            <Link
              name="Signout"
              iconName="logout"
              onPress={() => setAlertModal(modalShow)}
            />
            <RenderFooter />
            {/* </ScrollView> */}
          </Cards>
        )}
      />
      <AlertModal
        obj={alertModal}
        setVisible={setAlertModal}
        onPress={handlePressAlert}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingTop: 15,
  },
  coolName: {
    fontSize: 14,
    textTransform: "uppercase",
    marginTop: 10,
    marginBottom: 15,
    color: colors.primary,
  },
  card: {
    flex: 1,
    paddingBottom: height * 0.12,
    elevation: 20,
    shadowRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.23,
    shadowOffset: {
      width: 0,
      height: 2.1,
    },
    borderTopStartRadius: width * 0.05,
    borderTopEndRadius: width * 0.05,
    padding: 15,
  },
  name: {
    marginVertical: 12,
    textTransform: "capitalize",
  },
  username: {
    marginBottom: 12,
    textTransform: "capitalize",
  },
  header: {
    alignItems: "center",
    paddingTop: width * 0.03,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 5,
  },
  information: {
    marginLeft: 10,
  },
  profilePicContainer: {
    marginTop: 10,
  },
  editIcon: {
    position: "absolute",
    bottom: "10%",
    width: "35%",
    height: "100%",
  },
  editIconTouch: {
    padding: 15,
    backgroundColor: colors.extraLight,
    borderRadius: 100,
    alignSelf: "flex-end",
    elevation: 2,
  },
  routeText: {
    color: colors.heart,
    marginVertical: 6,
  },
});
export default AccountScreen;
