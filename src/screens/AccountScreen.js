import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Share,
  FlatList,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Clipboard, { useClipboard } from "@react-native-community/clipboard";
import { StatusBar } from "expo-status-bar";

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
import ThemeContext from "../config/ThemeContext";
import AppFadeIn from "../components/AppFadeIn";
import PopMessage from "../components/PopMessage";
import { launchGallery } from "../constants/helpers";

const { width, height } = Dimensions.get("window");
const modalShow = {
  visible: true,
  title: "Sign Out",
  message: "Are you sure?",
  btn: "YES",
  type: "signout",
};

const InviteWeebs = ({ closeModal }) => {
  const theme = useContext(ThemeContext);
  const [clipStr, setClipper] = useClipboard();
  const {
    // sendInvite,
    state: {
      userInfo: { username, _id },
    },
  } = useContext(AuthContext);

  const message = `Hi, I'm ${username}, \n Join our Weebo Community now by downloading our app in the app stores. \n\nhttp://192.168.43.236/users/invite_weebs?user?=${username}&identifier=${_id}&repo=false`;

  const handleInvites = async (type) => {
    switch (type) {
      case "link":
        // USE EXPO CLIPBOARD PACKAGE
        try {
          setClipper(clipStr);
          closeModal("copied");
        } catch (err) {
          console.log("Nope");
        }
        break;
      case "share":
        await Share.share({ message });
        closeModal();
        break;
    }
  };

  return (
    <View style={[styles.invites, { backgroundColor: theme.background }]}>
      <AppText size="xlarge" bold>
        Weeb Invites!
      </AppText>
      <Separator h={2} m={3} />
      <AppText style={{ textAlign: "center", marginTop: 8 }}>
        Invite a fellow Weeb to the community and earn more Weebo Points
      </AppText>
      <View style={styles.invitesContent}>
        <TouchableOpacity
          onPress={() => handleInvites("link")}
          activeOpacity={0.85}
          style={styles.invitesBtns}
        >
          <Ionicons name="copy-outline" size={40} color={colors.medium} />
          <AppText bold style={{ marginTop: 10 }}>
            Copy Link
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleInvites("share")}
          activeOpacity={0.85}
          style={styles.invitesBtns}
        >
          <Ionicons name="share-outline" size={40} color={colors.medium} />
          <AppText bold style={{ marginTop: 10 }}>
            Share Link
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
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
  const [refreshing, setRefreshing] = useState(false);
  const [invites, setInvites] = useState(false);
  const [account, setAccount] = useState([userInfo]);
  const [popper, setPopper] = useState({ vis: false });

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

  const selectProfileImage = async () => {
    const { results } = await launchGallery("image", true, false, [4, 4]);
    if (results) {
      setImageLoading(true);
      updateAvatar(
        results[0],
        (res) => {
          setAccount([
            {
              ...account[0],
              avatar: {
                uri: results[0].uri,
                height: results[0].height,
                width: results[0].width,
              },
            },
          ]);
          setImageLoading(false);
        },
        (err) => {
          console.log(err?.err?.message);
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

  const closeInviteWeebModal = (type) => {
    switch (type) {
      case "copied":
        setPopper({
          vis: true,
          msg: "Invite link copied to clipboard!",
          type: "success",
        });
        setInvites(false);
        break;

      default:
        setInvites(false);
        break;
    }
  };

  const RenderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.profilePicContainer}>
          <ProfilePic
            source={account[0]?.avatar}
            loading={imageLoading}
            size={width * 0.32}
            border={5}
            borderColor="#ddd"
            displayPic
          />
          <View style={styles.editIcon}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.editIconTouch,
                { backgroundColor: theme.extralight },
              ]}
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
          {!isProfileCompleted && !isEmailVerified ? " and " : null}
          {!isEmailVerified ? "Verify your email" : null} to earn{" "}
          <AppText bold style={{ color: colors.primary }}>
            80WP
          </AppText>{" "}
          more
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
      <StatusBar style={theme.bar} />
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
                  ? `${item.name} ${item.second_name}`
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
                title="Instances"
                count={item.instance_count}
                onPress={() =>
                  navigation.navigate("CharacterList", {
                    id: userInfo._id,
                    type: "instances",
                  })
                }
              />
              <Info
                title="Following"
                count={item.following}
                onPress={() =>
                  navigation.navigate("CharacterList", {
                    id: userInfo._id,
                    type: "following",
                  })
                }
              />

              <Info
                title="Followers"
                count={item.followers}
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
                navigation.navigate("MyPost", {
                  // COMPLICATING THINGS. USE THE PARENT OBJECT ONLY
                  screen: "account",
                  info: { isMine: true },
                })
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
              name="My Collections"
              iconName="star"
              onPress={() =>
                navigation.navigate("Saved", { userID: userInfo._id })
              }
            />
            <Link
              name="Invite Weebs"
              iconName="account-plus"
              onPress={() => setInvites(true)}
            />
            <Link
              name="Settings & More"
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
      <AppFadeIn
        visible={invites}
        setVisible={setInvites}
        RenderComponent={() => (
          <InviteWeebs closeModal={closeInviteWeebModal} />
        )}
      />
      <AlertModal
        obj={alertModal}
        setVisible={setAlertModal}
        onPress={handlePressAlert}
      />
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
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
  invites: {
    width: width * 0.7,
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
  },
  invitesContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    marginBottom: 10,
  },
  invitesBtns: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
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
