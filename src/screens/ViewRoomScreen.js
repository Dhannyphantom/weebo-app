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
import MaskedView from "@react-native-community/masked-view";
import Svg, { Rect } from "react-native-svg";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

import { Context as CharContext } from "../config/CharContext";
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
import AlertModal from "../components/AlertModal";
import FloatIcons from "../components/FloatIcons";
import InstanceInvites from "../components/InstanceInvites";
import PopDownModal from "../components/PopDownModal";
import ThemeContext from "../config/ThemeContext";
import Link from "../components/Link";

const { width, height } = Dimensions.get("window");

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;
const SPACING = 10;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;

const ViewRoomScreen = ({ navigation, route }) => {
  const {
    roomCharacters,
    getCharacters,
    instanceUpdater,
    sendInvite,
    deleteInstance,
  } = useContext(CharContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const [pageData, setPageData] = useState({});
  const [alertModal, setAlertModal] = useState({ visible: false });
  const [pageLoaded, setPageLoaded] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [searcher, setSearcher] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showInvites, setShowInvites] = useState(false);
  const [groupAction, setGroupAction] = useState(false);
  const [showCharacters, setShowCharacters] = useState(false);
  const [showRemoveCharacter, setShowRemoveCharacter] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popper, setPopper] = useState({ vis: false, msg: null, type: null });
  const [refreshing, setRefreshing] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  // console.log(pageData.invites);

  const params = route.params;
  // params = { instance}
  const scrollX = useRef(new Animated.Value(0)).current;
  const searchRef = useRef(null);
  const theme = useContext(ThemeContext);
  let isManager;
  if (params?.instance?.manager == userInfo._id) {
    isManager = true;
  } else {
    isManager = false;
  }
  let showInviteIcon = false;
  if (pageData.type === "show") {
    showInviteIcon = false;
  } else if (pageData.type === "group") {
    showInviteIcon = true;
  }

  const floatData = [
    {
      id: "189686",
      icon: "account-plus",
      text: isManager ? "Invite Character" : "Join",
      show: true,
      isProfile: { vis: false, data: null },
      onPress: () => handleCharacterInvites(),
    },
    {
      id: "9806792",
      icon: "format-list-text",
      text: "See Invites",
      isProfile: { vis: false, data: null },
      show: showInviteIcon,
      onPress: () => setShowInvites(true),
    },
    {
      id: "507734",
      icon: "menu",
      text: "Actions",
      isProfile: { vis: false, data: null },
      show: isManager && showInviteIcon,
      onPress: () => setGroupAction(true),
    },
    {
      id: "9806792",
      isProfile: {
        vis: true,
        data: pageData?.manager ?? pageData?.app_creator,
      },
      show: true,
      onPress: () => setShowInvites(true),
    },
  ];

  const groupActionArr = [
    {
      id: "2",
      title: "Update Cover photo",
      onPress: () => handleCoverImageChange(),
      icon: "image-multiple",
    },
    {
      id: "458093240",
      icon: "delete",
      title: "Remove Character",
      show: isManager,
      onPress: () => setShowRemoveCharacter(true),
    },
    {
      id: "230428",
      icon: "trash-can",
      title: "Delete Group",
      show: isManager,
      onPress: () => handleDeleteInstance("alert"),
    },
  ];

  const handleCharacterInvites = () => {
    // setPopper({ vis: true, msg: "Invite sent", type: "success" });
    // return;
    if (isManager) {
      setShowSearch(!showSearch);
    } else {
      setShowCharacters(true);
    }
  };

  const handleCoverImageChange = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [25, 16],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!res.cancelled) {
      setIsLoading(true);
      const dataObj = {
        action: "cover",
        actionData: res,
        instance: "group",
        instanceID: pageData?._id,
        media: true,
      };
      instanceUpdater(
        dataObj,
        (resData) => {
          const newData = { ...pageData };
          newData.cover_photo = resData.cover_photo;
          setPageData(newData);
          setGroupAction(false);
          setPopper({ vis: true, type: "success", msg: "Cover updated" });
          setIsLoading(false);
        },
        (err) => {
          setPopper({ vis: true, type: "failed", msg: err });
        }
      );
    }
  };

  const fetchRoomCharacters = () => {
    setRefreshing(true);
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
        setPageLoaded(true);
        setFirstLoad(true);
        setRefreshing(false);
      },
      (err) => {
        setErrMsg(err?.response?.data);
        setPageLoaded(true);
        setRefreshing(false);
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

  const handleDeleteInstance = (type) => {
    if (type === "alert") {
      setAlertModal({
        visible: true,
        title: "Delete Group",
        message: "Are sure you want to delete this group?",
        btn: "YES",
        type: "delete_group",
      });
    } else if (type === "delete") {
      setIsLoading(true);

      const deleteObj = {
        instance: "group",
        instanceID: pageData._id,
      };

      deleteInstance(
        deleteObj,
        (resData) => {
          navigation.goBack();
        },
        (err) => {
          setPopper({ vis: true, type: "fail", msg: err });
          setIsLoading(false);
        }
      );
    }
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
          contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) =>
            renderBackDrops({ item, index }, scrollX)
          }
        />
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.2)", "white"]}
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
        setVisible={() => setShowInvites(false)}
        instance={{ name: pageData.name, id: pageData._id, type: "group" }}
      />
    );
  };

  const RenderRemoveCharacter = () => {
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
      if (!item.name) return null;
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

      const handleRemoveCharacter = () => {
        const sendCharacters = selectedCharacters.map((item) => item._id);
        const removeCharData = {
          instance: "character",
          instanceID: sendCharacters,
          group: params.roomID,
          type: "remove",
        };
        console.log(removeCharData);
        handleSendInvite(null, removeCharData);
      };

      return (
        <View>
          <AppButton
            title="Remove character"
            bare
            RIcon="delete"
            onPress={handleRemoveCharacter}
            style={{ alignSelf: "center", marginTop: 10 }}
          />
        </View>
      );
    };

    return (
      <View style={styles.modal}>
        <FlatList
          data={pageData?.characters}
          keyExtractor={(item) => item._id}
          renderItem={renderCharactersOwned}
          ListEmptyComponent={
            <ActivityIndicator
              type="isEmpty"
              text="There are no characters in this group"
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
    fetchRoomCharacters();
  }, [navigation]);

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
        onRefresh={fetchRoomCharacters}
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
      <ActivityIndicator visible={!pageLoaded} style={styles.activity} />
      {pageData?.characters?.length <= 2 && firstLoad && (
        <>
          <ActivityIndicator
            visible={pageData?.characters.length <= 2}
            type="isEmpty"
            text="There are no Character Instances yet"
            style={styles.activity}
            ComponentRenderer={() => (
              <View style={styles.links}>
                <Link
                  iconName="plus"
                  onPress={handleCharacterInvites}
                  name={isManager ? "Invite Characters" : "Join"}
                />
                {isManager && (
                  <>
                    <Link
                      iconName="format-list-text"
                      onPress={() => setShowInvites(true)}
                      name="See Invites"
                    />
                    <Link
                      iconName="format-list-text"
                      onPress={() => handleDeleteInstance("alert")}
                      name="Delete Group"
                    />
                  </>
                )}
              </View>
            )}
          />
        </>
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
            <View style={styles.searchInstance}>
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
          visible={showCharacters}
          setVisible={setShowCharacters}
          ContentComponent={RenderMyCharacters}
        />
        <PopUpModal
          visible={showRemoveCharacter}
          setVisible={setShowRemoveCharacter}
          ContentComponent={RenderRemoveCharacter}
        />
        <PopUpModal
          visible={showInvites}
          setVisible={setShowInvites}
          ContentComponent={RenderInvites}
        />
        <ActivityIndicator
          type="spin"
          visible={isLoading}
          style={styles.activity}
          wTransparent
        />
        <PopDownModal
          visible={groupAction}
          title="group actions"
          setVisible={setGroupAction}
          data={groupActionArr}
        />
        <AlertModal
          obj={alertModal}
          setVisible={setAlertModal}
          onPress={() => handleDeleteInstance("delete")}
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
