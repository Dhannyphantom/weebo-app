import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Platform,
  Animated,
  Image,
  TouchableOpacity,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, { Rect } from "react-native-svg";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

import { Context as CharContext } from "../config/CharContext";
import { Context as ChallContext } from "../config/ChallContext";
import { Context as FeedContext } from "../config/FeedContext";
import { Context as AuthContext } from "../config/AuthContext";

import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import Screen from "../components/Screen";
import SearchBar from "../components/SearchBar";
import SearchInstance from "../components/SearchInstance";
import colors from "../constants/colors";
import PopMessage from "../components/PopMessage";
import PopUpModal from "../components/PopUpModal";
import SelectItem from "../components/SelectItem";
import FloatIcons from "../components/FloatIcons";
import InstanceInvites from "../components/InstanceInvites";
import ThemeContext from "../config/ThemeContext";
import Link from "../components/Link";
import PopDropDown from "../components/PopDropDown";
import { capFirstLetter } from "../constants/helpers";
import InstanceHeader, { RenderVerifyInfo } from "../components/InstanceHeader";
import AppFadeIn from "../components/AppFadeIn";
import InstanceChallenger from "../components/InstanceChallenger";
import ShowUpload from "../components/ShowUpload";
import TransferInstance from "../components/TransferInstance";
import CharChallengerScreen from "./CharChallengerScreen";

const { width, height } = Dimensions.get("window");

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;
const SPACING = 10;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;
const boolsObj = { cover: false, followed: false, transfer: false };
const popObj = {
  characters: false,
  vis: false,
  challengers: false,
  invites: false,
  close: null,
};

const RenderChallengers = ({ name, id, setChallengeModal, isManager }) => {
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);
  const [challengers, setChallengers] = useState([]);

  const { fetchGroupProperty } = useContext(CharContext);

  const fetchChallengers = (type) => {
    type !== "fresh" && setLoading(true);
    fetchGroupProperty(
      { id, prop: "challengers" },
      (resData) => {
        // console.log(resData);
        setLoading(false);
        setChallengers(resData.challengers);
      },
      (errData) => {
        // console.log(errData);
        setErrMsg(errData.data ?? errData.msg);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchChallengers("fresh");
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <CharChallengerScreen
        challengerArr={challengers}
        name={name + " group"}
        setChallengeModal={setChallengeModal}
        isMine={isManager}
      />
      <ActivityIndicator visible={loading} />
    </View>
  );
};

const ViewRoomScreen = ({ navigation, route }) => {
  const { roomCharacters, getCharacters, instanceUpdater, sendInvite } =
    useContext(CharContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const { followInstance } = useContext(FeedContext);
  const { withdrawChallenge } = useContext(ChallContext);

  const [pageData, setPageData] = useState({});
  const [searcher, setSearcher] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [popModal, setPopModal] = useState(popObj);
  const [groupAction, setGroupAction] = useState(false);
  const [showUpload, setShowUpload] = useState({ vis: false, data: null });
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [verifyModal, setVerifyModal] = useState(false);
  const [challengeModal, setChallengeModal] = useState({
    vis: false,
    contest: null,
  });
  const [searchList, setSearchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popper, setPopper] = useState({ vis: false });
  const [refreshing, setRefreshing] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const params = route.params;
  // params = { instance}
  const scrollX = useRef(new Animated.Value(0)).current;
  const searchRef = useRef(null);
  const theme = useContext(ThemeContext);
  let showInviteIcon = false;
  const isFollowing = pageData?.followers?.includes(userInfo._id);
  const isManager = pageData?.manager?._id == userInfo._id;
  const hasSentFeedback = pageData?.verifiedList?.find(
    (obj) => obj.user == userInfo._id
  );
  const [bools, setBools] = useState(boolsObj);

  if (pageData.type === "group") {
    showInviteIcon = true;
  }

  const gradientColor =
    theme.mode === "light"
      ? ["transparent", "rgba(255,255,255,0.2)", "white"]
      : ["transparent", theme.transparent, theme.transparentBolder];

  const floatData = [
    {
      id: "507734",
      icon: "menu",
      text: "Actions",
      isProfile: { vis: false, data: null },
      show: isManager && showInviteIcon,
      onPress: () => setGroupAction(true),
    },
    {
      id: "7",
      text: "Challengers",
      onPress: () => setPopModal({ ...popModal, vis: true, challengers: true }),
      icon: "trophy",
      selected: true,
      isProfile: { vis: false, data: null },
      show: true,
    },
    {
      id: "50745988",
      text: "Challenge",
      isProfile: { vis: false, data: null },
      onPress: () => {
        if (checkIsVerified()) {
          setChallengeModal({ vis: true });
          onCloseModal();
        }
      },
      icon: "trophy-outline",
      show: !isManager && !pageData?.hasChallengedAlready,
      selected: true,
    },
    {
      id: "5078",
      text: "Withdraw Challenge",
      isProfile: { vis: false, data: null },
      onPress: () => {
        if (checkIsVerified()) {
          handleWithdrawChallenge();
          onCloseModal();
        }
      },
      icon: "trophy-outline",
      show: !isManager && pageData?.hasChallengedAlready,
      selected: true,
    },
    {
      id: "169576",
      name: "Withdraw challenge",
      onPress: () => handleWithdrawChallenge(),
      icon: "trophy-outline",
      selected: true,
      show: !isManager && false, // && you are a challenger
    },
    {
      id: "2",
      text: "Posts",
      onPress: () => navigateToPosts(),
      icon: "image-multiple",
      selected: true,
      isProfile: { vis: false, data: null },
      show: true,
    },
    {
      id: "vdush2",
      text: bools.followed ? "Unfollow" : "Follow", // or Unfollow
      onPress: () => handleGroupFollow(),
      icon: "star",
      selected: true,
      isProfile: { vis: false, data: null },
      show: !isManager,
    },
    {
      id: "9806792",
      isProfile: {
        vis: true,
        data: pageData?.manager,
      },
      show: true,
      onPress: () => setPopModal({ ...popModal, vis: true, invites: true }),
    },
  ];

  const listItems = [
    {
      id: "507848",
      name: "Upload Story",
      onPress: () => {
        if (checkIsVerified()) {
          handleUploadStory();
          onCloseModal();
        }
      },
      icon: "circle-outline",
      show: isManager,
      selected: true,
    },
    {
      id: "5",
      name: "Update Cover",
      selected: true,
      onPress: () => handleCoverImageChange(),
      icon: "reload",
      show: isManager,
    },
    {
      id: "9806792",
      icon: "format-list-text",
      name: "See Invites",
      show: showInviteIcon,
      onPress: () => setPopModal({ ...popModal, vis: true, invites: true }),
    },
    {
      id: "189686",
      icon: "account-plus",
      name: isManager ? "Add or Invite Characters" : "Join",
      show: true,
      onPress: () => {
        handleCharacterInvites();
        onCloseModal();
      },
    },
    {
      id: "3",
      name: "New Event",
      onPress: () => {
        if (!checkIsVerified()) return;
        navigation.navigate("Event", {
          instance: "group",
          instanceID: pageData?._id,
        });
        onCloseModal();
      },
      selected: true,
      icon: "plus",
      show: isManager,
    },
    {
      id: "35t74085",
      name: "Transfer Group",
      onPress: () => {
        if (!checkIsVerified()) return;
        setBools({ ...bools, transfer: true });
      },
      selected: true,
      icon: "transfer",
      show: isManager,
    },
  ];

  const headerData = {
    cover_photo: pageData?.cover_photo,
    description: null,
    coverLoading: bools.cover,
    listItems,
    owner: pageData?.manager,
    screenIcon: "people",
    verified: pageData?.verified,
    handleLeftPress: () => handleGroupFollow(),
    followers: pageData?.followers?.length,
    verifiedList: pageData?.verifiedList,
    subscribers: null,
    feedback: {
      instanceID: pageData?._id,
      finder: hasSentFeedback,
      instanceName: pageData?.name,
      instanceShow: pageData?.show?.name_j ?? pageData?.show?.name_e,
      instance: "group",
    },
    leftColor: bools.followed ? colors.primary : colors.medium,
    name: pageData?.name,
  };

  const handleGroupFollow = () => {
    setBools({ ...bools, cover: true });
    let followObj = {
      instance: "group",
      instanceID: pageData?._id,
    };
    if (bools.followed) {
      // UNFOLLOWS
      followObj.action = "unfollow";
    } else {
      followObj.action = "follow";
    }
    followInstance(
      followObj,
      (_resData) => {
        setBools({ ...bools, cover: false, followed: true });
        fetchRoomCharacters("load");
      },
      (err) => {
        // console.log(err);
        setErrMsg(err?.response.data);
        setBools({ ...bools, cover: false });
      }
    );
  };

  const onCloseModal = () => {
    setPopModal({ ...popModal, close: "close" });
  };

  const handleUploadStory = async () => {
    // TODO:: UPDATE ONLY THE COVER FIELD IN THE CHARACTER OBJ
    // MEANS YOU WANT TO GRAB THE IMAGE FROM GALLERY

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });

    if (!res.cancelled) {
      // setIsCoverLoading(true);
      setBools({ ...bools, cover: true });
      const statusObj = {
        instance: "group",
        instanceID: pageData?._id,
        post: {
          ...res,
        },
      };
      delete statusObj.post.cancelled;

      setShowUpload({ vis: true, data: statusObj });
    }
  };

  const checkIsVerified = () => {
    if (!pageData?.verified) {
      setPopper({
        vis: true,
        msg: `${capFirstLetter(pageData?.name)} group instance not verified`,
        type: "failed",
      });
      return false;
    }
    return true;
  };

  const handleStatusVisibility = (bool) => {
    if (bool) {
      setPopper({ vis: true, type: "success", msg: "Status uploaded" });
    }
    setShowUpload({ vis: false, data: null });
  };

  const navigateToPosts = () => {
    const navObj = {
      id: pageData?._id,
      name: pageData?.name,
      verified: pageData?.verified,
      isMine: isManager,
    };
    navigation.navigate("MyPost", {
      screen: "group",
      data: [],
      info: navObj,
    });
  };

  const updateThisInstance = (prop, val) => {
    setPageData({ ...pageData, [prop]: val });
  };

  const handleCharacterInvites = () => {
    // setPopper({ vis: true, msg: "Invite sent", type: "success" });
    // return;
    if (isManager) {
      setShowSearch(!showSearch);
    } else {
      setPopModal({ ...popModal, vis: true, characters: true });
      set;
    }
  };

  const handleCoverImageChange = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [25, 16],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!res.cancelled) {
      setBools({ ...bools, cover: true });
      const dataObj = {
        action: "cover_photo",
        actionData: res,
        instance: "group",
        instanceID: pageData?._id,
        media: true,
      };

      instanceUpdater(
        dataObj,
        (resData) => {
          setPageData({ ...pageData, cover_photo: resData.cover_photo });
          setPopper({ vis: true, type: "success", msg: "Cover updated" });
          setGroupAction(false);
          setBools({ ...bools, cover: false });
        },
        (err) => {
          console.log(err);
          setPopper({ vis: true, type: "failed", msg: err.data ?? err.msg });
          setBools({ ...bools, cover: false });
        }
      );
    }
  };

  const fetchRoomCharacters = (type) => {
    type === "refresh" && setRefreshing(true);

    roomCharacters(
      params.data,
      (resData) => {
        // console.log(resData);
        setPageData({
          ...resData,
          characters: [
            { _id: "left-spacer" },
            ...resData.characters,
            { _id: "right-spacer" },
          ],
        });
        type === "refresh" && setRefreshing(false);
      },
      (err) => {
        setErrMsg(err?.response?.data);
        type === "refresh" && setRefreshing(false);
      }
    );
  };

  const handleSearchInstance = () => {
    getCharacters(searcher, (data) => {
      if (Array.isArray(data)) {
        setSearchList(data);
      } else {
        // Character not found
        setErrMsg(data);
      }
    });
  };

  const handleSendInvite = (item, data) => {
    setIsLoading(true);
    // console.log(item);
    const inviteData = {
      instance: "character",
      instanceID: item?._id,
      group: params.roomID,
      type: "invite",
    };
    const sendData = data ? data : inviteData;
    sendInvite(
      sendData,
      (resData) => {
        fetchRoomCharacters();
        setIsLoading(false);
        setPopper({ vis: true, msg: resData, type: "success" });
      },
      (err) => {
        setIsLoading(false);
        setPopper({ vis: true, msg: err, type: "fail" });
        setErrMsg(err);
      }
    );
  };

  const handleWithdrawChallenge = () => {
    const data = {
      instanceID: pageData?._id,
      instance: "group",
    };
    withdrawChallenge(
      data,
      (res) => {
        setPopper({ vis: true, type: "success", msg: "Challenge withdrawn" });
        fetchRoomCharacters("cover");
      },
      (err) => {
        setPopper({ vis: true, type: "failed", msg: err });
      }
    );
  };

  const handleCloseSearch = () => {
    setSearchList([]);
    setShowSearch(false);
  };

  const renderCharacters = ({ item, index }) => {
    if (!item.cover_photo) return <View style={{ width: SPACER_ITEM_SIZE }} />;
    const inputRange = [
      (index - 2) * ITEM_SIZE,
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
    ];

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [100, 50, 100],
      extrapolate: "clamp",
    });

    return (
      <View style={{ width: ITEM_SIZE }}>
        <Animated.View
          style={{
            marginHorizontal: SPACING,
            padding: SPACING * 2,
            alignItems: "center",
            transform: [{ translateY }],
            backgroundColor: theme.background,
            borderRadius: width * 0.08,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.96}
            onPress={() => navigation.navigate("Character", { item: item._id })}
            style={{
              width: "100%",
              height: height * 0.45,
            }}
          >
            <Image
              source={{ uri: item?.cover_photo?.uri }}
              style={{
                width: "99%",
                height: "99%",
                borderRadius: width * 0.05,
              }}
              resizeMethod="resize"
            />
          </TouchableOpacity>
          <AppText
            style={{
              textTransform: "capitalize",
              marginTop: SPACING,
            }}
            size="xlarge"
            bold
          >
            {item.name}
          </AppText>
          <AppText
            style={{
              textTransform: "capitalize",
              marginTop: SPACING,
            }}
            size="large"
          >
            {item.followers?.length} followers
          </AppText>
        </Animated.View>
      </View>
    );
  };

  const renderBackDrops = ({ item, index }, scrollX) => {
    const spacers = ["right-spacer", "left-spacer"];
    if (spacers.includes(item._id)) return null;

    const inputRange = [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE];

    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [-width, 0],
    });

    return (
      <MaskedView
        style={{ position: "absolute" }}
        maskElement={
          <AnimatedSvg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{
              transform: [{ translateX }],
            }}
          >
            <Rect x="0" y="0" width={width} height={height} fill="red" />
          </AnimatedSvg>
        }
      >
        <Animated.View
          removeClippedSubviews={true}
          style={{
            position: "absolute",
            transform: [{ translateX }],
            height,
            overflow: "hidden",
          }}
        >
          <Image
            source={{ uri: item?.room_cover?.uri }}
            style={{
              width,
              height: BACKDROP_HEIGHT,
              resizeMode: "cover",
            }}
          />
        </Animated.View>
      </MaskedView>
    );
  };

  const BackDrop = ({ myCharacters, scrollX }) => {
    return (
      <View
        style={{
          position: "absolute",
          width,
          height: BACKDROP_HEIGHT,
        }}
      >
        <FlatList
          data={myCharacters}
          removeClippedSubviews={false}
          contentContainerStyle={{
            width,
            height: BACKDROP_HEIGHT,
          }}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) =>
            renderBackDrops({ item, index }, scrollX)
          }
        />
        <LinearGradient
          colors={gradientColor}
          style={{
            width,
            height: BACKDROP_HEIGHT,
            position: "absolute",
            bottom: 0,
          }}
        />
      </View>
    );
  };

  const RenderPageFooter = () => {
    if (!pageData?.verified) return null;
    return (
      <View style={styles.footerView}>
        <FloatIcons data={floatData} />
      </View>
    );
  };

  const RenderInvites = () => {
    return (
      <InstanceInvites
        data={pageData?.invites}
        setVisible={() =>
          setPopModal({ ...popModal, vis: false, invites: false })
        }
        instance={{ name: pageData.name, id: pageData._id, type: "group" }}
      />
    );
  };

  const RenderAllPopups = () => {
    if (popModal.characters) {
      return <RenderMyCharacters />;
    } else if (popModal.invites) {
      return <RenderInvites />;
    } else if (popModal.challengers) {
      return (
        <RenderChallengers
          name={pageData?.name}
          isManager={isManager}
          id={pageData?._id}
          setChallengeModal={setChallengeModal}
        />
      );
    }
  };

  const RenderMyCharacters = () => {
    //
    const handleCharacterSelect = (item) => {
      const index = selectedCharacters.findIndex(
        (obj) => obj.name == item.name
      );
      if (index == -1) {
        setSelectedCharacters([...selectedCharacters, item]);
      } else if (index > -1) {
        setSelectedCharacters(
          selectedCharacters.filter((obj) => obj.name !== item.name)
        );
      }
    };

    const renderCharactersOwned = ({ item }) => {
      return (
        <SelectItem
          item={item}
          check={selectedCharacters}
          pickItem={handleCharacterSelect}
        />
      );
    };

    const RenderFooterComponent = () => {
      if (!selectedCharacters[0]) return null;

      const handleJoinGroup = () => {
        const sendCharacters = selectedCharacters.map((item) => item._id);
        const inviteData = {
          instance: "character",
          instanceID: sendCharacters,
          group: params.roomID,
          type: "join",
        };
        handleSendInvite(null, inviteData);
      };

      return (
        <View>
          <AppButton
            title="Join group"
            bare
            onPress={handleJoinGroup}
            style={{ alignSelf: "center", marginTop: 10 }}
          />
        </View>
      );
    };

    return (
      <View style={styles.modal}>
        <FlatList
          data={userInfo.charactersOwned}
          keyExtractor={(item) => item._id}
          renderItem={renderCharactersOwned}
          ListEmptyComponent={
            <ActivityIndicator
              type="isEmpty"
              text={
                "You have no characters. \n Challenge a Character Instance now to obtain one. \n Or Create a non-existing Character Instance by searching the featured character's name"
              }
              style={{ marginTop: 50 }}
              visible={true}
            />
          }
          ListFooterComponent={RenderFooterComponent}
        />
        <ActivityIndicator
          type="spin"
          visible={isLoading}
          style={styles.activityTwo}
          wTransparent
        />
      </View>
    );
  };

  useEffect(() => {
    fetchRoomCharacters("load");
  }, [navigation]);

  useEffect(() => {
    setBools({ ...bools, followed: isFollowing });
  }, [isFollowing]);

  useEffect(() => {
    searchRef?.current?.focus();
  }, [showSearch]);

  return (
    <View style={styles.container}>
      <StatusBar translucent />
      <BackDrop myCharacters={pageData.characters} scrollX={scrollX} />
      <Animated.FlatList
        data={pageData.characters}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToAlignment="start"
        snapToInterval={ITEM_SIZE}
        refreshing={refreshing}
        onRefresh={() => fetchRoomCharacters("refresh")}
        decelerationRate={0}
        bounces={false}
        renderToHardwareTextureAndroid
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        keyExtractor={(item) => item._id}
        horizontal
        contentContainerStyle={{
          alignItems: "center",
        }}
        renderItem={renderCharacters}
      />
      <RenderPageFooter />
      <ActivityIndicator visible={isLoading} style={styles.activity} />
      {pageData?.characters?.length <= 2 && (
        <View style={{ position: "absolute", top: 0, width }}>
          <InstanceHeader instanceData={headerData} />
          <ActivityIndicator
            visible
            type="isEmpty"
            text="No characters in this group"
          />
        </View>
      )}
      {showSearch && (
        <Screen
          style={{
            position: "absolute",
            width: "100%",
            marginTop: 20,
            height: "100%",
          }}
        >
          <SearchBar
            searchBar={searcher}
            ref={searchRef}
            setSearchBar={setSearcher}
            style={{ width: "90%", alignSelf: "center" }}
            pressCb={handleSearchInstance}
            closeCb={handleCloseSearch}
            placeholder="Invite Characters..."
          />
          {searchList[0] ? (
            <View
              style={[
                styles.searchInstance,
                { backgroundColor: theme.extralight },
              ]}
            >
              <SearchInstance
                data={searchList}
                onPress={handleSendInvite}
                title="Characters"
                type="rect"
              />
            </View>
          ) : (
            <AppText style={styles.error}> {errMsg} </AppText>
          )}
        </Screen>
      )}
      <>
        <PopMessage
          popData={popper}
          setter={() => setPopper({ vis: false, msg: null })}
        />
        <PopUpModal
          visible={popModal.vis}
          setter={() => setPopModal(popObj)}
          ContentComponent={RenderAllPopups}
        />

        <InstanceChallenger
          visible={challengeModal.vis}
          data={{
            instance: "group",
            id: pageData?._id,
            name: pageData?.name,
            owner: pageData?.manager,
            contest: challengeModal.contest,
          }}
          fetchInstance={fetchRoomCharacters}
          setter={() => setChallengeModal({ vis: null, contest: null })}
        />

        <ActivityIndicator
          type="spin"
          visible={isLoading}
          style={styles.activity}
          wTransparent
        />
        <PopDropDown
          visible={groupAction}
          setter={() => {
            setPopModal({ ...popModal, close: null });
            setGroupAction(false);
          }}
          closer={() => popModal.close}
          headerTitle="Group Actions"
          RenderComponent={() => {
            return (
              <View style={{ paddingBottom: 40 }}>
                {listItems.map((item, idx) => {
                  if (item.show) {
                    return (
                      <Link
                        name={item.name}
                        iconName={item.icon}
                        key={item + idx}
                        onPress={item.onPress}
                        style={styles.link}
                      />
                    );
                  }
                })}
              </View>
            );
          }}
        />

        <ShowUpload visObj={showUpload} setVisible={handleStatusVisibility} />
        <TransferInstance
          visible={bools.transfer}
          instance="group"
          updateThisInstance={updateThisInstance}
          instanceID={pageData?._id}
          setter={() => setBools({ ...bools, transfer: false })}
        />

        <AppFadeIn
          visible={verifyModal}
          setVisible={setVerifyModal}
          RenderComponent={() => (
            <RenderVerifyInfo
              vName={pageData?.name}
              vInstance="group"
              vList={pageData?.verifiedList}
              vFollowers={pageData?.followers?.length}
              vInstanceID={pageData?._id}
            />
          )}
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
  activityTwo: {
    position: "absolute",
    width,
    height: "45%",
  },
  container: {
    flex: 1,
  },
  error: {
    textAlign: "center",
    marginTop: 15,
    color: colors.medium,
  },
  footerView: {
    position: "absolute",
    zIndex: 5,
    bottom: 0,
    justifyContent: "flex-end",
    padding: 12,
  },
  links: {
    width: "80%",
    padding: 20,
    marginTop: 35,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 15,
  },
  link: {
    width: "80%",
    alignSelf: "center",
  },
  modal: {
    flex: 1,
    marginTop: 12,
    alignItems: "center",
  },
  searchInstance: {
    flex: 1,
    backgroundColor: colors.extraLight,
    marginTop: 15,
    borderRadius: 15,
    width: width * 0.95,
    alignSelf: "center",
  },
});

export default ViewRoomScreen;
