import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid";

import AppText from "../components/AppText";
import colors from "../constants/colors";

import { Context as AuthContext } from "../config/AuthContext";
import { Context as ChallContext } from "../config/ChallContext";
import { Context as CharContext } from "../config/CharContext";
import { Context as FeedContext } from "../config/FeedContext";
import { charPropInfos } from "../constants/data_store";
import ActivityIndicator from "../components/ActivityIndicator";
import AlertModal from "../components/AlertModal";
import CharInfoScreen from "./CharInfoScreen";
import CharChallengerScreen from "./CharChallengerScreen";
import TransferInstance from "../components/TransferInstance";
import ShowUpload from "../components/ShowUpload";
import PopUpModal from "../components/PopUpModal";
import InstanceHeader from "../components/InstanceHeader";
import InstanceInvites from "../components/InstanceInvites";
import PopMessage from "../components/PopMessage";
import AppFadeIn from "../components/AppFadeIn";
import InstanceChallenger from "../components/InstanceChallenger";
import { launchGallery } from "../constants/helpers";
import StickyHeader from "../components/StickyHeader";

const { width, height } = Dimensions.get("window");

const dayta = charPropInfos.map((obj) => obj.prop);
const daytaObj = {};
for (let i = 0; i < dayta.length; i++) {
  const e = dayta[i];
  daytaObj[e] = "";
}
//// FOR BETTER PERFORMANCE MAKE THIS SCREEN FETCH A SINGLE CHARACTER FROM DB USING ROUTE DATA
//// LETS GET THAT TO WORK /// 2ND JAN 2021 - DONE

const CharacterScreen = ({ route, navigation }) => {
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const { followChar, getTheCharacter, instanceUpdater } =
    useContext(CharContext);
  const { getShows } = useContext(FeedContext);
  const { withdrawChallenge } = useContext(ChallContext);

  const characterID = route.params.item;

  const [character, setCharacter] = useState({ id: characterID });
  const [errMsg, setErrMsg] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const charID = character?._id;
  const userID = userInfo._id;
  const ownerID = character?.manager?._id;
  const follow = character.followers?.find((obj) => obj._id == userID);

  const challConst = character?.challengers?.find(
    (obj) => obj?.user?._id == userID
  );
  const isMine = userID === ownerID;
  const charFollowers = character?.followers?.length;
  const charFavs = character?.favorites?.length;
  const isFav = character?.favorites?.includes(userID);

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
  const [isCoverLoading, setIsCoverLoading] = useState(false);
  const [isLoading, setIsLoading] = useState({ loader: true, err: false });
  const [transfer, setTransfer] = useState(false);
  const [alertModal, setAlertModal] = useState({ visible: false });
  const [bools, setBools] = useState({ hash: uuid.v4() });
  const [challengerArr, setChallengerArr] = useState(
    character.challengers ?? []
  );
  const [challengeModal, setChallengeModal] = useState({
    vis: false,
    contest: null,
  });
  const [dropDown, setDropDown] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);
  const [showUpload, setShowUpload] = useState({ vis: false, data: null });
  const [popper, setPopper] = useState({ vis: false });

  const isChallenger =
    isMine &&
    challengerArr?.length > 0 &&
    Boolean(challengerArr.find((obj) => obj.pending == true));
  const isInvited = isMine && character?.invites?.length > 0;

  const listItems = [
    {
      id: "5078",
      name: "post media",
      onPress: () => setOpenMedia(!openMedia),
      icon: "upload",
      show: character?.verified && isMine,
      selected: true,
      badge: false,
    },
    {
      id: "2",
      name: "posts",
      onPress: () => handleChangeTab("post"),
      icon: "image-multiple-outline",
      show: true,
      selected: true,
      badge: false,
    },
    {
      id: "23",
      name: "Favorite",
      onPress: () => handleFavPress(),
      icon: "star-outline",
      selected: cardState.fav,
      badge: false,
      show: true,
    },
    {
      id: "1",
      name: "challengers",
      onPress: () => handleChangeTab("challenger"),
      icon: "Trophy",
      iconPack: "AD",
      selected: true,
      show: true,
      badge: isChallenger,
    },
    {
      id: "5q1",
      name: "invites",
      onPress: () => handleInvitePress(),
      icon: "account-plus-outline",
      selected: character?.verified,
      show: isMine,
      badge: isInvited,
    },
    {
      id: "3",
      name: "New event",
      onPress: () =>
        navigation.navigate("Event", {
          instance: "character",
          instanceID: character?._id,
          followers: character?.followers?.length,
        }),
      icon: "plus",
      iconPack: "F",
      show: character?.verified && isMine,
      selected: true,
      badge: false,
    },
    {
      id: "873",
      name: isMine ? "Lose Character" : follow ? "Unfollow" : "Follow",
      onPress: () => handleFollowPress(),
      icon: "account-remove-outline",
      show: true,
      selected: follow,
      badge: false,
    },
  ];

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
    leftColor: cardState.selected,
    verified: character.verified,
    verifiedList: character.verifiedList,
    followers: character?.followers?.length,
    coverLoading: isCoverLoading,
    setCoverLoading: setIsCoverLoading,
    badge: Boolean(isChallenger || isInvited),
    owner: character?.manager,
    handleLeftPress: () => handleFollowPress(),
    screenAlias: `character@${character?._id}`,
    handleRightPress: null,
  };

  const handleStatusVisibility = (bool) => {
    if (bool) {
      setPopper({ vis: true, type: "success", msg: "Story uploaded" });
    }
    setShowUpload({ vis: false, data: null });
    setOpenMedia(false);
  };

  const handleFetchCharacter = (type = "cover", cb, popData) => {
    const isCover = type === "cover";
    const isLoader = type === "load";

    isCover && setIsCoverLoading(true);

    getTheCharacter(
      characterID,
      (data) => {
        setCharacter(data);
        isLoader && setIsLoading({ loader: false, err: false });
        isCover && setIsCoverLoading(false);
        cb && cb("success");
        if (popData) {
          setPopper({
            vis: true,
            msg: popData.msg,
            type: popData.type,
          });
        }
      },
      (err) => {
        isLoader && setIsLoading({ loader: true, err: true });
        isCover && setIsCoverLoading(false);
        setErrMsg(
          err.err?.response?.data === "deleted_instance"
            ? "Character has been deleted"
            : err.msg
        );
        cb && cb("failed");
        if (popData) {
          setPopper({
            vis: true,
            msg: popData.msg,
            type: popData.type,
          });
        }
      }
    );
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

  const handleCharacterTransfer = () => {
    setTransfer(true);
  };

  const handleNewPost = async () => {
    // LIMIT INSTANCE POSTS
    const { results } = await launchGallery("all");
    if (results) {
      navigation.navigate("Post", {
        assets: results,
        type: "character",
        id: charID,
        // id: params?.info?.id,
        screenAlias: ["Character"],
        hash: bools.hash,
        fromScreen: "Character",
        name: character?.name,
      });
    }
    setOpenMedia(false);
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
    if (cardState.selected && isMine) {
      setAlertModal({
        visible: true,
        title: "Lose Character",
        message: `You're going to lose ${character.name.toUpperCase()} if you unfollow`,
        btn: "LOSE",
        type: "unfollowC",
      });
    } else if (cardState.selected && !isMine) {
      setAlertModal({
        visible: true,
        title: "Unfollow Character",
        message: `Are you sure you want to miss out on ${character.name.toUpperCase()} feeds?`,
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
    withdrawChallenge(data, (res) => {
      handleFetchCharacter("cover", (type) => {
        setPopper({
          type,
          msg: `Challenge withdrawn ${
            type === "failed" ? "un" : ""
          }successfully`,
          vis: true,
        });
      });
    });
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

    const { results, _error } = await launchGallery(
      "all",
      false,
      false,
      null,
      45
    );

    if (results) {
      // setIsCoverLoading(true);

      const statusObj = {
        instance: "character",
        instanceID: character._id,
        post: {
          ...results[0],
        },
      };

      setShowUpload({ vis: true, data: statusObj });
    } else if (_error) {
      return setPopper({
        type: "failed",
        vis: true,
        msg: _error,
      });
    }
  };

  const handleCoverChange = async (type) => {
    if (!character.verified) {
      return setPopper({
        type: "failed",
        vis: true,
        msg: "Character is yet to be verified",
      });
    }

    const { results } = await launchGallery("image", true, false, [12, 14]);
    if (results) {
      setIsCoverLoading(true);
      const dataObj = {
        action: "cover",
        actionData: results[0],
        instance: "character",
        instanceID: character._id,
        media: true,
      };

      instanceUpdater(
        dataObj,
        (resData) => {
          const newData = { ...character };
          newData.cover_photo = resData?.updater?.cover_photo;
          setCharacter(newData);

          setIsCoverLoading(false);
          setOpenMedia(false);
        },
        (err) => {
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
      <>
        <InstanceHeader
          instanceData={headerData}
          RenderInstanceContent={() => (
            <CharInfoScreen
              challenged={challConst}
              handleChangeTab={handleChangeTab}
              handleWithdrawChallenge={handleWithdrawChallenge}
              handleCharacterTransfer={handleCharacterTransfer}
              cardState={cardState}
              isMine={isMine}
              setPopper={setPopper}
              character={character}
              setChallengeModal={setChallengeModal}
            />
          )}
        />
      </>
    );
  };

  const RenderInstanceMedia = ({ style }) => {
    return (
      <View style={[styles.instanceMedia, style]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            marginTop: width * 0.05,
          }}
        >
          <TouchableOpacity
            onPress={() => handleCoverChange("cover")}
            activeOpacity={0.8}
            style={{ alignSelf: "center", alignItems: "center" }}
          >
            <Feather name="user" size={width * 0.1} color={colors.primary} />
            <AppText style={{ textAlign: "center" }} bold>
              New Cover
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ alignSelf: "center", alignItems: "center" }}
            onPress={handleUploadStaus}
          >
            <Ionicons
              name="ellipse-outline"
              size={width * 0.1}
              color={colors.primary}
            />

            <AppText style={{ textAlign: "center" }} bold>
              Story
            </AppText>
          </TouchableOpacity>
        </View>
        {isMine && (
          <View style={{ marginTop: 25 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ alignSelf: "center", alignItems: "center" }}
              onPress={handleNewPost}
            >
              <Ionicons
                name="camera-outline"
                size={width * 0.1}
                color={colors.primary}
              />

              <AppText style={{ textAlign: "center" }} bold>
                New Post
              </AppText>
            </TouchableOpacity>
          </View>
        )}
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
    setChallengerArr(character.challengers);
  }, [character]);

  useEffect(() => {
    handleFetchCharacter("load");
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <View style={styles.flatPost}>
        {!isLoading.loader ? (
          <View>
            <Animated.FlatList
              data={["OTAKU"]}
              keyExtractor={(item, index) => item + index}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              onRefresh={handleScreenRefresh}
              contentContainerStyle={{ paddingBottom: height * 0.05 }}
              overScrollMode="never"
              renderItem={renderPage}
            />
            <StickyHeader scrollY={scrollY} title={character.name} />
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
              setChallengeModal={setChallengeModal}
              handleChangeTab={handleChangeTab}
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
              callback={() => handleFetchCharacter("load")}
              instance={{
                name: character.name,
                id: character._id,
                type: "character",
              }}
            />
          )}
        />

        <InstanceChallenger
          visible={challengeModal.vis}
          data={{
            instance: "character",
            id: character._id,
            name: character?.name,
            owner: character?.manager,
            isFollowing: cardState.selected,
            contest: challengeModal.contest,
          }}
          fetchInstance={handleFetchCharacter}
          setter={() => setChallengeModal({ vis: null, contest: null })}
        />
        <ShowUpload
          visObj={showUpload}
          hash={{
            value: bools.hash,
          }}
          setVisible={handleStatusVisibility}
        />
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
    paddingBottom: width * 0.08,
    paddingTop: width * 0.04,
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
