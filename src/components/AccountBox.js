import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import colors from "../constants/colors";
import AppText from "./AppText";
import AppButton from "./AppButton";
import Info from "./Info";
import Separator from "./Separator";
import Link from "./Link";
import ActivityIndicator from "./ActivityIndicator";

//// ----------- FILES
import malePlaceholder from "../../assets/male.jpg";
import femalePlaceholder from "../../assets/female.jpg";
import ThemeContext from "../config/ThemeContext";

const screen = Dimensions.get("window");

const AccountBox = ({
  setPicModal,
  addWeeb,
  getUserData,
  tryLocalSignin,
  userID,
  userInfo,
}) => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState([]);
  const [added, setAdded] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const theme = useContext(ThemeContext);

  const info = profileData[0];
  let imgUri, isMine, pNoun;

  if (info) {
    isMine = userInfo.username === info.username;
    if (info.avatar) {
      imgUri = { uri: info.avatar };
    } else if (!info.avatar && info.gender === "male") {
      imgUri = malePlaceholder;
    } else if (!info.avatar && info.gender === "female") {
      imgUri = femalePlaceholder;
    }

    if (isMine) {
      pNoun = "My";
    } else if (!isMine && info.gender === "male") {
      pNoun = "His";
    } else if (!isMine && info.gender === "female") {
      pNoun = "Her";
    }
  }

  const handleAddWeeb = (type) => {
    addWeeb(
      userID,
      type,
      () => {
        if (type === "add") {
          setAdded(true);
        } else {
          setAdded(false);
        }
      },
      (err) => setErrMsg(err)
    );
  };

  const checkWeebs = () => {
    const fIds = userInfo.friends.map((obj) => obj._id);
    if (fIds.includes(userID)) {
      setAdded(true);
    } else {
      setAdded(false);
    }
  };

  const onCloseModal = () => {
    tryLocalSignin();
    setPicModal(false);
  };

  const onLink = (screen, params) => {
    onCloseModal();
    navigation.navigate(screen, params);
  };

  useEffect(() => {
    getUserData(
      userID,
      "normal",
      (data) => {
        setProfileData([data]);
      },
      (err) => {
        setErrMsg(err);
      }
    );
    checkWeebs();
  }, []);

  return (
    <TouchableOpacity
      onPress={onCloseModal}
      activeOpacity={1}
      style={styles.container}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={[
          styles.outerContent,
          { backgroundColor: theme.backgroundLight },
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.content, { backgroundColor: theme.background }]}
        >
          {profileData.length > 0 ? (
            <ScrollView>
              <View style={styles.header}>
                <Image
                  source={imgUri.uri}
                  resizeMethod="resize"
                  style={{
                    ...styles.proPic,
                    borderColor: info.avatar ? colors.primary : colors.light,
                    borderWidth: info.avatar ? 3 : 2,
                  }}
                />
                <AppText style={styles.userText} size="xlarge" bold>
                  @{info.username}
                </AppText>
                {info.name && info.second_name && (
                  <AppText style={styles.nameText} bold>
                    {`${info.name} ${info.second_name}`}
                  </AppText>
                )}
                {info.country && info.city && (
                  <AppText
                    style={styles.otherText}
                  >{`${info.country}, ${info.city}`}</AppText>
                )}
                <AppText style={styles.otherText}>{info.gender}</AppText>
              </View>
              <Separator h={1} />
              <View style={styles.info}>
                <Info
                  title="Characters"
                  count={info.charactersOwned.length}
                  onPress={() =>
                    onLink("CharacterList", {
                      type: "otherCharacters",
                      id: info._id,
                    })
                  }
                />
                <Info
                  title="Following"
                  count={info.following.length}
                  onPress={() =>
                    onLink("CharacterList", {
                      type: "following",
                      id: info._id,
                    })
                  }
                />

                <Info
                  title="Followers"
                  count={info.followers.length}
                  onPress={() =>
                    onLink("Followers", {
                      type: "otherFollowers",
                      id: info._id,
                    })
                  }
                />
              </View>
              <Separator h={1} />
              {added && !isMine ? (
                <AppButton
                  icon="close"
                  title="UNWEEB"
                  onPress={() => handleAddWeeb("remove")}
                  bare
                  style={styles.followBtn}
                />
              ) : !added && !isMine ? (
                <AppButton
                  icon="plus"
                  title="SEND REQUEST"
                  onPress={() => handleAddWeeb("add")}
                  bare
                  style={styles.followBtn}
                />
              ) : null}
              <View style={styles.linkCont}>
                <Link
                  name={`${pNoun} Collection`}
                  iconName="image-multiple"
                  onPress={() =>
                    onLink("MyPost", {
                      screen: isMine ? "account" : "accountBox",
                      info: { username: info.username, id: info._id },
                    })
                  }
                />
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyScreen}>
              {!errMsg ? (
                <ActivityIndicator visible={true} type="spin" />
              ) : (
                <AppText> {errMsg} </AppText>
              )}
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  content: {
    width: screen.width * 0.94,
    overflow: "hidden",
    minHeight: screen.height * 0.35,
    maxHeight: screen.height * 0.75,
    paddingTop: 30,
    paddingBottom: 40,
    borderRadius: 12,
  },
  outerContent: {
    borderRadius: 20,
    elevation: 3,
    padding: 7,
  },
  emptyScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  followBtn: {
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginTop: 15,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 5,
  },
  linkCont: {
    marginHorizontal: 20,
  },
  nameText: {
    fontSize: 17,
    textTransform: "capitalize",
    paddingBottom: 6,
  },
  otherText: {
    textTransform: "capitalize",
    paddingVertical: 5,
  },
  proPic: {
    width: 150,
    height: 150,
    borderRadius: 25,
  },
  userText: {
    color: colors.primary,
    textTransform: "uppercase",
    marginVertical: 5,
    paddingBottom: 5,
  },
});
export default AccountBox;
