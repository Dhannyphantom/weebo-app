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
import { Context as AuthContext } from "../config/AuthContext";

import colors from "../constants/colors";
import AppText from "./AppText";
import AppButton from "./AppButton";
import Info from "./Info";
import Separator from "./Separator";
import Link from "./Link";
import ActivityIndicator from "./ActivityIndicator";

//// ----------- FILES
import femalePlaceholder from "../../assets/arts/girl_1.png";
import malePlaceholder from "../../assets/arts/sasuke_1.png";
import ThemeContext from "../config/ThemeContext";
import MediaModal from "./MediaModal";

const screen = Dimensions.get("window");

const AccountBox = ({
  setPicModal,
  callback,
  getUserData,
  tryLocalSignin,
  userID,
  userInfo,
}) => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState([]);
  const [status, setStatus] = useState("no_request");
  const [errMsg, setErrMsg] = useState(null);
  const [displayPic, setDisplayPic] = useState({ vis: false });

  const { requestWeeb, joinRoom, addWeeb } = useContext(AuthContext);

  const theme = useContext(ThemeContext);

  const info = profileData[0];
  let imgUri, isMine, pNoun;

  if (info) {
    isMine = userInfo.username === info.username;
    if (info.avatar) {
      imgUri = info.avatar;
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
    switch (type) {
      case "request":
        requestWeeb(
          { id: userID, type: "add" },
          (_data) => {
            setStatus("requested");
          },
          (err) => setErrMsg(err)
        );
        break;
      case "unrequest":
        requestWeeb(
          { id: userID, type: "remove" },
          (_data) => {
            setStatus("no_request");
          },
          (err) => setErrMsg(err)
        );
        break;
      case "remove":
        addWeeb(
          { id: userID, type: "remove" },
          (_data) => {
            setStatus("no_request");
          },
          (err) => setErrMsg(err)
        );
        break;
    }
  };

  const onCloseModal = () => {
    tryLocalSignin();
    setPicModal(false);
    callback && callback();
  };

  const onLink = (screen, params) => {
    onCloseModal();
    navigation.navigate(screen, params);
  };

  const messageWeeb = () => {
    joinRoom(userID, info._id);
    navigation.navigate("ChatUser", {
      item: {
        _id: info._id,
        username: info.username,
        avatar: info.avatar,
        gender: info.gender,
      },
    });
    setPicModal(false);
    callback && callback();
  };

  const displayImage = () => {
    setDisplayPic({ vis: true, item: imgUri });
  };

  useEffect(() => {
    getUserData(
      {
        id: userID,
        type: "get_account",
        query: "",
      },
      (data) => {
        setStatus(data.status);
        setProfileData([data.user]);
      },
      (err) => {
        setErrMsg(`${err.msg}: ${err.data}`);
      }
    );
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
                <TouchableOpacity
                  disabled={!info?.avatar}
                  activeOpacity={1}
                  onPress={displayImage}
                >
                  <Image
                    source={imgUri}
                    resizeMethod="scale"
                    resizeMode={imgUri.uri ? "cover" : "contain"}
                    style={{
                      ...styles.proPic,
                      borderColor: info.avatar ? colors.primary : colors.light,
                      borderWidth: info.avatar ? 3 : 2,
                    }}
                  />
                </TouchableOpacity>
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
                  title="Instances"
                  count={info.instance_count}
                  onPress={() =>
                    onLink("CharacterList", {
                      type: "otherCharacters",
                      id: info._id,
                    })
                  }
                />
                <Info
                  title="Following"
                  count={info.following}
                  onPress={() =>
                    onLink("CharacterList", {
                      type: "following",
                      id: info._id,
                    })
                  }
                />

                <Info
                  title="Followers"
                  count={info.followers}
                  onPress={() =>
                    onLink("Followers", {
                      type: isMine ? "isMine" : "otherFollowers",
                      id: info._id,
                    })
                  }
                />
              </View>
              <Separator h={1} />
              {status === "weebs" && !isMine ? (
                <View style={styles.btns}>
                  <AppButton
                    icon="close"
                    title="Unweeb"
                    onPress={() => handleAddWeeb("remove")}
                    bare
                    style={styles.followBtn}
                  />
                  <AppButton
                    icon="close"
                    title="Chat"
                    LIcon="chat-outline"
                    onPress={messageWeeb}
                    bare
                    style={{ ...styles.followBtn, marginLeft: 20 }}
                  />
                </View>
              ) : status === "no_request" && !isMine ? (
                <AppButton
                  icon="plus"
                  title="Request"
                  onPress={() => handleAddWeeb("request")}
                  bare
                  style={styles.followBtn}
                />
              ) : status === "requested" ? (
                <AppButton
                  icon="plus"
                  title="Unrequest"
                  onPress={() => handleAddWeeb("unrequest")}
                  bare
                  style={styles.followBtn}
                />
              ) : null}
              <View style={styles.linkCont}>
                <Link
                  name={`${pNoun} Posts`}
                  iconName="image-multiple"
                  onPress={() =>
                    onLink("MyPost", {
                      screen: isMine ? "account" : "accountBox",
                      info: { username: info.username, id: info._id, isMine },
                    })
                  }
                />
                <Link
                  name={`${pNoun} Collection`}
                  iconName="image-multiple"
                  onPress={() =>
                    onLink("Saved", {
                      userID: info._id,
                      username: info.username,
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
      <MediaModal modalObject={displayPic} setVisible={setDisplayPic} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  btns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
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
