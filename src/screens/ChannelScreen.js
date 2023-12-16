import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

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
import AppFadeIn from "../components/AppFadeIn";
import { useNavigation } from "@react-navigation/native";
import getTimestamp from "../constants/getTimestamp";

const { width, height } = Dimensions.get("window");

const validationSchema = scheme.channelValidation;

const init = {
  name: "",
  cover_photo: {
    width: 0,
    height: 0,
    uri: "",
  },
  description: "",
};

const POINTS = 150;

const ChannelHeaderComp = ({
  boxState,
  handleBoxChange,
  checkSubChannels,
  channels,
  renderChannelsTwo,
}) => {
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const hasSubscribedChannels = Boolean(
    channels.find(
      (item) =>
        item.manager?._id != userInfo._id &&
        item.subscribers.includes(userInfo._id)
    )
  );

  const hasNotSubscribedChannels = Boolean(
    channels.find(
      (item) =>
        item.manager?._id != userInfo._id &&
        !item.subscribers?.includes(userInfo._id)
    )
  );

  const isAChannelManager = Boolean(
    channels.find((item) => item.manager?._id == userInfo._id)
  );

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
        <HeaderTitle
          text="Subscribed Channels"
          show={boxState.s && channels[0] && hasSubscribedChannels}
        />
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
      <HeaderTitle
        text="All Channels"
        show={boxState.s && checkSubChannels && hasNotSubscribedChannels}
      />

      <ActivityIndicator
        visible={
          !hasNotSubscribedChannels && !hasSubscribedChannels && boxState.s
        }
        type="isEmpty"
        text={"No channels"}
        transparent
        style={{ width, height: height * 0.8 }}
      />
      <ActivityIndicator
        visible={boxState.m && !isAChannelManager}
        type="isEmpty"
        text={"You don't have any channel. Create one now"}
        transparent
        style={{ width, height: height * 0.8 }}
      />
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

const CreateChannelForm = ({ setBoxState, addNewElement, setModal }) => {
  const theme = useContext(ThemeContext);

  const { createChannel } = useContext(CharContext);
  const {
    updateMe,
    state: { userInfo },
  } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

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
        updateMe(userInfo.points - POINTS, "points");
      },
      (errData) => {
        setErrMsg(errData.data ?? errData.msg);
        setIsLoading(false);
      }
    );
  };

  return (
    <View style={[styles.border, { backgroundColor: theme.backgroundLight }]}>
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <AppText style={styles.title} bold>
          Create new channel
        </AppText>
        <Separator h={1} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <CreateFormik
            initialValues={init}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {errMsg ? (
              <AppText style={styles.error}>{errMsg}</AppText>
            ) : (
              <AppText
                style={{ color: theme.medium, textAlign: "center" }}
                bold
              >
                Will require {POINTS}CP
              </AppText>
            )}
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
              <View style={styles.btns}>
                <SubmitButton title="CREATE" bared style={styles.submitBtn} />
                <AppButton
                  title="Cancel"
                  LIcon="cancel"
                  style={styles.submitBtn}
                  bare
                  bareRed
                  onPress={() => setModal(false)}
                />
              </View>
            </View>
          </CreateFormik>
        </ScrollView>
        <View style={styles.activity}>
          {isLoading && (
            <ActivityIndicator type="spin" visible={true} wTransparent />
          )}
        </View>
      </View>
    </View>
  );
};

const ChannelListComp = ({
  item,
  subscribe,
  addNewElement,
  isMine,
  small,
  unsubscribe,
}) => {
  const navigation = useNavigation();
  const { subscribeChannel } = useContext(CharContext);
  const theme = useContext(ThemeContext);

  const handleSubscribe = (type, id) => {
    subscribeChannel(
      type,
      id,
      (data) => {
        addNewElement(data);
      },
      (err) => {}
    );
  };
  const handleImagePress = (id) => {
    navigation.navigate("ChannelPost", { id });
  };

  return (
    <View style={[styles.channelContainer, { backgroundColor: theme.lighter }]}>
      <View style={styles.header}>
        <Feather name="tv" size={18} color={colors.primary} />
        <AppText style={styles.titleText} bold>
          {item.name}
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
            source={item.manager.avatar}
            userID={item.manager._id}
            size={50}
          />
          <AppText
            size={small ? "small" : "normal"}
            bold
            ellipsizeMode="tail"
            numberOfLines={3}
            style={styles.descText}
          >
            {item.description?.substring(0, small ? 25 : 50)}
          </AppText>
        </View>
      </View>
      {/* {!small && <Separator h={1} />} */}
      {!small && (
        <View style={styles.stats}>
          <AppText style={styles.statsItem}>
            Created <AppText bold> {getTimestamp(item._id, "feed")}</AppText>
          </AppText>
          {subscribe && (
            <View style={{ flex: 0.5 }}>
              <AppButton
                title="SUBSCRIBE"
                bare
                style={{ alignSelf: "center" }}
                onPress={() => handleSubscribe("sub", item._id)}
              />
            </View>
          )}
          {(isMine || (!unsubscribe && !subscribe)) && (
            <View style={styles.statsItem}>
              <AppText size="normal" bold style={{ color: colors.primary }}>
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
            <AppText bold>{item.subscribers.length}</AppText> subscribers
          </AppText>
        </View>
      )}
    </View>
  );
};

const ChannelScreen = ({ route, navigation }) => {
  const { getChannels, searchChannels } = useContext(CharContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const [channels, setChannels] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [boxState, setBoxState] = useState({ s: true, m: false });
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [modal, setModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [bools, setBools] = useState({ search: false, isLoading: false });

  const checkSubChannels = channels.find((obj) =>
    obj?.subscribers.includes(userInfo._id)
  );

  const searchRef = useRef(null);

  const handleRefresh = () => {
    setRefreshing(true);
    getChannels((resData) => {
      setChannels(resData);
      setRefreshing(false);
    });
  };

  const handleChannelSearch = (type) => {
    setBools({ ...bools, search: true });
    if (type === "search" && searchText.length > 2) {
      setErrMsg(null);
      searchChannels(
        { type: "channel", term: searchText },
        (resData) => {
          setSearchResults(resData);
          setBools({ ...bools, search: false });
          !resData[0] && setErrMsg(`${searchText} channel not found`);
        },
        (err) => {
          setBools({ ...bools, search: false });
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

  const handleBoxChange = (type) => {
    if (type === "s") {
      setBoxState({ s: true, m: false });
    } else if (type === "m") {
      setBoxState({ s: false, m: true });
    }
  };

  const renderChannels = ({ item }) => {
    if (boxState.m && item.manager._id == userInfo._id) {
      return <ChannelListComp addNewElement={addNewElement} item={item} />;
    } else if (
      boxState.s &&
      !item.subscribers.includes(userInfo._id) &&
      item.manager._id != userInfo._id
    ) {
      return (
        <ChannelListComp addNewElement={addNewElement} item={item} subscribe />
      );
    }
  };

  const renderChannelsTwo = ({ item }) => {
    if (
      boxState.s &&
      item.manager._id !== userInfo._id &&
      item.subscribers.includes(userInfo._id)
    ) {
      return (
        <ChannelListComp
          addNewElement={addNewElement}
          item={item}
          unsubscribe
          small
        />
      );
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
                  transparent
                  visible={!bools.isLoading}
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
    if (item.manager._id == userInfo._id) {
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
        addNewElement={addNewElement}
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
    const sub = navigation.addListener("focus", () => {
      if (route?.params?.reload === true) {
        setBools({ ...bools, isLoading: true });
        getChannels((resData) => {
          setChannels(resData);
          setBools({ ...bools, isLoading: false });
        });
      }
    });

    return function () {
      sub;
    };
  }, [route, navigation]);

  useEffect(() => {
    searchRef?.current?.focus();
  }, [showSearch]);

  return (
    <Screen
      style={{
        ...styles.container,
        backgroundColor: theme.backgroundExtralight,
      }}
    >
      <AppHeader
        title="Channels"
        RightComponent={() => (
          <View style={styles.headerBtnCont}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.headerBtn}
              onPress={() => setShowSearch(!showSearch)}
            >
              <Feather name="search" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBtn}
              activeOpacity={1}
              onPress={() => setModal(true)}
            >
              <Feather name="plus" size={18} color={colors.primary} />
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
            loading={bools.search}
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
      {/* <Separator h={1} m={0.01} /> */}
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
            handleBoxChange={handleBoxChange}
            renderChannelsTwo={renderChannelsTwo}
            checkSubChannels={checkSubChannels}
          />
        }
      />
      <AppFadeIn
        visible={modal}
        setVisible={setModal}
        RenderComponent={() => (
          <CreateChannelForm
            setModal={setModal}
            setBoxState={setBoxState}
            addNewElement={addNewElement}
          />
        )}
      />
      <ActivityIndicator visible={bools.isLoading} absolute wTransparent />
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
    borderRadius: 20,
  },

  btns: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  channelContainer: {
    borderRadius: 20,
    marginBottom: 20,
    elevation: 1,
    paddingBottom: 14,
  },
  content: {
    minHeight: height * 0.6,
    maxHeight: height * 0.85,
    alignItems: "center",
    overflow: "hidden",
    paddingBottom: 20,
    borderRadius: 15,
  },
  descText: {
    marginLeft: 8,
    maxWidth: "78%",
    color: colors.white,
  },
  error: {
    color: colors.heart,
    textAlign: "center",
  },
  titleText: {
    // fontSize: 14,
    // marginLeft: 3,
    padding: 10,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    marginLeft: 6,
    padding: 12,
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
    maxHeight: (width * 0.96) / 1.7,
    alignSelf: "center",
  },
  imageContTwo: {
    width: width * 0.56,
    height: (width * 0.56) / 1.7,
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
    alignSelf: "center",
    marginTop: 10,
  },
  statsItem: {
    alignItems: "center",
    flex: 0.25,
    marginVertical: 10,
    textAlign: "center",
  },
  stats: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  title: {
    color: colors.primary,
    textAlign: "center",
    fontSize: 14,
    textTransform: "uppercase",
    marginTop: 20,
  },
  titleText: {
    marginLeft: 6,
    maxWidth: "85%",
  },
});
export default ChannelScreen;
