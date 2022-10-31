import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../constants/colors";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Avatar from "./Avatar";
import { Context as ChallContext } from "../config/ChallContext";
import { Context as AuthContext } from "../config/AuthContext";
import getFormatTime from "../constants/getFormatTime";
import ChallengeCard from "./ChallengeCard";
import ChallengeIcon from "./ChallengeIcon";
import FeedImage from "./FeedImage";
import Icon from "./Icon";
import Comments from "./Comments";
// import PostVideo from "./PostVideo";
import InfoChallenge from "./InfoChallenge";
import MediaModal from "./MediaModal";

const { width } = Dimensions.get("window");

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
  score1,
  nav,
  instance,
  clientID,
  challengeID,
  score2,
  onPress,
  cardProps, //an object for my card styles and props..,
}) => {
  const navigation = useNavigation();
  const {
    state: { cComments },
    voteTwo,
    getComments,
    replyComments,
    commentPost,
  } = useContext(ChallContext);
  const {
    state: { userInfo },
  } = useContext(AuthContext);
  /// STATES
  const [scores, setScores] = useState([
    { scoreOne: score1 },
    { scoreTwo: score2 },
  ]);
  const [errMsg, setErrMsg] = useState(null);
  const [myComments, setMyComments] = useState([]);
  const [modalVis, setModalVis] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reply, setReply] = useState({});
  const [displayMedia, setDisplayMedia] = useState({ vis: false, data: null });

  useEffect(() => {
    setScores([{ scoreOne: score1 }, { scoreTwo: score2 }]);
  }, []);

  useEffect(() => {
    setMyComments(cComments);
  }, [cComments]);

  const copyScores = [...scores];

  const cArr = scores[0].scoreOne;
  const oArr = scores[1].scoreTwo;
  const oScore = copyScores[1].scoreTwo;
  const cScore = copyScores[0].scoreOne;

  const finderC = cArr.find((uri) => uri == clientID);
  const finderO = oArr.find((uri) => uri == clientID);

  const checkC = finderC === clientID;
  const checkO = finderO === clientID;

  const imgFeed = {
    type: "image",
    posts: [image1, image2],
  };

  const vidFeed = {
    type: "video",
    posts: [image1, image2],
  };

  const handleVote = (type) => {
    if (type === "challenger") {
      if (finderC == undefined && finderO == undefined) {
        // fresh vote
        cScore.push(clientID);
      } else if (finderC == clientID && finderO == undefined) {
        //remove vote
        copyScores[0].scoreOne = copyScores[0].scoreOne.filter(
          (id) => id != clientID
        );
      } else if (finderC == undefined && finderO == clientID) {
        copyScores[1].scoreTwo = copyScores[1].scoreTwo.filter(
          (id) => id != clientID
        );
        cScore.push(clientID);
        // change vote
      }
      setScores(copyScores);
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
      setScores(copyScores);
    }
    voteTwo(challengeID, type, (err) => setErrMsg(err));
  };

  const handleChallengeCardPress = () => {
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

  const handleDone = (data) => {
    setMyComments(data);
    setLoaded(true);
  };

  const handleComments = () => {
    setMyComments([]);
    setModalVis(true);
    getComments(challengeID, "two", handleDone, (err) => setErrMsg(err));
  };

  const handleShowMedia = (mediaObj) => {
    setDisplayMedia({ vis: true, data: mediaObj });
  };

  const handleSend = (text) => {
    if (reply._id) {
      replyComments(id, "two", reply._id, text, null, (err) => setErrMsg(err));
      setReply({});
    } else {
      commentPost(challengeID, "two", text, null, (err) => setErrMsg(err));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.uppCont}>
        <View style={styles.profile}>
          <Avatar
            avatar={avatar1}
            feederID={name1ID}
            name={name1}
            style={styles.avatar}
            bold
          />
          <View style={styles.feedcontainer}>
            {type === "image" && (
              <FeedImage
                feed={imgFeed}
                dbDisabled
                showMediaFunc={handleShowMedia}
                image={image1}
                style={styles.challengeImages}
              />
            )}
            {type === "video" && (
              <TouchableOpacity
                style={styles.vidContainer}
                activeOpacity={0.8}
                onPress={() =>
                  handleShowMedia({ feed: { type: "video" }, item: image1 })
                }
              >
                <Image
                  source={{ uri: image1.thumb ?? image1?.uri }}
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
                <InfoChallenge data={ownerInfo} color="a" />
              </View>
            )}
          </View>
        </View>
        <View style={styles.profile}>
          <Avatar
            avatar={avatar2}
            feederID={name2ID}
            name={name2}
            style={styles.avatar}
            bold
          />
          <View style={styles.feedcontainer}>
            {type === "image" && (
              <FeedImage
                feed={imgFeed}
                dbDisabled
                showMediaFunc={handleShowMedia}
                image={image2}
                style={styles.challengeImages}
              />
            )}
            {type === "video" && (
              <TouchableOpacity
                style={styles.vidContainer}
                activeOpacity={0.8}
                onPress={() =>
                  handleShowMedia({ feed: { type: "video" }, item: image2 })
                }
              >
                <Image
                  source={{ uri: image2.thumb ?? image2?.uri }}
                  blurRadius={5}
                  resizeMode="cover"
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
              <InfoChallenge
                data={challengerInfo}
                color="b"
                flatKey={Math.random().toString()}
              />
            )}
            <View style={styles.versusContainer}>
              <Icon
                text="VS"
                topText={`${myComments.length} C`}
                subText={getFormatTime(countdown, null, "format").mid}
                size={80}
                onPress={handleComments}
                textSize="xlarge"
                activeOpacity={1}
                style={styles.iconVersus}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.challengebox}>
        <View style={styles.challengeIcon}>
          <ChallengeIcon
            score={cArr.length}
            onPress={() => handleVote("challenger")}
            color={checkC ? colors.heart : colors.medium}
          />
        </View>
        <ChallengeCard
          series={instance.show || instance.group}
          onPress={handleChallengeCardPress}
          {...cardProps}
        />
        <View style={styles.challengeIcon}>
          <ChallengeIcon
            score={oArr.length}
            onPress={() => handleVote("owner")}
            color={checkO ? colors.heart : colors.medium}
          />
        </View>
      </View>
      <Comments
        modalVis={modalVis}
        // error={errMsg}
        setErrMsg={setErrMsg}
        setModal={setModalVis}
        loaded={loaded}
        onSend={handleSend}
        data={myComments}
        reply={reply}
        setReply={setReply}
        avatar={userInfo.avatar}
      />
      <MediaModal modalObject={displayMedia} setVisible={setDisplayMedia} />
    </View>
  );
};
const styles = StyleSheet.create({
  avatar: {
    marginBottom: 9,
  },
  feedcontainer: {
    justifyContent: "center",
    flex: 1,
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
  profile: {},
  uppCont: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  vidImage: {
    width: "100%",
    height: (width / 2.5) * 2,
    borderRadius: 12,
  },
  vidIcon: {
    position: "absolute",
    top: 5,
    left: 5,
  },
  vidContainer: {
    borderRadius: 12,
    backgroundColor: "black",
    width: width / 2.15,
  },
  versusContainer: {
    position: "absolute",
    left: -80 / 1.7,
  },
});
export default Challenge;
