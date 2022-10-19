import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons } from "@expo/vector-icons";

import AppText from "../components/AppText";
import colors from "../constants/colors";

import { Context as AuthContext } from "../config/AuthContext";
import { Context as ChallContext } from "../config/ChallContext";
import { Context as CharContext } from "../config/CharContext";
import { Context as FeedContext } from "../config/FeedContext";
import charPropInfos from "../constants/characterInfoProps";
import ActivityIndicator from "../components/ActivityIndicator";
import DropDown from "../components/DropDown";
import AlertModal from "../components/AlertModal";
import characterRole from "../constants/characterRoles";
import characterTypes from "../constants/characterTypes";
import PopModal from "../components/PopModal";
import CharInfoScreen from "./CharInfoScreen";
import CharChallengerScreen from "./CharChallengerScreen";
import Events from "../components/Events";
import ChallengeForm from "../components/ChallengeForm";
import TransferInstance from "../components/TransferInstance";
import ShowUpload from "../components/ShowUpload";
import PopUpModal from "../components/PopUpModal";
import InstanceHeader from "../components/InstanceHeader";
import InstanceInvites from "../components/InstanceInvites";
import PopMessage from "../components/PopMessage";
import AppFadeIn from "../components/AppFadeIn";

const { width, height } = Dimensions.get("window");

const dayta = charPropInfos.map((obj) => obj.prop);
const daytaObj = {};
for (let i = 0; i < dayta.length; i++) {
  const e = dayta[i];
  daytaObj[e] = "";
}

const CharacterScreen = ({ route, navigation }) => {
  //// FOR BETTER PERFORMANCE MAKE THIS SCREEN FETCH A SINGLE CHARACTER FROM DB USING ROUTE DATA
  //// LETS GET THAT TO WORK /// 2ND JAN 2021 - DONE
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const { followChar, getTheCharacter, instanceUpdater } =
    useContext(CharContext);
  const { getShows } = useContext(FeedContext);
  const {
    charChallengeTwo,
    startChallengeTwo,
    startChallengeTwoB,
    startInfoChallenge,
    withdrawChallenge,
  } = useContext(ChallContext);

  const characterID = route.params.item;

  const [character, setCharacter] = useState([]);
  const [errMsg, setErrMsg] = useState(null);

  const charID = character?._id;
  const asp = { width: 1, height: 1 };
  const userID = userInfo._id;
  const ownerID = character?.owner?._id;
  const followingArr = userInfo.following;
  const checkerArr = followingArr?.filter((obj) => obj._id === charID);
  const challengerIds = character?.challengers?.map((obj) => obj.user._id);
  const challConst = challengerIds?.includes(userID);
  const isMine = userID === ownerID;
  const charFollowers = character?.followers?.length;
  const charFavs = character?.favorites?.length;
  const isFav = character?.favorites?.includes(userID);
  const follow = checkerArr?.map((obj) => obj._id).includes(charID);

  const [characterTab, setCharacterTab] = useState({
    post: false,
    info: true,
    challengers: false,
    invites: false,
  });
  const [cardState, setCardState] = useState({
    liked: charFollowers,
    selected: follow,
    thumb: false,
    fav: isFav,
    favNum: charFavs,
  });
  const [asset, setAsset] = useState(asp);
  const [modalVis, setModalVis] = useState(false);
  const [isCoverLoading, setIsCoverLoading] = useState(false);
  const [isLoading, setIsLoading] = useState({ loader: true, err: false });
  const [transfer, setTransfer] = useState(false);
  const [alertModal, setAlertModal] = useState({ visible: false });
  const [isStarting, setIsStarting] = useState(false);
  const [challengerArr, setChallengerArr] = useState(character.challengers);
  const [challenged, setChallenged] = useState(challConst);
  const [challenger, setChallenger] = useState(null);
  const [challengeType, setChallengeType] = useState(null);
  const [dropDown, setDropDown] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);
  const [badInfoData, setBadInfoData] = useState(charPropInfos);
  const [infoContest, setInfoContest] = useState(daytaObj);
  const [infoModal, setInfoModal] = useState({ vis: false, type: null });
  const [showUpload, setShowUpload] = useState({ vis: false, data: null });
  const [popper, setPopper] = useState({ vis: false });

  const listItems = [
    {
      id: "5078",
      name: "upload media",
      onPress: () => setOpenMedia(!openMedia),
      icon: "upload",
      show: character?.verified && isMine,
      selected: true,
    },
    {
      id: "2",
      name: "posts",
      onPress: () => handleChangeTab("post"),
      icon: "image-multiple",
      show: true,
      selected: true,
    },
    {
      id: "23",
      name: "Favorite",
      onPress: () => handleFavPress(),
      icon: "star",
      selected: cardState.fav,
      show: true,
    },
    {
      id: "1",
      name: "challengers",
      onPress: () => handleChangeTab("challenger"),
      icon: "ninja",
      selected: true,
      show: true,
    },
    {
      id: "5q1",
      name: "invites",
      onPress: () => handleInvitePress(),
      icon: "account-plus",
      selected: character?.verified,
      show: isMine,
    },

    {
      id: "3",
      name: "New event",
      onPress: () =>
        navigation.navigate("Event", {
          instance: "character",
          instanceID: character?._id,
        }),
      icon: "plus",
      show: character?.verified && isMine,
      selected: true,
    },
    {
      id: "873",
      name: isMine ? "Lose Character" : follow ? "Unfollow" : "Follow",
      onPress: () => handleFollowPress(),
      icon: "account-star",
      show: true,
      selected: follow,
    },
  ];
  const leftColor = cardState.selected ? colors.heart : colors.medium;

  const headerData = {
    cover_photo: character.cover_photo,
    description: "CHARACTER INFO",
    name: character.gender,
    dropDown,
    setDropDown,
    feedback: {
      instanceID: charID,
      finder: character?.verifiedList?.find((obj) => obj.user == userInfo._id),
      instanceName: character?.name,
      instanceShow: character?.show?.name_j ?? character?.show?.name_e,
      instance: "character",
    },
    listItems,
    leftColor,
    verified: character.verified,
    verifiedList: character.verifiedList,
    followers: character?.followers?.length,
    coverLoading: isCoverLoading,
    owner: character.owner,
    handleLeftPress: () => handleFollowPress(),
    handleRightPress: null,
  };

  const handleStatusVisibility = (bool) => {
    if (bool) {
      setPopper({ vis: true, type: "success", msg: "Story uploaded" });
    }
    setShowUpload({ vis: false, data: null });
  };

  const handleScreenRefresh = () => {
    setRefreshing(true);
    getTheCharacter(
      characterID,
      (data) => {
        setCharacter(data);
        setRefreshing(false);
      },
      (err) => {
        setErrMsg(err);
        setRefreshing(false);
      }
    );
  };

  const handleContest = async (type) => {
    if (type === "image") {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (result.cancelled) return;
      setAsset(result);
    } else if (type === "video") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });
      if (result.cancelled) return;
      if (result.duration > 60 * 1000) {
        return setPopper({
          vis: true,
          type: "failed",
          msg: "Video max length of 60s exceeded",
        });
      }
      setAsset(result);
    } else if (type === "info") {
      setAsset({ type: "info" });
    } else if (type === "fresh") {
      if (!userInfo.verified) {
        // koop
        setPopper({
          vis: true,
          type: "failed",
          msg: "Please verify your account!",
        });
        return;
      }
      if (!character.verified) {
        // koop
        setPopper({
          vis: true,
          type: "failed",
          msg: "Character is yet to be verified!",
        });
        return;
      }
      follow
        ? setModalVis(true)
        : setAlertModal({
            visible: true,
            title: "Follow Character",
            message: `You need to follow ${character?.name?.toUpperCase()} to challenge character`,
            btn: "YES",
            type: "followC",
          });
    }
  };

  const handleInvitePress = () => {
    setCharacterTab({ ...characterTab, invites: true });
  };

  const handleOkAlert = () => {
    if (alertModal.type === "followC") {
      updateCardState(true);
      followChar({ charID, userID, route: "follow" }, null, (err) =>
        setPopper({
          vis: true,
          msg: err.msg,
          type: "failed",
        })
      );
    } else if (alertModal.type === "unfollowC") {
      updateCardState(false);
      followChar({ charID, userID, route: "unfollow" }, null, (err) =>
        setPopper({
          vis: true,
          msg: err.msg,
          type: "failed",
        })
      );
    }
  };

  const handleStartChallenge = (type) => {
    setIsStarting(true);
    if (type === "challenge" && asset.type !== "info") {
      if (!asset.uri) return setErrMsg("Please provide your contest info");
      const dataChallenge = {
        instanceID: charID,
        owner: ownerID,
        instance: "character",
        media: asset,
        type: asset.type,
      };

      charChallengeTwo(
        dataChallenge,
        () => {
          setChallenged(true);
          setModalVis(false);
          setErrMsg(null);
          setIsStarting(false);
        },
        (err) => {
          setErrMsg(err);
          setIsStarting(false);
        }
      );
    } else if (type === "challenge" && asset.type === "info") {
      // ISSUE DEY
      if (!infoContest) return setErrMsg("Please provide your contest info");
      setErrMsg(null);
      const cData = {
        data: infoContest,
        instanceID: character._id,
        instance: "character",
      };
      startChallengeTwoB(
        cData,
        () => {
          setChallenged(true);
          setModalVis(false);
          setIsStarting(false);
        },
        (err) => {
          setIsStarting(false);
          setErrMsg(err.msg);
        }
      );
    } else if (type === "accept") {
      if (challengeType !== "info") {
        if (!asset.uri) return setErrMsg("Please provide your contest info");
        const dataAccept = {
          instanceID: charID,
          instance: "character",
          owner: ownerID,
          challengerMedia: challenger.challengerMedia,
          ownerMedia: asset,
          challengeID: challenger._id,
          challenger: challenger.user._id,
          type: asset.type,
        };

        startChallengeTwo(dataAccept, () => {
          getTheCharacter(
            characterID,
            (data) => {
              setCharacter(data);
            },
            (err) => setErrMsg(err)
          );
          setChallenged(true);
          setAsset(asp);
          setModalVis(false);
          setIsLoading({ loader: false, err: false });
        });
      } else {
        setAsset({ type: "info_start" });
        const dataAccept = {
          instanceID: charID,
          instance: "character",
          owner: ownerID,
          challengeID: challenger._id,
        };
        startInfoChallenge(dataAccept, (resData) => {
          getTheCharacter(
            characterID,
            (data) => {
              setCharacter(data);
            },
            (err) => setErrMsg(err)
          );
          setChallenged(true);
          setAsset(asp);
          setModalVis(false);
          setIsStarting(false);
          setIsLoading({ loader: false, err: false });
        });
      }
    }
  };

  const handleCharacterTransfer = () => {
    setTransfer(true);
  };

  const updateThisInstance = (prop, val) => {
    const oldCharObj = { ...character };
    oldCharObj[prop] = val;
    setCharacter(oldCharObj);
  };

  const handleChangeTab = (type) => {
    switch (type) {
      case "info":
        setCharacterTab({ post: false, info: true, challengers: false });
        break;
      case "post":
        const navObj = {
          id: character._id,
          name: character?.name,
          verified: character?.verified,
          isMine,
        };
        navigation.navigate("MyPost", {
          screen: "character",
          data: character?.posts,
          info: navObj,
        });
        break;
      case "challenger":
        setCharacterTab({
          post: false,
          info: false,
          invites: false,
          challengers: true,
        });
        break;
      default:
        console.log(type);
        break;
    }
  };

  const updateCardState = (bool = null, fav = null) => {
    if (bool !== null) {
      setCardState({
        ...cardState,
        selected: bool,
        liked: bool ? cardState.liked + 1 : cardState.liked - 1,
      });
    } else if (fav != null) {
      setCardState({
        ...cardState,
        fav,
        favNum:
          fav === null
            ? cardState.favNum
            : fav
            ? cardState.favNum + 1
            : cardState.favNum - 1,
      });
      if (fav) {
        setPopper({
          vis: true,
          type: "success",
          msg: "Character added to favorites",
        });
      }
    }
    ////  SOMETHING WRONG BELOW
    getShows();
  };

  const handleFollowPress = () => {
    if (follow && isMine) {
      setAlertModal({
        visible: true,
        title: "Lose Character",
        message: `You're going to lose ${character.name.toUpperCase()} if you unfollow`,
        btn: "LOSE",
        type: "unfollowC",
      });
    } else if (follow && !isMine) {
      setAlertModal({
        visible: true,
        title: "Unfollow Character",
        message: `Are you sure you really want to unfollow ${character.name.toUpperCase()}?`,
        btn: "YES",
        type: "unfollowC",
      });
    } else {
      updateCardState(true);
      followChar({ charID, userID, route: "follow" }, null, (err) => {
        setPopper({
          vis: true,
          msg: err.msg,
          type: "failed",
        });
      });
    }
  };

  const handleWithdrawChallenge = () => {
    const data = {
      instanceID: character._id,
      instance: "character",
    };
    withdrawChallenge(
      data,
      (res) => {
        setChallenged(false);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const handleUploadStaus = async () => {
    // TODO:: UPDATE ONLY THE COVER FIELD IN THE CHARACTER OBJ
    if (!character?.verified) {
      return setPopper({
        type: "failed",
        vis: true,
        msg: "Character is yet to be verified",
      });
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      videoMaxDuration: 15,
    });

    if (!res.cancelled) {
      // setIsCoverLoading(true);
      const vidMaxLength = 45 * 1000;
      if (res.type === "video" && res.duration > vidMaxLength) {
        return setPopper({
          type: "failed",
          vis: true,
          msg: "Video length exceeds 45 seconds",
        });
      }

      const statusObj = {
        instance: "character",
        instanceID: character._id,
        post: {
          ...res,
        },
      };
      delete statusObj.post.cancelled;

      setShowUpload({ vis: true, data: statusObj });
    }
  };

  const handleCoverChange = async (type) => {
    if (type === "room" && !character.verified) {
      return setPopper({
        type: "failed",
        vis: true,
        msg: "Character is yet to be verified",
      });
    }
    // TODO:: UPDATE ONY THE COVER FIELD IN THE CHARACTER OBJ
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [12, 14],
    });
    if (!res.cancelled) {
      setIsCoverLoading(true);
      const dataObj = {
        action: "cover",
        actionData: res,
        instance: "character",
        instanceID: character._id,
        media: true,
      };
      if (type === "room") {
        dataObj.action = "room_cover";
      }
      instanceUpdater(
        dataObj,
        (resData) => {
          if (type === "cover") {
            const newData = { ...character };
            newData.cover_photo = resData.cover_photo;
            setCharacter(newData);
          } else {
            setPopper({
              vis: true,
              type: "success",
              msg: "Rooom cover updated successfully",
            });
          }
          setIsCoverLoading(false);
          setOpenMedia(false);
        },
        (err) => {
          console.log(err?.err?.response?.data);
          setErrMsg(err);
          setIsCoverLoading(false);
        }
      );
    }
  };

  const handleFavPress = () => {
    const data = {
      character: character?._id,
      route: "favorite",
    };
    let bool = false;
    if (cardState.fav) {
      bool = false;
      data.type = "remove";
    } else {
      //fav
      bool = true;
      data.type = "add";
    }
    updateCardState(null, bool);
    followChar(data, null, (err) => {
      setPopper({
        type: "failed",
        vis: true,
        msg: err.msg,
      });
    });
  };

  const renderPage = ({ item }) => {
    return (
      <View>
        <InstanceHeader instanceData={headerData} />
        <CharInfoScreen
          challenged={challenged}
          handleChangeTab={handleChangeTab}
          handleWithdrawChallenge={handleWithdrawChallenge}
          handleCharacterTransfer={handleCharacterTransfer}
          cardState={cardState}
          isMine={isMine}
          character={character}
          handleContest={handleContest}
        />
      </View>
    );
  };

  const handleInfoPress = (item, show) => {
    const editable = ["role", "type"].includes(item.prop);
    if (editable && show) {
      setInfoModal({ vis: true, type: item.prop });
    }
    const copyArr = [...badInfoData];
    const ind = copyArr.findIndex((obj) => obj.prop === item.prop);
    if (copyArr[ind].selected && !show) {
      copyArr[ind] = { ...item, selected: false };
      setInfoContest(daytaObj);
    } else {
      copyArr[ind] = { ...item, selected: true };
    }
    setBadInfoData(copyArr);
  };

  const handleContestTextChange = (val, prop) => {
    setInfoContest({ ...infoContest, [prop]: val });
  };

  const RenderInstanceMedia = ({ style }) => {
    return (
      <View style={[styles.instanceMedia, style]}>
        <View>
          <TouchableOpacity
            onPress={() => handleCoverChange("cover")}
            activeOpacity={0.8}
            style={{ alignSelf: "center" }}
          >
            <Feather name="user" size={width * 0.1} color={colors.primary} />
            <AppText style={{ textAlign: "center" }} bold>
              Cover
            </AppText>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              marginTop: width * 0.05,
            }}
          >
            <TouchableOpacity activeOpacity={0.8} onPress={handleUploadStaus}>
              <Ionicons
                name="ellipse-outline"
                size={width * 0.1}
                color={colors.primary}
              />

              <AppText style={{ textAlign: "center" }} bold>
                Story
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCoverChange("room")}
              activeOpacity={0.8}
            >
              <Ionicons
                name="images-outline"
                size={width * 0.1}
                color={colors.primary}
              />

              <AppText style={{ textAlign: "center" }} bold>
                Room Cover
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    setCardState({
      ...cardState,
      liked: charFollowers,
      selected: follow,
      fav: isFav,
      favNum: charFavs,
    });
    setChallenged(challConst);
    setChallengerArr(character.challengers);
  }, [character]);

  useEffect(() => {
    getTheCharacter(
      characterID,
      (data) => {
        setCharacter(data);
        setIsLoading({ loader: false, err: false });
      },
      (err) => {
        setIsLoading({ loader: true, err: true });
        setErrMsg(
          err.err?.response?.data === "deleted_instance"
            ? "Character has been deleted"
            : err.msg
        );
      }
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <View style={styles.flatPost}>
        {!isLoading.loader ? (
          <View>
            <FlatList
              data={["OTAKU"]}
              keyExtractor={(item, index) => item + index}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={handleScreenRefresh}
              contentContainerStyle={{ paddingBottom: width * 0.035 }}
              overScrollMode="never"
              renderItem={renderPage}
            />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <ActivityIndicator
              visible={!isLoading.err}
              style={styles.activity}
              type="spin"
            />
            <ActivityIndicator
              visible={isLoading.err}
              style={styles.activity}
              type="isEmpty"
              text={errMsg}
            />
          </View>
        )}
      </View>
      <>
        <PopModal
          modalVis={infoModal.vis}
          setModalVis={setInfoModal}
          data={infoModal.type === "role" ? characterRole : characterTypes}
          handleDropdown={(val) => handleContestTextChange(val, infoModal.type)}
        />
        <TransferInstance
          visible={transfer}
          updateThisInstance={updateThisInstance}
          instanceID={character._id}
          setVisible={setTransfer}
        />
        <PopUpModal
          visible={characterTab.challengers}
          setter={() =>
            setCharacterTab({ ...characterTab, challengers: false })
          }
          ContentComponent={() => (
            <CharChallengerScreen
              challengerArr={challengerArr}
              name={character?.name}
              setChallengeType={setChallengeType}
              handleChangeTab={handleChangeTab}
              setModalVis={setModalVis}
              setChallenger={setChallenger}
              isMine={isMine}
            />
          )}
        />
        <PopUpModal
          visible={characterTab.invites}
          setter={() => setCharacterTab({ ...characterTab, invites: false })}
          ContentComponent={() => (
            <InstanceInvites
              data={character.invites}
              setVisible={() =>
                setCharacterTab({ ...characterTab, invites: false })
              }
              instance={{
                name: character.name,
                id: character._id,
                type: "character",
              }}
            />
          )}
        />
        <DropDown
          lists={listItems}
          visible={dropDown}
          setVisible={setDropDown}
        />
        <ShowUpload visObj={showUpload} setVisible={handleStatusVisibility} />
        <AlertModal
          obj={alertModal}
          setVisible={setAlertModal}
          onPress={handleOkAlert}
        />
        <PopMessage
          popData={popper}
          timer={0.45}
          setter={() => setPopper({ vis: false })}
        />
        <AppFadeIn
          visible={openMedia}
          RenderComponent={RenderInstanceMedia}
          setVisible={setOpenMedia}
        />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width,
    height,
  },
  error: {
    textAlign: "center",
    color: colors.heart,
    marginVertical: 5,
  },

  ballHead: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ballIcons: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 6,
  },
  btnAction: {
    width: "65%",
    alignSelf: "center",
    marginTop: 15,
  },
  charInfo: {
    marginTop: 15,
  },
  emptyPic: {
    width: 130,
    height: 130,
  },
  flatPost: {
    // alignItems: "center",
    flex: 1,
  },
  imageContaineer: {
    width: width,
    height: height * 0.59,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  instanceMedia: {
    width: width * 0.5,
    backgroundColor: colors.white,
    borderRadius: width * 0.03,
    justifyContent: "center",
    paddingVertical: width * 0.04,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    bottom: 130 / 2,
  },

  links: {
    alignSelf: "center",
    width: width * 0.5,
  },
  listFooter: {
    bottom: 45,
    flex: 1,
  },
  margin: {
    bottom: 50,
  },

  modalBtn: {
    marginTop: 6,
    width: width * 0.55,
    alignSelf: "center",
  },

  modalLoad: {
    position: "absolute",
    zIndex: 1,
    height: "100%",
    borderRadius: 15,
    width: "100%",
  },
  modalDisplay: {
    backgroundColor: colors.white,
    marginBottom: 30,
    width: "90%",
    maxHeight: height * 0.6,
    alignSelf: "center",
    borderRadius: 20,
  },

  modalImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  modalCont: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalView: {
    backgroundColor: colors.white,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    paddingBottom: 20,
  },

  user: {
    textAlign: "center",
    bottom: 54,
  },
  tab: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.white,
    alignItems: "flex-start",
    top: 5,
  },
  tabText: {
    fontSize: 10,
    color: colors.medium,
    textAlign: "center",
    padding: 9,
  },
  tabItems: {
    width: "33%",
  },
  post: {
    margin: 10,
  },
  postCollection: {
    marginTop: 15,
  },
  postStat: {
    textAlign: "center",
    marginTop: 15,
    textTransform: "capitalize",
  },
  vidCont: {
    width: width,
    height: height * 0.7,
  },
  vidContent: {
    maxHeight: height * 0.65,
  },
});
export default CharacterScreen;
