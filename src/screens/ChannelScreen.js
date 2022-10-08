import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  FlatList,
  RefreshControl,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { Context as CharContext } from "../config/CharContext";
import { Context as AuthContext } from "../config/AuthContext";

import AppButton from "../components/AppButton";
import SearchBar from "../components/SearchBar";
import AppHeader from "../components/AppHeader";
import Screen from "../components/Screen";
import Separator from "../components/Separator";
import AppText from "../components/AppText";
import colors from "../constants/colors";
import ProfilePic from "../components/ProfilePic";
import CreateFormik from "../components/CreateFormik";
import scheme from "../constants/yupSchema";
import CreateForm from "../components/CreateForm";
import CoverUpload from "../components/CoverUpload";
import SubmitButton from "../components/SubmitButton";
import ActivityIndicator from "../components/ActivityIndicator";
import LoaderImage from "../components/LoaderImage";
import ThemeContext from "../config/ThemeContext";
import TabList from "../components/TabList";

const { width, height } = Dimensions.get("window");

const validationSchema = scheme.channelValidation;

const ChannelHeaderComp = ({
  boxState,
  handleBoxChange,
  checkSubChannels,
  checkOwnerChannels,
  channels,
  renderChannelsTwo,
}) => {
  return (
    <View>
      <TabList
        state={boxState}
        items={[
          { tab: "s", name: "Channels" },
          { tab: "m", name: "My Channels" },
        ]}
        onPress={handleBoxChange}
      />

      <View>
        {checkSubChannels && boxState.s && !checkOwnerChannels && (
          <HeaderTitle text="Subscribed Channels" />
        )}
        <FlatList
          data={channels}
          extraData={boxState}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderChannelsTwo}
          listKey="21"
        />
      </View>
    </View>
  );
};

const HeaderTitle = ({ text, show }) => {
  if (!show) return null;
  return (
    <View style={styles.headerCont}>
      <Separator h={1} />
      <AppText style={styles.headerTitle} bold>
        {text ? text : channelHeaderTitle}
      </AppText>
      <Separator h={1} />
    </View>
  );
};

const ChannelScreen = ({ navigation }) => {
  const { createChannel, getChannels, subscribeChannel, searchChannels } =
    useContext(CharContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const [channels, setChannels] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [boxState, setBoxState] = useState({ s: true, m: false });
  const [isLoading, setIsLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [modal, setModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const checkSubChannels = channels.find((obj) =>
    obj?.subscribers.includes(userInfo._id)
  );

  const checkOwnerChannels = channels.find(
    (obj) => obj?.owner?._id === userInfo._id
  );

  const init = {
    name: "",
    cover_photo: {
      width: 0,
      height: 0,
      uri: "",
    },
    description: "",
  };
  const searchRef = useRef(null);

  const handleImagePress = (id) => {
    navigation.navigate("ChannelPost", { id });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getChannels((resData) => {
      setChannels(resData);
      setRefreshing(false);
    });
  };

  const handleChannelSearch = (type) => {
    setSearchLoading(true);
    if (type === "search" && searchText.length > 2) {
      setErrMsg(null);
      searchChannels(
        { type: "channel", term: searchText },
        (resData) => {
          setSearchResults(resData);
          setSearchLoading(false);
          !resData[0] && setErrMsg(`${searchText} channel not found`);
        },
        (err) => {
          setSearchLoading(false);
          setErrMsg(err.msg);
        }
      );
    } else if (type === "close") {
      setShowSearch(false);
    }
  };

  const addNewElement = (data) => {
    const cArr = [...channels];
    const index = cArr.findIndex((obj) => obj._id === data._id);
    if (index >= 0) {
      cArr[index] = data;
    } else {
      cArr.unshift(data);
    }
    setChannels(cArr);
  };

  const handleSubscribe = (type, id) => {
    subscribeChannel(
      type,
      id,
      (data) => {
        addNewElement(data);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const ChannelListComp = ({ item, subscribe, isMine, small, unsubscribe }) => {
    return (
      <View style={{ marginBottom: 5 }}>
        <View style={styles.header}>
          <Feather name="tv" size={18} color={colors.primary} />
          <AppText style={styles.titleText} bold>
            {" "}
            {item.name}{" "}
          </AppText>
        </View>
        <View style={small ? styles.imageContTwo : styles.imageCont}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handleImagePress(item._id)}
            style={small ? styles.imageContTwo : styles.imageCont}
          >
            <LoaderImage
              image={item.cover_photo}
              borderRadius={width * 0.03}
              noAspect
              style={small ? styles.imageTwo : styles.image}
            />
            <View style={styles.imageBg}></View>
          </TouchableOpacity>
          <View style={styles.profilePic}>
            <ProfilePic
              source={item.owner.avatar}
              userID={item.owner._id}
              size={50}
            />
            <AppText bold style={styles.descText}>
              {item.description}
            </AppText>
          </View>
        </View>
        {!small && <Separator h={1} />}
        {!small && (
          <View style={styles.stats}>
            <AppText style={styles.statsItem}>
              <AppText bold>{item.posts.length}</AppText> posts{" "}
            </AppText>
            {subscribe && (
              <View style={styles.statsItem}>
                <AppButton
                  title="SUBSCRIBE"
                  bare
                  style={styles.statsItem}
                  onPress={() => handleSubscribe("sub", item._id)}
                />
              </View>
            )}
            {(isMine || (!unsubscribe && !subscribe)) && (
              <View style={styles.statsItem}>
                <AppText size="xlarge" bold style={{ color: colors.primary }}>
                  MANAGING
                </AppText>
              </View>
            )}
            {unsubscribe && (
              <AppButton
                title="UN-SUBSCRIBE"
                style={styles.statsItem}
                onPress={() => handleSubscribe("unsub", item._id)}
                bare
              />
            )}
            <AppText style={styles.statsItem}>
              <AppText bold>{item.subscribers.length}</AppText> subscribers{" "}
            </AppText>
          </View>
        )}
        {!small && <Separator h={1} />}
      </View>
    );
  };

  const handleBoxChange = (type) => {
    if (type === "s") {
      setBoxState({ s: true, m: false });
    } else if (type === "m") {
      setBoxState({ s: false, m: true });
    }
  };

  const handleFormSubmit = (formValues) => {
    setIsLoading(true);
    setErrMsg(null);
    createChannel(
      formValues,
      (data) => {
        setBoxState({ s: false, m: true });
        addNewElement(data);
        setIsLoading(false);
        setModal(false);
      },
      (err1, err2) => {
        setErrMsg(err2 ?? err1);
        setIsLoading(false);
      }
    );
  };

  const handleNewChannel = () => {
    setModal(true);
  };

  const renderChannels = ({ item }) => {
    if (boxState.m && item.owner._id == userInfo._id) {
      return <ChannelListComp item={item} />;
    } else if (
      boxState.s &&
      !item.subscribers.includes(userInfo._id) &&
      item.owner._id != userInfo._id
    ) {
      return <ChannelListComp item={item} subscribe />;
    }
  };

  const renderChannelsTwo = ({ item }) => {
    if (
      boxState.s &&
      item.owner._id !== userInfo._id &&
      item.subscribers.includes(userInfo._id)
    ) {
      return <ChannelListComp item={item} unsubscribe small />;
    }
  };

  const renderPage = () => {
    return (
      <View>
        <FlatList
          data={channels}
          extraData={boxState}
          keyExtractor={(item) => item._id}
          renderItem={renderChannels}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={{ width: width, height: height * 0.7 }}>
              {loadedOnce ? (
                <ActivityIndicator
                  type="isEmpty"
                  visible
                  text="No channels at the moment"
                />
              ) : (
                <ActivityIndicator type="spin" visible />
              )}
            </View>
          }
          ListHeaderComponent={<View>{channels[0] && <HeaderTitle />}</View>}
        />
      </View>
    );
  };

  const renderSeachResults = ({ item }) => {
    let unsubscribe, isMine, subscribe;
    if (item.owner._id == userInfo._id) {
      isMine = true;
      unsubscribe = false;
      subscribe = false;
    } else if (item.subscribers.includes(userInfo._id.toString())) {
      isMine = false;
      unsubscribe = true;
      subscribe = false;
    } else {
      subscribe = true;
      isMine = false;
      unsubscribe = false;
    }

    return (
      <ChannelListComp
        item={item}
        unsubscribe={unsubscribe}
        isMine={isMine}
        subscribe={subscribe}
      />
    );
  };

  useEffect(() => {
    let isSubscribed = true;
    getChannels((data) => {
      if (isSubscribed) setChannels(data);
      setLoadedOnce(true);
    });
    return () => (isSubscribed = false);
  }, []);
  useEffect(() => {
    searchRef?.current?.focus();
  }, [showSearch]);

  return (
    <Screen style={styles.container}>
      <AppHeader
        title="Channels"
        RightComponent={() => (
          <View style={styles.headerBtnCont}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.headerBtn}
              onPress={() => setShowSearch(!showSearch)}
            >
              <Feather
                name="search"
                size={width * 0.03}
                color={colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBtn}
              activeOpacity={1}
              onPress={handleNewChannel}
            >
              <MaterialCommunityIcons
                name="plus"
                size={width * 0.035}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        )}
      />

      {showSearch && (
        <>
          <SearchBar
            placeholder="Search channels..."
            searchBar={searchText}
            setSearchBar={setSearchText}
            pressCb={() => handleChannelSearch("search")}
            closeCb={() => handleChannelSearch("close")}
            loading={searchLoading}
            ref={searchRef}
            style={styles.searchBar}
          />
          <View
            style={[
              styles.searchResContainer,
              { backgroundColor: theme.extralight },
            ]}
          >
            <AppText size="large" style={styles.searchText} bold>
              Search Results
            </AppText>
            <AppText style={{ ...styles.error, marginTop: 10 }} bold>
              {errMsg}
            </AppText>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item._id}
              renderItem={renderSeachResults}
            />
          </View>
        </>
      )}
      <Separator h={1} m={0.01} />
      <FlatList
        data={["channel"]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={theme.extralight}
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item, index) => item + index}
        contentContainerStyle={{ paddingBottom: height * 0.1 }}
        renderItem={renderPage}
        ListHeaderComponent={
          <ChannelHeaderComp
            boxState={boxState}
            channels={channels}
            checkOwnerChannels={checkOwnerChannels}
            handleBoxChange={handleBoxChange}
            renderChannelsTwo={renderChannelsTwo}
            checkSubChannels={checkSubChannels}
          />
        }
      />
      <Modal
        visible={modal}
        transparent
        animationType="fade"
        style={{ flex: 1 }}
        statusBarTranslucent
        onRequestClose={() => setModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModal(false)}
          style={styles.modalCont}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.border, { backgroundColor: theme.backgroundLight }]}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.content, { backgroundColor: theme.background }]}
            >
              <AppText style={styles.title} bold>
                Create new channel
              </AppText>
              <Separator h={1} />
              <CreateFormik
                initialValues={init}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
              >
                <AppText style={{ color: theme.medium }} bold>
                  Will require 150CP
                </AppText>
                <View style={{ padding: 12 }}>
                  <CreateForm
                    name="name"
                    header="Channel Name:"
                    mutable="Give your channel a name"
                  />
                  <CreateForm
                    name="description"
                    header="Channel's Desciption:"
                    placeholder="Write something about your channel"
                    grow
                  />
                  <CoverUpload type="channel" show name="cover_photo" />
                  <SubmitButton title="CREATE" bared style={styles.submitBtn} />
                </View>
              </CreateFormik>
              <View style={styles.activity}>
                {isLoading && (
                  <ActivityIndicator type="spin" visible={true} wTransparent />
                )}
              </View>
              {errMsg && <AppText style={styles.error}>{errMsg}</AppText>}
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </Screen>
  );
};
const styles = StyleSheet.create({
  activity: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  border: {
    padding: 8,
    alignSelf: "center",
    elevation: 3,
    shadowRadius: 7,
    shadowColor: "black",
    shadowOpacity: 0.18,
    shadowOffset: {
      width: 0,
      height: 2.1,
    },
    borderRadius: 22,
  },

  content: {
    maxHeight: height * 0.75,
    alignItems: "center",
    overflow: "hidden",
    paddingBottom: 20,
    borderRadius: 19,
  },
  descText: {
    marginLeft: 8,
    color: colors.white,
  },
  error: {
    color: colors.heart,
    textAlign: "center",
  },
  titleText: {
    fontSize: 14,
    marginLeft: 3,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
    marginLeft: 9,
  },
  headerCont: {
    // alignSelf: "center",
  },
  headerBtnCont: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 5,
  },
  headerBtn: {
    width: width * 0.085,
    height: width * 0.085,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: width * 0.003,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 14,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.03,
  },
  imageTwo: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.03,
  },
  imageCont: {
    width: width * 0.96,
    height: width * 0.96 - 100,
    alignSelf: "center",
  },
  imageContTwo: {
    width: width * 0.56,
    height: width * 0.48,
    alignSelf: "center",
    marginHorizontal: 10,
  },
  imageBg: {
    borderRadius: 15,
    width: "100%",
    position: "absolute",
    height: "100%",
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  line: {
    width: 2,
    height: "100%",
    backgroundColor: colors.extraLight,
  },
  modalCont: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
  },
  profilePic: {
    position: "absolute",
    flexDirection: "row",
    margin: 12,
    marginLeft: 20,
  },
  searchBar: {
    width: width * 0.92,
    marginVertical: 8,
    alignSelf: "center",
  },
  searchResContainer: {
    borderRadius: width * 0.03,
    marginBottom: width * 0.01,
    height,
  },
  searchText: {
    textAlign: "center",
    marginTop: width * 0.04,
  },
  submitBtn: {
    width: width * 0.5,
    alignSelf: "center",
    marginTop: 10,
  },
  statsItem: {
    width: width * 0.33,
    alignItems: "center",
    textAlign: "center",
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: colors.primary,
    textAlign: "center",
    fontSize: 14,
    textTransform: "uppercase",
    marginTop: 20,
  },
});
export default ChannelScreen;
