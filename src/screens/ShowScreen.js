import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, FlatList, Animated } from "react-native";
import { Viewport } from "@skele/components";
import { StatusBar } from "expo-status-bar";

import { Context as FeedContext } from "../config/FeedContext";
import { Context as CharContext } from "../config/CharContext";
import { Context as AuthContext } from "../config/AuthContext";
import { Context as ChallContext } from "../config/ChallContext";

import AppText from "../components/AppText";
import colors from "../constants/colors";
import ActivityIndicator from "../components/ActivityIndicator";
import Separator from "../components/Separator";
import GroupCard from "../components/GroupCard";
import AlertModal from "../components/AlertModal";
import ChallengeCard from "../components/ChallengeCard";
import PopMessage from "../components/PopMessage";
import CharChallengerScreen from "./CharChallengerScreen";
import PopUpModal from "../components/PopUpModal";
import TransferInstance from "../components/TransferInstance";
import AppButton from "../components/AppButton";
import ShowUpload from "../components/ShowUpload";
import InfoBox from "../components/InfoBox";
import InstanceHeader from "../components/InstanceHeader";
import StickyHeader from "../components/StickyHeader";
import InstanceChallenger from "../components/InstanceChallenger";

import { showInfoProps } from "../constants/data_store";
import { capFirstLetter, launchGallery } from "../constants/helpers";

const { width, height } = Dimensions.get("window");
const dayta = showInfoProps.map((obj) => obj.prop);
const daytaObj = {};
for (let i = 0; i < dayta.length; i++) {
  const e = dayta[i];
  daytaObj[e] = "";
}
const hider = [
  "__v",
  "cover_photo",
  "_id",
  "isManga",
  "manager",
  "verified",
  "instance_creator",
  "verifiedList",
  "name_j",
  "name_e",
];
const counter = ["characters", "groups", "followers", "posts", "challengers"];

const ShowScreen = ({ route, navigation }) => {
  const { getShows, followInstance } = useContext(FeedContext);
  const { withdrawChallenge } = useContext(ChallContext);
  const { instanceUpdater } = useContext(CharContext);

  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const [dataState, setDataState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCoverLoading, setIsCoverLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [transfer, setTransfer] = useState(false);
  const [popper, setPopper] = useState({ vis: false });

  const [challengerArr, setChallengerArr] = useState(
    dataState?.challengers ?? []
  );
  const [alertModal, setAlertModal] = useState({ visible: false });
  const [modalVis, setModalVis] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [pageInfo, setPageInfo] = useState([]);
  const [challengeModal, setChallengeModal] = useState({
    vis: false,
    contest: null,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [challenged, setChallenged] = useState(false);
  const [showUpload, setShowUpload] = useState({ vis: false, data: null });

  const show = route.params.show;
  // show = { cover_photo, _id }
  const isFollowing =
    dataState.followers && dataState.followers.includes(userInfo._id);

  const isMine = dataState.manager && dataState.manager._id === userInfo._id;
  const scrollY = useRef(new Animated.Value(0)).current;

  const listItems = [
    {
      id: "5078",
      name: "upload story",
      onPress: () => handleUploadStory(),
      icon: "circle-outline",
      show: isMine,
      selected: true,
    },
    {
      id: "5",
      name: "update cover",
      selected: true,
      onPress: () => {
        if (checkIsVerified()) {
          handleNewCover();
        }
      },
      icon: "reload",
      show: isMine,
    },
    {
      id: "2",
      name: "posts",
      onPress: () => navigateToPosts(),
      icon: "image-multiple",
      selected: true,
      show: true,
    },
    {
      id: "1",
      name: "challenge",
      onPress: () => {
        if (!checkIsVerified()) return;
        setChallengeModal({ vis: true, contest: { mode: "start" } });
      },
      icon: "trophy-outline",
      selected: true,
      show: !isMine && !challenged,
    },
    {
      id: "169576",
      name: "Withdraw challenge",
      onPress: () => handleWithdrawChallenge(),
      icon: "trophy-outline",
      selected: true,
      show: !isMine && challenged,
    },
    {
      id: "7",
      name: "challengers",
      onPress: () => setModalVis(true),
      icon: "trophy",
      selected: true,
      show: true,
    },
    {
      id: "3",
      name: "New event",
      onPress: () => {
        if (!checkIsVerified()) return;
        navigation.navigate("Event", {
          instance: "show",
          instanceID: dataState._id,
        });
      },
      selected: true,
      icon: "plus",
      show: isMine,
    },
    {
      id: "35t74085",
      name: "Transfer show",
      onPress: () => {
        if (!checkIsVerified()) return;
        setTransfer(true);
      },
      selected: true,
      icon: "transfer",
      show: isMine,
    },
  ];

  const headerObj = {
    _id: dataState?._id,
    name: `${
      dataState?.name_j && dataState?.name_e && dataState?.name_e != "none"
        ? dataState.name_j + "\n" + "(" + dataState.name_e + ")"
        : dataState?.name_j ?? dataState?.name_e
    }`,
    description: `By ${dataState.creator}`,
    cover_photo: dataState?.cover_photo,
    owner: dataState?.manager,
    screenIcon: "ios-tv",
    feedback: {
      instanceID: dataState?._id,
      finder: dataState?.verifiedList?.find((obj) => obj.user == userInfo._id),
      instanceName: dataState?.name_j ?? dataState?.name_e,
      instanceShow: null,
      instance: "show",
    },
    namePosition: "left",
    listItems,
    coverLoading: isCoverLoading,
    handleLeftPress: () => handleFollowShow(),
    leftColor: isFollowed ? colors.heart : colors.medium,
    subscribers: null,
    verified: dataState.verified,
    verifiedList: dataState?.verifiedList,
    followers: dataState?.followers?.length,
    handleRightPress: null,
  };

  const getMyShows = (type) => {
    const isRefresh = type === "refresh";
    const isFetch = type === "fetch";
    const isCover = type === "cover";

    isFetch && setIsLoading(true);
    isRefresh && setRefreshing(true);
    isCover && setIsCoverLoading(true);

    getShows(
      show._id,
      (data) => {
        const dataArr = [];
        setDataState(data);
        //data = {};
        for (const key in data) {
          let name = key;
          let val;

          if (Object.hasOwnProperty.call(data, key)) {
            const e = data[key];
            val = e;
            if (hider.includes(key)) continue;
            switch (key) {
              case "other_names":
                name = "other names";
                break;
              case "subGenres":
                name = "other genres";
                break;
              case "genres":
                name = "main genres";
                break;
              case "releaseDate":
                name = "release date";
                break;

              case "startDate":
                name = "start date";
                break;

              default:
                break;
            }

            if (counter.includes(key)) val = e?.length?.toString();

            dataArr.push({ prop: name, value: val });
          }
        }
        setPageInfo(dataArr);
        isFetch && setIsLoading(false);
        isRefresh && setRefreshing(false);
        isCover && setIsCoverLoading(false);
      },
      (err) => {
        setErrMsg(err.data ?? err.msg);
        isFetch && setIsLoading(false);
        isRefresh && setRefreshing(false);
        isCover && setIsCoverLoading(false);
      }
    );
  };

  const handleNewCover = async () => {
    const { results } = await launchGallery("image", true, false, [30, 25]);
    if (results) {
      setIsCoverLoading(true);
      const dataObj = {
        action: "cover",
        actionData: results[0],
        instance: "show",
        instanceID: dataState._id,
        media: true,
      };
      instanceUpdater(
        dataObj,
        (resData) => {
          const newData = { ...dataState };
          newData.cover_photo = resData.cover_photo;
          setDataState(newData);
          setIsCoverLoading(false);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };

  const handleOkAlert = () => {
    if (alertModal.type === "followC") {
      //follow show
      // followChar({ charID, userID }, "follow", () => follows(true));
      console.log("Followed");
    } else if (alertModal.type === "unfollowC") {
      // unfollow show
      // followChar({ charID, userID }, "unfollow", () => follows(false));
      console.log("Un - Followed");
    }
  };

  const checkIsVerified = () => {
    if (!dataState?.verified) {
      setPopper({
        vis: true,
        msg: `${capFirstLetter(
          dataState?.name_j ?? dataState?.name_e
        )} instance not verified yet`,
        type: "failed",
      });
      return false;
    }
    return true;
  };

  const navigateToPosts = () => {
    const navObj = {
      id: dataState._id,
      name: dataState?.name_j || dataState?.name_e,
      verified: dataState?.verified,
      isMine,
    };
    navigation.navigate("MyPost", {
      screen: "show",
      data: [],
      info: navObj,
    });
  };

  const handleUploadStory = async () => {
    // TODO:: UPDATE ONY THE COVER FIELD IN THE CHARACTER OBJ
    // MEANS YOU WANT TO GRAB THE IMAGE FROM GALLERY
    if (!checkIsVerified()) return;

    const { results } = await launchGallery("all", false, false, null, 45);

    if (results) {
      // setIsCoverLoading(true);
      const statusObj = {
        instance: "show",
        instanceID: dataState._id,
        post: {
          ...results[0],
        },
      };
      delete statusObj.post.cancelled;

      setShowUpload({ vis: true, data: statusObj });
    }
  };

  const handleWithdrawChallenge = () => {
    const data = {
      instanceID: dataState._id,
      instance: "show",
    };
    withdrawChallenge(
      data,
      (res) => {
        setPopper({ vis: true, type: "success", msg: "Challenge withdrawn" });
        getMyShows("cover");
      },
      (err) => {
        setPopper({ vis: true, type: "failed", msg: err });
      }
    );
  };

  const updateThisInstance = (prop, val) => {
    setDataState({ ...dataState, [prop]: val });
  };

  const handleFollowShow = () => {
    setIsCoverLoading(true);
    let followObj = {
      instance: "show",
      instanceID: dataState._id,
    };
    if (isFollowing) {
      // UNFOLLOWS
      followObj.action = "unfollow";
    } else {
      followObj.action = "follow";
    }
    followInstance(
      followObj,
      (resData) => {
        console.log(resData);
        setIsFollowed(isFollowing ? false : true);
        setIsCoverLoading(false);
      },
      (err) => {
        console.log(err);
        setErrMsg(err?.response.data);
        setIsCoverLoading(false);
      }
    );
  };

  const handleStatusVisibility = (bool) => {
    if (bool) {
      setPopper({ vis: true, type: "success", msg: "Status uploaded" });
    }
    setShowUpload({ vis: false, data: null });
  };

  const handleScreenRefresh = () => {
    getMyShows("refresh");
  };

  const handleItemPress = (item) => {
    // console.log(item);
    switch (item.prop) {
      case "challengers":
        setModalVis(true);
        break;
      case "posts":
        navigateToPosts();
        break;
      default:
        break;
    }
  };
  const renderPageInfos = ({ item }) => {
    return <InfoBox item={item} onPress={() => handleItemPress(item)} />;
  };

  useEffect(() => {
    getMyShows("fetch");
  }, []);

  useEffect(() => {
    const challengerIds = dataState?.challengers?.map((obj) => obj.user._id);
    const challConst = challengerIds?.includes(userInfo._id);
    setChallenged(challConst);
    setChallengerArr(dataState.challengers);
    setIsFollowed(isFollowing);
  }, [dataState]);

  const renderGroups = ({ item }) => {
    const viewRoomData = {
      instance: "group",
      instanceID: item._id,
    };

    return (
      <GroupCard
        item={item}
        onPress={() =>
          navigation.navigate("Room", { roomID: item._id, data: viewRoomData })
        }
      />
    );
  };

  const renderHome = () => {
    if (isLoading) return null;
    return (
      <View style={styles.content}>
        <View style={styles.list}>
          <FlatList
            data={pageInfo}
            keyExtractor={(item) => item.prop}
            renderItem={renderPageInfos}
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          />
        </View>
        <View>
          {dataState.groups && dataState?.groups[0] && (
            <>
              <Separator h={1} />
              <AppText style={{ marginLeft: 12 }} size="large" bold>
                GROUPS & ORGANIZATIONS
              </AppText>
              <Separator h={1} />
            </>
          )}
          <FlatList
            data={dataState.groups}
            listKey="groups"
            showsHorizontalScrollIndicator={false}
            horizontal
            keyExtractor={(i, ind) => i + ind}
            renderItem={renderGroups}
          />
          {dataState.characters && dataState?.characters[0] && (
            <>
              <Separator h={1} />
              <View style={styles.flatTitle}>
                <AppText size="large" bold>
                  CHARACTERS
                </AppText>
                <AppButton
                  title="Enter room"
                  onPress={() =>
                    navigation.navigate("Room", {
                      data: {
                        instance: "show",
                        instanceID: dataState._id,
                      },
                    })
                  }
                  naked
                />
              </View>
              <Separator h={1} />
            </>
          )}
          <FlatList
            showsVerticalScrollIndicator={false}
            numColumns={2}
            listKey="characters"
            data={dataState.characters}
            keyExtractor={(item, index) => (item + index).toString()}
            renderItem={({ item }) => {
              return (
                <View style={styles.charCont}>
                  <ChallengeCard
                    large
                    name={item.dpName}
                    id={item._id}
                    show={item?.show?.name_j ?? item?.show?.name_e}
                    followers={item.followers}
                    avatar={item?.manager?.avatar}
                    manager={item.manager}
                    image={item.cover_photo}
                    onPress={() =>
                      navigation.navigate("Character", {
                        item: item._id,
                      })
                    }
                  />
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      {isLoading ? (
        <ActivityIndicator
          visible={isLoading}
          type="spin"
          style={styles.activity}
        />
      ) : errMsg && errMsg.includes("deleted_instance") ? (
        <ActivityIndicator
          visible
          type="isEmpty"
          text="Anime was  not verifiable and has been deleted"
          style={styles.activity}
        />
      ) : (
        <Viewport.Tracker>
          <>
            <Animated.FlatList
              data={["OTAKU"]}
              ListHeaderComponent={<InstanceHeader instanceData={headerObj} />}
              listKey="@home"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              renderItem={renderHome}
              refreshing={refreshing}
              contentContainerStyle={{ paddingBottom: height * 0.08 }}
              onRefresh={handleScreenRefresh}
              overScrollMode="never"
              keyExtractor={(item, index) => item + index}
            />
            <StickyHeader
              scrollY={scrollY}
              title={dataState?.name_j || dataState?.name_e}
            />
          </>
        </Viewport.Tracker>
      )}

      <InstanceChallenger
        visible={challengeModal.vis}
        data={{
          instance: "show",
          id: show._id,
          name: dataState?.name_j ?? dataState?.name_e,
          owner: dataState?.manager,
          contest: challengeModal.contest,
        }}
        fetchInstance={getMyShows}
        setter={() => setChallengeModal({ vis: null, contest: null })}
      />
      <TransferInstance
        visible={transfer}
        instance="show"
        updateThisInstance={updateThisInstance}
        instanceID={dataState._id}
        setVisible={setTransfer}
      />
      <PopUpModal
        visible={modalVis}
        setVisible={setModalVis}
        ContentComponent={() => (
          <CharChallengerScreen
            challengerArr={challengerArr}
            name={dataState.name_j + " show" ?? dataState.name_e + " show"}
            setChallengeModal={setChallengeModal}
            isMine={isMine}
          />
        )}
      />
      <AlertModal
        obj={alertModal}
        setVisible={setAlertModal}
        onPress={handleOkAlert}
      />
      <ShowUpload visObj={showUpload} setVisible={handleStatusVisibility} />
      <PopMessage popData={popper} setter={() => setPopper({ vis: false })} />
    </View>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  content: {
    bottom: width * 0.11,
    minHeight: height * 0.4,
  },
  charCont: {
    marginBottom: 18,
    marginHorizontal: width * 0.01,
  },
  error: {
    textAlign: "center",
    marginTop: 8,
    color: colors.heart,
  },
  flatTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  imageContaineer: {
    width: width,
    height: height * 0.4,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    bottom: 130 / 2,
  },
  list: {
    padding: 12,
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
  subTitle: {
    textAlign: "center",
    textTransform: "capitalize",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    textTransform: "uppercase",
    marginLeft: 3,
    color: colors.primary,
  },
  user: {
    textAlign: "center",
    bottom: 52,
  },
});
export default ShowScreen;
