import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../constants/colors";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Avatar from "./Avatar";
import { Context as ChallContext } from "../config/ChallContext";
import { Context as AuthContext } from "../config/AuthContext";
import { Context as FeedContext } from "../config/FeedContext";

import getFormatTime from "../constants/getFormatTime";
import ChallengeCard from "./ChallengeCard";
import Icon from "./Icon";
import Comments from "./Comments";
import InfoChallenge from "./InfoChallenge";
import MediaModal from "./MediaModal";
import ThemeContext from "../config/ThemeContext";
import LoaderImage from "./LoaderImage";
import AppText from "./AppText";
import { getFeedNumber } from "../constants/helpers";
import PopUpModal from "./PopUpModal";
import { RenderLinearGradient } from "../screens/ViewRoomScreen";
// import Drag from "./Drag";

const { width, height } = Dimensions.get("window");

const COMMENTS_LENGTH = 20;

const RenderFeed = ({ avatar, avatarID, name, type, media, info }) => {
  const [displayMedia, setDisplayMedia] = useState({ vis: false, data: null });

  const theme = useContext(ThemeContext);

  const handleShowMedia = (mediaObj) => {
    setDisplayMedia({ vis: true, item: mediaObj });
  };

  return (
    <View style={styles.profile}>
      <Avatar
        avatar={avatar}
        feederID={avatarID}
        name={name}
        style={[styles.avatar, { backgroundColor: theme.extralight }]}
        bold
      />

      <View
        style={[styles.feedcontainer, { backgroundColor: theme.background }]}
      >
        {type === "image" && (
          <TouchableOpacity
            activeOpacity={0.92}
            style={{ height: height * 0.3 }}
            onPress={() => handleShowMedia(media)}
          >
            <LoaderImage style={styles.imageStyle} noAspect image={media} />
          </TouchableOpacity>
        )}
        {type === "video" && (
          <TouchableOpacity
            style={styles.vidContainer}
            activeOpacity={0.92}
            onPress={() => handleShowMedia({ ...media, type: "video" })}
          >
            <Image
              source={{ uri: media.thumb ?? media?.uri }}
              blurRadius={5}
              style={styles.vidImage}
            />
            <View style={styles.vidIcon}>
              <MaterialCommunityIcons
                name="play-circle"
                size={30}
                color="white"
              />
            </View>
          </TouchableOpacity>
        )}
        {type === "info" && (
          <View>
            <InfoChallenge data={info} color="a" />
          </View>
        )}
      </View>
      <MediaModal modalObject={displayMedia} setVisible={setDisplayMedia} />
    </View>
  );
};

const RenderModalItem = ({ title, data, onPress, subTitle }) => {
  const theme = useContext(ThemeContext);

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.modalItem, { backgroundColor: theme.extralight }]}
    >
      <View>
        <AppText size="large" bold>
          {title}
        </AppText>
        {subTitle && <AppText> {subTitle} </AppText>}
      </View>
      <AppText size="large" bold>
        {data}
      </AppText>
    </TouchableOpacity>
  );
};

const RenderModal = ({
  data,
  countdown,
  setMyComments,
  stats,
  challengeData,
  setLoaded,
  setModalVis,
  instance,
}) => {
  const { getComments } = useContext(FeedContext);

  const handleComments = () => {
    setMyComments([]);
    setModalVis(true);
    getComments(
      {
        type: challengeData.challengeType,
        instanceID: challengeData.challengeID,
        page: 1,
        limit: COMMENTS_LENGTH,
      },
      (resData) => {
        setMyComments(resData);
        setLoaded(true);
      },
      (err) => console.log(err)
    );
  };

  return (
    <ScrollView>
      <View>
        <Image source={data.image} style={styles.modalImage} />
        <RenderLinearGradient modalHeight={height * 0.5} />
      </View>
      <View style={{ marginTop: 10 }}>
        <AppText bold size="large" style={styles.modalText}>
          {data?.fullName}
        </AppText>
        <AppText style={{ ...styles.modalText, marginVertical: 5 }}>
          {data.show}
        </AppText>
        <AppText
          style={{
            ...styles.modalText,
            color: colors.primary,
          }}
        >
          {instance} Challenge
        </AppText>
      </View>
      <View style={{ marginTop: 15 }}>
        <RenderModalItem
          title="Comments"
          onPress={handleComments}
          data={stats?.commentCount >= 0 ? stats?.commentCount : "..."}
        />
        <RenderModalItem
          title="Time Left"
          data={getFormatTime(countdown, null, "format").short}
        />

        <RenderModalItem
          title="Challenger"
          subTitle="@dhannyphantom"
          data={
            stats?.challengerScore >= 0
              ? stats.challengerScore?.toString()
              : "..."
          }
        />
        <RenderModalItem
          title="Manager"
          subTitle="@kira"
          data={stats?.ownerScore >= 0 ? stats?.ownerScore : "..."}
        />
      </View>
    </ScrollView>
  );
};

const Challenge = ({
  countdown,
  avatar1,
  name1,
  name1ID,
  name2ID,
  avatar2,
  image1,
  image2,
  name2,
  type,
  ownerInfo,
  challengerInfo,
  challengeType,
  score1,
  nav,
  instance,
  clientID,
  challengeID,
  score2,
  cardProps, //an object for my card styles and props..,
}) => {
  const navigation = useNavigation();
  const {
    state: { cComments },
    voteTwo,
    replyComments,
    fetchStats,
    commentPost,
  } = useContext(ChallContext);
  const {
    state: { userInfo },
    updateMe,
  } = useContext(AuthContext);

  const theme = useContext(ThemeContext);

  /// STATES
  const [scores, setScores] = useState([
    { scoreOne: score1 },
    { scoreTwo: score2 },
  ]);
  const [errMsg, setErrMsg] = useState(null);
  const [myComments, setMyComments] = useState({
    current: { limit: 15, page: 1 },
    results: [],
  });
  const [modalVis, setModalVis] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reply, setReply] = useState({});
  const [bools, setBools] = useState({ modal: false });
  const [stats, setStats] = useState({});

  const copyScores = [...scores];

  const oScore = copyScores[1].scoreTwo;
  const cScore = copyScores[0].scoreOne;

  const finderC = cScore.find((uId) => uId == clientID);
  const finderO = oScore.find((uId) => uId == clientID);

  const checkC = finderC === clientID;
  const checkO = finderO === clientID;

  const handleVote = (type) => {
    if (type === "challenger") {
      if (finderC == undefined && finderO == undefined) {
        // fresh vote
        cScore.push(clientID);
      } else if (finderC == clientID && (!finderO || finderO == undefined)) {
        //remove vote
        copyScores[0].scoreOne = copyScores[0].scoreOne.filter(
          (id) => id != clientID
        );
      } else if ((!finderC || finderC == undefined) && finderO == clientID) {
        copyScores[1].scoreTwo = copyScores[1].scoreTwo.filter(
          (id) => id != clientID
        );
        cScore.push(clientID);
      }
    } else if (type === "owner") {
      if (finderC == undefined && finderO == undefined) {
        // fresh vote
        oScore.push(clientID);
      } else if (finderC == clientID && finderO == undefined) {
        //change vote
        copyScores[0].scoreOne = copyScores[0].scoreOne.filter(
          (id) => id != clientID
        );
        oScore.push(clientID);
      } else if (finderC == undefined && finderO == clientID) {
        // remove vote
        copyScores[1].scoreTwo = copyScores[1].scoreTwo.filter(
          (id) => id != clientID
        );
      }
    }

    setScores(copyScores);
    voteTwo(
      challengeID,
      type,
      (resData) => {
        if (resData.hasVotedBefore === false) {
          updateMe(resData.points, "points");
        }
      },
      (err) => setErrMsg(err)
    );
  };

  const navigateToInstance = () => {
    navigation.navigate(nav, {
      show: {
        _id: cardProps.id,
        cover_photo: cardProps.image,
        app_creator: {
          _id: cardProps.owner_id,
          avatar: cardProps.avatar,
        },
      },
      item: cardProps.id,
      roomID: cardProps.id,
      data: {
        instance: "group",
        instanceID: cardProps.id,
      },
    });
  };

  const handleSend = (text) => {
    if (reply._id) {
      replyComments(id, "two", reply._id, text, null, (err) => setErrMsg(err));
      setReply({});
    } else {
      commentPost(challengeID, "two", text, null, (err) => setErrMsg(err));
    }
  };

  const openChallengeModal = () => {
    setBools({ ...bools, modal: true });

    fetchStats(
      { challengeId: challengeID, type: challengeType },
      (resData) => {
        setStats(resData);
      },
      (errData) => {
        setErrMsg(errData?.data ?? errData?.msg);
      }
    );
  };

  useEffect(() => {
    setScores([{ scoreOne: score1 }, { scoreTwo: score2 }]);
  }, []);

  useEffect(() => {
    setMyComments(cComments);
  }, [cComments]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.mediaContainer}>
        <RenderFeed
          avatar={avatar1}
          avatarID={name1ID}
          info={challengerInfo}
          media={image2}
          name={name1}
          type={type}
        />
        <RenderFeed
          avatar={avatar2}
          avatarID={name2ID}
          info={ownerInfo}
          media={image1}
          name={name2}
          type={type}
        />
        <View style={styles.versusContainer}>
          <Text style={styles.versusText}>V</Text>
          <Text
            style={{
              ...styles.versusText,
              position: "absolute",
              top: 25,
              left: 20,
            }}
          >
            S
          </Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={openChallengeModal}
        style={[styles.info, { backgroundColor: theme.extralight }]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleVote("challenger")}
          style={[
            styles.scoreContainer,
            { backgroundColor: checkC ? colors.unChange : colors.white },
          ]}
        >
          <AppText size="xlarge" bold>
            {getFeedNumber(cScore)}
          </AppText>
        </TouchableOpacity>
        <View>
          <AppText style={styles.formatText} bold>
            {cardProps?.fullName}
          </AppText>
          <AppText style={styles.formatText}>{instance.type}</AppText>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleVote("owner")}
          style={[
            styles.scoreContainer,
            { backgroundColor: checkO ? colors.unChange : colors.white },
          ]}
        >
          <AppText size="xlarge" bold>
            {getFeedNumber(oScore)}
          </AppText>
        </TouchableOpacity>
      </TouchableOpacity>

      <PopUpModal
        ContentComponent={() => (
          <RenderModal
            data={cardProps}
            countdown={countdown}
            setModalVis={setModalVis}
            setLoaded={setLoaded}
            stats={stats}
            setMyComments={setMyComments}
            challengeData={{ challengeID, challengeType }}
            instance={instance.type}
          />
        )}
        visible={bools.modal}
        setter={() => setBools({ ...bools, modal: false })}
        full
      />

      <Comments
        modalVis={modalVis}
        error={errMsg}
        setErrMsg={setErrMsg}
        setModal={setModalVis}
        loaded={loaded}
        onSend={handleSend}
        setMyComments={setMyComments}
        commentData={{ instanceType: challengeType, instanceID: challengeID }}
        data={myComments}
        reply={reply}
        setReply={setReply}
        avatar={userInfo.avatar}
        setLoaded={setLoaded}

        // setPost={setPost}
        // post={post}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginBottom: 9,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 8,
    elevation: 2.5,
    maxWidth: "90%",
    marginLeft: 12,
  },
  feedcontainer: {
    justifyContent: "center",
    // minHeight: height * 0.3,
    padding: 10,
  },
  challengebox: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  challengeIcon: {
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  challengeImages: {
    width: width * 0.49,
  },
  formatText: {
    textAlign: "center",
    textTransform: "capitalize",
    marginTop: 4,
  },
  imageStyle: {
    width: width / 2.1,
    padding: 10,
    elevation: 2,
  },
  info: {
    width: "90%",
    borderRadius: 12,
    elevation: 0.6,
    alignSelf: "center",
    alignItems: "center",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalItem: {
    width: width * 0.88,
    borderRadius: 10,
    elevation: 1,
    alignSelf: "center",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingVertical: 25,
    paddingRight: 20,
    // paddingRight: 20,
  },
  modalText: { textAlign: "center", textTransform: "capitalize" },
  modalImage: {
    width,
    height: height * 0.5,
  },
  profile: {
    flex: 1,
  },
  scoreContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  mediaContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  vidImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  vidIcon: {
    position: "absolute",
    top: 5,
    left: 5,
  },
  vidContainer: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "black",
    width: width / 2.15,
    height: (width / 2.5) * 2,
  },
  versusContainer: {
    position: "absolute",
    top: (height * 0.3) / 2 - 25,
    left: width / 2 - 25,
  },
  versusText: {
    fontFamily: "fonter",
    fontSize: 80,
    width: 45,
    color: colors.primary,
  },
});
export default Challenge;
