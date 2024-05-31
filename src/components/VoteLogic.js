import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ScrollView, Image } from "react-native";

import { Context as ChallContext } from "../config/ChallContext";
import { Context as AuthContext } from "../config/AuthContext";
import { Context as FeedContext } from "../config/FeedContext";

import FeedHeader from "../components/FeedHeader";
import colors from "../constants/colors";
import Vote from "../components/Vote";
import AppText from "./AppText";
import Icon from "./Icon";
import Separator from "./Separator";
import getFormatTime from "../constants/getFormatTime";
// import PopUpModal from "./PopUpModal";
import ProfilePic from "./ProfilePic";
import Comments from "./Comments";
import AppDetail from "./AppDetail";
import PopMessage from "./PopMessage";
import { COMMENT_COUNT } from "./FeedFooter";
import PopDropDown from "./PopDropDown";
import { RenderLinearGradient } from "../screens/ViewRoomScreen";
import { Dimensions } from "react-native";
import Avatar from "./Avatar";
import ThemeContext from "../config/ThemeContext";

const { width, height } = Dimensions.get("screen");

const InfoComponent = ({ type, instance, timer, scorer }) => {
  const message = type.type == "events" ? "users" : "characters";
  const { data, tag } = instance;

  return (
    <ScrollView>
      <View style={styles.infoContainer}>
        <View>
          <Image
            source={data.cover_photo}
            style={[
              styles.infoImage,
              { height: tag === "character" ? height * 0.5 : height * 0.25 },
            ]}
          />
          <RenderLinearGradient
            modalHeight={tag === "character" ? height * 0.5 : height * 0.35}
          />
        </View>
        <AppText size="xlarge" bold style={styles.infoTitle}>
          {data.title
            ? data.title
            : `${
                data?.name ?? data?.name_j ?? data.name_e
              } ${tag} instance challenge`}
        </AppText>
        <View style={styles.infoContent}>
          <AppDetail
            icon="timer"
            title="Timer"
            item={`${getFormatTime(timer, null, "format").full} left`}
          />
          <AppDetail
            icon="ninja"
            title={`${message} participating`}
            item={`${scorer.length} ${message}`}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const VoteLogic = ({ title, type, timer, cards, user, voteId, instance }) => {
  const { voteOne } = useContext(ChallContext);
  const { getComments, replyComments, commentPost } = useContext(FeedContext);
  const {
    state: { userInfo },
    updateMe,
  } = useContext(AuthContext);
  const userID = userInfo._id;

  const [scorer, setScorer] = useState(cards);
  const [errMsg, setErrMsg] = useState(null);
  const [myComments, setMyComments] = useState([]);
  const [infoModal, setInfoModal] = useState(false);
  const [modalVis, setModalVis] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reply, setReply] = useState({});
  const [popper, setPopper] = useState({ vis: false });
  const copy = [...scorer];

  const finder = scorer.find((obj) => obj.selected === true);
  const commentType = type.type == "events" ? "three" : "one";
  const theme = useContext(ThemeContext);

  const checkVote = () => {
    setScorer(cards);
    const newVoteArr = [];
    copy.forEach((obj) => {
      if (obj.score.includes(userID)) {
        obj.selected = true;
      } else {
        obj.selected = false;
      }
      newVoteArr.push(obj);
    });
    setScorer(newVoteArr.sort((a, b) => b.score.length - a.score.length));
  };

  const handleVote = (itemId, type) => {
    setErrMsg(null);
    if (!userInfo.verified) {
      return setPopper({
        vis: true,
        type: "failed",
        msg: "Complete and verify your account",
      });
    }
    const ind = copy.findIndex((obj) => obj._id == itemId);
    const checkUser = copy[ind].score.includes(userID); // true or false
    const filter = copy[ind].score.filter((id) => id !== userID);

    if (finder === undefined && !checkUser) {
      // no match i.e fresh vote
      copy[ind].score.push(userID);
      copy[ind] = {
        ...copy[ind],
        selected: true,
      };
      setScorer(copy.sort((a, b) => b.score.length - a.score.length));
    } else if (finder._id == itemId) {
      //remove vote
      copy[ind].score = filter;
      copy[ind] = {
        ...copy[ind],
        selected: false,
      };
      setScorer(copy.sort((a, b) => b.score.length - a.score.length));
    } else if (finder._id !== itemId) {
      // change vote
      // checkUser = the voted item clicked
      const selectedIndex = scorer.findIndex((e) => e._id == finder._id);
      copy[selectedIndex].score = copy[selectedIndex].score.filter(
        (id) => id !== userID
      );
      copy[selectedIndex] = {
        ...copy[selectedIndex],
        selected: false,
      };
      copy[ind].score.push(userID);
      copy[ind] = {
        ...copy[ind],
        selected: true,
      };
      setScorer(copy.sort((a, b) => b.score.length - a.score.length));
    }
    const voteObj = {
      voteId,
      itemId,
      type: type === "events" ? "events" : "characters",
    };

    voteOne(
      voteObj,
      (resData) => {
        if (resData?.hasVotedBefore === false) {
          updateMe(resData.points, "points");
        }
      },
      (_err) => {}
    );
  };

  const handleDone = (data) => {
    setMyComments(data);
    setLoaded(true);
  };

  const handleComments = () => {
    // setMyComments([]);
    setModalVis(true);
    getComments(
      { instanceID: voteId, type: commentType, page: 1, limit: COMMENT_COUNT },
      (data) => handleDone(data),
      (err) => {
        setErrMsg(err.msg);
      }
    );
  };

  const handleSentComment = (type, comment, replyID) => {
    if (type === "comment") {
      // push a new comment
      setMyComments([...myComments, comment]);
    } else {
      // A REPLY ACTION
    }
  };

  const handleSend = (text) => {
    if (reply._id) {
      replyComments(
        voteId,
        commentType,
        reply._id,
        text,
        (resData) => handleSentComment("reply", resData), // for success.
        (err) => setErrMsg(err)
      );
      setReply({});
    } else {
      commentPost(
        voteId,
        commentType,
        text,
        (resData) => handleSentComment("comment", resData),
        (err) => setErrMsg(err)
      );
    }
  };

  const renderVotes = ({ item }) => {
    if (item.info || item.media) {
      return (
        <Vote
          score={item?.score?.length}
          type={type.type}
          onPress={() => handleVote(item._id, type.type)}
          color={item.selected ? colors.heart : colors.medium}
          cardInfo={{
            media: item.media,
            user: item.user,
            info: item.info,
            type: type.c_type,
          }}
        />
      );
    }
    return (
      <Vote
        score={item.score.length}
        onPress={() => handleVote(item._id, type.type)}
        type={type.type}
        color={item.selected ? colors.heart : colors.medium}
        cardInfo={{
          id: item.character._id,
          image: item.character.cover_photo,
          followers: item.character.followers,
          avatar: item.character.manager.avatar,
          name: item.character.dpName,
          show: item.character.show.name_j ?? item.character.show.name_e,
        }}
      />
    );
  };

  const VoteHeader = () => {
    return (
      <View style={styles.voteHeader}>
        <Icon
          size={40}
          activeOpacity={1}
          color={colors.medium}
          bgColor={theme.backgroundExtralight}
          iconSize={12}
          name="more-v-a"
          pack="b"
          onPress={() => setInfoModal(true)}
        />
        <View style={styles.pic}>
          <ProfilePic source={user.avatar} userID={user._id} size={35} />
          {/* <Avatar avatar={user.avatar} noAt feederID={user?._id} /> */}
          {/* <AppText style={styles.username} bold>
            @{user.username}
          </AppText> */}
        </View>
        <Icon
          activeOpacity={1}
          name="comment"
          color={colors.medium}
          bgColor={theme.backgroundExtralight}
          pack="b"
          iconSize={12}
          size={40}
          // text={`${myComments.length.toString()}`}
          textStyle={styles.textIcon}
          onPress={handleComments}
        />
      </View>
    );
  };

  useEffect(() => {
    checkVote();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundExtralight },
      ]}
    >
      <FeedHeader challenge={title} />
      <Separator h={2} />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        ListHeaderComponent={VoteHeader}
        ListFooterComponent={<View style={styles.spacer} />}
        data={scorer}
        keyExtractor={(item) => item._id}
        renderItem={renderVotes}
      />
      {errMsg && <AppText style={styles.errText}> {errMsg} </AppText>}
      <Comments
        modalVis={modalVis}
        error={errMsg}
        setErrMsg={setErrMsg}
        setModal={setModalVis}
        commentData={{ instanceType: commentType, instanceID: voteId }}
        loaded={loaded}
        onSend={handleSend}
        data={myComments}
        setMyComments={setMyComments}
        reply={reply}
        setReply={setReply}
        avatar={userInfo.avatar}
      />
      <PopDropDown
        visible={infoModal}
        setter={() => setInfoModal(false)}
        // modalHeight={null}
        RenderComponent={() => (
          <InfoComponent
            instance={instance}
            scorer={scorer}
            timer={timer}
            type={type}
          />
        )}
      />
      <PopMessage
        popData={popper}
        timer={0.5}
        setter={() => setPopper({ vis: false })}
      />
      <Separator h={1} m={10} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    elevation: 3,
    backgroundColor: colors.extraLight,
    borderRadius: 20,
  },
  errText: {
    textAlign: "center",
    color: colors.white,
    padding: 5,
    backgroundColor: colors.heart,
  },
  infoContainer: {
    borderTopStartRadius: width * 0.04,
    borderTopEndRadius: width * 0.04,
    // paddingVertical: 20,
    // paddingHorizontal: 10,
  },
  infoImage: {
    width: "100%",
    borderTopStartRadius: width * 0.04,
    borderTopEndRadius: width * 0.04,
  },
  infoContent: {
    padding: 35,
  },
  infoTitle: {
    marginTop: 30,
    textAlign: "center",
    textTransform: "capitalize",
    alignSelf: "center",
    maxWidth: "90%",
  },
  pic: {
    alignItems: "center",
    marginVertical: 30,
  },
  spacer: {
    paddingHorizontal: 15,
  },
  username: {
    marginTop: 6,
    textAlign: "center",
  },
  voteHeader: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 55,
    marginHorizontal: 10,
  },
});
export default VoteLogic;
